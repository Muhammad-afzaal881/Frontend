import { useContext, useEffect, useState } from "react";
import { UserContext } from "../Components/Usercontext";
import "./UserProfile.css";
import {useNavigate } from "react-router-dom";
function UserProfile() {
  const { user, setUser } = useContext(UserContext);
  const [loading, setLoading] = useState(true);
const navigate = useNavigate();
  const { logout } = useContext(UserContext);
  function handleLogout() {
    logout();
    navigate("/Login"); // user ko login page pe redirect karo
  }

  useEffect(() => {
    async function fetchProfile() {
      const token = localStorage.getItem("token");
      if (token && !user) {
        const res = await fetch("https://backend-code-production-9f20.up.railway.app/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) setUser(data);
      }
      setLoading(false);
    }
    fetchProfile();
  }, [user, setUser]);

  if (loading) return <h2>Loading...</h2>;
  if (!user) return null

  return (
    <div className="Profile_creation">
      <div className="card">
        <img
          className="avatar"
          src={
            user.avatar ||
            `https://images.unsplash.com/photo-1750535135677-ed85c46d8201?w=500&
            auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx
            8cGVyc29uJTIwYXZhdGFyJTIwY2FydG9vbnxlbnwwfHwwfHx8MA%3D%3D`
          }
          alt="User Avatar"
        />
        <h1>
          {user.first_name} {user.last_name}
        </h1>
        <p>@{user.username}</p>
        <p>{user.email}</p>

        <div className="social">
          <button onClick={() => window.open("https://github.com", "_blank")}>
            <ion-icon name="logo-github"></ion-icon>
          </button>

          <button onClick={() => window.open("https://linkedin.com", "_blank")}>
            <ion-icon name="logo-linkedin"></ion-icon>
          </button>

          <button onClick={() => window.open("https://twitter.com", "_blank")}>
            <ion-icon name="logo-twitter"></ion-icon>
          </button>
          <button onClick={handleLogout} className="logout-btn">
            <ion-icon name="log-in-outline"></ion-icon>
          </button>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
