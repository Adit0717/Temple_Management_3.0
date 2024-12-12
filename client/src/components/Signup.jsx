import react, { useState } from "react";
import '../components/styles/signup.css'
import templeImage from '../assets/resolution-900.jpg'
import { useNavigate } from "react-router-dom";
//import { ToastContainer, toast } from 'react-toastify';

const SingupPage = () => {

    const [showPassword, setShowPassword] = useState(false);
    const [role, setRole] = useState("Devotee");
    const [error, setError] = useState("");
    const [validationErrors, setValidationErrors] = useState({});
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
        empId: ""
      });
    

    const handleSignup = async (e) => {
        e.preventDefault();
        setError("");
        setValidationErrors({});

        const errors = validateForm();
        
        if (Object.keys(errors).length === 0) {
            try {
                const response = await fetch("http://localhost:3001/sign-up", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ ...formValues, role, empId: undefined}),
                });
            
                if (!response.ok) {
                  const {message} = await response.json();
                  setError(message || "Signup failed");
                  console.log(message);
                } else {
                  const data = await response.json();
                  console.log("Signup successful:", data);
                  navigate('/login');
                }
            } catch (error) {
                console.error("Error during Signup:", error);
                setError("An error occurred. Please try again.");
                console.log(error);
            }
        } else{
            setValidationErrors(errors);
        }       
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value });
      };

    const validateForm = () => {
        let errors = {};
        if (!formValues.firstName.match(/^[a-zA-Z]+$/)) {
          errors.firstName = "First name must not include numbers";
        }
        if (!formValues.lastName.match(/^[a-zA-Z]+$/)) {
          errors.lastName = "Last name must not include numbers";
        }
        if (!formValues.email.includes('@')) {
          errors.email = "Email must include '@' character";
        }
        if (!formValues.phone.match(/^\+\d{1,2}-?\d{10}$/)) {
          errors.phone = "Phone number must include country code and be 10 digits";
        }
        if (!formValues.password.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}$/)) {
          errors.password = "Password must be at least 8 characters, include a number, uppercase, lowercase, and special character";
        }
        return errors;
      };

    return(
        <div className='signup-page'>
            <div className='signup-left'>
                <img
                    src={templeImage}
                    alt='Temple'
                    className='signup-Image'
                />
            </div>
            
            <div className='signup-right'>
                <h1 className='signup-right-message1'> Welcome 👋</h1>
                <p className='signup-right-message2'> Create an account </p>
                
                <form className="signup-form" onSubmit={handleSignup} noValidate>
                    <label htmlFor="email"><strong>Email</strong></label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Enter your email"
                            value={formValues.email}
                            onChange={handleInputChange}
                        />
                    {validationErrors.email && <p className="error-message">{validationErrors.email}</p>}

                    <label htmlFor="password"><strong>Password</strong></label>
                        <div className="password-container">
                            <input
                            type={showPassword ? "text" : "password"} /* Dynamically set input type */
                            id="password"
                            name="password"
                            placeholder="Enter your password"
                            value={formValues.password}
                            onChange={handleInputChange}
                            />
                            <button
                            type="button"
                            className="toggle-password"
                            onClick={togglePasswordVisibility}
                            >
                            {showPassword ? "Hide" : "Show"}
                            </button>
                        </div>
                    {validationErrors.password && <p className="error-message">{validationErrors.password}</p>}

                    <label htmlFor="firstName"><strong>First Name</strong></label>
                        <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            placeholder="Enter your First Name"
                            value={formValues.firstName}
                            onChange={handleInputChange}
                        />
                    {validationErrors.firstName && <p className="error-message">{validationErrors.firstName}</p>}

                    <label htmlFor="lastName"><strong>Last Name</strong></label>
                        <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            placeholder="Enter your Last Name"
                            value={formValues.lastName}
                            onChange={handleInputChange}
                        />
                    {validationErrors.lastName && <p className="error-message">{validationErrors.lastName}</p>}

                    <label htmlFor="Phone"><strong>Phone</strong></label>
                        <input
                            type="string"
                            id="phone"
                            name="phone"
                            placeholder="Enter your contact number"
                            value={formValues.phone}
                            onChange={handleInputChange}
                        />
                    {validationErrors.phone && <p className="error-message">{validationErrors.phone}</p>}

                    <label htmlFor="role"><strong>Role</strong></label>                        
                        <select
                            id="role"
                            value={role}
                            name="role"
                            onChange={(e) => setRole(e.target.value)}
                            className="role-dropdown"
                        >
                            <option value="Administrator">Administrator</option>
                            <option value="Devotee">Devotee</option>
                            <option value="Priest">Priest</option>
                        </select>

                    {error && <p className="error-message">{error}</p>}
                    <button type="submit" className="signup-button">Sign Up</button>
                </form>

                <p className='login-link'>
                    Already have an account? <a href='/login'> Sign In </a>
                </p>
            </div>
        </div>
    );
};

export default SingupPage;