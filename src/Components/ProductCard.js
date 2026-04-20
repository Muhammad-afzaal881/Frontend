import React, { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { ShoppingCart } from "lucide-react";

const ProductCard = ({ product, onProductClick }) => {
  const { addToCart } = useContext(CartContext);
  if (!product) return null;

 const API_BASE = 'https://zust-mu.vercel.app';
  const imageUrl = product?.images?.length > 0
      ? product.images[0].startsWith("http") ? product.images[0] : `${API_BASE}${product.images[0]}`
      : "https://via.placeholder.com/300x400?text=No+Image";

  return (
    <div className="modern-card">
      <div className="image-frame" onClick={() => onProductClick(product)}>
        <img src={imageUrl} alt={product.title} className="main-img" loading="lazy" />
        
        {/* Floating Add to Cart Button */}
        <button 
          className="floating-cart-btn" 
          onClick={(e) => { e.stopPropagation(); addToCart(product); }}
        >
          <ShoppingCart size={18} strokeWidth={2.5} />
        </button>
      </div>
          
      <div className="info-area" onClick={() => onProductClick(product)}>
        <h3 className="minor-title">{product.title}</h3>
        <p className="minor-price">Rs {product.price?.toLocaleString()}</p>
      </div>
    </div>
  );
};

export default ProductCard;