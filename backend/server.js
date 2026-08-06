require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const resumeRoutes = require("./routes/resumeRoutes");
const aiRoutes = require("./routes/aiRoutes");
const analyzerRoutes = require("./routes/analyzerRoutes");
const chatbotRoutes = require("./routes/chatbotRoutes");
const analysisHistoryRoutes = require("./routes/analysisHistoryRoutes");

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

connectDB();

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/analyzer", analyzerRoutes);
app.use("/api/chatbot", chatbotRoutes);
app.use("/api/analyzer/history", analysisHistoryRoutes);

app.get("/welcome", (req, res) => {
  res.send("Welcome to the MERN backend server of resume builder webapp");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
