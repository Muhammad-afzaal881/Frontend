import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../Components/Usercontext";
import "./Login.css";

function Login() {
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function loginHandler(e) {
    e.preventDefault();

    try {
      // 1️⃣ Login request
      const res = await fetch("https://backend-code-production-9f20.up.railway.app/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) return alert(data.message || "Login failed");

      // 2️⃣ Save JWT token
      localStorage.setItem("token", data.token);

      // 3️⃣ Fetch profile
      const profileRes = await fetch("https://backend-code-production-9f20.up.railway.app/profile", {
        headers: { Authorization: `Bearer ${data.token}` },
      });

      const profileData = await profileRes.json();
      if (!profileRes.ok) return alert(profileData.message || "Failed to fetch profile");

      // 4️⃣ Set UserContext
      setUser(profileData);

      // 5️⃣ Navigate
      navigate("/UserProfile");
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  }

  return (
    <div className="Account_creation">
      <form onSubmit={loginHandler} className="Login">
        <h1>Login</h1>

        <label>Email</label>
        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label>Password</label>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Login</button>
        <button type="button" onClick={() => navigate("/Sign")}>Register</button>
      </form>
    </div>
  );
}

export default Login;
