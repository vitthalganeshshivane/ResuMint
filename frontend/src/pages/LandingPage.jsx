import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import HERO_IMG from "../../public/Hero_Img.png";
import Login from "../pages/Auth/Login";
import SignUp from "../pages/Auth/SignUp";
import Modal from "../components/Modal";
import { UserContext } from "../context/userContext";
import { useTheme } from "../context/themeContext";
import ProfileInfoCard from "../components/cards/ProfileInfoCard";
import { LuArrowRight, LuMoon, LuSun } from "react-icons/lu";

const LandingPage = () => {
  const { user } = useContext(UserContext);
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [openAuthModel, setOpenAuthModel] = useState(false);
  const [currentPage, setCurrentPage] = useState("login");

  const handleCTA = () => {
    if (!user) {
      setOpenAuthModel(true);
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <div
      className="w-full min-h-full pb-96 transition-colors duration-300"
      style={{ backgroundColor: "var(--color-cream)" }}
    >
      <div className="container mx-auto px-6 py-6 max-w-6xl">
        {/* Navigation */}
        <header className="flex justify-between items-center mb-20">
          <div
            className="text-xl font-semibold"
            style={{ color: "var(--color-ink)", letterSpacing: "-0.02em" }}
          >
            Resu<span style={{ color: "var(--color-signal-orange)" }}>Mint</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="w-10 h-10 flex items-center justify-center rounded-full cursor-pointer transition-all duration-200"
              style={{
                backgroundColor: "var(--color-cream-lifted)",
                color: "var(--color-ink)",
                boxShadow: "rgba(0, 0, 0, 0.04) 0px 4px 24px 0px",
              }}
            >
              {isDarkMode ? <LuSun size={18} /> : <LuMoon size={18} />}
            </button>
            {user ? (
              <ProfileInfoCard />
            ) : (
              <button
                className="text-sm font-medium px-6 py-2.5 rounded-full cursor-pointer transition-all duration-200"
                style={{
                  backgroundColor: "var(--color-cream-lifted)",
                  color: "var(--color-ink)",
                  border: "1.5px solid var(--color-dust)",
                }}
                onClick={() => setOpenAuthModel(true)}
              >
                Login / Sign Up
              </button>
            )}
          </div>
        </header>

        {/* Hero Section */}
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="w-full md:w-1/2">
            <div className="flex items-center gap-2 mb-5">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: "var(--color-signal-orange)" }}
              />
              <span
                className="text-xs font-bold uppercase"
                style={{ color: "var(--color-slate)", letterSpacing: "0.04em" }}
              >
                Resume Builder
              </span>
            </div>

            <h1
              className="text-5xl md:text-6xl font-medium mb-6 leading-none"
              style={{ color: "var(--color-ink)", letterSpacing: "-0.02em" }}
            >
              Build Your Resume{" "}
              <span
                className="text-transparent bg-clip-text"
                style={{
                  backgroundImage: "linear-gradient(135deg, var(--color-signal-orange), var(--color-signal-orange-light))",
                }}
              >
                Effortlessly
              </span>
            </h1>

            <p
              className="text-lg mb-10 leading-relaxed max-w-md"
              style={{ color: "var(--color-slate)", fontWeight: 450 }}
            >
              Craft a standout resume in minutes with our smart and intuitive
              resume builder. Professional templates, instant PDF export.
            </p>

            <button
              className="inline-flex items-center gap-2 text-sm font-medium px-8 py-3.5 rounded-full cursor-pointer transition-all duration-200"
              style={{
                backgroundColor: "var(--color-ink)",
                color: "var(--color-cream)",
                border: "1.5px solid var(--color-ink)",
                letterSpacing: "-0.003em",
              }}
              onClick={handleCTA}
            >
              Get Started
              <LuArrowRight size={16} />
            </button>
          </div>

          <div className="w-full md:w-1/2">
            <div style={{ borderRadius: "40px", overflow: "hidden" }}>
              <img
                src={HERO_IMG}
                alt="Resume Builder"
                className="w-full object-cover"
                style={{ borderRadius: "40px" }}
              />
            </div>
          </div>
        </div>

        {/* Features Section */}
        <section className="mt-32">
          <div className="flex items-center gap-2 mb-4 justify-center">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: "var(--color-signal-orange)" }}
            />
            <span
              className="text-xs font-bold uppercase"
              style={{ color: "var(--color-slate)", letterSpacing: "0.04em" }}
            >
              Features
            </span>
          </div>

          <h2
            className="text-3xl md:text-4xl font-medium text-center mb-16"
            style={{ color: "var(--color-ink)", letterSpacing: "-0.02em" }}
          >
            Everything You Need
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Easy Editing",
                desc: "Update your resume sections with live preview and instant formatting.",
              },
              {
                title: "Beautiful Templates",
                desc: "Choose from modern, professional templates that are easy to customize.",
              },
              {
                title: "One-Click Export",
                desc: "Download your resume instantly as a high-quality PDF with one click.",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="p-8 transition-all duration-300"
                style={{
                  backgroundColor: "var(--color-cream-lifted)",
                  borderRadius: "24px",
                  border: "1px solid var(--color-dust)",
                }}
              >
                <div
                  className="w-10 h-10 flex items-center justify-center rounded-full mb-5"
                  style={{ backgroundColor: "var(--color-cream)" }}
                >
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: "var(--color-signal-orange)" }}
                  />
                </div>
                <h3
                  className="text-lg font-medium mb-3"
                  style={{ color: "var(--color-ink)", letterSpacing: "-0.005em" }}
                >
                  {feature.title}
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "var(--color-slate)", fontWeight: 450 }}
                >
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Footer */}
      <div
        className="text-sm text-center py-6 mt-16"
        style={{
          backgroundColor: "var(--color-dark-surface)",
          color: "var(--color-slate)",
          borderTop: "1px solid var(--color-dark-border)",
        }}
      >
        Made with care. ResuMint
      </div>

      <Modal
        isOpen={openAuthModel}
        onClose={() => {
          setOpenAuthModel(false);
          setCurrentPage("login");
        }}
        hideHeader
      >
        <div>
          {currentPage === "login" && <Login setCurrentPage={setCurrentPage} />}
          {currentPage === "signup" && <SignUp setCurrentPage={setCurrentPage} />}
        </div>
      </Modal>
    </div>
  );
};

export default LandingPage;
