import react, {useState} from "react";
import '../components/styles/login.css'
import templeImage from '../assets/resolution-900.jpg'
import { useNavigate } from "react-router-dom";
import Navbar from "./NavBar";
import Footer from "./Footer";

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [role, setRole] = useState("devotee");
    const [error, setError] = useState("");
  
    const navigate = useNavigate();
  
    const togglePasswordVisibility = () => {
      setShowPassword((prev) => !prev);
    };
  
    const handleLogin = async (e) => {
      e.preventDefault();
      setError("");
  
      if (!email.includes("@")) {
        setError("Enter a valid email id");
        setTimeout(() => setError(""), 5000);
        return;
      }
  
      if (password.length < 8) {
        setError("Password must be at least 8 characters");
        setTimeout(() => setError(""), 5000);
        return;
      }
  
      try {
        const response = await fetch("http://localhost:3001/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password, role }),
        });
  
        if (!response.ok) {
          const { message } = await response.json();
          setError(message || "Login failed");
          setTimeout(() => setError(""), 5000);
          console.log(message);
        } else {
          const data = await response.json();
          console.log("Login successful:", data);
          
          localStorage.setItem("role", data.user.role);
          localStorage.setItem("token", data.token);
          localStorage.setItem("userName", (data.user.firstName + ' ' + data.user.lastName));
          localStorage.setItem("email", data.user.email);
          
          navigate("/home");
          window.location.reload();
        }
      } catch (error) {
        console.error("Error during login:", error);        
        setError("An error occurred. Please try again.");
        setTimeout(() => setError(""), 5000);
        console.log(error);
      }
    };
  
    return (
      <div className="login-page">
        
        <div className="login-content">
          <div className="login-left">
            <img
              src={templeImage}
              alt="Temple"
              className="login-image"
            />
          </div>
  
          <div className="login-right">
            <h1 className="login-right-message1">Welcome Back</h1>
            <p className="login-right-message2">Login to your account 👋</p>
  
            <form className="login-form" onSubmit={handleLogin} noValidate>
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
  
              <label htmlFor="password">
                <strong>Password</strong>
              </label>
              <div className="password-container">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
  
              <label htmlFor="role">
                <strong>Login as</strong>
              </label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="role-dropdown"
              >
                <option value="administrator">Administrator</option>
                <option value="devotee">Devotee</option>
                <option value="priest">Priest</option>
              </select>
  
              {error && <p className="error-message">{error}</p>}
              <button type="submit" className="login-button">
                Login
              </button>
            </form>
  
            <p className="signup-link">
              Don't have an account? <a href="/sign-up">Signup</a>
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
  };

export default LoginPage;