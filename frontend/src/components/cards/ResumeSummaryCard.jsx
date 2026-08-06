import React, { useEffect, useState } from "react";
import { getLightColorFromImage } from "../../utils/helper";

const ResumeSummaryCard = ({ imgUrl, title, lastUpdated, onSelect }) => {
  const [bgColor, setBgColor] = useState("#ffffff");

  useEffect(() => {
    if (imgUrl) {
      getLightColorFromImage(imgUrl)
        .then((color) => setBgColor(color))
        .catch(() => setBgColor("#ffffff"));
    }
  }, [imgUrl]);

  return (
    <div
      onClick={onSelect}
      className="h-[300px] flex flex-col items-center justify-between overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.02]"
      style={{
        backgroundColor: bgColor,
        borderRadius: "24px",
        border: "1px solid var(--color-dust)",
      }}
    >
      <div className="p-4 w-full">
        {imgUrl ? (
          <img
            src={imgUrl}
            className="w-full h-[200px] object-cover"
            style={{ borderRadius: "16px" }}
            alt=""
          />
        ) : (
          <div className="w-full h-[200px]" />
        )}
      </div>

      <div
        className="w-full px-5 py-3"
        style={{
          backgroundColor: "var(--color-cream-lifted)",
          borderTop: "1px solid var(--color-dust)",
        }}
      >
        <h5
          className="text-sm font-medium truncate overflow-hidden whitespace-nowrap"
          style={{ color: "var(--color-ink)" }}
        >
          {title}
        </h5>
        <p
          className="text-xs mt-0.5"
          style={{ color: "var(--color-slate)", fontWeight: 450 }}
        >
          Last Updated: {lastUpdated}
        </p>
      </div>
    </div>
  );
};

export default ResumeSummaryCard;
