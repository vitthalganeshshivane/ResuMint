import React from "react";

const Progress = ({ progress = 0, total = 5, color, bgColor }) => {
  const activeColor = color || "var(--color-ink)";
  const inactiveColor = bgColor || "var(--color-dust)";

  return (
    <div className="flex gap-1.5">
      {[...Array(total)].map((_, index) => {
        return (
          <div
            key={index}
            className="w-2 h-2 rounded-full transition-all"
            style={{
              backgroundColor: index < progress ? activeColor : inactiveColor,
            }}
          />
        );
      })}
    </div>
  );
};

export default Progress;
