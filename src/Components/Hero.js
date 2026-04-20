import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="hero">
      <div className="hero-wrapper">

        <div className="hero-left">
          <span className="hero-badge">🔥 Big Sale Live</span>

          <h1>
            Discover Premium <br />
            <span>Products Online</span>
          </h1>

          <p>
            Shop the latest fashion, electronics, and trending products 
            at unbeatable prices. Limited time offers available now.
          </p>

          <div className="hero-buttons">
            <Link to="/category/Clothes" className="btn-primary">
              Shop Now →
            </Link>
            <Link to="/category/Clothes" className="btn-outline">
              Browse Categories
            </Link>
          </div>

          <div className="hero-stats">
            <div>
              <h3>50K+</h3>
              <span>Happy Customers</span>
            </div>
            <div>
              <h3>1K+</h3>
              <span>Products</span>
            </div>
            <div>
              <h3>4.9★</h3>
              <span>Top Rating</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default HeroSection;