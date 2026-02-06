import React from "react";
import { Link } from "react-router-dom"; // React Router import
import "./Footers.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* About Section */}
        <div className="footer-section">
          <h3>About Us</h3>
          <p>
            We provide quality content and services to help you grow your online
            presence. Stay connected with us for updates and tips.
          </p>
        </div>

        {/* Quick Links */}
        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul className="footer-list">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/Projects">Projects</Link></li>
            <li><Link to="/Skills">Skills</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>

        {/* Social Media */}
        <div className="footer-section">
          <h3>Follow Us</h3>
          <div className="footer-social">
            <a href="/" target="_blank" rel="noopener noreferrer">Github</a> | 
            <a href="/" target="_blank" rel="noopener noreferrer">Linkdln</a> | 
            <a href="/" target="_blank" rel="noopener noreferrer">Upwork</a>
          </div>
        </div>
      </div>

      <div className="footer-copy">
        &copy; 2026 YourCompany. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;
