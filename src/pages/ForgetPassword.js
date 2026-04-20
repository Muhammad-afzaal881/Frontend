import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Mail, KeyRound, Lock, Loader2 } from "lucide-react";
import "./ForgetPassword.css";

// ✅ Updated to New Backend URL
const API_BASE = 'https://zust-mu.vercel.app';

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // 1=email, 2=otp, 3=new password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  // STEP 1: Send OTP
  const handleSendOTP = async (e) => {
    e.preventDefault();
    setLoading(true); setError(""); setSuccess("");

    try {
      const response = await axios.post(`${API_BASE}/api/auth/forgot-password`, { email });
      if (response.data.success) {
        setSuccess("OTP sent to your email! Please check your inbox.");
        setStep(2);
      }
    } catch (err) {
      setError(err.response?.data?.message || "User not found or Server error.");
    } finally {
      setLoading(false);
    }
  };

  // STEP 2: Verify OTP
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) return setError("Please enter a valid 6-digit OTP.");
    
    setLoading(true); setError(""); setSuccess("");

    try {
      const response = await axios.post(`${API_BASE}/api/auth/verify-forgot-otp`, { email, otp });
      if (response.data.success) {
        setSuccess("OTP verified! Now set your new password.");
        setStep(3);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid or expired OTP");
    } finally {
      setLoading(false);
    }
  };

  // STEP 3: Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true); setError(""); setSuccess("");

    try {
      const response = await axios.post(`${API_BASE}/api/auth/reset-password`, {
        email,
        newPassword
      });
      if (response.data.success) {
        setSuccess("Password reset successful! Redirecting to login...");
        setTimeout(() => navigate("/login"), 2000);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-wrapper">
      <div className="forgot-container">
        <div className="forgot-card animate-in">

          {error && <div className="error-banner-top">⚠️ {error}</div>}
          {success && <div className="success-banner-top">✅ {success}</div>}

          <div className="forgot-header">
            <h2>
              {step === 1 && "Forgot Password"}
              {step === 2 && "Verify OTP"}
              {step === 3 && "Set New Password"}
            </h2>
            <p>
              {step === 1 && "Enter your email to receive a recovery OTP."}
              {step === 2 && `Enter the code sent to ${email}`}
              {step === 3 && "Create a new strong password for your account."}
            </p>
          </div>

          {/* STEP 1: Email */}
          {step === 1 && (
            <form onSubmit={handleSendOTP} className="forgot-form">
              <div className="input-wrapper">
                <Mail size={20} className="input-icon-fixed" />
                <input
                  type="email"
                  placeholder="Email Address"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field"
                  disabled={loading}
                />
              </div>
              <button className="forgot-submit-btn" disabled={loading}>
                {loading ? <Loader2 className="spinner" /> : "Send OTP"}
              </button>
            </form>
          )}

          {/* STEP 2: OTP */}
          {step === 2 && (
            <form onSubmit={handleVerifyOTP} className="forgot-form">
              <div className="input-wrapper">
                <KeyRound size={20} className="input-icon-fixed" />
                <input
                  type="text"
                  placeholder="6 Digit OTP"
                  maxLength="6"
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))} // Only numbers
                  className="input-field"
                  disabled={loading}
                />
              </div>
              <button className="forgot-submit-btn" disabled={loading}>
                {loading ? <Loader2 className="spinner" /> : "Verify OTP"}
              </button>
              <button type="button" className="link-btn" onClick={() => setStep(1)} disabled={loading}>
                Entered wrong email? <span className="link-bold">Go Back</span>
              </button>
            </form>
          )}

          {/* STEP 3: New Password */}
          {step === 3 && (
            <form onSubmit={handleResetPassword} className="forgot-form">
              <div className="input-wrapper">
                <Lock size={20} className="input-icon-fixed" />
                <input
                  type="password"
                  placeholder="New Password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="input-field"
                  disabled={loading}
                />
              </div>
              <button className="forgot-submit-btn" disabled={loading}>
                {loading ? <Loader2 className="spinner" /> : "Set New Password"}
              </button>
            </form>
          )}

          <div className="back-login-wrapper">
            <Link to="/login" className="back-login">
              ← Back to Login
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;