import React, { useState } from "react";
import "./styles/newsletter.css";

const Newsletter = () => {
  const currDate = new Date();
  const [email, setEmail] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState({ emailId: "", date: currDate });

  const handleSubscribe = async () => {
    if (email) {
      try {
        const updatedFormData = { ...formData, emailId: email };
        const response = await fetch("http://localhost:3001/subscribe-newsletter", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedFormData),
        });

        if (response.ok) {
          setSuccessMessage("Thank you for subscribing to our newsletter!");
          setErrorMessage("");
          setEmail("");
        } else {
          setErrorMessage("Subscription failed. Please try again.");
          setSuccessMessage("");
        }
      } catch (error) {
        console.error("Error subscribing to newsletter:", error);
        setErrorMessage("Something went wrong. Please try again later.");
        setSuccessMessage("");
      }

      setTimeout(() => {
        setSuccessMessage("");
        setErrorMessage("");
      }, 5000);

    } else {
      setErrorMessage("Please enter a valid email address.");
      setTimeout(() => setErrorMessage(""), 5000);
    }
  };

  return (
    <div className="newsletter-section">
      <h3>Subscribe to our Newsletter</h3>
      <p>Stay updated with the latest announcements and temple events!</p>
      <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
        <input
          type="email"
          placeholder="Enter your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="newsletter-input"
          required
        />
        <button
          type="submit"
          onClick={handleSubscribe}
          className="newsletter-button"
        >
          Subscribe
        </button>
      </form>
      {successMessage && <p className="success-message">{successMessage}</p>}
      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </div>
  );
};

export default Newsletter;
