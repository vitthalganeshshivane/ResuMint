import React from "react";
import Input from "../../../components/inputs/Input";
import { LuPlus, LuTrash2 } from "react-icons/lu";
import RatingInput from "../../../components/ResumeSections/RatingInput";

const SkillsInfoForm = ({
  skillsInfo,
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
        Skills
      </h2>

      <div className="mt-5 flex flex-col mb-3 gap-4">
        {skillsInfo.map((skill, index) => (
          <div
            key={index}
            className="p-4 rounded-2xl relative"
            style={{ border: "1px solid var(--color-dust)" }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Skill Name"
                placeholder="JavaScript"
                type="text"
                value={skill.name || ""}
                onChange={({ target }) =>
                  updateArrayItem(index, "name", target.value)
                }
              />

              <div className="flex flex-col">
                <label
                  className="text-[13px] mb-1"
                  style={{ color: "var(--color-slate)" }}
                >
                  Proficiency ({skill.progress / 20 || 0}/5)
                </label>

                <div className="mt-5">
                  <RatingInput
                    value={skill.progress || 0}
                    total={5}
                    onChange={(newValue) =>
                      updateArrayItem(index, "progress", newValue)
                    }
                  />
                </div>
              </div>
            </div>

            {skillsInfo.length > 1 && (
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
              name: "",
              progress: "",
            })
          }
        >
          <LuPlus /> Add Skill
        </button>
      </div>
    </div>
  );
};

export default SkillsInfoForm;
