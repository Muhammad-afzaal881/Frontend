import { useState } from "react";
import "./Contact.css";

function Contact() {
  const [name, setname] = useState("");
  const [email, setemail] = useState("");
  const [number, setnumber] = useState("");
  const [message, setmessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !message || !number) {
      alert("Please fill all the fields");
      return;
    }

    const data = {
      name,
      email,
      message,
      number,
    };
     alert(`Thank You
    Your Subbmission SucessFully Sent`)
     console.log(data)
  };

  return (
    <div className="contact">
      {/* Top Section */}
      <div className="top">
        <h1>Let's Work Together</h1>
        <h3>
          Have a project in mind? Let's discuss how I can help bring your ideas
          to life
        </h3>
      </div>

      {/* Left & Right */}
      <div className="contact-content">
        {/* Left Side */}
        <div className="left">
          <h1>Contact information</h1>
          <label>Email</label>
          <h2>malikafzaalali5@gmail.com</h2>
          <label>Github</label>
          <h2>Muhammad-afzaal881</h2>
          <label>LinkedIn</label>
          <h2>Muhammad Afzaal</h2>

          {/* Social Media Buttons */}
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

        {/* Right Side - Contact Form */}
        <div className="right">
          <form onSubmit={handleSubmit}>
            <h1>Contact Now</h1>
            <label>Name</label>
            <input
              type="text"
              placeholder="Enter Name"
              value={name}
              onChange={(e) => setname(e.target.value)}
            />
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setemail(e.target.value)}
            />
            <label>Number</label>
            <input
              type="number"
              placeholder="Enter Number"
              value={number}
              onChange={(e) => setnumber(e.target.value)}
            />
            <label>Message</label>
            <textarea
              placeholder="Tell me about your project"
              value={message}
              onChange={(e) => setmessage(e.target.value)}
            ></textarea>
            <button type="submit">Send Message</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Contact;
