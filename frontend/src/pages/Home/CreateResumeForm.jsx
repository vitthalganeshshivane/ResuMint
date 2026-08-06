import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../../components/inputs/Input";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";

const CreateResumeForm = () => {
  const [title, setTitle] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleCreateResume = async (e) => {
    e.preventDefault();

    if (!title) {
      setError("Please enter a resume title");
      return;
    }

    setError("");

    try {
      const response = await axiosInstance.post(API_PATHS.RESUME.CREATE, {
        title,
      });

      if (response.data?._id) {
        navigate(`/resume/${response.data?._id}`);
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div className="w-[90vw] md:w-[420px] p-8 flex flex-col justify-center">
      <h3
        className="text-xl font-medium"
        style={{ color: "var(--color-ink)", letterSpacing: "-0.01em" }}
      >
        Create New Resume
      </h3>
      <p
        className="text-sm mt-1 mb-5"
        style={{ color: "var(--color-slate)", fontWeight: 450 }}
      >
        Give your resume a title to get started. You can edit all details later.
      </p>

      <form onSubmit={handleCreateResume}>
        <Input
          value={title}
          onChange={({ target }) => setTitle(target.value)}
          label="Resume Title"
          placeholder="Eg: Mike's Resume"
          type="text"
        />

        {error && (
          <p className="text-xs pb-2.5" style={{ color: "var(--color-signal-orange)" }}>
            {error}
          </p>
        )}

        <button type="submit" className="btn-primary">
          Create Resume
        </button>
      </form>
    </div>
  );
};

export default CreateResumeForm;
