const mongoose = require("mongoose");

const AIConfigSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    provider: {
      type: String,
      enum: ["internal", "openai", "gemini", "openrouter", "nvidia", "custom"],
      default: "internal",
    },
    apiKey: {
      type: String,
      default: "",
    },
    baseUrl: {
      type: String,
      default: "",
    },
    model: {
      type: String,
      default: "",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("AIConfig", AIConfigSchema);
