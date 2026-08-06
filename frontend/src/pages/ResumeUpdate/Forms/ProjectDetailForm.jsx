import React, { useState } from "react";
import Input from "../../../components/inputs/Input";
import { LuPlus, LuTrash2 } from "react-icons/lu";
import AISuggestionButton from "../../../components/AI/AISuggestionButton";
import AIResultModal from "../../../components/AI/AIResultModal";
import axiosInstance from "../../../utils/axiosInstance";
import { API_PATHS } from "../../../utils/apiPaths";

const ProjectDetailForm = ({
  projectInfo,
  updateArrayItem,
  addArrayItem,
  removeArrayItem,
}) => {
  const [showAIModal, setShowAIModal] = useState(false);
  const [aiResults, setAiResults] = useState("");
  const [aiTargetIndex, setAiTargetIndex] = useState(null);

  const handleEnhanceProject = async (index) => {
    const project = projectInfo[index];
    setAiTargetIndex(index);
    const response = await axiosInstance.post(API_PATHS.AI.ENHANCE_PROJECT, {
      title: project.title || "",
      description: project.description || "",
      technologies: "",
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
        Projects
      </h2>

      <div className="mt-5 flex flex-col mb-3 gap-4">
        {projectInfo.map((project, index) => (
          <div
            key={index}
            className="p-4 rounded-2xl relative"
            style={{ border: "1px solid var(--color-dust)" }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="col-span-2">
                <Input
                  label="Project Title"
                  placeholder="Portfolio Website"
                  type="text"
                  value={project.title || ""}
                  onChange={({ target }) =>
                    updateArrayItem(index, "title", target.value)
                  }
                />
              </div>

              <div className="col-span-2">
                <label
                  className="text-xs font-medium"
                  style={{ color: "var(--color-slate)" }}
                >
                  Description
                </label>
                <textarea
                  placeholder="Short description about the project"
                  rows={3}
                  className="form-input w-full mt-1"
                  value={project.description || ""}
                  onChange={({ target }) =>
                    updateArrayItem(index, "description", target.value)
                  }
                />
                <AISuggestionButton
                  onClick={() => handleEnhanceProject(index)}
                  label="Enhance with AI"
                />
              </div>

              <Input
                label="GitHub Link"
                placeholder="https://github.com/username/project"
                type="url"
                value={project.github || ""}
                onChange={({ target }) =>
                  updateArrayItem(index, "github", target.value)
                }
              />

              <Input
                label="Live Demo URL"
                placeholder="https://yourproject.live"
                type="url"
                value={project.liveDemo || ""}
                onChange={({ target }) =>
                  updateArrayItem(index, "liveDemo", target.value)
                }
              />
            </div>

            {projectInfo.length > 1 && (
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
              title: "",
              description: "",
              github: "",
              liveDemo: "",
            })
          }
        >
          <LuPlus /> Add Project
        </button>
      </div>

      <AIResultModal
        isOpen={showAIModal}
        onClose={() => {
          setShowAIModal(false);
          setAiTargetIndex(null);
        }}
        title="AI-Enhanced Project Description"
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

export default ProjectDetailForm;
