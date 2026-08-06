import React from "react";
import Input from "../../../components/inputs/Input";
import { LuPlus, LuTrash2 } from "react-icons/lu";

const EducationDetailsForm = ({
  educationInfo,
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
        Education
      </h2>

      <div className="mt-5 flex flex-col mb-3 gap-4">
        {educationInfo.map((education, index) => (
          <div
            key={index}
            className="p-4 rounded-2xl relative"
            style={{ border: "1px solid var(--color-dust)" }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Degree"
                placeholder="B.Tech in Computer Science"
                type="text"
                value={education.degree || ""}
                onChange={({ target }) =>
                  updateArrayItem(index, "degree", target.value)
                }
              />

              <Input
                label="Institution"
                placeholder="XYZ University"
                type="text"
                value={education.institution || ""}
                onChange={({ target }) =>
                  updateArrayItem(index, "institution", target.value)
                }
              />

              <Input
                label="Start Date"
                placeholder=""
                type="month"
                value={education.startDate || ""}
                onChange={({ target }) =>
                  updateArrayItem(index, "startDate", target.value)
                }
              />

              <Input
                label="End Date"
                placeholder=""
                type="month"
                value={education.endDate || ""}
                onChange={({ target }) =>
                  updateArrayItem(index, "endDate", target.value)
                }
              />
            </div>

            {educationInfo.length > 1 && (
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
              degree: "",
              institution: "",
              startDate: "",
              endDate: "",
            })
          }
        >
          <LuPlus /> Add Education
        </button>
      </div>
    </div>
  );
};

export default EducationDetailsForm;
