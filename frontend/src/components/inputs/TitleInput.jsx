import React, { useState } from "react";
import { LuCheck, LuPencil } from "react-icons/lu";

const TitleInput = ({ title, setTitle, onSave }) => {
  const [showInput, setShowInput] = useState(false);

  const handleSave = async () => {
    if (onSave) await onSave();
    setShowInput(false);
  };

  return (
    <div className="flex items-center gap-3">
      {showInput ? (
        <>
          <input
            type="text"
            placeholder="Resume title"
            className="text-sm md:text-[17px] bg-transparent outline-none font-semibold pb-1"
            style={{
              color: "var(--color-ink)",
              borderBottom: "1.5px solid var(--color-ink)",
            }}
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
          <button className="cursor-pointer">
            <LuCheck
              className="text-[16px]"
              style={{ color: "var(--color-signal-orange)" }}
              onClick={handleSave}
            />
          </button>
        </>
      ) : (
        <>
          <h2
            className="text-sm md:text-[17px] font-semibold"
            style={{ color: "var(--color-ink)", letterSpacing: "-0.005em" }}
          >
            {title}
          </h2>
          <button className="cursor-pointer">
            <LuPencil
              className="text-sm"
              style={{ color: "var(--color-slate)" }}
              onClick={() => setShowInput((prevState) => !prevState)}
            />
          </button>
        </>
      )}
    </div>
  );
};

export default TitleInput;
