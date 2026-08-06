const AnalysisHistory = require("../models/AnalysisHistory");

const saveAnalysis = async (req, res) => {
  try {
    const { fileName, analysis } = req.body;

    if (!fileName || !analysis) {
      return res.status(400).json({ message: "fileName and analysis are required" });
    }

    const record = await AnalysisHistory.create({
      userId: req.user._id,
      fileName,
      overallScore: analysis.overallScore || 0,
      summary: analysis.summary || "",
      sections: analysis.sections || {},
      strengths: analysis.strengths || [],
      improvements: analysis.improvements || [],
      atsAnalysis: analysis.atsAnalysis || {},
    });

    res.status(201).json(record);
  } catch (error) {
    res.status(500).json({ message: "Failed to save analysis", error: error.message });
  }
};

const getAnalysisHistory = async (req, res) => {
  try {
    const records = await AnalysisHistory.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch history", error: error.message });
  }
};

const deleteAnalysis = async (req, res) => {
  try {
    const record = await AnalysisHistory.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!record) {
      return res.status(404).json({ message: "Record not found" });
    }

    res.json({ message: "Analysis deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete analysis", error: error.message });
  }
};

module.exports = { saveAnalysis, getAnalysisHistory, deleteAnalysis };
