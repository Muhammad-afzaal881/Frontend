import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import ProductCard from "../components/ProductCard"; 
import ProductModal from "../components/Modal";
import "./SearchResults.css"; 

// ✅ Updated to New Backend URL

const API_BASE = 'https://zust-mu.vercel.app';

function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || ""; 

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const fetchSearchData = async () => {
      if (!query.trim()) {
        setProducts([]);
        return;
      }

      setLoading(true);
      try {
        // ✅ API call to new backend
        const { data } = await axios.get(`${API_BASE}/api/products/search?q=${encodeURIComponent(query)}`);
        
        // Agar data array hai toh set karein, warna empty array
        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Search error:", err.response?.data || err.message);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchData();
  }, [query]);

  const handleProductClick = (product) => {
    setSelectedProduct(product);
  };

  return (
    <div className="search-page-container">
      <div className="search-header">
        {query ? (
          <div className="header-text-info">
            <h2>Results for <span className="query-highlight">"{query}"</span></h2>
            <p className="results-count">{products.length} Items found</p>
          </div>
        ) : (
          <div className="empty-search-prompt">
            <h2>Search Zust Store</h2>
            <p>Type something to find your favorite products...</p>
          </div>
        )}
      </div>

      <hr className="search-divider" />

      {loading ? (
        <div className="search-loader-wrapper">
          <div className="search-spinner"></div>
          <p>Loading.....</p>
        </div>
      ) : (
        <div className="search-grid">
          {products.length > 0 ? (
            products.map(product => (
              <ProductCard
                key={product._id}
                product={product}
                onProductClick={handleProductClick} 
              />
            ))
          ) : (
            query && (
              <div className="no-results-box animate-in">
                <div className="no-results-icon">🔎</div>
                <h3>Oops! No results found</h3>
                <p>Humein <strong>"{query}"</strong> ke liye kuch nahi mila.</p>
                <div className="search-tips">
                  <p>Try these categories instead:</p>
                  <div className="tip-badges">
                    <span>Electronics</span>
                    <span>Fashion</span>
                    <span>Decor & Kitchen</span>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      )}

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
}

export default SearchResults;