import React, { useState } from "react";
import { LuCheck, LuSparkles } from "react-icons/lu";

const AIResultModal = ({ isOpen, onClose, title, results, onSelect }) => {
  const [selected, setSelected] = useState(null);

  if (!isOpen) return null;

  const parseResults = (raw) => {
    if (!raw) return [];

    const cleaned = raw
      .replace(/^```[\s\S]*?\n/gm, "")
      .replace(/```/g, "")
      .trim();

    const parts = cleaned.split(/\n\s*(?:\d+[\.\)]\s*|(?=Option\s*\d)|(?=Variation\s*\d)|(?=Version\s*\d))/i);

    const filtered = parts
      .map((p) => p.trim())
      .filter((p) => p.length > 10);

    if (filtered.length === 0 && cleaned.length > 0) {
      return [cleaned];
    }

    return filtered.slice(0, 3);
  };

  const resultsList = parseResults(results);

  const handleSelect = () => {
    if (selected !== null && resultsList[selected]) {
      onSelect(resultsList[selected]);
      setSelected(null);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center w-full h-full bg-black/40 backdrop-blur-sm">
      <div
        className="relative flex flex-col overflow-hidden animate-fade-in w-[90vw] md:w-[600px] max-h-[80vh]"
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
          <LuSparkles size={18} style={{ color: "var(--color-signal-orange)" }} />
          <h3
            className="text-lg font-medium"
            style={{ color: "var(--color-ink)", letterSpacing: "-0.005em" }}
          >
            {title || "AI Suggestions"}
          </h3>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto custom-scrollbar px-6 py-5">
          {resultsList.length === 0 ? (
            <p className="text-sm text-center py-8" style={{ color: "var(--color-slate)" }}>
              No suggestions generated. Try again.
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {resultsList.map((result, index) => (
                <button
                  key={index}
                  onClick={() => setSelected(index)}
                  className="w-full text-left p-4 rounded-2xl cursor-pointer transition-all duration-200"
                  style={{
                    backgroundColor:
                      selected === index ? "var(--color-ink)" : "var(--color-cream)",
                    color:
                      selected === index ? "var(--color-cream)" : "var(--color-ink)",
                    border:
                      selected === index
                        ? "1.5px solid var(--color-ink)"
                        : "1.5px solid var(--color-dust)",
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center mt-0.5"
                      style={{
                        backgroundColor:
                          selected === index
                            ? "var(--color-cream)"
                            : "var(--color-cream-lifted)",
                        border:
                          selected === index
                            ? "none"
                            : "1.5px solid var(--color-dust)",
                      }}
                    >
                      {selected === index && (
                        <LuCheck
                          size={12}
                          style={{ color: "var(--color-ink)" }}
                        />
                      )}
                    </div>
                    <p
                      className="text-sm leading-relaxed whitespace-pre-wrap"
                      style={{ fontWeight: 450 }}
                    >
                      {result}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-end gap-3 px-6 py-4"
          style={{ borderTop: "1px solid var(--color-dust)" }}
        >
          <button className="btn-small-light" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn-small"
            onClick={handleSelect}
            disabled={selected === null}
            style={{ opacity: selected === null ? 0.5 : 1 }}
          >
            Use Selected
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIResultModal;
