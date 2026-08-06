import React, { useState } from "react";
import Input from "../../../components/inputs/Input";
import { LuPlus, LuTrash2 } from "react-icons/lu";
import AISuggestionButton from "../../../components/AI/AISuggestionButton";
import AIResultModal from "../../../components/AI/AIResultModal";
import axiosInstance from "../../../utils/axiosInstance";
import { API_PATHS } from "../../../utils/apiPaths";

const WorkExperienceForm = ({
  WorkExperience,
  updateArrayItem,
  addArrayItem,
  removeArrayItem,
}) => {
  const [showAIModal, setShowAIModal] = useState(false);
  const [aiResults, setAiResults] = useState("");
  const [aiTargetIndex, setAiTargetIndex] = useState(null);

  const handleImproveBullets = async (index) => {
    const exp = WorkExperience[index];
    setAiTargetIndex(index);
    const response = await axiosInstance.post(API_PATHS.AI.IMPROVE_BULLETS, {
      company: exp.company || "",
      role: exp.role || "",
      startDate: exp.startDate || "",
      endDate: exp.endDate || "",
      description: exp.description || "",
    });
    setAiResults(response.data.result);
    setShowAIModal(true);
  };

  return (
    <div className="px-6 pt-6">
      <h2
        className="text-lg font-medium"
        style={{ color: "var(--color-ink)", letterSpacing: "-0.005em" }}
      >
        Work Experience
      </h2>
      <div className="mt-5 flex flex-col gap-4 mb-3">
        {Array.isArray(WorkExperience) &&
          WorkExperience.map((experience, index) => (
            <div
              key={index}
              className="p-4 rounded-2xl relative"
              style={{ border: "1px solid var(--color-dust)" }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Company"
                  placeholder="ABC Corp"
                  type="text"
                  value={experience.company || ""}
                  onChange={({ target }) =>
                    updateArrayItem(index, "company", target.value)
                  }
                />

                <Input
                  label="Role"
                  placeholder="Frontend Developer"
                  type="text"
                  value={experience.role || ""}
                  onChange={({ target }) =>
                    updateArrayItem(index, "role", target.value)
                  }
                />

                <Input
                  label="Start Date"
                  placeholder=""
                  type="month"
                  value={experience.startDate || ""}
                  onChange={({ target }) =>
                    updateArrayItem(index, "startDate", target.value)
                  }
                />

                <Input
                  label="End Date"
                  placeholder=""
                  type="month"
                  value={experience.endDate || ""}
                  onChange={({ target }) =>
                    updateArrayItem(index, "endDate", target.value)
                  }
                />
              </div>

              <div className="mt-4">
                <label
                  className="text-xs font-medium"
                  style={{ color: "var(--color-slate)" }}
                >
                  Description
                </label>
                <textarea
                  placeholder="What did you do in this role?"
                  className="form-input w-full mt-1"
                  rows={3}
                  value={experience.description || ""}
                  onChange={({ target }) => {
                    updateArrayItem(index, "description", target.value);
                  }}
                />
                <AISuggestionButton
                  onClick={() => handleImproveBullets(index)}
                  label="Improve with AI"
                />
              </div>

              {WorkExperience.length > 1 && (
                <button
                  type="button"
                  className="absolute top-3 right-3 text-sm cursor-pointer"
                  style={{ color: "var(--color-signal-orange)" }}
                  onClick={() => removeArrayItem(index)}
                >
                  <LuTrash2 />
                </button>
              )}
            </div>
          ))}

        <button
          type="button"
          className="self-start flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium cursor-pointer transition-all duration-200"
          style={{
            backgroundColor: "var(--color-cream)",
            color: "var(--color-ink)",
            border: "1px solid var(--color-dust)",
          }}
          onClick={() =>
            addArrayItem({
              company: "",
              role: "",
              startDate: "",
              endDate: "",
              description: "",
            })
          }
        >
          <LuPlus /> Add Work Experience
        </button>
      </div>

      <AIResultModal
        isOpen={showAIModal}
        onClose={() => {
          setShowAIModal(false);
          setAiTargetIndex(null);
        }}
        title="AI-Improved Bullet Points"
        results={aiResults}
        onSelect={(text) => {
          if (aiTargetIndex !== null) {
            updateArrayItem(aiTargetIndex, "description", text);
          }
        }}
      />
    </div>
  );
};

export default WorkExperienceForm;
