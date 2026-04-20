import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Mail, Lock, Eye, EyeOff, Loader2, LogIn } from 'lucide-react'; 
import './Auth.css';

// ✅ Updated to correct Backend URL
const API_BASE = 'https://zust-mu.vercel.app';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // ✅ Corrected Endpoint: Backend use kar raha hai "/api/login" 
      // Pehle ye "/api/auth/login" ho gaya tha jiski wajah se 404 aa raha tha.
      const response = await axios.post(`${API_BASE}/api/login`, {
        email,
        password
      });

      console.log("✅ Login Success:", response.data);

      // 1. Context update
      login(response.data); 

      // 2. Role-based redirection
      if (response.data.user && response.data.user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/profile');
      }

    } catch (err) {
      console.error("Login Error Details:", err.response?.data || err.message);
      const msg = err.response?.data?.message || "Email ya password durust nahi hai.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-container">
        <div className="auth-card animate-in">
          {error && (
            <div className="error-banner-top">
              <span>⚠️ {error}</span>
            </div>
          )}

          <div className="auth-header">
            <div className="auth-icon-circle">
              <LogIn size={32} color="#4f46e5" />
            </div>
            <h2>Welcome Back</h2>
            <p>Please enter your details to sign in</p>
          </div>

          <form onSubmit={handleLogin} className="auth-form">
            <div className="input-group">
              <div className="input-wrapper">
                <Mail className="input-icon-fixed" size={20} />
                <input 
                  type="email" 
                  placeholder="Email Address" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                  className="input-field"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="input-group">
              <div className="input-wrapper">
                <Lock className="input-icon-fixed" size={20} />
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                  className="input-field"
                  disabled={loading}
                />
                <button 
                  type="button" 
                  className="toggle-password-fixed"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="forgot-pass-link">
              <Link to="/Forget">Forgot Password?</Link>
            </div>

            <button type="submit" className="auth-submit-btn" disabled={loading}>
              {loading ? <Loader2 className="spinner" size={20} /> : "Sign In"}
            </button>
          </form>

          <div className="auth-divider">
            <span>OR</span>
          </div>

          <p className="auth-footer">
            Don't have an account? <Link to="/register" className="link">Create one now</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;