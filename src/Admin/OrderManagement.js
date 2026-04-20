import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Eye, Package, X, Phone, MapPin, Search, RefreshCw, Printer } from 'lucide-react';
import './OrderManagement.css';

// UPDATED API BASE URL
const API_BASE = 'https://zust-mu.vercel.app';

function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusPopup, setStatusPopup] = useState({ show: false, message: '', type: '' });

  // Memoized fetch to prevent unnecessary re-renders
  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_BASE}/api/admin/orders`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Filter out completed/cancelled orders for the "Active" view
      const activeOrders = res.data.filter(order => 
        order.orderStatus !== 'Delivered' && order.orderStatus !== 'Cancelled'
      );
      
      setOrders(activeOrders);
      setFilteredOrders(activeOrders);
    } catch (err) { 
      showStatus("Could not fetch orders! ❌", "error");
    } finally { 
      setLoading(false); 
    }
  }, []);

  useEffect(() => { 
    fetchOrders(); 
  }, [fetchOrders]);

  // Handle Search Filtering
  useEffect(() => {
    const results = orders.filter(order =>
      order.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.phone?.includes(searchTerm) ||
      order._id.includes(searchTerm)
    );
    setFilteredOrders(results);
  }, [searchTerm, orders]);

  const updateStatus = async (id, newStatus) => {
    if (!newStatus) return;
    
    // Save previous state for rollback on error
    const previousOrders = [...orders];
    
    // Optimistic UI Update
    if (newStatus === 'Delivered' || newStatus === 'Cancelled') {
      setOrders(orders.filter(order => order._id !== id));
    } else {
      setOrders(orders.map(order => 
        order._id === id ? { ...order, orderStatus: newStatus } : order
      ));
    }

    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_BASE}/api/admin/orders/${id}/status`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showStatus(`Order marked as ${newStatus}! ✅`, "success");
    } catch (err) { 
      setOrders(previousOrders); // Rollback
      showStatus("Error updating status ❌", "error"); 
    }
  };

  const showStatus = (msg, type) => {
    setStatusPopup({ show: true, message: msg, type: type });
    setTimeout(() => setStatusPopup({ show: false, message: '', type: '' }), 3000);
  };

  const handlePrint = () => { window.print(); };

  return (
    <div className="admin-section animate-in">
      {/* Status Notification Popup */}
      {statusPopup.show && (
        <div className={`status-toast ${statusPopup.type}`}>
          {statusPopup.message}
        </div>
      )}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="order-modal-overlay">
          <div className="order-modal-content card-shadow printable-content">
            <div className="modal-header no-print">
              <h3><Package size={20} /> Order Invoice</h3>
              <button className="close-btn" onClick={() => setSelectedOrder(null)}><X size={20}/></button>
            </div>
            
            <div className="modal-body">
              <div className="invoice-badge">Order ID: {selectedOrder._id}</div>
              
              <section className="detail-section">
                <h4><Phone size={16}/> Customer Information</h4>
                <div className="info-grid">
                  <p><strong>Name:</strong> {selectedOrder.user?.name || "N/A"}</p>
                  <p><strong>Phone:</strong> {selectedOrder.phone || "N/A"}</p>
                  <p><strong>Email:</strong> {selectedOrder.user?.email || "N/A"}</p>
                </div>
              </section>

              <section className="detail-section">
                <h4><MapPin size={16}/> Shipping Address</h4>
                <p className="address-box">{selectedOrder.shippingAddress || "N/A"}</p>
              </section>

              <section className="detail-section">
                <h4>🛍️ Items Summary</h4>
                <div className="modal-items-list">
                  {selectedOrder.items?.map((item, idx) => (
                    <div key={idx} className="item-row">
                      <span>{item.name || "Product"} <small>(x{item.quantity})</small></span>
                      <span>Rs. {(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
                <div className="modal-total">
                  <div className="total-line">
                    <span>Total Amount:</span>
                    <strong>Rs. {selectedOrder.totalAmount?.toLocaleString()}</strong>
                  </div>
                  <p className="payment-tag">Method: {selectedOrder.paymentMethod}</p>
                </div>
              </section>
            </div>

            <div className="modal-footer no-print">
                <button className="btn-print" onClick={handlePrint}>
                  <Printer size={18} /> Print Invoice
                </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Dashboard Header */}
      <div className="admin-header">
          <div className="header-title">
            <h3><Package size={22} /> Active Orders ({filteredOrders.length})</h3>
          </div>
          
          <div className="header-actions">
            <div className="search-bar">
              <Search size={18} />
              <input 
                type="text" 
                placeholder="Search name or phone..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="refresh-btn" onClick={fetchOrders} disabled={loading}>
              <RefreshCw size={18} className={loading ? "spin" : ""} />
            </button>
          </div>
      </div>

      {/* Orders Table */}
      <div className="table-wrapper card-shadow">
        {loading && orders.length === 0 ? (
          <div className="loader-container">Loading active orders...</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Amount</th>
                <th>Details</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map(order => (
                  <tr key={order._id}>
                    <td data-label="Customer">
                      <div className="customer-cell">
                        <strong>{order.user?.name || "Unknown"}</strong>
                        <span>{order.phone}</span>
                      </div>
                    </td>
                    <td data-label="Amount" className="price-cell">
                      Rs. {order.totalAmount?.toLocaleString()}
                    </td>
                    <td data-label="Details">
                      <button className="view-details-btn" onClick={() => setSelectedOrder(order)}>
                        <Eye size={14}/> View Info
                      </button>
                    </td>
                    <td data-label="Status">
                      <span className={`status-pill pill-${order.orderStatus?.toLowerCase()}`}>
                        {order.orderStatus}
                      </span>
                    </td>
                    <td data-label="Actions">
                      <select 
                        className="status-select"
                        onChange={(e) => updateStatus(order._id, e.target.value)}
                        value={order.orderStatus}
                      >
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped 🚚</option>
                        <option value="Delivered">Delivered ✅</option>
                        <option value="Cancelled">Cancelled ❌</option>
                      </select>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="empty-row">No active orders found matching your search.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default OrderManagement;