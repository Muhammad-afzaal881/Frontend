import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2'; 
import { Eye, EyeOff, User, Mail, Lock, Loader2, KeyRound } from 'lucide-react'; 
import './Auth.css';

// ✅ Updated to New Backend URL
const API_BASE = 'https://zust-mu.vercel.app';

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const showToast = (message, icon = 'success') => {
    Swal.fire({
      toast: true,
      position: 'top-end', 
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      icon: icon,
      title: message
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  // --- Step 1: Register (Sends OTP) ---
  const handleRegister = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return setError("Passwords match nahi kar rahe!");
    }
    if (formData.password.length < 6) {
      return setError("Password kam az kam 6 characters ki honi chahiye.");
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE}/api/auth/register`, {
        name: formData.name,
        email: formData.email,
        password: formData.password
      });

      if (response.data.success) {
        setIsOtpSent(true);
        showToast("Verification code aapki email par bhej diya gaya hai! 📧");
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || "Registration fail ho gayi.";
      setError(errMsg);
      showToast(errMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  // --- Step 2: Verify OTP ---
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (otp.length < 6) return setError("Poora 6-digit code enter karein.");

    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE}/api/auth/verify-otp`, {
        email: formData.email,
        otp: otp
      });

      if (response.data.success) {
        showToast("Account verify ho gaya! 🎉"); 
        setTimeout(() => {
          navigate('/login');
        }, 1500);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid or expired OTP!");
      showToast("OTP code ghalat hai!", 'error');
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
            <h2>{isOtpSent ? "Verify Email" : "Create Account"}</h2>
            <p>
              {isOtpSent 
                ? `Enter the 6-digit code sent to ${formData.email}` 
                : "Zust Store ka hissa banein aur shopping shuru karein!"}
            </p>
          </div>

          {!isOtpSent ? (
            <form onSubmit={handleRegister} className="auth-form">
              <div className="input-group">
                <div className="input-wrapper">
                  <User className="input-icon-fixed" size={20} />
                  <input name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required className="input-field" disabled={loading} />
                </div>
              </div>

              <div className="input-group">
                <div className="input-wrapper">
                  <Mail className="input-icon-fixed" size={20} />
                  <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} required className="input-field" disabled={loading} />
                </div>
              </div>

              <div className="input-group">
                <div className="input-wrapper">
                  <Lock className="input-icon-fixed" size={20} />
                  <input type={showPassword ? "text" : "password"} name="password" placeholder="Password (Min 6 chars)" value={formData.password} onChange={handleChange} required className="input-field" disabled={loading} />
                  <button type="button" className="toggle-password-fixed" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className="input-group">
                <div className="input-wrapper">
                  <Lock className="input-icon-fixed" size={20} />
                  <input type={showPassword ? "text" : "password"} name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} required className="input-field" disabled={loading} />
                </div>
              </div>

              <button type="submit" className="auth-submit-btn" disabled={loading}>
                {loading ? <Loader2 className="spinner" size={20} /> : "Get Verification Code"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOTP} className="auth-form">
              <div className="input-group">
                <div className="input-wrapper">
                  <KeyRound className="input-icon-fixed" size={20} />
                  <input 
                    type="text" 
                    placeholder="Enter 6-digit OTP" 
                    maxLength="6"
                    value={otp} 
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))} 
                    required 
                    className="input-field otp-input"
                    disabled={loading}
                  />
                </div>
              </div>

              <button type="submit" className="auth-submit-btn" disabled={loading}>
                {loading ? <Loader2 className="spinner" size={20} /> : "Verify & Register"}
              </button>
              
              <button type="button" className="link-btn" onClick={() => setIsOtpSent(false)} disabled={loading}>
                Email galat hai? <span className="link-bold">Wapis jayein</span>
              </button>
            </form>
          )}

          <div className="auth-divider"><span>OR</span></div>
          <p className="auth-footer">
            Pehle se account hai? <Link to="/login" className="link">Login karein</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;