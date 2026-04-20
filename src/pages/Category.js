import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ProductCard from "../components/ProductCard";
import ProductModal from "../components/Modal";
import "./Category.css";

// ✅ Updated to New Backend URL
const API_BASE = 'https://zust-mu.vercel.app';

const Category = () => {
  const { category } = useParams();
  
  // URL parameters handling for "Decor & Kitchen" transition
  const decodedCategory = decodeURIComponent(category) === "Home & Kitchen" 
    ? "Decor & Kitchen" 
    : decodeURIComponent(category);

  const [products, setProducts] = useState([]);
  const [selectedSub, setSelectedSub] = useState(null);
  const [selectedSubSub, setSelectedSubSub] = useState("All");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // Updated CATEGORY_DATA structure
  const categories = {
    Clothes: {
      Men: ["Shirts", "Jeans", "Jackets"],
      Women: ["Shirts", "Dresses", "Jeans"],
      Baby: ["Bags", "cloths"],
    },
    Electronics: {
      Mobiles: [],
      Laptops: [],
      Accessories: ["Chargers", "Headphones"],
    },
    "Decor & Kitchen": {
      Decor: [],
      Kitchen: [],
    },
    Beauty: {
      Skincare: ["Creams", "Serums"],
      Makeup: ["Lipstick", "Eyeliner"],
    },
  };

  useEffect(() => {
    setSelectedSub(null);
    setSelectedSubSub("All");
    fetchProducts();
    // Scroll to top when category changes
    window.scrollTo(0, 0);
  }, [decodedCategory]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      // ✅ Using params object for cleaner API calls
      const res = await axios.get(`${API_BASE}/api/products`, {
        params: { 
          category: decodedCategory 
        }
      });
      setProducts(res.data);
    } catch (err) {
      console.error("Category fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter((p) => {
    // Robust category matching
    const productMainCat = p.category?.main || p.category;
    const matchMain = productMainCat === decodedCategory;
    
    const matchSub = !selectedSub || p.category?.sub === selectedSub;
    const matchSubSub = selectedSubSub === "All" || p.category?.subSub === selectedSubSub;
    
    return matchMain && matchSub && matchSubSub;
  });

  return (
    <div className="category-page">
      <div className="container">
        
        <header className="category-header">
          <h1 className="category-title">{decodedCategory}</h1>
          <p className="product-count">{filteredProducts.length} Items Found</p>
        </header>

        {/* 1. Main Sub-Categories Row */}
        <div className="filter-section">
          <div className="sub-category-wrapper">
            {categories[decodedCategory] &&
              Object.entries(categories[decodedCategory]).map(([sub]) => (
                <button
                  key={sub}
                  className={`main-btn ${selectedSub === sub ? "active" : ""}`}
                  onClick={() => {
                    if (selectedSub === sub) {
                      setSelectedSub(null);
                      setSelectedSubSub("All");
                    } else {
                      setSelectedSub(sub);
                      setSelectedSubSub("All");
                    }
                  }}
                >
                  {sub}
                </button>
              ))}
          </div>

          {/* 2. Secondary Sub-Sub Row (Chips) */}
          {selectedSub && categories[decodedCategory]?.[selectedSub]?.length > 0 && (
            <div className={`sub-sub-row active-row`}>
               <button
                  className={`chip ${selectedSubSub === "All" ? "chip-active" : ""}`}
                  onClick={() => setSelectedSubSub("All")}
                >
                  All
                </button>
              {categories[decodedCategory][selectedSub].map((subSub) => (
                <button
                  key={subSub}
                  className={`chip ${selectedSubSub === subSub ? "chip-active" : ""}`}
                  onClick={() => setSelectedSubSub(subSub)}
                >
                  {subSub}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Products Display */}
        {loading ? (
          <div className="loader-container">
            <div className="spinner"></div>
            <p>Loading...</p>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="product-grid">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onProductClick={setSelectedProduct}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <span className="empty-icon">🔎</span>
            <p>No products found in this category.</p>
            <button className="reset-filter-btn" onClick={() => setSelectedSub(null)}>Clear Filters</button>
          </div>
        )}
      </div>

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
};

export default Category;