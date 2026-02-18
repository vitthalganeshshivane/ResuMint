import TEMPLATE_ONE_IMG from "../assets/template-one.png";
import TEMPLATE_TWO_IMG from "../assets/template-one.png";
import TEMPLATE_THREE_IMG from "../assets/template-one.png";

export const resumeTemplates = [
  {
    id: "01",
    thumbnailImg: TEMPLATE_ONE_IMG,
    colorPaletteCode: "themeOne",
  },
  {
    id: "02",
    thumbnailImg: TEMPLATE_TWO_IMG,
    colorPaletteCode: "themeTwo",
  },
  {
    id: "03",
    thumbnailImg: TEMPLATE_THREE_IMG,
    colorPaletteCode: "themeThree",
  },
];

export const themeColorPalette = {
  themeOne: [
    ["#EBFDFF", "#A1F4FD", "#CEFAFE", "#00B8DB", "#4A5565"],

    ["#E9FBF8", "#B4EFE7", "#93E2DA", "#2AC9A0", "#3D4C5A"],
    ["#F5F4FF", "#E0DBFF", "#C9C2F8", "#8579D1", "#4B4B5C"],
    ["#F0FAFF", "#D6F0FF", "#AFDEFF", "#3399FF", "#445361"],
    ["#FFF5F7", "#FFE0EC", "#FAC6D4", "#F6729C", "#5A5A5A"],
    ["#F9FAFB", "#E4E7EB", "#CBD5E0", "#7F9CF5", "#2D3748"],

    ["#F4FFFD", "#D3FDF2", "#B0E9D4", "#34C79D", "#384C48"],
    ["#FFF7F0", "#FFE6D9", "#FFD2BA", "#FF9561", "#4C4743"],
    ["#F9FCFF", "#E3F0F9", "#C0DDEE", "#6CA6CF", "#46545E"],
    ["#FFFDF6", "#FFF4D7", "#FFE7A0", "#FFD000", "#57534E"],
    ["#EFFCFF", "#C8F0FF", "#99E0FF", "#007BA7", "#2B3A42"],

    ["#F7F7F7", "#E4E4E4", "#CFCFCF", "#4A4A4A", "#222222"],
    ["#E3F2FD", "#90CAF9", "#A8D2F4", "#1E88E5", "#0D47A1"],
  ],
};

export const DUMMY_RESUME_DATA = {
  profileInfo: {
    profileImg: null,
    profilePreviewUrl: "",
    fullName: "Aarav Sharma",
    designation: "Full Stack Software Engineer",
    summary:
      "Results-driven Full Stack Developer with 5+ years of experience building scalable web applications using the MERN stack and cloud technologies. Passionate about clean architecture, performance optimization, and delivering user-centric solutions.",
  },

  contactInfo: {
    email: "aarav.sharma.dev@gmail.com",
    phone: "+91 9876543210",
    location: "Bangalore, India",
    linkedin: "https://linkedin.com/in/aarav-sharma",
    github: "https://github.com/aarav-sharma",
    website: "https://aaravdev.tech",
  },

  workExperience: [
    {
      company: "TechNova Solutions",
      role: "Senior Frontend Engineer",
      startDate: "2022-04",
      endDate: "2025-03",
      description:
        "Led a team of 4 developers to build enterprise-grade React applications. Improved performance by 35% through code-splitting and optimization. Integrated REST APIs and implemented scalable state management using Redux Toolkit.",
    },
    {
      company: "CodeSphere Labs",
      role: "Full Stack Developer",
      startDate: "2020-01",
      endDate: "2022-03",
      description:
        "Developed and maintained MERN-based SaaS platforms. Designed RESTful APIs using Node.js and Express. Optimized MongoDB queries to reduce response time by 40%.",
    },
  ],

  education: [
    {
      degree: "B.Tech in Computer Science and Engineering",
      institution: "National Institute of Technology, Trichy",
      startDate: "2016",
      endDate: "2020",
    },
  ],

  skills: [
    { name: "JavaScript", progress: 90 },
    { name: "React.js", progress: 85 },
    { name: "Node.js", progress: 80 },
    { name: "MongoDB", progress: 75 },
    { name: "System Design", progress: 70 },
    { name: "AWS", progress: 65 },
  ],

  projects: [
    {
      title: "E-Commerce Platform",
      description:
        "Built a full-featured e-commerce web application with payment gateway integration and admin dashboard using MERN stack.",
      github: "https://github.com/aarav-sharma/ecommerce-platform",
      liveDemo: "https://shopnow-demo.vercel.app",
    },
    {
      title: "Real-Time Chat App",
      description:
        "Developed a scalable real-time messaging app using Socket.io and JWT authentication with persistent chat history.",
      github: "https://github.com/aarav-sharma/chat-app",
      liveDemo: "https://chatwave-demo.vercel.app",
    },
  ],

  certifications: [
    {
      title: "AWS Certified Cloud Practitioner",
      issuer: "Amazon Web Services",
      year: "2024",
    },
    {
      title: "MongoDB Developer Certification",
      issuer: "MongoDB University",
      year: "2023",
    },
  ],

  languages: [
    { name: "English", progress: 95 },
    { name: "Hindi", progress: 90 },
  ],

  interests: [
    "System Architecture",
    "Open Source Contributions",
    "Formula 1",
    "Reading Tech Blogs",
  ],
};
