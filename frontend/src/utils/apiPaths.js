export const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const API_PATHS = {
  AUTH: {
    REGISTER: "/api/auth/register",
    LOGIN: "/api/auth/login",
    GET_PROFILE: "/api/auth/profile",
    UPDATE_PROFILE: "/api/auth/profile",
    CHANGE_PASSWORD: "/api/auth/change-password",
    GET_STATS: "/api/auth/stats",
    DELETE_ACCOUNT: "/api/auth/account",
  },

  RESUME: {
    CREATE: "/api/resume",
    GET_ALL: "/api/resume",
    GET_BY_ID: (id) => `/api/resume/${id}`,
    UPDATE: (id) => `/api/resume/${id}`,
    DELETE: (id) => `/api/resume/${id}`,
    UPLOAD_IMAGES: (id) => `/api/resume/${id}/upload-images`,
    QUICK_SKILL: "/api/resume/quick/skill",
    QUICK_PROJECT: "/api/resume/quick/project",
    QUICK_EXPERIENCE: "/api/resume/quick/experience",
  },

  IMAGE: {
    UPLOAD_IMAGE: "/api/auth/upload-image",
  },

  AI: {
    GET_SETTINGS: "/api/ai/settings",
    SAVE_SETTINGS: "/api/ai/settings",
    FETCH_MODELS: (provider, apiKey, baseUrl) => {
      const params = new URLSearchParams({ provider });
      if (apiKey) params.append("apiKey", apiKey);
      if (baseUrl) params.append("baseUrl", baseUrl);
      return `/api/ai/models?${params.toString()}`;
    },
    GENERATE_SUMMARY: "/api/ai/generate-summary",
    IMPROVE_BULLETS: "/api/ai/improve-bullets",
    ENHANCE_PROJECT: "/api/ai/enhance-project",
    SUGGEST_SKILLS: "/api/ai/suggest-skills",
    REVIEW_RESUME: "/api/ai/review-resume",
  },

  ANALYZER: {
    ANALYZE: "/api/analyzer/analyze",
  },

  CHATBOT: {
    SEND: "/api/chatbot",
  },
};
