import React, { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import { X, ShoppingCart, CheckCircle, AlertTriangle } from "lucide-react";

// ✅ Updated to New Backend URL
const API_BASE = 'https://zust-mu.vercel.app';

const ProductModal = ({ product, onClose }) => {
  const { addToCart } = useContext(CartContext);
  const [selectedImage, setSelectedImage] = useState(
    product?.images && product.images.length > 0 ? product.images[0] : null
  );

  if (!product) return null;

  const getImageUrl = (img) => {
    if (!img) return "https://via.placeholder.com/400x400?text=No+Image";
    return img.startsWith("http")
      ? img
      : `${API_BASE}${img}`;
  };

  const handleAddToCart = () => {
    addToCart(product);
    onClose();
  };

  // ✅ Helper to display category safely
  const displayCategory = () => {
    if (typeof product.category === 'object') {
      return product.category.main || "General";
    }
    return product.category || "General";
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card animate-pop-in" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <X size={24} />
        </button>

        <div className="modal-body">
          {/* Left: Image Gallery */}
          <div className="modal-gallery">
            <div className="modal-main-image">
              <img 
                src={getImageUrl(selectedImage)} 
                alt={product.title} 
                className="img-fluid" 
              />
            </div>

            {product.images?.length > 1 && (
              <div className="modal-thumbnails">
                {product.images.map((img, index) => (
                  <div
                    key={index}
                    className={`thumb-box ${selectedImage === img ? "active-thumb" : ""}`}
                    onClick={() => setSelectedImage(img)}
                  >
                    <img src={getImageUrl(img)} alt={`thumb-${index}`} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Info */}
          <div className="modal-info">
            <div className="modal-header-info">
              {/* ✅ Safely display category */}
              <span className="modal-category-tag">{displayCategory()}</span>
              <h2 className="modal-title">{product.title}</h2>
            </div>

            <div className="modal-price-section">
              <span className="current-price">Rs {product.price?.toLocaleString()}</span>
              {product.originalPrice && (
                <span className="modal-original-price">Rs {product.originalPrice?.toLocaleString()}</span>
              )}
            </div>

            <div className="modal-description">
              <h4>Product Details</h4>
              <p>{product.text || product.description || "Premium quality product from ZustStore."}</p>
            </div>

            <div className={`stock-status ${product.stock > 0 ? "text-success" : "text-danger"}`}>
              {product.stock > 0 ? (
                <><CheckCircle size={16} /> In Stock: {product.stock}</>
              ) : (
                <><AlertTriangle size={16} /> Out of Stock</>
              )}
            </div>

            <div className="modal-actions">
              <button
                className="modal-add-btn"
                disabled={product.stock < 1}
                onClick={handleAddToCart}
              >
                {product.stock > 0 ? (
                  <>
                    <ShoppingCart size={20} />
                    <span>Add to Cart</span>
                  </>
                ) : (
                  "Currently Unavailable"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;