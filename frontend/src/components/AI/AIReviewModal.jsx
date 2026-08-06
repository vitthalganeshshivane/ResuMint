import React from "react";
import { LuSparkles, LuCheck, LuInfo } from "react-icons/lu";

const AIReviewModal = ({ isOpen, onClose, reviewData }) => {
  if (!isOpen || !reviewData) return null;

  const { score = 0, summary = "", sections = {}, improvements = [], atsNotes = "" } = reviewData;

  const getScoreColor = (s) => {
    if (s >= 80) return "#22C55E";
    if (s >= 60) return "var(--color-signal-orange)";
    return "#EF4444";
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center w-full h-full bg-black/40 backdrop-blur-sm">
      <div
        className="relative flex flex-col overflow-hidden animate-fade-in w-[90vw] md:w-[550px] max-h-[85vh]"
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
            Resume Review
          </h3>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar px-6 py-5">
          {/* Score */}
          <div className="flex items-center gap-4 mb-6">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center"
              style={{
                border: `3px solid ${getScoreColor(score)}`,
              }}
            >
              <span
                className="text-2xl font-bold"
                style={{ color: getScoreColor(score) }}
              >
                {score}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium" style={{ color: "var(--color-ink)" }}>
                Overall Score
              </p>
              <p className="text-[12px]" style={{ color: "var(--color-slate)" }}>
                {score >= 80
                  ? "Great resume! A few tweaks could make it perfect."
                  : score >= 60
                    ? "Good foundation. See improvements below."
                    : "Needs work. Focus on the suggestions below."}
              </p>
            </div>
          </div>

          {/* Summary */}
          {summary && (
            <div className="mb-5">
              <p className="text-[12px] font-semibold uppercase mb-2" style={{ color: "var(--color-slate)", letterSpacing: "0.04em" }}>
                Summary
              </p>
              <p className="text-sm leading-relaxed" style={{ color: "var(--color-ink)", fontWeight: 450 }}>
                {summary}
              </p>
            </div>
          )}

          {/* Section Feedback */}
          {Object.keys(sections).length > 0 && (
            <div className="mb-5">
              <p className="text-[12px] font-semibold uppercase mb-2" style={{ color: "var(--color-slate)", letterSpacing: "0.04em" }}>
                Section Feedback
              </p>
              <div className="flex flex-col gap-2">
                {Object.entries(sections).map(([key, value]) => (
                  <div
                    key={key}
                    className="p-3 rounded-xl"
                    style={{ backgroundColor: "var(--color-cream)", border: "1px solid var(--color-dust)" }}
                  >
                    <p className="text-[11px] font-semibold uppercase mb-1" style={{ color: "var(--color-signal-orange)" }}>
                      {key}
                    </p>
                    <p className="text-[12px] leading-relaxed" style={{ color: "var(--color-ink)", fontWeight: 450 }}>
                      {value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Improvements */}
          {improvements.length > 0 && (
            <div className="mb-5">
              <p className="text-[12px] font-semibold uppercase mb-2" style={{ color: "var(--color-slate)", letterSpacing: "0.04em" }}>
                Top Improvements
              </p>
              <div className="flex flex-col gap-2">
                {improvements.map((item, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <LuCheck size={14} className="mt-0.5 flex-shrink-0" style={{ color: "var(--color-signal-orange)" }} />
                    <p className="text-[12px] leading-relaxed" style={{ color: "var(--color-ink)", fontWeight: 450 }}>
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ATS Notes */}
          {atsNotes && (
            <div>
              <p className="text-[12px] font-semibold uppercase mb-2" style={{ color: "var(--color-slate)", letterSpacing: "0.04em" }}>
                ATS Compatibility
              </p>
              <div
                className="flex items-start gap-2 p-3 rounded-xl"
                style={{ backgroundColor: "var(--color-cream)", border: "1px solid var(--color-dust)" }}
              >
                <LuInfo size={14} className="mt-0.5 flex-shrink-0" style={{ color: "var(--color-slate)" }} />
                <p className="text-[12px] leading-relaxed" style={{ color: "var(--color-ink)", fontWeight: 450 }}>
                  {atsNotes}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-end px-6 py-4"
          style={{ borderTop: "1px solid var(--color-dust)" }}
        >
          <button className="btn-small" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIReviewModal;
