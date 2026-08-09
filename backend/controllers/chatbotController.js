const { chat } = require("../services/chatbotService");
const AIConfig = require("../models/AIConfig");

const INTERNAL_API_KEY = process.env.NVIDIA_NIM_API_KEY || "";
const INTERNAL_BASE_URL = process.env.NVIDIA_NIM_BASE_URL || "https://integrate.api.nvidia.com/v1";
const INTERNAL_MODEL = process.env.NVIDIA_NIM_MODEL || "nvidia/nemotron-mini-4b-instruct";

async function getAIConfig(userId) {
  const config = await AIConfig.findDecrypted({ userId });
  if (!config || config.provider === "internal") {
    return {
      provider: "nvidia",
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

const handleChat = async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ message: "Message is required" });
    }

    const aiConfig = await getAIConfig(req.user._id);
    const reply = await chat(message.trim(), history || [], aiConfig);

    res.status(200).json({ reply });
  } catch (error) {
    console.error("Chatbot error:", error);
    res
      .status(500)
      .json({ message: "Failed to get response", error: error.message });
  }
};

module.exports = { handleChat };
