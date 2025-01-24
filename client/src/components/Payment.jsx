import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../components/styles/payments.css";
import Navbar from "./NavBar";
import Footer from "./Footer";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Payment = () => {
  const location = useLocation();
  const { donationAmount } = location.state || { donationAmount: 0 };

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    cardNumber: "",
    cardholderName: "",
    expiry: "",
    cvv: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    if (!formData.fullName.trim() || !/^[a-zA-Z ]+$/.test(formData.fullName)) {
      toast.error("Please enter a valid Full Name.");
      return false;
    }

    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error("Please enter a valid Email Address.");
      return false;
    }

    if (!formData.address.trim()) {
      toast.error("Please enter your Address.");
      return false;
    }

    if (!formData.city.trim()) {
      toast.error("Please enter your City.");
      return false;
    }

    if (!formData.state.trim()) {
      toast.error("Please enter your State.");
      return false;
    }

    if (!formData.zipCode.trim() || !/^\d{5}$/.test(formData.zipCode)) {
      toast.error("Please enter a valid 5-digit Zip Code.");
      return false;
    }

    if (!formData.cardNumber.trim() || !/^\d{16}$/.test(formData.cardNumber)) {
      toast.error("Please enter a valid 16-digit Card Number.");
      return false;
    }

    if (!formData.cardholderName.trim() || !/^[a-zA-Z ]+$/.test(formData.cardholderName)) {
      toast.error("Please enter a valid Cardholder Name.");
      return false;
    }
    
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();
    const [expiryMonth, expiryYear] = formData.expiry.split("/");
    if (
      !formData.expiry.trim() ||
      !/^\d{2}\/\d{4}$/.test(formData.expiry) ||
      parseInt(expiryMonth, 10) > 12 ||
      parseInt(expiryYear, 10) < currentYear ||
      (parseInt(expiryYear, 10) === currentYear && parseInt(expiryMonth, 10) < currentMonth)
    ) {
      toast.error("Please enter a valid Expiry Date (MM/YYYY).");
      return false;
    }

    if (!formData.cvv.trim() || !/^\d{3}$/.test(formData.cvv)) {
      toast.error("Please enter a valid 3-digit CVV.");
      return false;
    }

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      toast.success("Payment submitted successfully!");
      console.log("Form Data Submitted: ", formData);

      setTimeout(() => {
        navigate("/donations");
      }, 2000);
    }
  };

  return (
    <div className="payment-page">
      
      <div className="payment-container">
        <h2 className="payment-header">Donate to Ram Mandir</h2>

        {/* Display Donation Amount */}
        <h3 className="donation-amount">
          Donation Amount: <span>${donationAmount}</span>
        </h3>

        {/* Billing and Payment Form */}
        <form className="payment-form" onSubmit={handleSubmit}>
          <h3 className="section-title">Billing Address</h3>
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleChange}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
          />
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
          />
          <input
            type="text"
            name="city"
            placeholder="City"
            value={formData.city}
            onChange={handleChange}
          />
          <div className="payment-row">
            <input
              type="text"
              name="state"
              placeholder="State"
              value={formData.state}
              onChange={handleChange}
            />
            <input
              type="text"
              name="zipCode"
              placeholder="Zip Code"
              value={formData.zipCode}
              onChange={handleChange}
            />
          </div>

          <h3 className="section-title">Payment</h3>
          <input
            type="text"
            name="cardNumber"
            placeholder="Card Number"
            value={formData.cardNumber}
            onChange={handleChange}
          />
          <input
            type="text"
            name="cardholderName"
            placeholder="Cardholder Name"
            value={formData.cardholderName}
            onChange={handleChange}
          />
          <div className="payment-row">
            <input
              type="text"
              name="expiry"
              placeholder="MM/YYYY"
              value={formData.expiry}
              onChange={handleChange}
            />
            <input
              type="text"
              name="cvv"
              placeholder="CVV"
              value={formData.cvv}
              onChange={handleChange}
            />
          </div>

          {/* Submit Button */}
          <button type="submit" className="donate-button">
            Donate ${donationAmount}
          </button>
        </form>
      </div>
      <ToastContainer position="top-center" autoClose={3000} />
      <Footer />
    </div>
  );
};

export default Payment;
