import React from "react";
import "./styles/contactUs.css";
import Footer from "./Footer";
import { useNavigate } from "react-router-dom";
import Navbar from "./NavBar";


const ContactUs = () => {

    const navigate = useNavigate();
    const handleLogout = async () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('empId');
        localStorage.setItem('role', '');
        
        navigate('/');
    };
  
  
    return (
        <div>
        
          <div className="contact-us-section">
            <h1><u>Contact Us</u></h1>
            <div className="contact-us-card">
              <div className="contact-item">
                <h3>Facebook:</h3>
                <p>*Facebook Messenger is currently the most reliable way of contacting us.*</p>
                <a href="https://www.facebook.com/" className="contact-link">
                  Ram Mandir Temple Facebook Page
                </a>
              </div>
              <div className="contact-item">
                <h3>Email:</h3>
                <p>*Please be advised that Facebook Messenger is currently the best method of contact.*</p>
                <a href="mailto:contact@rammandir.org" className="contact-link">
                  contact@rammandir.org
                </a>
              </div>
              <div className="contact-item">
                <h3>Phone:</h3>
                <p>*Please be advised that Facebook Messenger is currently the best method of contact.*</p>
                <a href="tel:+12603021008" className="contact-link">260-302-1008</a>
              </div>
              <div className="contact-item">
                <h3>US Postal Address:</h3>
                <p>Ram Mandir<br />14745 Yellow River Road<br />Fort Wayne, IN 46818</p>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=14745+Yellow+River+Road+Fort+Wayne+IN+46818"
                  className="contact-link"
                >
                  Open in Google Maps
                </a>
              </div>
            </div>
          </div>
          <Footer />
        </div>
      );
    }
    
    export default ContactUs;