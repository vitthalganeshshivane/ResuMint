import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  LuUser,
  LuMail,
  LuLock,
  LuSave,
  LuTrash2,
  LuFileText,
  LuBriefcase,
  LuFolderKanban,
  LuAward,
  LuCalendar,
  LuArrowLeft,
  LuCamera,
  LuLogOut,
  LuPlus,
  LuChevronDown,
  LuChevronUp,
  LuX,
} from "react-icons/lu";
import toast from "react-hot-toast";
import moment from "moment";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { UserContext } from "../../context/userContext";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";

const ProfilePage = () => {
  const { user, updateUser, clearUser } = useContext(UserContext);
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });
  const [profileImage, setProfileImage] = useState(null);
  const [profilePreview, setProfilePreview] = useState("");

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [changingPassword, setChangingPassword] = useState(false);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [expandedSection, setExpandedSection] = useState(null);
  const [quickAddLoading, setQuickAddLoading] = useState(false);

  const [skillForm, setSkillForm] = useState({ name: "", progress: 60 });
  const [projectForm, setProjectForm] = useState({ title: "", description: "", github: "", liveDemo: "" });
  const [experienceForm, setExperienceForm] = useState({ company: "", role: "", startDate: "", endDate: "", description: "" });

  const handleLogout = () => {
    localStorage.clear();
    clearUser();
    navigate("/");
  };

  useEffect(() => {
    if (user) {
      setFormData({ name: user.name || "", email: user.email || "" });
      setProfilePreview(user.profileImageUrl || "");
    }
  }, [user]);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.AUTH.GET_STATS);
      setStats(response.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      let imageUrl = user.profileImageUrl;

      if (profileImage) {
        const uploadForm = new FormData();
        uploadForm.append("profileImage", profileImage);
        const uploadRes = await axiosInstance.post(
          API_PATHS.IMAGE.UPLOAD_IMAGE,
          uploadForm,
          { headers: { "Content-Type": "multipart/form-data" } },
        );
        imageUrl = uploadRes.data.imageUrl;
      }

      const response = await axiosInstance.put(API_PATHS.AUTH.UPDATE_PROFILE, {
        name: formData.name,
        email: formData.email,
        profileImageUrl: imageUrl,
      });

      updateUser({ ...user, ...response.data });
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setChangingPassword(true);
    try {
      await axiosInstance.put(API_PATHS.AUTH.CHANGE_PASSWORD, {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      toast.success("Password changed successfully");
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to change password");
    } finally {
      setChangingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    try {
      await axiosInstance.delete(API_PATHS.AUTH.DELETE_ACCOUNT);
      toast.success("Account deleted");
      clearUser();
      navigate("/");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to delete account");
    } finally {
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const handleQuickAddSkill = async (e) => {
    e.preventDefault();
    if (!skillForm.name.trim()) return;
    setQuickAddLoading(true);
    try {
      await axiosInstance.post(API_PATHS.RESUME.QUICK_SKILL, skillForm);
      toast.success("Skill added");
      setSkillForm({ name: "", progress: 60 });
      setExpandedSection(null);
      fetchStats();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to add skill");
    } finally {
      setQuickAddLoading(false);
    }
  };

  const handleQuickAddProject = async (e) => {
    e.preventDefault();
    if (!projectForm.title.trim()) return;
    setQuickAddLoading(true);
    try {
      await axiosInstance.post(API_PATHS.RESUME.QUICK_PROJECT, projectForm);
      toast.success("Project added");
      setProjectForm({ title: "", description: "", github: "", liveDemo: "" });
      setExpandedSection(null);
      fetchStats();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to add project");
    } finally {
      setQuickAddLoading(false);
    }
  };

  const handleQuickAddExperience = async (e) => {
    e.preventDefault();
    if (!experienceForm.company.trim() || !experienceForm.role.trim()) return;
    setQuickAddLoading(true);
    try {
      await axiosInstance.post(API_PATHS.RESUME.QUICK_EXPERIENCE, experienceForm);
      toast.success("Experience added");
      setExperienceForm({ company: "", role: "", startDate: "", endDate: "", description: "" });
      setExpandedSection(null);
      fetchStats();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to add experience");
    } finally {
      setQuickAddLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate("/dashboard")}
            className="w-9 h-9 flex items-center justify-center rounded-full cursor-pointer transition-all duration-200"
            style={{
              backgroundColor: "var(--color-cream-lifted)",
              color: "var(--color-ink)",
              border: "1px solid var(--color-dust)",
            }}
          >
            <LuArrowLeft size={16} />
          </button>
          <h1
            className="text-xl font-semibold"
            style={{ color: "var(--color-ink)", letterSpacing: "-0.02em" }}
          >
            Profile
          </h1>
        </div>

        {/* Profile Header Card */}
        <div
          className="p-6 mb-5"
          style={{
            backgroundColor: "var(--color-cream-lifted)",
            borderRadius: "24px",
            border: "1px solid var(--color-dust)",
          }}
        >
          <div className="flex items-center gap-5">
            <div className="relative">
              <div
                className="w-20 h-20 rounded-full overflow-hidden flex-shrink-0"
                style={{ backgroundColor: "var(--color-dust)" }}
              >
                {profilePreview ? (
                  <img
                    src={profilePreview}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center text-2xl font-semibold"
                    style={{ color: "var(--color-slate)" }}
                  >
                    {user?.name?.charAt(0)?.toUpperCase()}
                  </div>
                )}
              </div>
              <label
                className="absolute -bottom-1 -right-1 w-7 h-7 flex items-center justify-center rounded-full cursor-pointer"
                style={{
                  backgroundColor: "var(--color-signal-orange)",
                  color: "var(--color-cream)",
                }}
              >
                <LuCamera size={12} />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setProfileImage(file);
                      setProfilePreview(URL.createObjectURL(file));
                    }
                  }}
                />
              </label>
            </div>

            <div>
              <h2
                className="text-lg font-medium"
                style={{ color: "var(--color-ink)" }}
              >
                {user?.name}
              </h2>
              <p className="text-[13px]" style={{ color: "var(--color-slate)" }}>
                {user?.email}
              </p>
              {stats?.memberSince && (
                <p className="text-[12px] mt-1" style={{ color: "var(--color-slate)" }}>
                  Member since {moment(stats.memberSince).format("MMM YYYY")}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
          {/* Resumes - no expand */}
          <div
            className="p-4 text-center"
            style={{
              backgroundColor: "var(--color-cream-lifted)",
              borderRadius: "20px",
              border: "1px solid var(--color-dust)",
            }}
          >
            <div
              className="w-10 h-10 mx-auto mb-2 flex items-center justify-center rounded-full"
              style={{ backgroundColor: "var(--color-cream)", color: "var(--color-signal-orange)" }}
            >
              <LuFileText size={18} />
            </div>
            <p className="text-xl font-bold" style={{ color: "var(--color-ink)" }}>
              {loading ? "-" : stats?.totalResumes || 0}
            </p>
            <p className="text-[11px] font-medium" style={{ color: "var(--color-slate)" }}>Resumes</p>
          </div>

          {/* Skills - expandable */}
          <button
            onClick={() => toggleSection("skills")}
            className="p-4 text-center cursor-pointer transition-all duration-200"
            style={{
              backgroundColor: "var(--color-cream-lifted)",
              borderRadius: "20px",
              border: expandedSection === "skills" ? "1.5px solid var(--color-signal-orange)" : "1px solid var(--color-dust)",
            }}
          >
            <div
              className="w-10 h-10 mx-auto mb-2 flex items-center justify-center rounded-full"
              style={{ backgroundColor: "var(--color-cream)", color: "var(--color-signal-orange)" }}
            >
              <LuAward size={18} />
            </div>
            <p className="text-xl font-bold" style={{ color: "var(--color-ink)" }}>
              {loading ? "-" : stats?.totalSkills || 0}
            </p>
            <div className="flex items-center justify-center gap-1">
              <p className="text-[11px] font-medium" style={{ color: "var(--color-slate)" }}>Skills</p>
              {expandedSection === "skills" ? <LuChevronUp size={10} style={{ color: "var(--color-slate)" }} /> : <LuChevronDown size={10} style={{ color: "var(--color-slate)" }} />}
            </div>
          </button>

          {/* Projects - expandable */}
          <button
            onClick={() => toggleSection("projects")}
            className="p-4 text-center cursor-pointer transition-all duration-200"
            style={{
              backgroundColor: "var(--color-cream-lifted)",
              borderRadius: "20px",
              border: expandedSection === "projects" ? "1.5px solid var(--color-signal-orange)" : "1px solid var(--color-dust)",
            }}
          >
            <div
              className="w-10 h-10 mx-auto mb-2 flex items-center justify-center rounded-full"
              style={{ backgroundColor: "var(--color-cream)", color: "var(--color-signal-orange)" }}
            >
              <LuFolderKanban size={18} />
            </div>
            <p className="text-xl font-bold" style={{ color: "var(--color-ink)" }}>
              {loading ? "-" : stats?.totalProjects || 0}
            </p>
            <div className="flex items-center justify-center gap-1">
              <p className="text-[11px] font-medium" style={{ color: "var(--color-slate)" }}>Projects</p>
              {expandedSection === "projects" ? <LuChevronUp size={10} style={{ color: "var(--color-slate)" }} /> : <LuChevronDown size={10} style={{ color: "var(--color-slate)" }} />}
            </div>
          </button>

          {/* Experiences - expandable */}
          <button
            onClick={() => toggleSection("experiences")}
            className="p-4 text-center cursor-pointer transition-all duration-200"
            style={{
              backgroundColor: "var(--color-cream-lifted)",
              borderRadius: "20px",
              border: expandedSection === "experiences" ? "1.5px solid var(--color-signal-orange)" : "1px solid var(--color-dust)",
            }}
          >
            <div
              className="w-10 h-10 mx-auto mb-2 flex items-center justify-center rounded-full"
              style={{ backgroundColor: "var(--color-cream)", color: "var(--color-signal-orange)" }}
            >
              <LuBriefcase size={18} />
            </div>
            <p className="text-xl font-bold" style={{ color: "var(--color-ink)" }}>
              {loading ? "-" : stats?.totalExperiences || 0}
            </p>
            <div className="flex items-center justify-center gap-1">
              <p className="text-[11px] font-medium" style={{ color: "var(--color-slate)" }}>Experiences</p>
              {expandedSection === "experiences" ? <LuChevronUp size={10} style={{ color: "var(--color-slate)" }} /> : <LuChevronDown size={10} style={{ color: "var(--color-slate)" }} />}
            </div>
          </button>
        </div>

        {/* Quick Add Forms */}
        {expandedSection && (
          <div
            className="p-5 mb-5"
            style={{
              backgroundColor: "var(--color-cream-lifted)",
              borderRadius: "24px",
              border: "1.5px solid var(--color-signal-orange)",
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3
                className="text-[14px] font-semibold"
                style={{ color: "var(--color-ink)", letterSpacing: "-0.005em" }}
              >
                Quick Add {expandedSection === "skills" ? "Skill" : expandedSection === "projects" ? "Project" : "Experience"}
              </h3>
              <button
                onClick={() => setExpandedSection(null)}
                className="w-6 h-6 rounded-full flex items-center justify-center cursor-pointer"
                style={{ backgroundColor: "var(--color-cream)", color: "var(--color-slate)" }}
              >
                <LuX size={12} />
              </button>
            </div>

            {/* Skill Form */}
            {expandedSection === "skills" && (
              <form onSubmit={handleQuickAddSkill} className="flex flex-col gap-3">
                <div>
                  <label className="text-[11px] font-medium mb-1 block" style={{ color: "var(--color-slate)" }}>Skill Name</label>
                  <input
                    type="text"
                    value={skillForm.name}
                    onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })}
                    className="form-input"
                    placeholder="e.g. React.js, Python, Project Management"
                    required
                  />
                </div>
                <div>
                  <label className="text-[11px] font-medium mb-1 block" style={{ color: "var(--color-slate)" }}>
                    Proficiency ({Math.round(skillForm.progress / 20)}/5)
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="20"
                    value={skillForm.progress}
                    onChange={(e) => setSkillForm({ ...skillForm, progress: parseInt(e.target.value) })}
                    className="w-full accent-[var(--color-signal-orange)]"
                  />
                </div>
                <button type="submit" className="btn-small self-end" disabled={quickAddLoading}>
                  <LuPlus size={14} />
                  {quickAddLoading ? "Adding..." : "Add Skill"}
                </button>
              </form>
            )}

            {/* Project Form */}
            {expandedSection === "projects" && (
              <form onSubmit={handleQuickAddProject} className="flex flex-col gap-3">
                <div>
                  <label className="text-[11px] font-medium mb-1 block" style={{ color: "var(--color-slate)" }}>Project Title</label>
                  <input
                    type="text"
                    value={projectForm.title}
                    onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                    className="form-input"
                    placeholder="e.g. Portfolio Website"
                    required
                  />
                </div>
                <div>
                  <label className="text-[11px] font-medium mb-1 block" style={{ color: "var(--color-slate)" }}>Description</label>
                  <textarea
                    value={projectForm.description}
                    onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                    className="form-input"
                    rows={2}
                    placeholder="What did you build?"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-medium mb-1 block" style={{ color: "var(--color-slate)" }}>GitHub URL</label>
                    <input
                      type="url"
                      value={projectForm.github}
                      onChange={(e) => setProjectForm({ ...projectForm, github: e.target.value })}
                      className="form-input"
                      placeholder="https://github.com/..."
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-medium mb-1 block" style={{ color: "var(--color-slate)" }}>Live Demo</label>
                    <input
                      type="url"
                      value={projectForm.liveDemo}
                      onChange={(e) => setProjectForm({ ...projectForm, liveDemo: e.target.value })}
                      className="form-input"
                      placeholder="https://..."
                    />
                  </div>
                </div>
                <button type="submit" className="btn-small self-end" disabled={quickAddLoading}>
                  <LuPlus size={14} />
                  {quickAddLoading ? "Adding..." : "Add Project"}
                </button>
              </form>
            )}

            {/* Experience Form */}
            {expandedSection === "experiences" && (
              <form onSubmit={handleQuickAddExperience} className="flex flex-col gap-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-medium mb-1 block" style={{ color: "var(--color-slate)" }}>Company</label>
                    <input
                      type="text"
                      value={experienceForm.company}
                      onChange={(e) => setExperienceForm({ ...experienceForm, company: e.target.value })}
                      className="form-input"
                      placeholder="e.g. Google"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-medium mb-1 block" style={{ color: "var(--color-slate)" }}>Role</label>
                    <input
                      type="text"
                      value={experienceForm.role}
                      onChange={(e) => setExperienceForm({ ...experienceForm, role: e.target.value })}
                      className="form-input"
                      placeholder="e.g. Frontend Developer"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-medium mb-1 block" style={{ color: "var(--color-slate)" }}>Start Date</label>
                    <input
                      type="month"
                      value={experienceForm.startDate}
                      onChange={(e) => setExperienceForm({ ...experienceForm, startDate: e.target.value })}
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-medium mb-1 block" style={{ color: "var(--color-slate)" }}>End Date</label>
                    <input
                      type="month"
                      value={experienceForm.endDate}
                      onChange={(e) => setExperienceForm({ ...experienceForm, endDate: e.target.value })}
                      className="form-input"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[11px] font-medium mb-1 block" style={{ color: "var(--color-slate)" }}>Description</label>
                  <textarea
                    value={experienceForm.description}
                    onChange={(e) => setExperienceForm({ ...experienceForm, description: e.target.value })}
                    className="form-input"
                    rows={2}
                    placeholder="What did you do in this role?"
                  />
                </div>
                <button type="submit" className="btn-small self-end" disabled={quickAddLoading}>
                  <LuPlus size={14} />
                  {quickAddLoading ? "Adding..." : "Add Experience"}
                </button>
              </form>
            )}
          </div>
        )}

        {/* Account Settings */}
        <div
          className="p-6 mb-5"
          style={{
            backgroundColor: "var(--color-cream-lifted)",
            borderRadius: "24px",
            border: "1px solid var(--color-dust)",
          }}
        >
          <h3
            className="text-[15px] font-semibold mb-4"
            style={{ color: "var(--color-ink)", letterSpacing: "-0.005em" }}
          >
            Account Settings
          </h3>

          <form onSubmit={handleProfileUpdate}>
            <div className="flex flex-col gap-4">
              <div>
                <label
                  className="text-[12px] font-medium mb-1.5 block"
                  style={{ color: "var(--color-slate)" }}
                >
                  Full Name
                </label>
                <div className="relative">
                  <LuUser
                    size={15}
                    className="absolute left-3 top-1/2 -translate-y-1/2"
                    style={{ color: "var(--color-slate)" }}
                  />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="form-input" style={{ paddingLeft: "2.5rem" }}
                    placeholder="Your name"
                    required
                  />
                </div>
              </div>

              <div>
                <label
                  className="text-[12px] font-medium mb-1.5 block"
                  style={{ color: "var(--color-slate)" }}
                >
                  Email Address
                </label>
                <div className="relative">
                  <LuMail
                    size={15}
                    className="absolute left-3 top-1/2 -translate-y-1/2"
                    style={{ color: "var(--color-slate)" }}
                  />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="form-input" style={{ paddingLeft: "2.5rem" }}
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-5">
              <button
                type="submit"
                className="btn-small"
                disabled={saving}
              >
                <LuSave size={14} />
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>

        {/* Change Password */}
        <div
          className="p-6 mb-5"
          style={{
            backgroundColor: "var(--color-cream-lifted)",
            borderRadius: "24px",
            border: "1px solid var(--color-dust)",
          }}
        >
          <h3
            className="text-[15px] font-semibold mb-4"
            style={{ color: "var(--color-ink)", letterSpacing: "-0.005em" }}
          >
            Change Password
          </h3>

          <form onSubmit={handlePasswordChange}>
            <div className="flex flex-col gap-4">
              <div>
                <label
                  className="text-[12px] font-medium mb-1.5 block"
                  style={{ color: "var(--color-slate)" }}
                >
                  Current Password
                </label>
                <div className="relative">
                  <LuLock
                    size={15}
                    className="absolute left-3 top-1/2 -translate-y-1/2"
                    style={{ color: "var(--color-slate)" }}
                  />
                  <input
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        currentPassword: e.target.value,
                      })
                    }
                    className="form-input" style={{ paddingLeft: "2.5rem" }}
                    placeholder="Enter current password"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    className="text-[12px] font-medium mb-1.5 block"
                    style={{ color: "var(--color-slate)" }}
                  >
                    New Password
                  </label>
                  <div className="relative">
                    <LuLock
                      size={15}
                      className="absolute left-3 top-1/2 -translate-y-1/2"
                      style={{ color: "var(--color-slate)" }}
                    />
                    <input
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          newPassword: e.target.value,
                        })
                      }
                      className="form-input" style={{ paddingLeft: "2.5rem" }}
                      placeholder="Min 6 characters"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label
                    className="text-[12px] font-medium mb-1.5 block"
                    style={{ color: "var(--color-slate)" }}
                  >
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <LuLock
                      size={15}
                      className="absolute left-3 top-1/2 -translate-y-1/2"
                      style={{ color: "var(--color-slate)" }}
                    />
                    <input
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          confirmPassword: e.target.value,
                        })
                      }
                      className="form-input" style={{ paddingLeft: "2.5rem" }}
                      placeholder="Repeat new password"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-5">
              <button
                type="submit"
                className="btn-small"
                disabled={changingPassword}
              >
                <LuLock size={14} />
                {changingPassword ? "Updating..." : "Update Password"}
              </button>
            </div>
          </form>
        </div>

        {/* Recent Resumes */}
        {stats?.recentResumes?.length > 0 && (
          <div
            className="p-6 mb-5"
            style={{
              backgroundColor: "var(--color-cream-lifted)",
              borderRadius: "24px",
              border: "1px solid var(--color-dust)",
            }}
          >
            <h3
              className="text-[15px] font-semibold mb-4"
              style={{ color: "var(--color-ink)", letterSpacing: "-0.005em" }}
            >
              Recent Resumes
            </h3>

            <div className="flex flex-col gap-2">
              {stats.recentResumes.map((resume) => (
                <button
                  key={resume._id}
                  onClick={() => navigate(`/resume/${resume._id}`)}
                  className="flex items-center gap-3 p-3 rounded-xl text-left cursor-pointer transition-all duration-200"
                  style={{
                    backgroundColor: "var(--color-cream)",
                    border: "1px solid var(--color-dust)",
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0"
                    style={{ backgroundColor: "var(--color-dust)" }}
                  >
                    {resume.thumbnailLink ? (
                      <img
                        src={resume.thumbnailLink}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div
                        className="w-full h-full flex items-center justify-center"
                        style={{ color: "var(--color-slate)" }}
                      >
                        <LuFileText size={16} />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-[13px] font-medium truncate"
                      style={{ color: "var(--color-ink)" }}
                    >
                      {resume.title}
                    </p>
                    <p
                      className="text-[11px]"
                      style={{ color: "var(--color-slate)" }}
                    >
                      Updated {moment(resume.updatedAt).fromNow()}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl text-[13px] font-semibold cursor-pointer transition-all duration-200"
          style={{
            backgroundColor: "var(--color-cream-lifted)",
            color: "var(--color-ink)",
            border: "1px solid var(--color-dust)",
          }}
        >
          <LuLogOut size={15} />
          Log Out
        </button>

        {/* Danger Zone */}
        <div
          className="p-6"
          style={{
            backgroundColor: "var(--color-cream-lifted)",
            borderRadius: "24px",
            border: "1px solid #FECACA",
          }}
        >
          <h3
            className="text-[15px] font-semibold mb-1"
            style={{ color: "#DC2626", letterSpacing: "-0.005em" }}
          >
            Danger Zone
          </h3>
          <p className="text-[12px] mb-4" style={{ color: "var(--color-slate)" }}>
            Permanently delete your account and all associated resumes. This action cannot be undone.
          </p>

          {!showDeleteConfirm ? (
            <button
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-semibold cursor-pointer transition-all duration-200"
              style={{
                backgroundColor: "transparent",
                color: "#DC2626",
                border: "1.5px solid #FECACA",
              }}
              onClick={() => setShowDeleteConfirm(true)}
            >
              <LuTrash2 size={14} />
              Delete Account
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <button
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-semibold cursor-pointer transition-all duration-200"
                style={{
                  backgroundColor: "#DC2626",
                  color: "#fff",
                }}
                onClick={handleDeleteAccount}
                disabled={deleting}
              >
                <LuTrash2 size={14} />
                {deleting ? "Deleting..." : "Yes, Delete Everything"}
              </button>
              <button
                className="btn-small-light"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProfilePage;
