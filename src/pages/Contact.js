import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import "./Contact.css";

// ✅ Updated to New Backend URL
const API_BASE = 'https://zust-mu.vercel.app';

function Contact() {
  const { token, user } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    orderId: "",
    complaintType: "",
    message: "",
  });

  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // ✅ Auto-fill user details if logged in
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.complaintType || !formData.message) {
      alert("Please fill all required fields");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/complaints`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, 
        },
        body: JSON.stringify({
          ...formData,
          userId: user?._id, 
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setSuccess(true);
        // Message reset but keep user info
        setFormData((prev) => ({
          ...prev,
          orderId: "",
          complaintType: "",
          message: "",
        }));
        setTimeout(() => setSuccess(false), 3000);
      } else {
        alert(result.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Complaint Submission Error:", error);
      alert("Failed to submit complaint. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-container">
      <div className="contact-card animate-in">
        <h2>Contact & Complaint Form</h2>
        <p className="contact-subtext">Aapki pareshani hamara masla hai. Hamein batayein!</p>

        {success && (
          <div className="success-message">
            ✅ Your complaint has been submitted successfully!
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="text"
              name="name"
              placeholder="Full Name *"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Email Address *"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <input
            type="text"
            name="orderId"
            placeholder="Order Number (Optional)"
            value={formData.orderId}
            onChange={handleChange}
          />

          <select
            name="complaintType"
            value={formData.complaintType}
            onChange={handleChange}
            required
          >
            <option value="">Select Complaint Type *</option>
            <option value="Late Delivery">Late Delivery</option>
            <option value="Wrong Product">Wrong Product</option>
            <option value="Damaged Product">Damaged Product</option>
            <option value="Refund Issue">Refund Issue</option>
            <option value="Other">Other</option>
          </select>

          <textarea
            name="message"
            placeholder="Write your complaint here... *"
            rows="5"
            value={formData.message}
            onChange={handleChange}
            required
          ></textarea>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Submitting..." : "Submit Complaint"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Contact;