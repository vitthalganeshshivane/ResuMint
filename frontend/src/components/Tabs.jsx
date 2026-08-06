import React from "react";

const Tabs = ({ tabs, activeTab, setActiveTab }) => {
  return (
    <div className="my-2">
      <div className="flex">
        {tabs.map((tab) => (
          <button
            key={tab.label}
            className="relative px-4 py-2 text-sm font-medium cursor-pointer transition-all duration-200"
            style={{
              color:
                activeTab === tab.label
                  ? "var(--color-ink)"
                  : "var(--color-slate)",
            }}
            onClick={() => setActiveTab(tab.label)}
          >
            <span
              className="text-[14px] font-semibold"
              style={{
                color:
                  activeTab === tab.label
                    ? "var(--color-ink)"
                    : "var(--color-slate)",
              }}
            >
              {tab.label}
            </span>

            {activeTab === tab.label && (
              <div
                className="absolute bottom-0 left-0 w-full h-0.5"
                style={{ backgroundColor: "var(--color-ink)" }}
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Tabs;
