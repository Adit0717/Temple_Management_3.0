import React, { useState, useEffect } from "react";
import "./styles/footer.css";
import footerlogo from '../assets/SRMA_logo.png'

const Footer = () => {
  const [showScroll, setShowScroll] = useState(false);

  useEffect(() => {
    const checkScroll = () => {
      if (window.scrollY > 100) {
        setShowScroll(true);
      } else {
        setShowScroll(false);
      }
    };

    window.addEventListener("scroll", checkScroll);
    return () => window.removeEventListener("scroll", checkScroll);
  }, []);

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
          <li><a href="https://www.youtube.com/@DoordarshanNational" target="_blank" rel="noopener noreferrer"><em>YouTube</em></a></li>
          <li><a href="https://x.com/ShriRamTeerth" target="_blank" rel="noopener noreferrer"><em>X</em></a></li>
        </ul>
        <p className="footer-copyright">
          © 2025 Ram Mandir Temple, All Rights Reserved.
          Developed By <span className="developer">Group 8</span>
        </p>
      </div>
      {showScroll && (
        <button
          className="scroll-to-top"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          ↑
        </button>
      )}
    </footer>
  );
};

export default Footer;
