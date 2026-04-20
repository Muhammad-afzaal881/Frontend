import React from "react";
import { useNavigate } from "react-router-dom";
import HeroSection from "../components/Hero"; 
import "./Home.css";

const Home = () => {
  const navigate = useNavigate();

  // ✅ Consistent Navigation Logic
  const handleCategoryClick = (category) => {
    // encodeURIComponent ensure karta hai ke "&" aur spaces URL mein break na hon
    navigate(`/category/${encodeURIComponent(category)}`);
    // Page top par scroll ho jaye jab category change ho
    window.scrollTo(0, 0);
  };

  const categories = [
    { name: "Clothes", icon: "👕", desc: "Trendy Styles", color: "#6366f1" },
    { name: "Electronics", icon: "📱", desc: "Latest Tech", color: "#10b981" },
    { name: "Decor & Kitchen", icon: "🏠", desc: "Modern Decor", color: "#f59e0b" },
    { name: "Beauty", icon: "💄", desc: "Premium Care", color: "#ec4899" }
  ];

  return (
    <div className="home-wrapper">
      <HeroSection />
      
      {/* Categories Section */}
      <section className="categories-section">
        <div className="container">
          <div className="section-header">
            <span className="subtitle">Collections</span>
            <h2>Shop by Category</h2>
            <div className="header-bar"></div>
          </div>
          
          <div className="category-grid">
            {categories.map(cat => (
              <div 
                key={cat.name} 
                className="category-card-modern" 
                onClick={() => handleCategoryClick(cat.name)}
                role="button"
                tabIndex="0"
              >
                <div className="card-bg-circle" style={{ backgroundColor: cat.color }}></div>
                <div className="category-content">
                  <div className="category-icon-main">{cat.icon}</div>
                  <h3>{cat.name}</h3>
                  <p>{cat.desc}</p>
                  <span className="explore-btn">Explore →</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;