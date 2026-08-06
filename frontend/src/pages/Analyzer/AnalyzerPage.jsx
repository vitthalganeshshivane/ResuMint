import React, { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  LuArrowLeft,
  LuUpload,
  LuFileText,
  LuCheck,
  LuAlertTriangle,
  LuSearch,
  LuSparkles,
  LuShield,
  LuEye,
  LuLoader,
  LuRotateCcw,
} from "react-icons/lu";
import toast from "react-hot-toast";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";

const SCORE_COLORS = {
  excellent: { bg: "#DCFCE7", text: "#16A34A", ring: "#22C55E" },
  good: { bg: "#FEF3C7", text: "#D97706", ring: "#F59E0B" },
  average: { bg: "#FFE4E6", text: "#E11D48", ring: "#F43F5E" },
  poor: { bg: "#FEE2E2", text: "#DC2626", ring: "#EF4444" },
};

function getScoreLevel(score) {
  if (score >= 85) return "excellent";
  if (score >= 70) return "good";
  if (score >= 50) return "average";
  return "poor";
}

function AnimatedScoreRing({ score, size = 160, strokeWidth = 10 }) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animatedScore / 100) * circumference;
  const level = getScoreLevel(score);
  const colors = SCORE_COLORS[level];

  React.useEffect(() => {
    let start = 0;
    const duration = 1200;
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedScore(Math.round(eased * score));
      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [score]);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--color-dust)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={colors.ring}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.1s linear" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="text-4xl font-bold"
          style={{ color: colors.text, letterSpacing: "-0.03em" }}
        >
          {animatedScore}
        </span>
        <span className="text-[11px] font-medium" style={{ color: "var(--color-slate)" }}>
          out of 100
        </span>
      </div>
    </div>
  );
}

function SectionCard({ label, score, feedback, delay }) {
  const [visible, setVisible] = useState(false);
  const level = getScoreLevel(score);
  const colors = SCORE_COLORS[level];

  React.useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className="p-4 rounded-2xl transition-all duration-500"
      style={{
        backgroundColor: "var(--color-cream-lifted)",
        border: "1px solid var(--color-dust)",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(12px)",
      }}
    >
      <div className="flex items-center justify-between mb-2">
        <span
          className="text-[13px] font-semibold capitalize"
          style={{ color: "var(--color-ink)" }}
        >
          {label}
        </span>
        <span
          className="text-[12px] font-bold px-2.5 py-0.5 rounded-full"
          style={{ backgroundColor: colors.bg, color: colors.text }}
        >
          {score}/100
        </span>
      </div>
      <p className="text-[12px] leading-relaxed" style={{ color: "var(--color-slate)" }}>
        {feedback}
      </p>
    </div>
  );
}

function ListItem({ icon: Icon, text, color, delay }) {
  const [visible, setVisible] = useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className="flex items-start gap-3 p-3 rounded-xl transition-all duration-500"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateX(0)" : "translateX(-8px)",
      }}
    >
      <div
        className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center mt-0.5"
        style={{ backgroundColor: color + "18", color }}
      >
        <Icon size={12} />
      </div>
      <p className="text-[12px] leading-relaxed" style={{ color: "var(--color-ink)", fontWeight: 450 }}>
        {text}
      </p>
    </div>
  );
}

const ANALYSIS_STEPS = [
  "Reading your resume...",
  "Extracting content...",
  "Analyzing with AI...",
  "Scoring sections...",
  "Generating insights...",
];

const AnalyzerPage = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [analysisResult, setAnalysisResult] = useState(null);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) validateAndSetFile(file);
  }, []);

  const validateAndSetFile = (file) => {
    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    const allowedExts = [".pdf", ".docx"];
    const ext = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();

    if (!allowedTypes.includes(file.type) && !allowedExts.includes(ext)) {
      toast.error("Only PDF and DOCX files are supported");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be under 5MB");
      return;
    }

    setSelectedFile(file);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) validateAndSetFile(file);
  };

  const runAnalysis = async () => {
    if (!selectedFile) return;

    setAnalyzing(true);
    setCurrentStep(0);

    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < ANALYSIS_STEPS.length - 1) return prev + 1;
        return prev;
      });
    }, 800);

    try {
      const formData = new FormData();
      formData.append("resumeFile", selectedFile);

      const response = await axiosInstance.post(
        API_PATHS.ANALYZER.ANALYZE,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          timeout: 60000,
        },
      );

      setAnalysisResult(response.data.analysis);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Analysis failed");
    } finally {
      clearInterval(stepInterval);
      setAnalyzing(false);
      setCurrentStep(0);
    }
  };

  const resetAnalyzer = () => {
    setSelectedFile(null);
    setAnalysisResult(null);
    setAnalyzing(false);
    setCurrentStep(0);
  };

  const ats = analysisResult?.atsAnalysis;

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
          <div>
            <h1
              className="text-xl font-semibold"
              style={{ color: "var(--color-ink)", letterSpacing: "-0.02em" }}
            >
              Resume Analyzer
            </h1>
            <p className="text-[12px]" style={{ color: "var(--color-slate)" }}>
              Upload your resume for AI-powered scoring and feedback
            </p>
          </div>
        </div>

        {/* Upload Zone */}
        {!analysisResult && !analyzing && (
          <div
            className="relative p-10 flex flex-col items-center justify-center cursor-pointer transition-all duration-300"
            style={{
              backgroundColor: isDragging ? "var(--color-cream-lifted)" : "transparent",
              borderRadius: "24px",
              border: `2px dashed ${isDragging ? "var(--color-signal-orange)" : "var(--color-dust)"}`,
              transform: isDragging ? "scale(1.01)" : "scale(1)",
            }}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx"
              className="hidden"
              onChange={handleFileSelect}
            />

            {!selectedFile ? (
              <>
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
                  style={{
                    backgroundColor: "var(--color-cream-lifted)",
                    color: "var(--color-signal-orange)",
                    border: "1.5px solid var(--color-dust)",
                  }}
                >
                  <LuUpload size={24} />
                </div>
                <p
                  className="text-[15px] font-medium mb-1"
                  style={{ color: "var(--color-ink)" }}
                >
                  Drop your resume here
                </p>
                <p className="text-[12px] mb-4" style={{ color: "var(--color-slate)" }}>
                  or click to browse
                </p>
                <div className="flex items-center gap-2">
                  <span
                    className="text-[11px] font-medium px-2.5 py-1 rounded-full"
                    style={{
                      backgroundColor: "var(--color-cream-lifted)",
                      color: "var(--color-slate)",
                      border: "1px solid var(--color-dust)",
                    }}
                  >
                    PDF
                  </span>
                  <span
                    className="text-[11px] font-medium px-2.5 py-1 rounded-full"
                    style={{
                      backgroundColor: "var(--color-cream-lifted)",
                      color: "var(--color-slate)",
                      border: "1px solid var(--color-dust)",
                    }}
                  >
                    DOCX
                  </span>
                  <span
                    className="text-[11px] font-medium px-2.5 py-1 rounded-full"
                    style={{
                      backgroundColor: "var(--color-cream-lifted)",
                      color: "var(--color-slate)",
                      border: "1px solid var(--color-dust)",
                    }}
                  >
                    Max 5MB
                  </span>
                </div>
              </>
            ) : (
              <>
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
                  style={{
                    backgroundColor: "var(--color-cream-lifted)",
                    color: "var(--color-signal-orange)",
                    border: "1.5px solid var(--color-dust)",
                  }}
                >
                  <LuFileText size={24} />
                </div>
                <p
                  className="text-[15px] font-medium mb-1"
                  style={{ color: "var(--color-ink)" }}
                >
                  {selectedFile.name}
                </p>
                <p className="text-[12px] mb-5" style={{ color: "var(--color-slate)" }}>
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
                <div className="flex items-center gap-3">
                  <button
                    className="btn-small"
                    onClick={(e) => {
                      e.stopPropagation();
                      runAnalysis();
                    }}
                  >
                    <LuSearch size={14} />
                    Analyze Resume
                  </button>
                  <button
                    className="btn-small-light"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedFile(null);
                    }}
                  >
                    <LuRotateCcw size={14} />
                    Change File
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* Analyzing State */}
        {analyzing && (
          <div
            className="p-10 flex flex-col items-center justify-center"
            style={{
              borderRadius: "24px",
              border: "1px solid var(--color-dust)",
              backgroundColor: "var(--color-cream-lifted)",
            }}
          >
            <div className="relative mb-6">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center"
                style={{
                  backgroundColor: "var(--color-cream)",
                  border: "2px solid var(--color-dust)",
                }}
              >
                <LuSparkles
                  size={28}
                  style={{ color: "var(--color-signal-orange)" }}
                  className="animate-pulse"
                />
              </div>
              <div
                className="absolute inset-0 rounded-full animate-ping"
                style={{
                  border: "2px solid var(--color-signal-orange)",
                  opacity: 0.2,
                }}
              />
            </div>

            <p
              className="text-[15px] font-medium mb-2"
              style={{ color: "var(--color-ink)" }}
            >
              Analyzing your resume
            </p>
            <p
              className="text-[12px] mb-6"
              style={{ color: "var(--color-slate)" }}
            >
              {ANALYSIS_STEPS[currentStep]}
            </p>

            {/* Progress steps */}
            <div className="flex flex-col gap-2 w-full max-w-[260px]">
              {ANALYSIS_STEPS.map((step, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2.5 transition-all duration-300"
                  style={{
                    opacity: i <= currentStep ? 1 : 0.3,
                  }}
                >
                  <div
                    className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center transition-all duration-300"
                    style={{
                      backgroundColor:
                        i < currentStep
                          ? "var(--color-signal-orange)"
                          : i === currentStep
                            ? "var(--color-cream)"
                            : "var(--color-cream)",
                      color:
                        i < currentStep
                          ? "var(--color-cream)"
                          : "var(--color-slate)",
                      border:
                        i === currentStep
                          ? "2px solid var(--color-signal-orange)"
                          : i < currentStep
                            ? "none"
                            : "1.5px solid var(--color-dust)",
                    }}
                  >
                    {i < currentStep ? (
                      <LuCheck size={10} />
                    ) : i === currentStep ? (
                      <LuLoader size={10} className="animate-spin" />
                    ) : null}
                  </div>
                  <span
                    className="text-[11px] font-medium"
                    style={{
                      color:
                        i <= currentStep
                          ? "var(--color-ink)"
                          : "var(--color-slate)",
                    }}
                  >
                    {step}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Results */}
        {analysisResult && !analyzing && (
          <div className="flex flex-col gap-5">
            {/* Score Header */}
            <div
              className="p-6 flex flex-col items-center"
              style={{
                backgroundColor: "var(--color-cream-lifted)",
                borderRadius: "24px",
                border: "1px solid var(--color-dust)",
              }}
            >
              <AnimatedScoreRing score={analysisResult.overallScore || 0} />
              <p
                className="text-[13px] font-medium mt-3"
                style={{ color: "var(--color-slate)" }}
              >
                Overall Resume Score
              </p>
              <p
                className="text-[12px] text-center mt-2 max-w-md leading-relaxed"
                style={{ color: "var(--color-ink)", fontWeight: 450 }}
              >
                {analysisResult.summary}
              </p>
            </div>

            {/* Section Scores */}
            {analysisResult.sections && Object.keys(analysisResult.sections).length > 0 && (
              <div>
                <h3
                  className="text-[13px] font-semibold uppercase mb-3 px-1"
                  style={{ color: "var(--color-slate)", letterSpacing: "0.04em" }}
                >
                  Section Breakdown
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {Object.entries(analysisResult.sections).map(
                    ([key, section], i) => (
                      <SectionCard
                        key={key}
                        label={key}
                        score={section.score}
                        feedback={section.feedback}
                        delay={i * 100}
                      />
                    ),
                  )}
                </div>
              </div>
            )}

            {/* Strengths */}
            {analysisResult.strengths?.length > 0 && (
              <div
                className="p-5"
                style={{
                  backgroundColor: "var(--color-cream-lifted)",
                  borderRadius: "24px",
                  border: "1px solid var(--color-dust)",
                }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: "#DCFCE7", color: "#16A34A" }}
                  >
                    <LuCheck size={14} />
                  </div>
                  <h3
                    className="text-[14px] font-semibold"
                    style={{ color: "var(--color-ink)" }}
                  >
                    What's Working Well
                  </h3>
                </div>
                <div className="flex flex-col gap-1">
                  {analysisResult.strengths.map((item, i) => (
                    <ListItem
                      key={i}
                      icon={LuCheck}
                      text={item}
                      color="#16A34A"
                      delay={i * 80}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Improvements */}
            {analysisResult.improvements?.length > 0 && (
              <div
                className="p-5"
                style={{
                  backgroundColor: "var(--color-cream-lifted)",
                  borderRadius: "24px",
                  border: "1px solid var(--color-dust)",
                }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: "#FEF3C7", color: "#D97706" }}
                  >
                    <LuAlertTriangle size={14} />
                  </div>
                  <h3
                    className="text-[14px] font-semibold"
                    style={{ color: "var(--color-ink)" }}
                  >
                    Key Improvements
                  </h3>
                </div>
                <div className="flex flex-col gap-1">
                  {analysisResult.improvements.map((item, i) => (
                    <ListItem
                      key={i}
                      icon={LuAlertTriangle}
                      text={item}
                      color="#D97706"
                      delay={i * 80}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* ATS Analysis */}
            {ats && (
              <div
                className="p-5"
                style={{
                  backgroundColor: "var(--color-cream-lifted)",
                  borderRadius: "24px",
                  border: "1px solid var(--color-dust)",
                }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center"
                    style={{
                      backgroundColor: "var(--color-cream)",
                      color: "var(--color-signal-orange)",
                    }}
                  >
                    <LuShield size={14} />
                  </div>
                  <h3
                    className="text-[14px] font-semibold"
                    style={{ color: "var(--color-ink)" }}
                  >
                    ATS Compatibility
                  </h3>
                  <span
                    className="text-[11px] font-bold px-2 py-0.5 rounded-full ml-auto"
                    style={{
                      backgroundColor: SCORE_COLORS[getScoreLevel(ats.score)].bg,
                      color: SCORE_COLORS[getScoreLevel(ats.score)].text,
                    }}
                  >
                    {ats.score}/100
                  </span>
                </div>

                {ats.foundKeywords?.length > 0 && (
                  <div className="mb-3">
                    <p
                      className="text-[11px] font-semibold uppercase mb-1.5"
                      style={{ color: "var(--color-slate)", letterSpacing: "0.04em" }}
                    >
                      Keywords Found
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {ats.foundKeywords.map((kw, i) => (
                        <span
                          key={i}
                          className="text-[11px] font-medium px-2.5 py-1 rounded-full"
                          style={{
                            backgroundColor: "#DCFCE7",
                            color: "#16A34A",
                          }}
                        >
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {ats.missingKeywords?.length > 0 && (
                  <div className="mb-3">
                    <p
                      className="text-[11px] font-semibold uppercase mb-1.5"
                      style={{ color: "var(--color-slate)", letterSpacing: "0.04em" }}
                    >
                      Suggested Keywords
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {ats.missingKeywords.map((kw, i) => (
                        <span
                          key={i}
                          className="text-[11px] font-medium px-2.5 py-1 rounded-full"
                          style={{
                            backgroundColor: "#FEF3C7",
                            color: "#D97706",
                          }}
                        >
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {ats.notes && (
                  <p
                    className="text-[12px] leading-relaxed mt-2"
                    style={{ color: "var(--color-slate)" }}
                  >
                    {ats.notes}
                  </p>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-center gap-3 pt-2 pb-4">
              <button className="btn-small" onClick={resetAnalyzer}>
                <LuRotateCcw size={14} />
                Analyze Another Resume
              </button>
              <button
                className="btn-small-light"
                onClick={() => navigate("/dashboard")}
              >
                <LuArrowLeft size={14} />
                Back to Dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AnalyzerPage;
