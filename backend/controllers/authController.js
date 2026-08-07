const User = require("../models/User");
const Resume = require("../models/Resume");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

const registerUser = async (req, res) => {
  try {
    const { name, email, password, profileImageUrl } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      profileImageUrl,
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      profileImageUrl: user.profileImageUrl,
      plan: user.plan || "free",
      token: generateToken(user._id),
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      profileImageUrl: user.profileImageUrl,
      plan: user.plan || "free",
      token: generateToken(user._id),
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const { name, email, profileImageUrl } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (email && email !== user.email) {
      const emailTaken = await User.findOne({ email, _id: { $ne: user._id } });
      if (emailTaken) {
        return res.status(400).json({ message: "Email already in use" });
      }
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (profileImageUrl !== undefined) user.profileImageUrl = profileImageUrl;

    await user.save();

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      profileImageUrl: user.profileImageUrl,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .json({ message: "Current and new password are required" });
    }

    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ message: "New password must be at least 6 characters" });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

const getAccountStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const totalResumes = await Resume.countDocuments({ userId });

    const recentResumes = await Resume.find({ userId })
      .sort({ updatedAt: -1 })
      .limit(5)
      .select("title updatedAt thumbnailLink");

    const lastUpdated =
      recentResumes.length > 0 ? recentResumes[0].updatedAt : null;

    const totalSkills = await Resume.aggregate([
      { $match: { userId: userObjectId(userId) } },
      { $unwind: "$skills" },
      { $match: { "skills.name": { $ne: "" } } },
      { $group: { _id: null, count: { $sum: 1 } } },
    ]);

    const totalProjects = await Resume.aggregate([
      { $match: { userId: userObjectId(userId) } },
      { $unwind: "$projects" },
      { $match: { "projects.title": { $ne: "" } } },
      { $group: { _id: null, count: { $sum: 1 } } },
    ]);

    const totalExperiences = await Resume.aggregate([
      { $match: { userId: userObjectId(userId) } },
      { $unwind: "$workExperience" },
      { $match: { "workExperience.company": { $ne: "" } } },
      { $group: { _id: null, count: { $sum: 1 } } },
    ]);

    const user = await User.findById(userId).select("createdAt");

    res.status(200).json({
      totalResumes,
      totalSkills: totalSkills[0]?.count || 0,
      totalProjects: totalProjects[0]?.count || 0,
      totalExperiences: totalExperiences[0]?.count || 0,
      memberSince: user.createdAt,
      lastUpdated,
      recentResumes,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

function userObjectId(id) {
  const mongoose = require("mongoose");
  return new mongoose.Types.ObjectId(id);
}

const deleteAccount = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await Resume.deleteMany({ userId: req.user.id });
    await User.findByIdAndDelete(req.user.id);

    res.status(200).json({ message: "Account deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  changePassword,
  getAccountStats,
  deleteAccount,
};
