import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import "./Cart.css";

// ✅ Updated to New Backend URL
const API_BASE = 'https://zust-mu.vercel.app';

function Cart() {
  const { cartItems, removeFromCart, increaseQty, decreaseQty, subtotal } =
    useContext(CartContext);
  const navigate = useNavigate();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const isLoggedIn = !!localStorage.getItem("token");

  // Calculations
  const tax = subtotal * 0.05;
  const shipping = subtotal > 1000 ? 0 : 150;
  const total = subtotal + tax + shipping;

  const handleCheckoutClick = () => {
    if (!isLoggedIn) {
      setIsAuthModalOpen(true);
    } else {
      navigate("/checkout");
    }
  };

  const confirmDelete = (item) => {
    setItemToDelete(item);
    setIsDeleteModalOpen(true);
  };

  const handleFinalDelete = () => {
    if (itemToDelete) {
      removeFromCart(itemToDelete._id);
      setIsDeleteModalOpen(false);
      setItemToDelete(null);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        <div className="empty-cart-wrapper">
          <div className="empty-cart-card">
            <div className="empty-icon">🛒</div>
            <h2>Your Cart is Empty</h2>
            <p>Looks like you haven’t added anything yet.</p>
            <Link to="/" className="empty-cart-btn">
              Start Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-container">
        <h1>Shopping Bag ({cartItems.length})</h1>

        <div className="cart-main-grid">
          {/* ===== CART ITEMS ===== */}
          <div className="cart-items-list">
            {cartItems.map((item) => {
              // ✅ Refined Image Logic to avoid double slashes and handle nulls
              let imageUrl = "https://via.placeholder.com/150x150?text=No+Image";
              
              if (item.images && item.images.length > 0) {
                const firstImage = item.images[0];
                imageUrl = firstImage.startsWith("http") 
                  ? firstImage 
                  : `${API_BASE}${firstImage.startsWith("/") ? "" : "/"}${firstImage}`;
              } else if (item.image) {
                imageUrl = item.image;
              }

              return (
                <div key={item._id} className="modern-cart-card">
                  {/* Image */}
                  <img
                    src={imageUrl}
                    alt={item.title}
                    onError={(e) => (e.target.src = "https://via.placeholder.com/150x150?text=Error")}
                  />

                  {/* Info */}
                  <div className="item-info">
                    <h3>{item.title}</h3>
                    <p>Rs {item.price?.toLocaleString()}</p>
                  </div>

                  {/* Quantity */}
                  <div className="qty-picker">
                    <button onClick={() => decreaseQty(item._id)}>−</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => increaseQty(item._id)}>+</button>
                  </div>

                  {/* Delete Button */}
                  <button
                    className="trash-btn"
                    onClick={() => confirmDelete(item)}
                  >
                    🗑
                  </button>
                </div>
              );
            })}
          </div>

          {/* ===== SUMMARY ===== */}
          <aside className="summary-sidebar">
            <div className="summary-card">
              <h3>Order Summary</h3>
              <div className="calc-row">
                <span>Subtotal</span>
                <span>Rs {subtotal.toLocaleString()}</span>
              </div>
              <div className="calc-row">
                <span>Tax (5%)</span>
                <span>Rs {tax.toLocaleString()}</span>
              </div>
              <div className="calc-row">
                <span>Delivery</span>
                <span>{shipping === 0 ? "FREE" : `Rs ${shipping}`}</span>
              </div>
              <div className="final-total">
                <span>Total</span>
                <span>Rs {total.toLocaleString()}</span>
              </div>
              <button className="main-checkout-btn" onClick={handleCheckoutClick}>
                Proceed to Checkout
              </button>
            </div>
          </aside>
        </div>
      </div>

      {/* ===== DELETE MODAL ===== */}
      {isDeleteModalOpen && (
        <div className="modal-overlay">
          <div className="delete-modal">
            <h3>Remove Item?</h3>
            <p>
              Are you sure you want to remove{" "}
              <strong>{itemToDelete?.title}</strong> from your cart?
            </p>
            <div className="modal-actions">
              <button className="confirm-remove-btn" onClick={handleFinalDelete}>
                Yes, Remove
              </button>
              <button className="cancel-btn" onClick={() => setIsDeleteModalOpen(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== AUTH MODAL ===== */}
      {isAuthModalOpen && (
        <div className="modal-overlay">
          <div className="auth-modal">
            <h3>Login Required</h3>
            <p>Please login to continue with your purchase.</p>
            <div className="modal-actions-auth">
                <button className="auth-confirm-btn" onClick={() => navigate("/login")}>Login Now</button>
                <button className="auth-cancel-btn" onClick={() => setIsAuthModalOpen(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;