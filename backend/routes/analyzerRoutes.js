const express = require("express");
const { protect } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");
const { analyzeUploadedResume } = require("../controllers/analyzerController");
const rateLimit = require("express-rate-limit");

const router = express.Router();

const analyzerLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: { message: "Too many analysis requests. Please wait a minute." },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post(
  "/analyze",
  protect,
  analyzerLimiter,
  upload.single("resumeFile"),
  analyzeUploadedResume,
);

module.exports = router;
