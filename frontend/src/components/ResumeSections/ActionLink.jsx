import React from "react";

const ActionLink = ({ icon, link, bgColor }) => {
  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3"
    >
      <div
        className="w-[25px] h-[25px] flex items-center justify-center rounded-full"
        style={{ backgroundColor: bgColor }}
      >
        {icon}
      </div>

      <p className="text-[13px] font-medium underline cursor-pointer break-all">
        {link}
      </p>
    </a>
  );
};

export default ActionLink;
