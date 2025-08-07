import React, { useState, useRef, useEffect } from "react";
import { IoChatboxEllipsesOutline } from "react-icons/io5";
import PulseLoader from "react-spinners/PulseLoader";
import ReactMarkdown from 'react-markdown';

const FloatingChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hello! I am Tara your AI assistant. How can I help you today?", sender: "bot" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatRef = useRef(null);
  const messagesEndRef = useRef(null);

  const sendMessage = async () => {
    // Prevent sending empty or while loading
    if (!input.trim() || loading) return;
    
    const userMsg = { text: input, sender: "user" };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(
        import.meta.env.VITE_AI_BACKEND_URL + "/api/chat",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question: input }),
        }
      );
      const data = await res.json();
      const botReply = data.answer || "Sorry, I didn’t understand that.";
      setMessages((prev) => [...prev, { text: botReply, sender: "bot" }]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { text: "Server error. Please try again later.", sender: "bot" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // --- MODIFIED CODE [START] ---
  const handleKeyDown = (e) => {
    // Check for Enter key and not loading
    if (e.key === "Enter" && !loading) {
      sendMessage();
    }
  };
  // --- MODIFIED CODE [END] ---

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        chatRef.current &&
        !chatRef.current.contains(e.target) &&
        !e.target.closest("#floating-chat-toggle")
      ) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <>
      {isOpen && (
        <div
          ref={chatRef}
          className="fixed bottom-28 right-4 left-4 h-[50vh] md:h-[500px] md:w-[420px] md:left-auto md:right-8 bg-white shadow-xl border border-[#A1876F] rounded-xl p-4 z-50 flex flex-col"
        >
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-bold text-[#40350A]">AiChat Support</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="text-2xl text-[#A1876F] hover:text-[#40350A]"
            >
              &times;
            </button>
          </div>

          <div className="flex-1 overflow-y-auto mb-3 space-y-2 pr-1">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`max-w-[75%] px-3 py-2 rounded-lg text-sm ${
                  msg.sender === "user"
                    ? "bg-[#40350A] text-white ml-auto"
                    : "bg-[#F5F2EF] text-[#40350A] mr-auto"
                }`}
              >
                {msg.sender === 'bot' ? (
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                ) : (
                  msg.text
                )}
              </div>
            ))}
            {loading && (
              <div className="mr-auto">
                <div className="bg-[#F5F2EF] text-[#40350A] rounded-lg px-3 py-2 inline-block">
                  <PulseLoader size={8} color="#40350A" speedMultiplier={0.7} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* --- MODIFIED CODE [START] --- */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder={loading ? "Waiting for response..." : "Type a message..."}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading} // Disable input when loading
              className="flex-1 border border-[#A1876F] rounded px-3 py-2 text-sm text-[#40350A] focus:outline-none disabled:bg-gray-200 disabled:cursor-not-allowed"
            />
            <button
              onClick={sendMessage}
              disabled={loading} // Disable button when loading
              className="text-sm bg-[#40350A] text-white px-4 py-2 rounded hover:bg-[#5a4812] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Send
            </button>
          </div>
          {/* --- MODIFIED CODE [END] --- */}

        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        id="floating-chat-toggle"
        className="fixed bottom-6 right-6 bg-[#40350A] text-white p-5 rounded-full shadow-xl z-50 hover:bg-[#5a4812] transition"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Toggle chat"
      >
        <IoChatboxEllipsesOutline size={34} />
      </button>
    </>
  );
};

export default FloatingChat;