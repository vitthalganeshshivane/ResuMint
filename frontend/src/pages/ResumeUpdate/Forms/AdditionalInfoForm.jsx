import React from "react";
import RatingInput from "../../../components/ResumeSections/RatingInput";
import Input from "../../../components/inputs/Input";
import { LuPlus, LuTrash2 } from "react-icons/lu";

const AdditionalInfoForm = ({
  languages,
  interests,
  updateArrayItem,
  addArrayItem,
  removeArrayItem,
}) => {
  return (
    <div className="px-6 pt-6">
      <h2
        className="text-lg font-medium"
        style={{ color: "var(--color-ink)", letterSpacing: "-0.005em" }}
      >
        Additional Info
      </h2>

      <div className="mt-6">
        <h3
          className="text-sm font-semibold mb-3"
          style={{ color: "var(--color-ink)" }}
        >
          Languages
        </h3>

        <div className="flex flex-col gap-4">
          {languages?.map((lang, index) => (
            <div
              key={index}
              className="relative p-4 rounded-2xl"
              style={{ border: "1px solid var(--color-dust)" }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                <Input
                  label="Language"
                  placeholder="e.g. English"
                  value={lang.name || ""}
                  onChange={({ target }) =>
                    updateArrayItem("languages", index, "name", target.value)
                  }
                />

                <div>
                  <label
                    className="text-xs font-medium"
                    style={{ color: "var(--color-slate)" }}
                  >
                    Proficiency
                  </label>
                  <RatingInput
                    value={lang.progress || 0}
                    onChange={(value) =>
                      updateArrayItem("languages", index, "progress", value)
                    }
                  />
                </div>
              </div>

              {languages.length > 1 && (
                <button
                  type="button"
                  className="absolute top-3 right-3 text-sm cursor-pointer"
                  style={{ color: "var(--color-signal-orange)" }}
                  onClick={() => removeArrayItem("languages", index)}
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
            onClick={() => addArrayItem("languages", { name: "", progress: 0 })}
          >
            <LuPlus /> Add Language
          </button>
        </div>
      </div>

      <div className="mt-8 mb-4">
        <h3
          className="text-sm font-semibold mb-3"
          style={{ color: "var(--color-ink)" }}
        >
          Interests
        </h3>

        <div>
          {interests.map((interest, index) => (
            <div key={index} className="relative rounded-2xl">
              <Input
                placeholder="e.g. Reading"
                value={interest || ""}
                onChange={({ target }) =>
                  updateArrayItem("interests", index, null, target.value)
                }
              />

              {interests.length > 1 && (
                <button
                  type="button"
                  className="absolute top-3 right-3 text-sm cursor-pointer"
                  style={{ color: "var(--color-signal-orange)" }}
                  onClick={() => removeArrayItem("interests", index)}
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
            onClick={() => addArrayItem("interests", "")}
          >
            <LuPlus /> Add Interest
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdditionalInfoForm;
