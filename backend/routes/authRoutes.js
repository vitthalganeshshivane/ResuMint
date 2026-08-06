const express = require("express");

const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  changePassword,
  getAccountStats,
  deleteAccount,
} = require("../controllers/authController");
const { protect } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, updateUserProfile);
router.put("/change-password", protect, changePassword);
router.get("/stats", protect, getAccountStats);
router.delete("/account", protect, deleteAccount);

router.post(
  "/upload-image",
  upload.single("profileImage"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "user-profiles" },
        (error, result) => {
          if (error) {
            console.error("Cloudinary Error:", error);
            return res.status(500).json({
              message: "Upload failed",
              error: error.message,
            });
          }

          res.status(200).json({
            imageUrl: result.secure_url,
          });
        },
      );

      streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Upload failed" });
    }
  },
);

module.exports = router;
