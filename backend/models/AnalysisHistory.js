const mongoose = require("mongoose");

const AnalysisHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    fileName: {
      type: String,
      required: true,
    },
    overallScore: {
      type: Number,
      default: 0,
    },
    summary: {
      type: String,
      default: "",
    },
    sections: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    strengths: {
      type: [String],
      default: [],
    },
    improvements: {
      type: [String],
      default: [],
    },
    atsAnalysis: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true },
);

AnalysisHistorySchema.index({ userId: -1, createdAt: -1 });

module.exports = mongoose.model("AnalysisHistory", AnalysisHistorySchema);
