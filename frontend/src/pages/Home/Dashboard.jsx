import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { LuCirclePlus, LuSearch } from "react-icons/lu";
import moment from "moment";
import ResumeSummaryCard from "../../components/cards/ResumeSummaryCard";
import Modal from "../../components/Modal";
import CreateResumeForm from "./CreateResumeForm";

const Dashboard = () => {
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [allResumes, setAllResumes] = useState(null);

  const navigate = useNavigate();

  const fetchAllResumes = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.RESUME.GET_ALL);
      setAllResumes(response.data);
    } catch (error) {
      console.error("Error fetching resumes:", error);
    }
  };

  useEffect(() => {
    fetchAllResumes();
  }, []);

  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-5 pt-2 pb-6">
        <div
          className="h-[300px] flex flex-col gap-5 items-center justify-center cursor-pointer transition-all duration-300"
          style={{
            backgroundColor: "var(--color-cream-lifted)",
            borderRadius: "24px",
            border: "1.5px dashed var(--color-dust)",
          }}
          onClick={() => setOpenCreateModal(true)}
        >
          <div
            className="w-12 h-12 flex items-center justify-center rounded-full"
            style={{
              backgroundColor: "var(--color-cream)",
              color: "var(--color-signal-orange)",
            }}
          >
            <LuCirclePlus size={22} />
          </div>

          <h3
            className="font-medium text-sm"
            style={{ color: "var(--color-ink)" }}
          >
            Add New Resume
          </h3>
        </div>

        <div
          className="h-[300px] flex flex-col gap-5 items-center justify-center cursor-pointer transition-all duration-300 hover:scale-[1.02]"
          style={{
            backgroundColor: "var(--color-cream-lifted)",
            borderRadius: "24px",
            border: "1.5px dashed var(--color-dust)",
          }}
          onClick={() => navigate("/analyzer")}
        >
          <div
            className="w-12 h-12 flex items-center justify-center rounded-full"
            style={{
              backgroundColor: "var(--color-cream)",
              color: "var(--color-signal-orange)",
            }}
          >
            <LuSearch size={22} />
          </div>

          <div className="text-center">
            <h3
              className="font-medium text-sm"
              style={{ color: "var(--color-ink)" }}
            >
              Analyze Resume
            </h3>
            <p
              className="text-[11px] mt-1"
              style={{ color: "var(--color-slate)" }}
            >
              Get AI-powered feedback
            </p>
          </div>
        </div>

        {allResumes?.map((resume) => (
          <ResumeSummaryCard
            key={resume?._id}
            imgUrl={resume?.thumbnailLink || null}
            title={resume?.title}
            lastUpdated={
              resume?.updatedAt
                ? moment(resume.updatedAt).format("Do MMM YYYY")
                : ""
            }
            onSelect={() => navigate(`/resume/${resume?._id}`)}
          />
        ))}
      </div>

      <Modal
        isOpen={openCreateModal}
        onClose={() => setOpenCreateModal(false)}
        title="Create New Resume"
      >
        <CreateResumeForm />
      </Modal>
    </DashboardLayout>
  );
};

export default Dashboard;
