import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import { useState, useEffect } from "react";
import LoginPage from './components/Login';
import SingupPage from './components/Signup';
import HomePage from './components/Home';
import LiveStream from './components/Livestream';
import AboutUs from './components/AboutUs';
import Mission from './components/Mission'
import ContactUs from './components/ContactUs';
import AboutPriest from './components/AboutPriest';
import Events from './components/Events';
import Donations from './components/Dontations';
import Payment from './components/Payment';
import Services from './components/Services';
import DevoteeAppointment from './components/DevoteeAppointments';
import AdministratorAppointments from './components/AdminView';

// Navbar Components
import Navbar from './components/NavBar';
import NavbarDevotee from './components/NavBarDevotee'
import NavbarAdmin from "./components/NavBarAdmin";

//<Route path='/view-appointments' element={<PriestView />} />


function App() {
	const [role, setRole] = useState(""); // Default role is 'guest'

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    setRole(storedRole); // Fetch role from localStorage
  }, []);

  // Conditionally render Navbar based on role
  const renderNavbar = () => {
    switch (role) {
      case "devotee":
        return <NavbarDevotee />;
      case "administrator":
        return <NavbarAdmin />;
      default:
        return <Navbar />;
    }
  };
  
  return (
    <div className='App'>
      <Router>
        {renderNavbar()}  
        <Routes>
          <Route path='/' element={<Navigate to='/home' />}/>
          <Route path='/home' element={<HomePage />}/>
          <Route path='/login' element={<LoginPage />} />
          <Route path='/sign-up' element={<SingupPage />} />
          <Route path='/live-stream' element={<LiveStream />} />
          <Route path='/about-us' element={<AboutUs />} />
          <Route path='/about-us/mission' element={<Mission />} />
          <Route path='/about-us/contact' element={<ContactUs />} />
          <Route path='/about-us/priest' element={<AboutPriest />} />
          <Route path='/events' element={<Events />} />
          <Route path='/donations' element={<Donations />} />
          <Route path='/payment' element={<Payment />} />
          <Route path='/services' element={<Services />} />
          <Route path='/book-appointment' element={<DevoteeAppointment />} />          
          <Route path='/view-all-appointments' element={<AdministratorAppointments />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
