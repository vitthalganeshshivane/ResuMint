import React, { useState } from "react";
import { Link } from "react-router-dom";
import { LuMoon, LuSun, LuSettings } from "react-icons/lu";
import ProfileInfoCard from "../cards/ProfileInfoCard";
import { useTheme } from "../../context/themeContext";
import AISettingsModal from "../AI/SettingsModal";

const Navbar = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const [openSettings, setOpenSettings] = useState(false);

  return (
    <>
      <div className="flex justify-center px-4 pt-5 pb-2 sticky top-0 z-30">
        <div
          className="flex items-center justify-between gap-5 w-full max-w-5xl px-6 py-3 rounded-full transition-all duration-300"
          style={{
            backgroundColor: "var(--color-cream-lifted)",
            boxShadow: "rgba(0, 0, 0, 0.04) 0px 4px 24px 0px",
            border: "1px solid var(--color-dust)",
          }}
        >
          <Link to={"/dashboard"}>
            <h2
              className="text-lg md:text-xl font-semibold"
              style={{ color: "var(--color-ink)", letterSpacing: "-0.02em" }}
            >
              Resu<span style={{ color: "var(--color-signal-orange)" }}>Mint</span>
            </h2>
          </Link>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="w-9 h-9 flex items-center justify-center rounded-full cursor-pointer transition-all duration-200"
              style={{
                backgroundColor: "var(--color-cream)",
                color: "var(--color-ink)",
              }}
            >
              {isDarkMode ? <LuSun size={16} /> : <LuMoon size={16} />}
            </button>

            <button
              onClick={() => setOpenSettings(true)}
              className="w-9 h-9 flex items-center justify-center rounded-full cursor-pointer transition-all duration-200"
              style={{
                backgroundColor: "var(--color-cream)",
                color: "var(--color-ink)",
              }}
              title="AI Settings"
            >
              <LuSettings size={16} />
            </button>

            <ProfileInfoCard />
          </div>
        </div>
      </div>

      <AISettingsModal
        isOpen={openSettings}
        onClose={() => setOpenSettings(false)}
      />
    </>
  );
};

export default Navbar;
