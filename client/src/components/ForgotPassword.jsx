import React, { useState } from "react";
import '../components/styles/login.css';  // Reuse the login styles
import templeImage from '../assets/resolution-900.jpg';
import { useNavigate } from "react-router-dom";
import Footer from "./Footer";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleSendOTP = async (e) => {
        e.preventDefault();
        setMessage("");
    
        if (!email.includes("@")) {
            setMessage("Enter a valid email address");
            return;
        }
    
        try {
            const response = await fetch("http://localhost:3001/send-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });
    
            if (response.ok) {
                setMessage("OTP sent to your email. Please check your inbox.");
                setTimeout(() => navigate("/reset-password", { state: { email } }), 3000);  // Pass email to reset page
            } else {
                setMessage("Email not found. Please enter a registered email.");
            }
        } catch (error) {
            setMessage("Server error. Try again later.");
        }
    };    

    return (
        <div className="login-page">
            <div className="login-content">
                <div className="login-left">
                    <img src={templeImage} alt="Temple" className="login-image" />
                </div>

                <div className="login-right">
                    <h1 className="login-right-message1">Forgot Password</h1>
                    <p className="login-right-message2">Enter your email to receive a reset link 📧</p>

                    <form className="login-form" onSubmit={handleSendOTP} noValidate>
                        <label htmlFor="email">
                            <strong>Email</strong>
                        </label>
                        <input
                            type="email"
                            id="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        {message && <p className="error-message">{message}</p>}

                        <button type="submit" className="login-button">
                            Send OTP
                        </button>
                    </form>

                    <p className="signup-link">
                        <a href="/login">Back to Login</a>
                    </p>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default ForgotPassword;