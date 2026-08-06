const { chat } = require("../services/chatbotService");

const handleChat = async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ message: "Message is required" });
    }

    const reply = await chat(message.trim(), history || []);

    res.status(200).json({ reply });
  } catch (error) {
    console.error("Chatbot error:", error);
    res
      .status(500)
      .json({ message: "Failed to get response", error: error.message });
  }
};

module.exports = { handleChat };
