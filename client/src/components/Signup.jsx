import React, { useState, useEffect } from "react";
import "../components/styles/signup.css";
import templeImage from "../assets/resolution-900.jpg";
import { useNavigate } from "react-router-dom";
import Navbar from "./NavBar";
import Footer from "./Footer";

const SignupPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("devotee");
  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState({});
  const [showOTPInput, setShowOTPInput] = useState(false);
  const [otpValue, setOTPValue] = useState("");
  const [otpSent, setOTPSent] = useState(false);

  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const [formValues, setFormValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
  });

  useEffect(() => {
    if (error) {
      const timeout = setTimeout(() => setError(""), 5000);
      return () => clearTimeout(timeout);
    }
  }, [error]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });

    setValidationErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      delete updatedErrors[name];
      return updatedErrors;
    });

    if (name === "email") {
      setOTPSent(false);
      setShowOTPInput(false);
      setOTPValue("");
    }
  };

  const validateForm = () => {
    let errors = {};
    if (!formValues.firstName.match(/^[a-zA-Z]+$/)) {
      errors.firstName = "First name must not include numbers";
    }
    if (!formValues.lastName.match(/^[a-zA-Z]+$/)) {
      errors.lastName = "Last name must not include numbers";
    }
    if (!formValues.email.includes("@")) {
      errors.email = "Email must include '@' character";
    }
    if (!formValues.phone.match(/^\+\d{1,2}-?\d{10}$/)) {
      errors.phone = "Phone number must include country code and be 10 digits";
    }
    if (
      !formValues.password.match(
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}$/
      )
    ) {
      errors.password =
        "Password must be at least 8 characters, include a number, uppercase, lowercase, and special character";
    }
    return errors;
  };
  
  const handleGenerateOTP = async () => {
    const errors = validateForm();
    if (!formValues.email.trim()) {
      errors.email = "Email is required to generate OTP";
    } else if (!formValues.email.includes("@")) {
      errors.email = "Invalid email format";
    }

    setValidationErrors(errors);

    if (Object.keys(errors).length === 0) {
      try {
        const response = await fetch("http://localhost:3001/generate-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: formValues.email }),
        });

        if (response.ok) {
          setOTPSent(true);
          setShowOTPInput(true);
          setError("");
        } else {
          const data = await response.json();
          setError(data.message || "Failed to send OTP");
        }
      } catch (error) {
        console.error("Error generating OTP:", error);
        setError("An error occurred. Please try again.");
      }
    }
  };

  const handleVerifyOTP = async () => {
    if (!otpValue.trim()) {
      setError("Please enter the OTP to verify.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3001/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formValues,
          role,
          otp: otpValue,
        }),
      });

      if (response.ok) {
        console.log("OTP Verified! Account created successfully.");
        navigate("/login");
      } else {
        const data = await response.json();
        setError(data.message || "OTP verification failed");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="signup-page">
    
      <div className="signup-content">
        <div className="signup-left">
          <img src={templeImage} alt="Temple" className="signup-Image" />
        </div>

        <div className="signup-right">
          <h1 className="signup-right-message1"> Welcome 👋</h1>
          <p className="signup-right-message2"> Create an account </p>

          <form className="signup-form" onSubmit={(e) => e.preventDefault()} noValidate>
            <label htmlFor="firstName"><strong>First Name</strong></label>
            <input
              type="text"
              name="firstName"
              placeholder="Enter your first name"
              value={formValues.firstName}
              onChange={handleInputChange}
            />
            {validationErrors.firstName && <p className="error-message">{validationErrors.firstName}</p>}

            <label htmlFor="lastName"><strong>Last Name</strong></label>
            <input
              type="text"
              name="lastName"
              placeholder="Enter your last name"
              value={formValues.lastName}
              onChange={handleInputChange}
            />
            {validationErrors.lastName && <p className="error-message">{validationErrors.lastName}</p>}

            <label htmlFor="email"><strong>Email</strong></label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formValues.email}
              onChange={handleInputChange}
            />
            {validationErrors.email && <p className="error-message">{validationErrors.email}</p>}

            <label htmlFor="phone"><strong>Phone</strong></label>
            <input
              type="text"
              name="phone"
              placeholder="Enter your phone number"
              value={formValues.phone}
              onChange={handleInputChange}
            />
            {validationErrors.phone && <p className="error-message">{validationErrors.phone}</p>}

            <label htmlFor="password"><strong>Password</strong></label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter your password"
              value={formValues.password}
              onChange={handleInputChange}
            />
            <label htmlFor="role"><strong>Role</strong></label>                        
                <select
                    id="role"
                    value={role}
                    name="role"
                    onChange={(e) => setRole(e.target.value)}
                    className="role-dropdown"
                >                    
                    <option value="devotee">Devotee</option>
                    <option value="administrator">Administrator</option>
                    <option value="priest">Priest</option>   
                </select>

            {validationErrors.password && <p className="error-message">{validationErrors.password}</p>}

            {!otpSent ? (
              <button type="button" onClick={handleGenerateOTP} className="signup-button">
                Generate OTP
              </button>
            ) : (
              <>
                <label><strong>OTP</strong></label>
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={otpValue}
                  onChange={(e) => setOTPValue(e.target.value)}
                />
                <button type="button" onClick={handleVerifyOTP} className="signup-button">
                  Verify OTP
                </button>
              </>
            )}
            {error && <p className="error-message">{error}</p>}
          </form>

          <p className="login-link">
            Already have an account? <a href="/login"> Sign In </a>
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SignupPage;
