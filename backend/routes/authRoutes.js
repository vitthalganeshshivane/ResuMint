const express = require("express");

const {
  registerUser,
  loginUser,
  getUserProfile,
} = require("../controllers/authController");
const { protect } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, getUserProfile);

// router.post("/upload-image", upload.single("image"), (req, res) => {
//   if (!req.file) {
//     return res.status(400).json({ message: "No file uploaded" });
//   }

//   const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

//   res.status(200).json({ imageUrl });
// });

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
          // if (error) {
          //   return res.status(500).json({ message: "Upload failed" });
          // }

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
