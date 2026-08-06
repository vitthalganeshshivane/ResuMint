const express = require("express");
const { protect } = require("../middlewares/authMiddleware");
const { handleChat } = require("../controllers/chatbotController");
const rateLimit = require("express-rate-limit");

const router = express.Router();

const chatLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  message: { message: "Too many messages. Please wait a moment." },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post("/", protect, chatLimiter, handleChat);

module.exports = router;
