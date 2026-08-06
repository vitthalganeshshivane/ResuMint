const express = require("express");
const { protect } = require("../middlewares/authMiddleware");
const {
  saveAnalysis,
  getAnalysisHistory,
  deleteAnalysis,
} = require("../controllers/analysisHistoryController");

const router = express.Router();

router.post("/", protect, saveAnalysis);
router.get("/", protect, getAnalysisHistory);
router.delete("/:id", protect, deleteAnalysis);

module.exports = router;
