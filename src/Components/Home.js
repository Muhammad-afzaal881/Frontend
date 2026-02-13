import "./Home.css";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../Components/Usercontext";

function Home() {
  const navigate = useNavigate();
  const { user, loading } = useContext(UserContext);

  if (loading) return null;

  return (
    <div className="home">
      {/* Text Column */}
      <div className="home-content">

        {/* 🔐 AUTH BUTTON LOGIC */}
        {!user ? (
          <button
            className="freelance-btn"
            onClick={() => navigate("/Sign")}
          >
            Sign Up / Login
          </button>
        ) : (
          <button
            className="freelance-btn logged"
            onClick={() => navigate("/UserProfile")}
          >
            Go to Profile
          </button>
        )}

        <h1>
          Hi, I'm <b>Muhammad Afzaal</b>
        </h1>
        <h3>Frontend Developer & UI/UX Designer</h3>
        <h4>
          I help startups and businesses build clean, responsive, and
          <br />
          high-performance frontend interfaces using HTML, CSS, JavaScript,
          <br />
          and React.
        </h4>

        {/* Buttons */}
        <div className="home-btns">
          <button
            className="btn-primary"
            onClick={() => navigate("/projects")}
          >
            View my work
          </button>
          <button
            className="btn-secondary"
            onClick={() => navigate("/contact")}
          >
            Contact Me
          </button>
        </div>

        {/* Social Media */}
        <div className="social_media">
          <button
            onClick={() =>
              window.open("https://github.com/Muhammad-afzaal881", "_blank")
            }
          >
            <ion-icon name="logo-github"></ion-icon>
          </button>

          <button
            onClick={() =>
              window.open(
                "https://www.linkedin.com/in/muhammad-afzaal-7981a22a9/",
                "_blank"
              )
            }
          >
            <ion-icon name="logo-linkedin"></ion-icon>
          </button>

          <button
            onClick={() =>
              window.open(
                "https://www.upwork.com/freelancers/~0172610fdcc4b9e7a4",
                "_blank"
              )
            }
          >
            <ion-icon name="logo-buffer"></ion-icon>
          </button>
        </div>
      </div>

      {/* Image */}
      <div className="Image">
        <img
          src={"/myphoto.jpg"}
          alt="Afzaal"
        />
      </div>
    </div>
  );
}

export default Home;
