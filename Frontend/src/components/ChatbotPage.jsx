import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./ChatbotPage.css";

function ChatbotPage({ authToken }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const navigate = useNavigate();

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    setMessages((prev) => [...prev, { text: input, sender: "user" }]);

    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/api/products/chatbot",
        { message: input },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      setMessages((prev) => [...prev, { text: response.data.response, sender: "bot" }]);
    } catch (error) {
      setMessages((prev) => [...prev, { text: "Error fetching response", sender: "bot" }]);
    }
    setInput("");
  };

  const handleShowHistory = () => {
    navigate("/history");
  };

  return (
    <div className="chatbot-container">
      <h1>Chatbot</h1>

      <div className="chat-window">
        {messages.map((msg, index) => (
          <div key={index} className={`chat-message ${msg.sender}`}>
            <p>{msg.text}</p>
          </div>
        ))}
      </div>

      <div className="chat-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>

      <div>
        <button onClick={handleShowHistory}>Show History</button>
      </div>
    </div>
  );
}

export default ChatbotPage;
