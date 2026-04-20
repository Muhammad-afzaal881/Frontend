import { useContext, useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Swal from "sweetalert2";
import "./Profile.css";

// Backend Base URL
const API_BASE = 'https://zust-mu.vercel.app'; 

function Profile() {
  const { user, logout, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    profilePic: "",
    name: "",
    email: "",
    phone: "",
    address: "",
    loading: false,
    saveLoading: false,
  });

  // ✅ 1. Get Data from Backend (On Mount)
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_BASE}/api/profile/get`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        const data = await res.json();
        
        if (data.success && data.profile) {
          setProfileData({
            profilePic: data.profile.profilePic || "",
            name: data.profile.name || user?.name || "",
            email: user?.email || "",
            phone: data.profile.phone || "",
            address: data.profile.address || "",
            loading: false,
            saveLoading: false,
          });
        }
      } catch (err) {
        console.error("Profile fetching error:", err);
      }
    };
    if (user) fetchProfile();
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ 2. Update Profile Text Data (PUT Request)
  const handleSave = async () => {
    if (!profileData.name.trim()) {
      return Swal.fire({ icon: "warning", title: "Required", text: "Name is mandatory!" });
    }

    setProfileData((prev) => ({ ...prev, saveLoading: true }));
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE}/api/profile/update-data`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          name: profileData.name,
          phone: profileData.phone,
          address: profileData.address,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setIsEditing(false);
        Swal.fire({ icon: "success", title: "Updated!", text: "Profile details save ho gayi hain.", timer: 2000 });
      }
    } catch (error) {
      Swal.fire({ icon: "error", title: "Error", text: "Update fail ho gaya." });
    } finally {
      setProfileData((prev) => ({ ...prev, saveLoading: false }));
    }
  };

  // ✅ 3. Update Profile Picture (POST Request with Multer FormData)
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Frontend validation
    if (file.size > 5 * 1024 * 1024) {
      return Swal.fire({ icon: "error", title: "File too big", text: "5MB se kam ki image select karein." });
    }

    const formData = new FormData();
    formData.append("profilePic", file); // Backend par 'profilePic' field expect ho rahi hai

    setProfileData((prev) => ({ ...prev, loading: true }));

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE}/api/profile/update-pic`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
          // Note: FormData ke saath Content-Type header khud set hota hai
        },
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        // Backend relative path bhej raha hai (e.g., /uploads/profiles/...)
        setProfileData((prev) => ({ ...prev, profilePic: data.profilePic }));
        Swal.fire({ icon: "success", title: "DP Updated!", toast: true, position: "top-end", timer: 3000 });
      }
    } catch (error) {
      Swal.fire({ icon: "error", title: "Upload Failed", text: "Image server tak nahi pohnchi." });
    } finally {
      setProfileData((prev) => ({ ...prev, loading: false }));
    }
  };

  const handleLogoutClick = () => {
    Swal.fire({
      title: "Logout?",
      text: "Waqai logout karna chahte hain?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
        navigate("/login");
      }
    });
  };

  if (!user) return null;

  // Image URL Helper: Agar path relative hai to API_BASE add karein
  const getImageUrl = (path) => {
    if (!path) return `https://ui-avatars.com/api/?name=${profileData.name || "User"}&background=random`;
    if (path.startsWith('http')) return path;
    return `${API_BASE}${path}`;
  };

  return (
    <div className="buyer-profile-wrapper">
      <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleFileChange} />
      
      <div className="buyer-profile-card">
        <div className="card-header-visual">
          <span className="buyer-status">{user?.role === "admin" ? "⚡ ADMIN" : "🛒 BUYER"}</span>
          <button 
            className="edit-profile-btn" 
            onClick={isEditing ? handleSave : () => setIsEditing(true)}
            disabled={profileData.saveLoading}
          >
            {profileData.saveLoading ? "Saving..." : isEditing ? "💾 Save" : "✏️ Edit Profile"}
          </button>
        </div>

        <div className="profile-avatar-section">
          <div className={`avatar-container ${isEditing ? "editable" : ""}`} onClick={() => isEditing && fileInputRef.current?.click()}>
            <img 
              src={getImageUrl(profileData.profilePic)} 
              alt="Profile" 
              className={profileData.loading ? "blur" : ""} 
            />
            {isEditing && <div className="avatar-overlay"><span>📸 Change</span></div>}
            {profileData.loading && <div className="spinner-overlay"><div className="spinner"></div></div>}
          </div>
          <h2 className="display-name">{profileData.name}</h2>
        </div>

        <div className="user-info-section">
          <div className="info-grid">
            <div className="input-group">
              <label>Full Name</label>
              {isEditing ? <input name="name" value={profileData.name} onChange={handleInputChange} className="active-input" /> : <p className="static-text">{profileData.name}</p>}
            </div>
            <div className="input-group">
              <label>Email Address</label>
              <p className="static-text muted">{profileData.email}</p>
            </div>
            <div className="input-group">
              <label>Phone Number</label>
              {isEditing ? <input name="phone" value={profileData.phone} onChange={handleInputChange} className="active-input" /> : <p className="static-text">{profileData.phone || "N/A"}</p>}
            </div>
            <div className="input-group full-width">
              <label>Shipping Address</label>
              {isEditing ? <textarea name="address" value={profileData.address} onChange={handleInputChange} className="active-input" /> : <p className="static-text">{profileData.address || "No address"}</p>}
            </div>
          </div>
        </div>

        <div className="profile-actions">
          <button className="logout-btn" onClick={handleLogoutClick}>Logout</button>
        </div>
      </div>
    </div>
  );
}

export default Profile;