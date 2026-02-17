const express = require("express");
const { protect } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");
const { uploadResumeImages } = require("../controllers/uploadImages");
const {
  createResume,
  getUserResumes,
  getResumeById,
  updateResume,
  deleteResume,
} = require("../controllers/resumeController");
const router = express.Router();

router.post("/", protect, createResume);
router.get("/", protect, getUserResumes);
router.get("/:id", protect, getResumeById);
router.put("/:id", protect, updateResume);
router.put(
  "/:id/upload-images",
  protect,
  upload.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  uploadResumeImages,
);

router.delete("/:id", protect, deleteResume);

module.exports = router;
