import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../Components/Usercontext";
import "./Sign.css";

function Sign() {
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const [first_name, setfirst_name] = useState("");
  const [last_name, setlast_name] = useState("");
  const [email, setemail] = useState("");
  const [username, setusername] = useState("");
  const [password, setpassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  async function submit_handler(e) {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      // 1️⃣ Signup
      const res = await fetch("https://backend-code-production-9f20.up.railway.app//signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name,
          last_name,
          email,
          username,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        return alert(data.message || "Signup failed");
      }

      // 2️⃣ Save JWT token
      localStorage.setItem("token", data.token);

      // 3️⃣ Fetch full user profile
      const profileRes = await fetch("https://backend-code-production-9f20.up.railway.app//profile", {
        headers: { Authorization: `Bearer ${data.token}` },
      });

      const profileData = await profileRes.json();

      if (!profileRes.ok) {
        return alert(profileData.message || "Failed to fetch profile");
      }

      // 4️⃣ Set UserContext
      setUser(profileData);

      // 5️⃣ Navigate to profile
      navigate("/UserProfile");

    } catch (error) {
      console.error(error);
      alert("Server error");
    }
  }

  return (
    <div className="Account_creation">
      <form onSubmit={submit_handler} className="Sign">
        <h1>Register Now</h1>

        <label>First Name</label>
        <input placeholder="First Name" onChange={(e) => setfirst_name(e.target.value)} required />

        <label>Last Name</label>
        <input placeholder="Last Name" onChange={(e) => setlast_name(e.target.value)} required />

        <label>Email</label>
        <input placeholder="Email" onChange={(e) => setemail(e.target.value)} required />

        <label>Username</label>
        <input placeholder="Username" onChange={(e) => setusername(e.target.value)} required />

        <label>Password</label>
        <input type="password" placeholder="Password" onChange={(e) => setpassword(e.target.value)} required />

        <label>Confirm Password</label>
        <input type="password" placeholder="Confirm Password" onChange={(e) => setConfirmPassword(e.target.value)} required />

        <button type="submit">Register</button>
        <button type="button" onClick={() => navigate("/Login")}>Login</button>
      </form>
    </div>
  );
}

export default Sign;
