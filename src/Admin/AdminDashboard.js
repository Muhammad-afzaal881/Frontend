import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Users, Package, Truck, Activity, LayoutDashboard, MessageCircle, BarChart3 } from "lucide-react";
import './AdminDashboard.css';

import UserManagement from "./UserManagement";
import ProductManagement from "./ProductManagement";
import OrderManagement from "./OrderManagement";
import ComplaintManagement from "./Compalin";

// ✅ Naya Backend Link Updated
const API_BASE = 'https://zust-mu.vercel.app';

function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalSales: 0,
    totalComplaints: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    if (!user || user.role !== "admin" || !token) {
      navigate('/login');
      return;
    }

    const fetchStats = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get(`${API_BASE}/api/admin/stats`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats(res.data);
      } catch (err) {
        console.error("Dashboard Stats Error:", err.response?.data?.message || err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [navigate]);

  // Card Data... (No changes needed here)
  const cardData = [
    { id: 'users', label: "Total Customers", value: stats.totalUsers || 0, icon: <Users />, color: "#4f46e5" },
    { id: 'products', label: "Active Products", value: stats.totalProducts || 0, icon: <Package />, color: "#f59e0b" },
    { id: 'orders', label: "COD Orders", value: stats.totalOrders || 0, icon: <Truck />, color: "#10b981" },
    { id: 'complaints', label: "Complaints", value: stats.totalComplaints || 0, icon: <MessageCircle />, color: "#ef4444" },
    { id: 'revenue', label: "Total Revenue", value: `Rs. ${(stats.totalSales || 0).toLocaleString()}`, icon: <Activity />, color: "#8b5cf6" }
  ];

  return (
    <div className="admin-layout">
      <main className="main-content">
        <header className="dashboard-header">
          <div className="header-title">
            <BarChart3 size={28} color="#4f46e5" />
            <h1>Admin Control Panel</h1>
          </div>
          {activeTab !== 'overview' && (
            <button className="back-btn" onClick={() => setActiveTab('overview')}>
              <LayoutDashboard size={18} /> Back to Overview
            </button>
          )}
        </header>

        <div className="stats-grid">
          {cardData.map((card) => (
            <div
              key={card.id}
              className={`stat-card ${activeTab === card.id ? 'active-card' : ''}`}
              onClick={() => setActiveTab(card.id)}
              style={{ borderTop: `4px solid ${card.color}` }}
            >
              <div className="card-icon" style={{ backgroundColor: `${card.color}15`, color: card.color }}>
                {card.icon}
              </div>
              <div className="card-info">
                <p>{card.label}</p>
                <h3>{isLoading ? "..." : card.value}</h3>
              </div>
            </div>
          ))}
        </div>

        <div className="admin-content-area animate-in">
          {activeTab === 'overview' && (
            <div className="welcome-box">
              <div className="welcome-text">
                <h2>Khush Amdeed, Admin! 👋</h2>
                <p>ZustStore ki performance aaj bohot achi hai. Aap filhal <strong>{stats.totalOrders}</strong> COD orders aur <strong>{stats.totalComplaints}</strong> pending complaints manage kar rahe hain.</p>
              </div>
              <div className="quick-action-btns">
                 <button onClick={() => setActiveTab('products')}>+ Add New Product</button>
                 <button onClick={() => setActiveTab('orders')}>View Recent Orders</button>
              </div>
            </div>
          )}

          {activeTab === 'users' && <UserManagement />}
          {activeTab === 'products' && <ProductManagement />}
          {activeTab === 'orders' && <OrderManagement />}
          {activeTab === 'complaints' && <ComplaintManagement />}
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;