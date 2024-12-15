import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import LoginPage from './components/Login';
import SingupPage from './components/Signup';
import HomePage from './components/Home';
import LiveStream from './components/Livestream';
import AboutUs from './components/AboutUs';
import Mission from './components/Mission'
import ContactUs from './components/ContactUs';
import AboutPriest from './components/AboutPriest';
import Events from './components/Events';

function App() {
  
  return (
    <div className='App'>
      <Router>
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
        </Routes>
      </Router>
    </div>
  );
}

export default App;
