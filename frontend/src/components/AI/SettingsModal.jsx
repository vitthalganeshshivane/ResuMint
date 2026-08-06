import React, { useState, useEffect } from "react";
import { LuSettings, LuCheck, LuLoader, LuInfo } from "react-icons/lu";
import toast from "react-hot-toast";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";

const PROVIDERS = [
  {
    id: "internal",
    name: "Internal (Free)",
    description: "Use the built-in API key",
    models: ["gpt-4o-mini"],
  },
  {
    id: "openai",
    name: "OpenAI",
    description: "api.openai.com",
    models: [],
  },
  {
    id: "gemini",
    name: "Google Gemini",
    description: "generativelanguage.googleapis.com",
    models: [],
  },
  {
    id: "openrouter",
    name: "OpenRouter",
    description: "openrouter.ai",
    models: [],
  },
  {
    id: "nvidia",
    name: "NVIDIA NIM",
    description: "integrate.api.nvidia.com",
    models: [],
  },
  {
    id: "custom",
    name: "Custom (OpenAI Compatible)",
    description: "Any OpenAI-compatible endpoint",
    models: [],
  },
];

const SettingsModal = ({ isOpen, onClose }) => {
  const [provider, setProvider] = useState("internal");
  const [apiKey, setApiKey] = useState("");
  const [baseUrl, setBaseUrl] = useState("");
  const [model, setModel] = useState("");
  const [models, setModels] = useState([]);
  const [loadingModels, setLoadingModels] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showKey, setShowKey] = useState(false);

  useEffect(() => {
    if (isOpen) fetchSettings();
  }, [isOpen]);

  useEffect(() => {
    if (provider !== "internal") {
      fetchModelsList();
    } else {
      setModels(["gpt-4o-mini"]);
      setModel("gpt-4o-mini");
    }
  }, [provider, apiKey, baseUrl]);

  const fetchSettings = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.AI.GET_SETTINGS);
      const { provider: p, apiKey: k, baseUrl: b, model: m } = response.data;
      setProvider(p || "internal");
      setApiKey(k || "");
      setBaseUrl(b || "");
      setModel(m || "");
    } catch (error) {
      console.error("Failed to fetch AI settings:", error);
    }
  };

  const fetchModelsList = async () => {
    setLoadingModels(true);
    try {
      const response = await axiosInstance.get(
        API_PATHS.AI.FETCH_MODELS(provider, apiKey, baseUrl),
      );
      const fetchedModels = response.data.models || [];
      setModels(fetchedModels);
      if (fetchedModels.length > 0 && !model) {
        setModel(fetchedModels[0]);
      }
    } catch (error) {
      console.error("Failed to fetch models:", error);
      setModels([]);
    } finally {
      setLoadingModels(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await axiosInstance.put(API_PATHS.AI.SAVE_SETTINGS, {
        provider,
        apiKey,
        baseUrl,
        model,
      });
      toast.success("AI settings saved!");
      onClose();
    } catch (error) {
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const selectedProvider = PROVIDERS.find((p) => p.id === provider);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center w-full h-full bg-black/40 backdrop-blur-sm">
      <div
        className="relative flex flex-col overflow-hidden animate-fade-in w-[90vw] md:w-[500px] max-h-[85vh]"
        style={{
          backgroundColor: "var(--color-cream-lifted)",
          borderRadius: "40px",
          boxShadow: "rgba(0, 0, 0, 0.25) 0px 70px 110px 0px",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center gap-3 px-6 py-4"
          style={{ borderBottom: "1px solid var(--color-dust)" }}
        >
          <LuSettings size={18} style={{ color: "var(--color-ink)" }} />
          <h3
            className="text-lg font-medium"
            style={{ color: "var(--color-ink)", letterSpacing: "-0.005em" }}
          >
            AI Assistant Settings
          </h3>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar px-6 py-5">
          {/* Provider Selection */}
          <label
            className="text-xs font-medium block mb-2"
            style={{ color: "var(--color-slate)" }}
          >
            Provider
          </label>
          <div className="grid grid-cols-2 gap-2 mb-5">
            {PROVIDERS.map((p) => (
              <button
                key={p.id}
                onClick={() => {
                  setProvider(p.id);
                  setApiKey("");
                  setBaseUrl("");
                  setModel("");
                }}
                className="p-3 rounded-xl text-left cursor-pointer transition-all duration-200"
                style={{
                  backgroundColor:
                    provider === p.id ? "var(--color-ink)" : "var(--color-cream)",
                  color:
                    provider === p.id ? "var(--color-cream)" : "var(--color-ink)",
                  border:
                    provider === p.id
                      ? "1.5px solid var(--color-ink)"
                      : "1.5px solid var(--color-dust)",
                }}
              >
                <div className="text-[13px] font-medium">{p.name}</div>
                <div
                  className="text-[11px] mt-0.5"
                  style={{
                    color:
                      provider === p.id
                        ? "var(--color-dust)"
                        : "var(--color-slate)",
                  }}
                >
                  {p.description}
                </div>
              </button>
            ))}
          </div>

          {provider !== "internal" && (
            <>
              {/* API Key */}
              <label
                className="text-xs font-medium block mb-2"
                style={{ color: "var(--color-slate)" }}
              >
                API Key
              </label>
              <div
                className="flex items-center gap-2 rounded-xl px-4 py-3 mb-4"
                style={{
                  backgroundColor: "var(--color-cream)",
                  border: "1px solid var(--color-dust)",
                }}
              >
                <input
                  type={showKey ? "text" : "password"}
                  placeholder="sk-..."
                  className="flex-1 bg-transparent outline-none text-sm"
                  style={{ color: "var(--color-ink)" }}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                />
                <button
                  onClick={() => setShowKey(!showKey)}
                  className="text-[11px] font-medium cursor-pointer px-2 py-1 rounded-lg"
                  style={{
                    backgroundColor: "var(--color-cream-lifted)",
                    color: "var(--color-slate)",
                  }}
                >
                  {showKey ? "Hide" : "Show"}
                </button>
              </div>

              {/* Base URL */}
              {provider === "custom" && (
                <>
                  <label
                    className="text-xs font-medium block mb-2"
                    style={{ color: "var(--color-slate)" }}
                  >
                    Base URL
                  </label>
                  <input
                    type="text"
                    placeholder="https://your-api.com/v1"
                    className="w-full rounded-xl px-4 py-3 mb-4 text-sm outline-none"
                    style={{
                      backgroundColor: "var(--color-cream)",
                      border: "1px solid var(--color-dust)",
                      color: "var(--color-ink)",
                    }}
                    value={baseUrl}
                    onChange={(e) => setBaseUrl(e.target.value)}
                  />
                </>
              )}

              {/* Model Selection */}
              <label
                className="text-xs font-medium block mb-2"
                style={{ color: "var(--color-slate)" }}
              >
                Model
              </label>
              <div
                className="flex items-center gap-2 rounded-xl px-4 py-3 mb-4"
                style={{
                  backgroundColor: "var(--color-cream)",
                  border: "1px solid var(--color-dust)",
                }}
              >
                {loadingModels ? (
                  <div className="flex items-center gap-2 text-sm" style={{ color: "var(--color-slate)" }}>
                    <LuLoader className="animate-spin" size={14} />
                    Fetching models...
                  </div>
                ) : models.length > 0 ? (
                  <select
                    className="flex-1 bg-transparent outline-none text-sm cursor-pointer"
                    style={{ color: "var(--color-ink)" }}
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                  >
                    {models.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    placeholder="Enter model name"
                    className="flex-1 bg-transparent outline-none text-sm"
                    style={{ color: "var(--color-ink)" }}
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                  />
                )}
              </div>

              <div
                className="flex items-start gap-2 p-3 rounded-xl mb-4"
                style={{
                  backgroundColor: "var(--color-cream)",
                  border: "1px solid var(--color-dust)",
                }}
              >
                <LuInfo size={14} className="mt-0.5 flex-shrink-0" style={{ color: "var(--color-slate)" }} />
                <p className="text-[11px] leading-relaxed" style={{ color: "var(--color-slate)" }}>
                  Your API key is stored securely in our database and only used for AI features.
                  {provider === "internal" && " No API key needed - using the built-in key."}
                </p>
              </div>
            </>
          )}

          {provider === "internal" && (
            <div
              className="flex items-start gap-2 p-4 rounded-xl"
              style={{
                backgroundColor: "var(--color-cream)",
                border: "1px solid var(--color-dust)",
              }}
            >
              <LuInfo size={14} className="mt-0.5 flex-shrink-0" style={{ color: "var(--color-slate)" }} />
              <p className="text-[12px] leading-relaxed" style={{ color: "var(--color-slate)" }}>
                Using the built-in API key. No configuration needed. Upgrade to your own API key for higher rate limits and access to more models.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-end gap-3 px-6 py-4"
          style={{ borderTop: "1px solid var(--color-dust)" }}
        >
          <button
            className="btn-small-light"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="btn-small"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Settings"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
