import React, { useState, useRef, useEffect } from "react";
import {
  LuMessageCircle,
  LuX,
  LuSend,
  LuBot,
  LuUser,
  LuSparkles,
} from "react-icons/lu";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";

const QUICK_SUGGESTIONS = [
  "How do I create a resume?",
  "What AI features are available?",
  "How do I analyze my resume?",
  "How do I change my profile?",
];

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1.5 px-4 py-3">
      <div className="flex items-center gap-1">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-1.5 h-1.5 rounded-full animate-bounce"
            style={{
              backgroundColor: "var(--color-slate)",
              animationDelay: `${i * 0.15}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

function MessageBubble({ message, isUser }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  return (
    <div
      className={`flex ${isUser ? "justify-end" : "justify-start"} mb-2 transition-all duration-300`}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(8px)",
      }}
    >
      {!isUser && (
        <div
          className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center mr-2 mt-0.5"
          style={{
            backgroundColor: "var(--color-signal-orange)",
            color: "var(--color-cream)",
          }}
        >
          <LuBot size={12} />
        </div>
      )}

      <div
        className="max-w-[75%] px-3.5 py-2.5 text-[12.5px] leading-relaxed"
        style={{
          backgroundColor: isUser ? "var(--color-ink)" : "var(--color-cream)",
          color: isUser ? "var(--color-cream)" : "var(--color-ink)",
          borderRadius: isUser
            ? "16px 16px 4px 16px"
            : "16px 16px 16px 4px",
          fontWeight: 450,
        }}
      >
        {message}
      </div>

      {isUser && (
        <div
          className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center ml-2 mt-0.5"
          style={{
            backgroundColor: "var(--color-dust)",
            color: "var(--color-slate)",
          }}
        >
          <LuUser size={12} />
        </div>
      )}
    </div>
  );
}

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hi! I'm ResuMint's assistant. Ask me anything about the website — how to create a resume, use AI features, analyze documents, or manage your account.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const sendMessage = async (text) => {
    const userMessage = text || input.trim();
    if (!userMessage || loading) return;

    const userMsg = { role: "user", content: userMessage };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const history = [...messages, userMsg].map((m) => ({
        role: m.role === "user" ? "user" : "assistant",
        content: m.content,
      }));

      const response = await axiosInstance.post(
        API_PATHS.CHATBOT.SEND,
        { message: userMessage, history },
        { timeout: 30000 },
      );

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: response.data.reply },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I couldn't process that. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Chat Window */}
      <div
        className="fixed bottom-24 right-5 z-50 flex flex-col overflow-hidden transition-all duration-400 ease-out"
        style={{
          width: isOpen ? "380px" : "0px",
          height: isOpen ? "520px" : "0px",
          opacity: isOpen ? 1 : 0,
          borderRadius: "24px",
          backgroundColor: "var(--color-cream-lifted)",
          boxShadow: isOpen
            ? "rgba(0, 0, 0, 0.12) 0px 20px 60px 0px"
            : "none",
          border: isOpen ? "1px solid var(--color-dust)" : "none",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-4 py-3 flex-shrink-0"
          style={{ borderBottom: "1px solid var(--color-dust)" }}
        >
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{
                backgroundColor: "var(--color-signal-orange)",
                color: "var(--color-cream)",
              }}
            >
              <LuSparkles size={14} />
            </div>
            <div>
              <p
                className="text-[13px] font-semibold leading-tight"
                style={{ color: "var(--color-ink)" }}
              >
                ResuMint Assistant
              </p>
              <p className="text-[10px]" style={{ color: "var(--color-slate)" }}>
                Ask me anything
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="w-7 h-7 rounded-full flex items-center justify-center cursor-pointer transition-colors duration-200"
            style={{
              backgroundColor: "var(--color-cream)",
              color: "var(--color-slate)",
            }}
          >
            <LuX size={14} />
          </button>
        </div>

        {/* Messages */}
        <div
          className="flex-1 overflow-y-auto px-3 py-4 custom-scrollbar"
          style={{ scrollBehavior: "smooth" }}
        >
          {messages.map((msg, i) => (
            <MessageBubble
              key={i}
              message={msg.content}
              isUser={msg.role === "user"}
            />
          ))}

          {loading && (
            <div className="flex items-start gap-2 mb-2">
              <div
                className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center"
                style={{
                  backgroundColor: "var(--color-signal-orange)",
                  color: "var(--color-cream)",
                }}
              >
                <LuBot size={12} />
              </div>
              <div
                className="px-1 py-1 rounded-2xl"
                style={{ backgroundColor: "var(--color-cream)" }}
              >
                <TypingIndicator />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestions */}
        {messages.length <= 1 && (
          <div
            className="px-3 pb-2 flex flex-wrap gap-1.5 flex-shrink-0"
          >
            {QUICK_SUGGESTIONS.map((suggestion, i) => (
              <button
                key={i}
                onClick={() => sendMessage(suggestion)}
                className="text-[11px] font-medium px-3 py-1.5 rounded-full cursor-pointer transition-all duration-200 hover:scale-[1.03]"
                style={{
                  backgroundColor: "var(--color-cream)",
                  color: "var(--color-signal-orange)",
                  border: "1px solid var(--color-dust)",
                }}
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div
          className="px-3 pb-3 pt-2 flex-shrink-0"
          style={{ borderTop: "1px solid var(--color-dust)" }}
        >
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-2xl"
            style={{
              backgroundColor: "var(--color-cream)",
              border: "1px solid var(--color-dust)",
            }}
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your question..."
              className="flex-1 bg-transparent outline-none text-[12.5px]"
              style={{
                color: "var(--color-ink)",
                fontWeight: 450,
              }}
              disabled={loading}
            />
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || loading}
              className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center cursor-pointer transition-all duration-200"
              style={{
                backgroundColor:
                  input.trim() && !loading
                    ? "var(--color-signal-orange)"
                    : "var(--color-dust)",
                color:
                  input.trim() && !loading
                    ? "var(--color-cream)"
                    : "var(--color-slate)",
              }}
            >
              <LuSend size={12} />
            </button>
          </div>
        </div>
      </div>

      {/* Floating Bubble */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-5 z-50 w-14 h-14 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-110"
        style={{
          backgroundColor: isOpen ? "var(--color-ink)" : "var(--color-signal-orange)",
          color: "var(--color-cream)",
          boxShadow: isOpen
            ? "rgba(0, 0, 0, 0.2) 0px 8px 30px 0px"
            : "rgba(207, 69, 0, 0.35) 0px 8px 30px 0px",
        }}
      >
        {isOpen ? <LuX size={20} /> : <LuMessageCircle size={20} />}
      </button>
    </>
  );
};

export default ChatBot;
