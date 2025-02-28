import React, { useState } from "react";
import '../components/styles/login.css';  // Reuse the login styles
import templeImage from '../assets/resolution-900.jpg';
import { useNavigate, useLocation } from "react-router-dom";
import Footer from "./Footer";

const ResetPassword = () => {
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();
    const location = useLocation();
    
    // Get email from state passed from ForgotPassword
    const email = location.state?.email;

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setMessage("");

        if (otp.trim() === "" || newPassword.length < 8) {
            setMessage("Invalid input. Ensure OTP is entered and password is at least 8 characters.");
            return;
        }

        try {
            const response = await fetch("http://localhost:3001/reset-password", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, otp, password: newPassword }),
            });

            if (response.ok) {
                setMessage("Password reset successful! Redirecting to login...");
                setTimeout(() => navigate("/login"), 3000);  // Redirect to login after success
            } else {
                setMessage("Invalid OTP. Please try again.");
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
                    <h1 className="login-right-message1">Reset Password</h1>
                    <p className="login-right-message2">Enter the OTP sent to your email and your new password 🔑</p>

                    <form className="login-form" onSubmit={handleResetPassword} noValidate>
                        <label htmlFor="otp">
                            <strong>OTP</strong>
                        </label>
                        <input
                            type="text"
                            id="otp"
                            placeholder="Enter the OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                        />

                        <label htmlFor="newPassword">
                            <strong>New Password</strong>
                        </label>
                        <input
                            type="password"
                            id="newPassword"
                            placeholder="Enter your new password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />

                        {message && <p className="error-message">{message}</p>}

                        <button type="submit" className="login-button">
                            Reset Password
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

export default ResetPassword;