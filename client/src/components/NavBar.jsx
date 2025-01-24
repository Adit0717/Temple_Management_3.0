import React from 'react';
import './styles/navbar.css';
import navbarlogo from '../assets/bow-300x300.png'
import { Link } from 'react-router-dom'

const Navbar = () => {
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
        <li><a href="/login">Login</a></li>
        <li><a href="/sign-up">Signup</a></li>
      </ul>
    </nav>
  );
};

export default Navbar;
