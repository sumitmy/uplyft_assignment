# E-commerce Application with Chatbot and Product Management

## Overview
This is a web-based E-commerce application built using **React with Vite** for the frontend and **Flask** for the backend. It includes features like product browsing, chatbot interaction, and chat history viewing.

## Features
1. **Login System**: JWT-based authentication for secure access.
2. **Product Management**: 
   - View products with filters (search and category-based).
3. **Chatbot**: Get automated responses about product categories.
4. **Chat History**: View all previous chatbot interactions.

## Frontend
- **React with Vite**: For fast and efficient UI development.
- **Dependencies**:
  - `axios`: For making API calls.
  - `react-router-dom`: For route management.

## Backend
- **Flask**: RESTful APIs to handle requests and manage data.
- **Database**: SQLite for storing product data and chat history.
- **Key Libraries**:
  - `SQLAlchemy`: ORM for database operations.
  - `flask-cors`: To enable CORS for frontend-backend communication.
  - `jwt`: For token-based authentication.

## Installation
### Backend
1. Navigate to the backend directory.
2. Install required Python libraries:
   ```bash
   pip install flask flask-cors sqlalchemy jwt

3.Run the backend server:
  python index.py


Frontend
  1.Navigate to the frontend directory.
  2.Install dependencies:
      npm install
  3.Start the Vite development server:
      npm run dev


Routes
  Backend Routes
    Login: /api/login (POST)
    Products: /api/products (GET)
    Chatbot: /api/products/chatbot (POST)
    Chat History: /api/chat_history (GET)
    Protected Route: /api/protected (GET)
Frontend Routes
    /: Login page.
    /products: Products page with search and category filters.
    /chatbot: Chatbot interaction page.
    /history: Chat history page.
    
Usage

  Login using credentials (username: admin, password: admin@123).
  
  Browse products and filter by category or name.
  Use the chatbot to inquire about products.
  View your chatbot interaction history.

