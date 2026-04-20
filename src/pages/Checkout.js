import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { MapPin, CreditCard, CheckCircle, AlertCircle } from 'lucide-react';
import './Checkout.css';

// ✅ Updated to New Backend URL
const API_BASE = 'https://zust-mu.vercel.app';

function Checkout() {
  const { cartItems, subtotal, clearCart } = useContext(CartContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [statusPopup, setStatusPopup] = useState({ show: false, message: '', type: '' });

  const [formData, setFormData] = useState({
    fullName: '',
    address: '',
    city: '',
    phone: '',
  });

  const shipping = subtotal > 1000 ? 0 : 150;
  const total = subtotal + shipping;

  const showStatus = (msg, type) => {
    setStatusPopup({ show: true, message: msg, type: type });
    if (type !== 'success') {
      setTimeout(() => setStatusPopup({ show: false, message: '', type: '' }), 3000);
    }
  };

  const handleOrder = async (e) => {
    e.preventDefault();
    
    // Basic validations
    if (cartItems.length === 0) return showStatus("Your cart is empty!", "error");
    if (formData.phone.trim().length < 11) return showStatus("Please enter a valid phone number!", "error");
    if (formData.address.trim().length < 10) return showStatus("Please provide a complete address!", "error");

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      // ✅ Sending order to new backend
      const response = await axios.post(`${API_BASE}/api/orders/create`, {
        items: cartItems.map(item => ({
          product: item._id,
          title: item.title,
          quantity: item.quantity,
          price: item.price
        })),
        totalAmount: total,
        address: formData,
        paymentMethod: 'COD' 
      }, { 
        headers: { 'Authorization': `Bearer ${token}` } 
      });

      if (response.data.success) {
        showStatus("🎉 Order Placed Successfully! Redirecting...", "success");
        setTimeout(() => {
          clearCart();
          navigate('/profile'); // User orders dekhne ke liye profile page par
        }, 2500);
      }
    } catch (err) {
      console.error("Order Creation Error:", err.response?.data || err.message);
      showStatus(err.response?.data?.message || "Order placement failed. Please try again! ❌", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-container">
      {statusPopup.show && (
        <div className={`status-popup-container ${statusPopup.type}`}>
          <div className="status-popup-content">
            {statusPopup.type === 'success' ? <CheckCircle size={24} /> : <AlertCircle size={24} />}
            <span>{statusPopup.message}</span>
          </div>
        </div>
      )}

      <h1>Checkout</h1>
      <div className="checkout-flex">
        <form onSubmit={handleOrder} className="shipping-form">
          <section className="form-section">
            <h3><MapPin size={20} /> Shipping Details</h3>
            <div className="input-group">
              <input type="text" placeholder="Full Name" required onChange={(e) => setFormData({...formData, fullName: e.target.value})} />
              <input type="text" placeholder="City" required onChange={(e) => setFormData({...formData, city: e.target.value})} />
            </div>
            <input type="text" placeholder="Phone (e.g. 03001234567)" required onChange={(e) => setFormData({...formData, phone: e.target.value})} />
            <textarea placeholder="Full House Address, Street, Area..." required onChange={(e) => setFormData({...formData, address: e.target.value})} />
          </section>

          <section className="payment-method">
            <h3><CreditCard size={20} /> Payment Method</h3>
            <div className="pay-card selected">
              <CheckCircle className="check-icon" size={18} />
              <div className="pay-text">
                <span>Cash on Delivery (COD)</span>
                <small>Pay when you receive your parcel at your doorstep.</small>
              </div>
            </div>
          </section>

          <button type="submit" className="place-order-btn" disabled={loading}>
            {loading ? "Processing Order..." : `Confirm Order - Rs ${total.toLocaleString()}`}
          </button>
        </form>

        <div className="order-summary-mini">
          <h3>Order Summary</h3>
          <div className="summary-items">
            {cartItems.map(item => (
              <div key={item._id} className="mini-item">
                <div className="item-name">
                  <strong>{item.title}</strong>
                  <span>Qty: {item.quantity}</span>
                </div>
                <span>Rs {(item.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
          </div>
          <hr />
          <div className="summary-total-details">
            <div className="total-row"><span>Subtotal:</span> <span>Rs {subtotal.toLocaleString()}</span></div>
            <div className="total-row"><span>Tax (5%):</span> <span>Rs {(subtotal * 0.05).toLocaleString()}</span></div>
            <div className="total-row"><span>Shipping:</span> <span>{shipping === 0 ? "FREE" : `Rs ${shipping}`}</span></div>
            <div className="total-row grand-total"><strong>Total:</strong> <strong>Rs {total.toLocaleString()}</strong></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;