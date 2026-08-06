const AIConfig = require("../models/AIConfig");
const aiService = require("../services/aiService");

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

const getSettings = async (req, res) => {
  try {
    const config = await AIConfig.findDecrypted({ userId: req.user._id });
    res.json({
      provider: config?.provider || "internal",
      apiKey: config?.apiKey || "",
      hasApiKey: !!config?.apiKey,
      baseUrl: config?.baseUrl || "",
      model: config?.model || "",
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to get AI settings", error: error.message });
  }
};

const saveSettings = async (req, res) => {
  try {
    const { provider, apiKey, baseUrl, model } = req.body;

    const config = await AIConfig.findOneAndUpdate(
      { userId: req.user._id },
      { provider, apiKey, baseUrl, model },
      { new: true, upsert: true },
    );

    res.json({ message: "AI settings saved", provider: config.provider });
  } catch (error) {
    res.status(500).json({ message: "Failed to save AI settings", error: error.message });
  }
};

const fetchModels = async (req, res) => {
  try {
    const { provider, apiKey, baseUrl } = req.query;

    if (!provider) {
      return res.status(400).json({ message: "Provider is required" });
    }

    let useApiKey = apiKey;
    let useBaseUrl = baseUrl;

    if (!useApiKey) {
      const config = await AIConfig.findDecrypted({ userId: req.user._id });
      if (config?.apiKey) {
        useApiKey = config.apiKey;
        useBaseUrl = config.baseUrl;
      } else {
        useApiKey = INTERNAL_API_KEY;
        useBaseUrl = INTERNAL_BASE_URL;
      }
    }

    const models = await aiService.fetchModels(provider, useApiKey, useBaseUrl);
    res.json({ models });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch models", error: error.message });
  }
};

const generateSummary = async (req, res) => {
  try {
    const config = await getAIConfig(req.user._id);
    const result = await aiService.generateSummary(
      config.provider,
      config.apiKey,
      config.baseUrl,
      config.model,
      req.body,
    );
    res.json({ result });
  } catch (error) {
    res.status(500).json({ message: "AI generation failed", error: error.message });
  }
};

const improveBullets = async (req, res) => {
  try {
    const config = await getAIConfig(req.user._id);
    const result = await aiService.improveBullets(
      config.provider,
      config.apiKey,
      config.baseUrl,
      config.model,
      req.body,
    );
    res.json({ result });
  } catch (error) {
    res.status(500).json({ message: "AI improvement failed", error: error.message });
  }
};

const enhanceProject = async (req, res) => {
  try {
    const config = await getAIConfig(req.user._id);
    const result = await aiService.enhanceProject(
      config.provider,
      config.apiKey,
      config.baseUrl,
      config.model,
      req.body,
    );
    res.json({ result });
  } catch (error) {
    res.status(500).json({ message: "AI enhancement failed", error: error.message });
  }
};

const suggestSkills = async (req, res) => {
  try {
    const config = await getAIConfig(req.user._id);
    const result = await aiService.suggestSkills(
      config.provider,
      config.apiKey,
      config.baseUrl,
      config.model,
      req.body,
    );
    res.json({ result });
  } catch (error) {
    res.status(500).json({ message: "AI suggestion failed", error: error.message });
  }
};

const reviewResume = async (req, res) => {
  try {
    const config = await getAIConfig(req.user._id);
    const result = await aiService.reviewResume(
      config.provider,
      config.apiKey,
      config.baseUrl,
      config.model,
      req.body,
    );
    res.json({ result });
  } catch (error) {
    res.status(500).json({ message: "AI review failed", error: error.message });
  }
};

module.exports = {
  getSettings,
  saveSettings,
  fetchModels,
  generateSummary,
  improveBullets,
  enhanceProject,
  suggestSkills,
  reviewResume,
};
