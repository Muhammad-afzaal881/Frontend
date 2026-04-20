import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, UserCheck, UserMinus, Shield, Mail, Calendar } from 'lucide-react';
import './UserManagement.css';

// ✅ Updated to New Vercel Backend
const API_BASE_URL = 'https://zust-mu.vercel.app';

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_BASE_URL}/api/admin/users`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const sortedUsers = Array.isArray(res.data) 
          ? res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) 
          : [];
        setUsers(sortedUsers);
      } catch (err) {
        console.error("Users fetch error:", err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [token]);

  const filteredUsers = users.filter(user => 
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-section animate-in">
      <div className="admin-header-flex">
        <div className="header-left">
          <h3><Shield size={22} /> Registered Customers</h3>
          <p>Manage your store's user base and verification status.</p>
        </div>
        
        <div className="user-search-wrapper">
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search by name or email..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="table-wrapper card-shadow">
        <table className="admin-table">
          <thead>
            <tr>
              <th>User Details</th>
              <th>Role</th>
              <th>Status</th>
              <th>Joined Date</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="4" className="text-center">Loading users...</td></tr>
            ) : filteredUsers.length > 0 ? (
              filteredUsers.map(user => (
                <tr key={user._id}>
                  {/* ✅ Added data-label for Mobile CSS */}
                  <td data-label="User Details" className="user-info-cell">
                    <div className="user-avatar-mini">
                      <img 
                        src={`https://ui-avatars.com/api/?name=${user.name}&background=random&color=fff`} 
                        alt="avatar" 
                      />
                    </div>
                    <div className="user-text">
                      <strong>{user.name}</strong>
                      <span><Mail size={12} /> {user.email}</span>
                    </div>
                  </td>
                  <td data-label="Role">
                    <span className={`role-pill pill-${user.role}`}>
                      {user.role === 'admin' ? '🛡️ Admin' : '👤 Customer'}
                    </span>
                  </td>
                  <td data-label="Status">
                    <span className={`status-tag ${user.isVerified ? "verified" : "pending"}`}>
                      {user.isVerified ? <UserCheck size={14} /> : <UserMinus size={14} />}
                      {user.isVerified ? "Verified" : "Unverified"}
                    </span>
                  </td>
                  <td data-label="Joined Date">
                    <span className="join-date">
                      <Calendar size={12} /> {new Date(user.createdAt).toLocaleDateString('en-GB')}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="4" className="empty-msg">No customers found matching "{searchTerm}"</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UserManagement;