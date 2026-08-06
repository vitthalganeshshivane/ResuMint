const express = require("express");
const { protect } = require("../middlewares/authMiddleware");
const {
  getSettings,
  saveSettings,
  fetchModels,
  generateSummary,
  improveBullets,
  enhanceProject,
  suggestSkills,
  reviewResume,
} = require("../controllers/aiController");

const router = express.Router();

const rateLimit = require("express-rate-limit");

const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: { message: "Too many AI requests. Please wait a minute." },
  standardHeaders: true,
  legacyHeaders: false,
});

router.get("/settings", protect, getSettings);
router.put("/settings", protect, saveSettings);
router.get("/models", protect, fetchModels);

router.post("/generate-summary", protect, aiLimiter, generateSummary);
router.post("/improve-bullets", protect, aiLimiter, improveBullets);
router.post("/enhance-project", protect, aiLimiter, enhanceProject);
router.post("/suggest-skills", protect, aiLimiter, suggestSkills);
router.post("/review-resume", protect, aiLimiter, reviewResume);

module.exports = router;
