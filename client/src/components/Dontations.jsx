import React, { useState } from "react";
import "../components/styles/donations.css";
import { useNavigate } from "react-router-dom";
import Navbar from "./NavBar";
import Footer from "./Footer";
import pdf from "../assets/Donation-form.pdf"

const Donations = () => {
  const [selectedPledge, setSelectedPledge] = useState("25");
  const navigate = useNavigate();

  const handlePledgeChange = (e) => {
    setSelectedPledge(e.target.value);
  };

  const handleDonationClick = (amount) => {
    navigate("/payment", { state: { donationAmount: amount } });
  };

  return (
    <div>
    
      <div className="donations-container">
        <div className="donations-header">
          <h2>Donations</h2>
          <p className="npo-info">
            NPO ID#: <strong>17053281338009</strong>
            <br />
            The Ram Mandir Temple is a non-profit organization, and all donations
            are eligible for tax deductions. Your generous contributions will go
            a long way in supporting the temple's development.
            <br />
            <strong>- By The Ram Mandir Administration</strong>
          </p>
        </div>

        {/* Donation Options */}
        <div className="donation-options">
          {/* One-Time Donation */}
          <div className="donation-box">
            <h3>One Time Donation:</h3>
            <p>via Credit Card or Debit Card</p>
            <button 
    			className="donation-button" 
    			onClick={() => handleDonationClick(50)}
    		>
    			Donate
    		</button>
          </div>

          {/* Monthly Donation */}
          <div className="donation-box monthly-donation">
            <h3>Monthly Donation:</h3>
            <p>via Credit Card or Debit Card</p>
            <select value={selectedPledge} onChange={handlePledgeChange}>              
              <option value="25">$25 per month</option>
              <option value="55">$55 per month</option>
              <option value="100">$100 per month</option>
            </select>
            <button
              className="donation-button"
              onClick={() => handleDonationClick(selectedPledge)}
            >
              Donate
            </button>
          </div>
        </div>

        {/* Cash/Check Donations */}
        <div className="cash-donations">
          <h3><u>Cash/Check Donations:</u></h3>
          <p>
            For those who prefer traditional methods of donating, you can
            download our Donation Form using this link
            <a
              href={pdf}
              download="Donation-form.pdf"
              target="_blank"
              rel="noopener noreferrer"
            >
              {" "}
              Donation Form
            </a>
            . Fill it out digitally or manually, and submit cash or checks at
            the Temple. Checks can also be mailed to our address.
            <br />
            <strong>Please do not mail cash.</strong>
            <br />
            <em>Thank you for your support!</em>
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Donations;

  