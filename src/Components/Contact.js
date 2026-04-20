import { useState } from "react";
import "./Contact.css";

function Contact() {
  const [name, setname] = useState("");
  const [number, setnumber] = useState("");
  const [message, setmessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation
    if (!name || !number || !message) {
      alert("Please fill all the fields");
      return;
    }

    // WhatsApp Message Formatting
    // %0A stands for a new line in URL encoding
    const whatsappMessage = `*New Inquiry from Portfolio*%0A%0A` +
      `*Name:* ${name}%0A` +
      `*Phone:* ${number}%0A` +
      `*Message:* ${message}`;

    const whatsappUrl = `https://wa.me/923004244616?text=${whatsappMessage}`;

    // Open WhatsApp in a new tab
    window.open(whatsappUrl, "_blank");

    alert(`Redirecting to WhatsApp...`);
    
    // Clear form fields
    setname("");
    setnumber("");
    setmessage("");
  };

  return (
    <div className="contact">
      {/* Top Section */}
      <div className="top">
        <h1>Let's Work Together</h1>
        <h3>
          Have a project in mind? Let's discuss how I can help bring your ideas
          to life.
        </h3>
      </div>

      <div className="contact-content">
        {/* Left Side - Info */}
        <div className="left">
          <h1>Contact information</h1>
          <label>Email</label>
          <h2>malikafzaalali5@gmail.com</h2>
          <label>Github</label>
          <h2>Muhammad-afzaal881</h2>
          <label>LinkedIn</label>
          <h2>Muhammad Afzaal</h2>

          <div className="social_media">
            <button onClick={() => window.open("https://github.com/Muhammad-afzaal881", "_blank")}>
              <ion-icon name="logo-github"></ion-icon>
            </button>
            <button onClick={() => window.open("https://www.linkedin.com/in/muhammad-afzaal-7981a22a9/", "_blank")}>
              <ion-icon name="logo-linkedin"></ion-icon>
            </button>
            <button onClick={() => window.open("https://www.upwork.com/freelancers/~0172610fdcc4b9e7a4", "_blank")}>
              <ion-icon name="logo-buffer"></ion-icon>
            </button>
          </div>
        </div>

        {/* Right Side - Short Form */}
        <div className="right">
          <form onSubmit={handleSubmit}>
            <h1>Contact Now</h1>
            
            <label>Name</label>
            <input
              type="text"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setname(e.target.value)}
            />

            <label>WhatsApp Number</label>
            <input
              type="number"
              placeholder="e.g. 03001234567"
              value={number}
              onChange={(e) => setnumber(e.target.value)}
            />

            <label>Message</label>
            <textarea
              placeholder="Briefly describe your project or inquiry..."
              value={message}
              onChange={(e) => setmessage(e.target.value)}
            ></textarea>

            <button type="submit">Send to WhatsApp</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Contact;