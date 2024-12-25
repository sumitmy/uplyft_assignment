
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./HistoryPage.css";

function HistoryPage({ authToken }) {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:5000/api/chat_history", {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        setHistory(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchHistory();
  }, [authToken]);

  return (
    <div className="history-page">
      <h1>Chat History</h1>
      {history.length > 0 ? (
        <div className="history-container">
          {history.map((item) => (
            <p key={item.id}>
              <strong>User:</strong> {item.user_message} <br />
              <strong>Bot:</strong> {item.bot_response}
            </p>
          ))}
        </div>
      ) : (
        <p>No history available.</p>
      )}
    </div>
  );
}

export default HistoryPage;
