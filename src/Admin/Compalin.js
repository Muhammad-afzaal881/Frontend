import React, { useEffect, useState } from "react";
import axios from "axios";
import { CheckCircle, Clock, Mail, Hash, AlertCircle, Calendar } from "lucide-react";
import "./complain.css";

// ✅ Updated API Base to new Vercel Link
const API_BASE = 'https://zust-mu.vercel.app';

function ComplaintManagement() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_BASE}/api/complaints`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      const sortedData = Array.isArray(res.data) 
        ? res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) 
        : [];
      setComplaints(sortedData);
    } catch (err) {
      console.error("Error fetching complaints:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const updateStatus = async (id, newStatus) => {
    const previousComplaints = [...complaints];
    setComplaints(complaints.map(c => c._id === id ? { ...c, status: newStatus } : c));

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${API_BASE}/api/complaints/${id}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error("Error updating status:", err.message);
      setComplaints(previousComplaints); 
      alert("Status update fail ho gaya. Dubara koshish karein.");
    }
  };

  if (loading) {
    return (
      <div className="complaint-management-loading">
        <div className="loader-spinner"></div>
        <p>Complaints load ho rahi hain...</p>
      </div>
    );
  }

  return (
    <div className="complaint-management animate-in">
      <div className="admin-section-header">
        <h2>Customer Support Center ({complaints.length})</h2>
        <p>Manage and resolve customer issues efficiently.</p>
      </div>

      {complaints.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <h3>Sab set hai!</h3>
          <p>Filhal koi nayi complaint nahi mili.</p>
        </div>
      ) : (
        <div className="complaints-grid">
          {complaints.map((item) => (
            <div
              key={item._id}
              className={`complaint-item card-shadow ${item.status === "Resolved" ? "resolved-border" : "pending-border"}`}
            >
              <div className="complaint-header">
                <div className="user-info-main">
                  <h4>{item.name}</h4>
                  <span className="complaint-date">
                    <Calendar size={12} /> {new Date(item.createdAt).toLocaleDateString('en-GB')}
                  </span>
                </div>
                <span className={`status-pill ${item.status.toLowerCase()}`}>
                  {item.status === "Resolved" ? <CheckCircle size={14} /> : <Clock size={14} />}
                  {item.status}
                </span>
              </div>

              <div className="complaint-details">
                <div className="detail-row">
                  <Mail size={14} /> <span>{item.email}</span>
                </div>
                <div className="detail-row">
                  <Hash size={14} /> <span>Order: #{item.orderId || "N/A"}</span>
                </div>
                <div className="detail-row">
                  <AlertCircle size={14} /> <span className="type-text">{item.complaintType}</span>
                </div>
                
                <div className="message-container">
                  <p className="label">Message:</p>
                  <div className="message-box">{item.message}</div>
                </div>
              </div>

              <div className="action-buttons">
                {item.status !== "Resolved" ? (
                  <button 
                    className="btn-resolve"
                    onClick={() => updateStatus(item._id, "Resolved")}
                  >
                    Mark as Resolved
                  </button>
                ) : (
                  <button 
                    className="btn-reopen"
                    onClick={() => updateStatus(item._id, "Pending")}
                  >
                    Re-open Ticket
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ComplaintManagement;