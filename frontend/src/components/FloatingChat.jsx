import React, { useState, useRef, useEffect } from "react";
import { IoChatboxEllipsesOutline } from "react-icons/io5";

const FloatingChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hello! How can I help you today?", sender: "bot" },
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { text: input, sender: "user" }]);
    setInput("");

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { text: "Thanks for your message!", sender: "bot" },
      ]);
    }, 1000);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      {/* Chat Box */}
      {isOpen && (
        <div className="fixed bottom-28 right-8 w-[420px] h-[500px] bg-white shadow-xl border border-[#A1876F] rounded-xl p-4 z-50 flex flex-col">
          {/* Header */}
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-bold" style={{ color: "#40350A" }}>
              AiChat Support
            </h2>
            <button
              onClick={() => setIsOpen(false)}
              className="text-2xl text-[#A1876F] hover:text-[#40350A]"
            >
              &times;
            </button>
          </div>

          {/* Messages */}
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
                {msg.text}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Box */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 border border-[#A1876F] rounded px-3 py-2 text-sm text-[#40350A] focus:outline-none"
            />
            <button
              onClick={sendMessage}
              className="text-sm bg-[#40350A] text-white px-4 py-2 rounded hover:bg-[#5a4812]"
            >
              Send
            </button>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        className="fixed bottom-6 right-6 bg-[#40350A] text-white p-5 rounded-full shadow-xl z-50 hover:bg-[#5a4812] transition"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle chat"
      >
        <IoChatboxEllipsesOutline size={34} />
      </button>
    </>
  );
};

export default FloatingChat;
