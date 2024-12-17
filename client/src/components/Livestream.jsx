import Navbar from "./NavBar";
import Footer from "./Footer";
import { useNavigate } from "react-router-dom";
import './styles/liveStream.css';

const LiveStream = () => {
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
        
            <div className="live-stream-section">
                <div className="live-stream-card">
                    <h1>Live Stream Updates!</h1>
                    <p>Our next livestream is scheduled for 6pm on December 20th 2024 (Aushadhadhivas, Kesaradhivas).</p>
                    <p>The channels listed below will be streaming live during the scheduled event:</p>
                    <ul>
                        <li>
                            <a href="https://www.youtube.com/@DoordarshanNational" target="_blank" rel="noopener noreferrer" className="stream-link">
                                YouTube channel
                            </a>
                        </li>
                        <li>
                            <a href="https://www.facebook.com/srirammandircom/" target="_blank" rel="noopener noreferrer" className="stream-link">
                                Facebook live
                            </a>
                        </li>
                    </ul>
                    <p>
                        Celebrate, honor, and learn about Hinduism as we open our doors and invite the world to join us for prayers, ceremonies, and events from wherever one may be.
                    </p>
                    <p>
                        LiveStreamed events are for all to enjoy, free of any charge, so please come and sit in with us at Ram Mandir Temple.
                    </p>
                    <p>Aum Shanthi, Shanthi, Shanthi.</p>
                    <p><u>The Ram Mandir Tech Team</u></p>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default LiveStream;
