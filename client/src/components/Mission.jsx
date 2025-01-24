import Navbar from "./NavBar";
import Footer from "./Footer";
import './styles/mission.css'
const Mission = () => {
    return (
        <div>
        
           <div className="mission-section">
                <h2 className="section-title">Our Mission</h2>
                <p className="mission-content">
                    To revive the spiritual essence of our culture by creating a sacred space where devotion, 
                    peace, and community thrive. The temple stands as a beacon of hope, 
                    illuminating the path toward spiritual growth and harmony.
                </p>

                <h2 className="section-title">Our Vision</h2>
                <p className="mission-content">
                    A world where ancient traditions and modern lives coexist seamlessly, fostering unity, 
                    compassion, and understanding among all. We envision the temple as a center for cultural 
                    preservation and spiritual awakening.
                </p>

                <h2 className="section-title">Our Purpose</h2>
                <p className="mission-content">
                    To provide a sanctuary for prayer, meditation, and celebration, connecting devotees 
                    to the divine and each other. By hosting vibrant events, daily rituals, and educational 
                    programs, we aim to inspire the next generation to uphold our sacred traditions.
                </p>
            </div>
           <Footer />
        </div>
    );
}

export default Mission;