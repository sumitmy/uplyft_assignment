import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import LoginPage from "./components/LoginPage";
import ProductsPage from "./components/ProductsPage";
import ChatbotPage from "./components/ChatbotPage";
import HistoryPage from "./components/HistoryPage";
import "./App.css";

function App() {
  const [authToken, setAuthToken] = useState(localStorage.getItem("authToken"));

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setAuthToken(null);
  };

  useEffect(() => {
    setAuthToken(localStorage.getItem("authToken"));
  }, []);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            authToken ? (
              <Navigate to="/products" replace />
            ) : (
              <LoginPage setAuthToken={setAuthToken} />
            )
          }
        />
        <Route
          path="/products"
          element={
            authToken ? (
              <ProductsPage authToken={authToken} handleLogout={handleLogout} />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/chatbot"
          element={
            authToken ? (
              <ChatbotPage authToken={authToken} />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/history"
          element={
            authToken ? (
              <HistoryPage authToken={authToken} />
            ) : (
              <Navigate to="/" />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
