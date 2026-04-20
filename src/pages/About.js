import React from 'react';
import { Link } from 'react-router-dom'; // ✅ Link import kiya
import './About.css';

function About() {
  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="hero-content">
          <h1>Humari Kahani</h1>
          <p>Behtareen products, har dil ki pounch mein.</p>
          {/* ✅ href ki jagah 'to' use kiya */}
          <Link to="/" className="cta-button">Shop Now</Link>
        </div>
      </section>

      {/* Info Section */}
      <section className="about-content">
        <div className="about-grid">
          <div className="about-text">
            <h2>Hum Kaun Hain?</h2>
            <p>
              Humne 2024 mein aik chote se khuwab se shuruat ki thi. Humara maqsad 
              Pakistan mein online shopping ko asaan aur sasta banana hai. Hum 
              quality par kabhi samjhota nahi karte.
            </p>
            <p>
              Aaj hum hazaron products apne customers tak pouncha rahe hain, aur ye 
              sab aapke bharose ki wajah se mumkin hua hai.
            </p>
            {/* ✅ Link component use kiya */}
            <Link to="/contact" className="learn-more">Humse milein →</Link>
          </div>
          <div className="about-image">
            <div className="image-placeholder">
              <img src="https://plus.unsplash.com/premium_photo-1664201890375-f8fa405cdb7d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZSUyMGNvbW1lcmNlfGVufDB8fDB8fHww" alt="Humari Team" />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="about-stats">
        <div className="stats-container">
          <div className="stat-card">
            <h3>10K+</h3>
            <p>Happy Customers</p>
          </div>
          <div className="stat-card">
            <h3>500+</h3>
            <p>Products</p>
          </div>
          <div className="stat-card">
            <h3>24/7</h3>
            <p>Support</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;