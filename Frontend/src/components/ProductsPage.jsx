import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./ProductsPage.css";

function ProductsPage({ authToken, handleLogout }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (authToken) {
      axios
        .get("http://127.0.0.1:5000/api/products", {
          headers: { Authorization: `Bearer ${authToken}` },
        })
        .then((response) => {
          const productsData = response.data;
          setProducts(productsData);

          // Extract unique categories
          const uniqueCategories = [
            ...new Set(productsData.map((product) => product.category)),
          ];
          setCategories(uniqueCategories);
        })
        .catch((error) => console.log(error));
    }
  }, [authToken]);

  const handleChatbot = () => {
    navigate("/chatbot");
  };

  const filteredProducts = products
    .filter((product) =>
      product.name.toLowerCase().startsWith(searchTerm.toLowerCase())
    )
    .filter((product) =>
      selectedCategory ? product.category === selectedCategory : true
    );

  return (
    <div className="products-page">
      <h1>Products</h1>

      <div className="filter-section">
        <div className="left">
          <input
            type="text"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="category-select"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        <div className="right">
          <button onClick={handleChatbot} className="chatbot-button">
            Chatbot
          </button>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Price</th>
              <th>Category</th>
              <th>Stocks</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>{product.name}</td>
                <td>{product.price}</td>
                <td>{product.category}</td>
                <td>{product.stock}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ProductsPage;
