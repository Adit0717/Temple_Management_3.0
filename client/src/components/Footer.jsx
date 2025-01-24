import React from "react";
import "./styles/footer.css";
import footerlogo from '../assets/SRMA_logo.png'

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-logo">
          <img
            src={footerlogo}
            alt="Logo"
          />
        </div>
        <ul className="footer-social">
          <li><a href="https://www.facebook.com/srjbtkshetra/" target="_blank" rel="noopener noreferrer"><em>Facebook</em></a></li>
          <li><a href="https://www.instagram.com/shriramteerthkshetra/?hl=en" target="_blank" rel="noopener noreferrer"><em>Instagram</em></a></li>
          <li><a href="https://youtube.com" target="_blank" rel="noopener noreferrer"><em>YouTube</em></a></li>
          <li><a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><em>Twitter</em></a></li>
        </ul>
        <p className="footer-copyright">
          © 2024 Ram Mandir Temple, All Rights Reserved.
          Developed By <span className="developer">Group 2</span>
        </p>
      </div>
      <button className="scroll-to-top" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
        ↑
      </button>
    </footer>
  );
};

export default Footer;
