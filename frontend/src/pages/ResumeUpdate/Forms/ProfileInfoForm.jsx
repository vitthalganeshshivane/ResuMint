import React, { useState } from "react";
import ProfilePhotoSelector from "../../../components/inputs/ProfilePhotoSelector";
import Input from "../../../components/inputs/Input";
import AISuggestionButton from "../../../components/AI/AISuggestionButton";
import AIResultModal from "../../../components/AI/AIResultModal";
import axiosInstance from "../../../utils/axiosInstance";
import { API_PATHS } from "../../../utils/apiPaths";

const ProfileInfoForm = ({ profileData, updateSection, onNext }) => {
  const [showAIModal, setShowAIModal] = useState(false);
  const [aiResults, setAiResults] = useState("");
  const [loadingAI, setLoadingAI] = useState(false);

  const handleGenerateSummary = async () => {
    setLoadingAI(true);
    try {
      const response = await axiosInstance.post(API_PATHS.AI.GENERATE_SUMMARY, {
        fullName: profileData.fullName || "",
        designation: profileData.designation || "",
      });
      setAiResults(response.data.result);
      setShowAIModal(true);
    } catch (error) {
      throw error;
    } finally {
      setLoadingAI(false);
    }
  };

  return (
    <div className="px-6 pt-6">
      <h2
        className="text-lg font-medium"
        style={{ color: "var(--color-ink)", letterSpacing: "-0.005em" }}
      >
        Personal Information
      </h2>

      <div className="mt-5">
        <ProfilePhotoSelector
          image={profileData?.profileImg || profileData?.profilePreviewUrl}
          setImage={(value) => updateSection("profileImg", value)}
          preview={profileData?.profilePreviewUrl}
          setPreview={(value) => updateSection("profilePreviewUrl", value)}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            value={profileData.fullName || ""}
            onChange={({ target }) => updateSection("fullName", target.value)}
            label="Full Name"
            placeholder="John"
            type="text"
          />

          <Input
            value={profileData.designation || ""}
            onChange={({ target }) =>
              updateSection("designation", target.value)
            }
            label="Designation"
            placeholder="UI Designer"
            type="text"
          />

          <div className="col-span-2 mt-2">
            <label
              className="text-xs font-medium"
              style={{ color: "var(--color-slate)" }}
            >
              Summary
            </label>
            <textarea
              placeholder="Short Introduction"
              className="form-input"
              rows={4}
              value={profileData.summary || ""}
              onChange={({ target }) => updateSection("summary", target.value)}
            />
            <AISuggestionButton
              onClick={handleGenerateSummary}
              label="Generate Summary with AI"
            />
          </div>
        </div>
      </div>

      <AIResultModal
        isOpen={showAIModal}
        onClose={() => setShowAIModal(false)}
        title="AI-Generated Summaries"
        results={aiResults}
        onSelect={(text) => updateSection("summary", text)}
      />
    </div>
  );
};

export default ProfileInfoForm;
