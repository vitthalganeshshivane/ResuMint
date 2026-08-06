import React from "react";

const TemplateCard = ({ thumbnailImg, isSelected, onSelect }) => {
  return (
    <div
      className="h-auto md:h-[300px] flex flex-col items-center justify-between overflow-hidden cursor-pointer transition-all duration-300"
      style={{
        backgroundColor: "var(--color-cream-lifted)",
        borderRadius: "20px",
        border: isSelected
          ? "2px solid var(--color-ink)"
          : "1px solid var(--color-dust)",
      }}
      onClick={onSelect}
    >
      {thumbnailImg ? (
        <img src={thumbnailImg} alt="" className="w-full rounded" />
      ) : (
        <div />
      )}
    </div>
  );
};

export default TemplateCard;
