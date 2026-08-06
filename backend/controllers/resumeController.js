const fs = require("node:fs");
const path = require("node:path");
const Resume = require("../models/Resume");

const createResume = async (req, res) => {
  try {
    const { title } = req.body;

    const defaultResumeData = {
      profileInfo: {
        profileImg: null,
        previewUrl: "",
        fullName: "",
        designation: "",
        summary: "",
      },
      contactInfo: {
        email: "",
        phone: "",
        location: "",
        linkedin: "",
        github: "",
        website: "",
      },
      workExperience: [
        {
          company: "",
          roles: "",
          startDate: "",
          endDate: "",
          description: "",
        },
      ],
      education: [
        {
          degree: "",
          institution: "",
          startDate: "",
          endDate: "",
        },
      ],

      skills: [
        {
          name: "",
          progress: 0,
        },
      ],
      projects: [
        {
          title: "",
          description: "",
          github: "",
          liveDemo: "",
        },
      ],
      certifications: [
        {
          title: "",
          issuer: "",
          year: "",
        },
      ],

      languages: [
        {
          name: "",
          progress: 0,
        },
      ],
      interests: [""],
    };

    const newResume = await Resume.create({
      userId: req.user._id,
      title,
      ...defaultResumeData,
    });

    res.status(201).json(newResume);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to create resume", error: error.message });
  }
};

const getUserResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({ userId: req.user._id }).sort({
      updatedAt: -1,
    });
    res.json(resumes);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to create resume", error: error.message });
  }
};

const getResumeById = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    res.json(resume);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to create resume", error: error.message });
  }
};

const updateResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!resume) {
      return res
        .status(404)
        .json({ message: "Resume not found or unauthorized" });
    }

    Object.assign(resume, req.body);

    const savedResume = await resume.save();

    res.json(savedResume);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to create resume", error: error.message });
  }
};

const deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!resume) {
      return res
        .status(404)
        .json({ message: "Resume not found or unauthorized" });
    }

    const uploadsFolder = path.join(__dirname, "..", "uploads");
    const baseUrl = `${req.protocol}://${req.get("host")}`;

    if (resume.thumbnailLink) {
      const oldThumbnail = path.join(
        uploadsFolder,
        path.basename(resume.thumbnailLink),
      );
      if (fs.existsSync(oldThumbnail)) fs.unlinkSync(oldThumbnail);
    }

    if (resume.profileInfo?.profilePreviewUrl) {
      const oldProfile = path.join(
        uploadsFolder,
        path.basename(resume.profileInfo.profilePreviewUrl),
      );
      if (fs.existsSync(oldProfile)) fs.unlinkSync(oldProfile);
    }

    const deleted = await Resume.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!deleted) {
      return res
        .status(404)
        .json({ message: "Resume not found or unauthorized" });
    }

    res.json({ message: "Resume deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to create resume", error: error.message });
  }
};

async function getOrCreateRecentResume(userId) {
  let resume = await Resume.findOne({ userId }).sort({ updatedAt: -1 });
  if (!resume) {
    resume = await Resume.create({
      userId,
      title: "My Resume",
      profileInfo: { fullName: "", designation: "", summary: "" },
      contactInfo: {},
      workExperience: [],
      education: [],
      skills: [],
      projects: [],
      certifications: [],
      languages: [],
      interests: [],
    });
  }
  return resume;
}

const quickAddSkill = async (req, res) => {
  try {
    const { name, progress } = req.body;
    if (!name?.trim()) {
      return res.status(400).json({ message: "Skill name is required" });
    }
    const resume = await getOrCreateRecentResume(req.user._id);
    resume.skills.push({ name: name.trim(), progress: progress || 60 });
    await resume.save();
    res.status(200).json({ message: "Skill added", totalSkills: resume.skills.length });
  } catch (error) {
    res.status(500).json({ message: "Failed to add skill", error: error.message });
  }
};

const quickAddProject = async (req, res) => {
  try {
    const { title, description, github, liveDemo } = req.body;
    if (!title?.trim()) {
      return res.status(400).json({ message: "Project title is required" });
    }
    const resume = await getOrCreateRecentResume(req.user._id);
    resume.projects.push({
      title: title.trim(),
      description: description || "",
      github: github || "",
      liveDemo: liveDemo || "",
    });
    await resume.save();
    res.status(200).json({ message: "Project added", totalProjects: resume.projects.length });
  } catch (error) {
    res.status(500).json({ message: "Failed to add project", error: error.message });
  }
};

const quickAddExperience = async (req, res) => {
  try {
    const { company, role, startDate, endDate, description } = req.body;
    if (!company?.trim() || !role?.trim()) {
      return res.status(400).json({ message: "Company and role are required" });
    }
    const resume = await getOrCreateRecentResume(req.user._id);
    resume.workExperience.push({
      company: company.trim(),
      role: role.trim(),
      startDate: startDate || "",
      endDate: endDate || "",
      description: description || "",
    });
    await resume.save();
    res.status(200).json({ message: "Experience added", totalExperiences: resume.workExperience.length });
  } catch (error) {
    res.status(500).json({ message: "Failed to add experience", error: error.message });
  }
};

module.exports = {
  createResume,
  getUserResumes,
  getResumeById,
  updateResume,
  deleteResume,
  quickAddSkill,
  quickAddProject,
  quickAddExperience,
};
