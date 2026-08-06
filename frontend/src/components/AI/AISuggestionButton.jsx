import React, { useState } from "react";
import { LuSparkles, LuLoader } from "react-icons/lu";
import toast from "react-hot-toast";

const AISuggestionButton = ({ onClick, label = "Generate with AI", size = "sm" }) => {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      await onClick();
    } catch (error) {
      toast.error(error?.response?.data?.message || "AI request failed");
    } finally {
      setLoading(false);
    }
  };

  if (size === "sm") {
    return (
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-lg cursor-pointer transition-all duration-200 mt-2"
        style={{
          backgroundColor: "var(--color-cream)",
          color: "var(--color-signal-orange)",
          border: "1px solid var(--color-dust)",
        }}
      >
        {loading ? (
          <LuLoader size={12} className="animate-spin" />
        ) : (
          <LuSparkles size={12} />
        )}
        {loading ? "Generating..." : label}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className="inline-flex items-center gap-2 text-[13px] font-semibold px-4 py-2 rounded-xl cursor-pointer transition-all duration-200"
      style={{
        backgroundColor: "var(--color-ink)",
        color: "var(--color-cream)",
        border: "1.5px solid var(--color-ink)",
      }}
    >
      {loading ? (
        <LuLoader size={14} className="animate-spin" />
      ) : (
        <LuSparkles size={14} />
      )}
      {loading ? "Generating..." : label}
    </button>
  );
};

export default AISuggestionButton;
