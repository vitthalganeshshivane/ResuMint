import React from "react";

const StepProgress = ({ progress }) => {
  return (
    <div
      className="w-full h-1 overflow-hidden"
      style={{
        backgroundColor: "var(--color-cream)",
        borderRadius: "2px",
      }}
    >
      <div
        className="h-1 transition-all"
        style={{
          width: `${progress}%`,
          backgroundColor: "var(--color-ink)",
          borderRadius: "2px",
        }}
      />
    </div>
  );
};

export default StepProgress;
