import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { LuCirclePlus } from "react-icons/lu";
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
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchAllResumes();
  }, []);

  useEffect(() => {
    console.log("ALL RESUMES 👉", allResumes);
  }, [allResumes]);

  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 md:gap-7 pt-1 pb-6 px-4 md:px-0">
        <div
          className="h-[300px] flex flex-col gap-5 items-center justify-center bg-white rounded-lg border border-purple-100 hover:border-purple-3 hover:bg-purple-50/5 cursor-pointer"
          onClick={() => {
            setOpenCreateModal(true);
          }}
        >
          <div className="w-12 h-12 flex items-center justify-center bg-purple-200/60 rounded-2xl">
            <LuCirclePlus />
          </div>

          <h3 className="font-medium text-gray-800">Add New Resume</h3>
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
        onClose={() => {
          setOpenCreateModal(false);
        }}
      >
        <div>
          <CreateResumeForm />
        </div>
      </Modal>
    </DashboardLayout>
  );
};

export default Dashboard;
