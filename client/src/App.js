import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import LoginPage from './components/Login';
import SingupPage from './components/Signup';

function App() {
  
  const uriValue = 'http://localhost:3001';
  localStorage.setItem('role', '');

  return (
    <div className='App'>
      <Router>
        <Routes>
          <Route path='/login' element={<LoginPage />} />
          <Route path="/sign-up" element={<SingupPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
