const { extractText, analyzeResume } = require("../services/analyzerService");
const AIConfig = require("../models/AIConfig");

const INTERNAL_API_KEY = process.env.OPENAI_API_KEY || "";
const INTERNAL_BASE_URL = process.env.OPENAI_BASE_URL || "";
const INTERNAL_MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";

async function getAIConfig(userId) {
  const config = await AIConfig.findDecrypted({ userId });
  if (!config || config.provider === "internal") {
    return {
      provider: "openai",
      apiKey: INTERNAL_API_KEY,
      baseUrl: INTERNAL_BASE_URL,
      model: INTERNAL_MODEL,
    };
  }
  return {
    provider: config.provider,
    apiKey: config.apiKey,
    baseUrl: config.baseUrl,
    model: config.model,
  };
}

const analyzeUploadedResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(req.file.mimetype)) {
      return res
        .status(400)
        .json({ message: "Only PDF and DOCX files are supported" });
    }

    const extractedText = await extractText(req.file);

    if (!extractedText || extractedText.trim().length < 50) {
      return res
        .status(400)
        .json({ message: "Could not extract sufficient text from the file" });
    }

    const aiConfig = await getAIConfig(req.user.id);

    const analysis = await analyzeResume(
      aiConfig.provider,
      aiConfig.apiKey,
      aiConfig.baseUrl,
      aiConfig.model,
      extractedText,
    );

    res.status(200).json({
      extractedText,
      analysis,
    });
  } catch (error) {
    console.error("Analyzer error:", error);
    res
      .status(500)
      .json({ message: "Analysis failed", error: error.message });
  }
};

module.exports = { analyzeUploadedResume };
