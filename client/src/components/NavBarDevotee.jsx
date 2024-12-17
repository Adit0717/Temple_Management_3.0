import React from 'react';
import './styles/navbar.css';
import navbarlogo from '../assets/bow-300x300.png';
import { Link, useNavigate } from 'react-router-dom';

const NavbarDevotee = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("email");
    localStorage.removeItem("role");
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    navigate("/login");
    window.location.reload();
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <img src={navbarlogo} alt="Temple Logo" />
        <Link to='/home' className='navbar-title'>
          <span>Ram Mandir</span>
        </Link>
      </div>
      <ul className="navbar-menu">
        <li><a href="/">Home</a></li>
        <li><a href="/live-stream">Live-Stream</a></li>
        <li className="dropdown">
          <a href="/about-us/mission">About</a>
          <ul className="dropdown-menu">
            <li><a href="/about-us/mission">Mission</a></li>
            <li><a href="/about-us/contact">Contact Us</a></li>
            <li><a href="/about-us/priest">About the Priest</a></li>
          </ul>
        </li>
        <li><a href="/events">Events</a></li>
        <li><a href="/donations">Donations</a></li>
        <li><a href="/services">Services</a></li>
        <li><a href="/book-appointment">Book Appointments</a></li>
        <div className='logout-container'>
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </ul>
    </nav>
  );
};

export default NavbarDevotee;
