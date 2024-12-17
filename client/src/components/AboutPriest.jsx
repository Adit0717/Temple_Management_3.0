import Navbar from "./NavBar";
import Footer from "./Footer";
import './styles/aboutPriest.css'

const AboutPriest = () => {
    return (
        <div>
             
                <div className="priest-section">
                    <h1><u>Employed Priests</u></h1> 
                    <div className="priest-card">
                        <div className="priest-item">
                            <h3>Vasudev</h3>
                            <p><u>Abhishekam(ritual bathing)</u></p>
                            <a href="tel:+12603021008" className="priest-link">260-302-1008</a>
                        </div>
                        
                        <div className="priest-item">
                            <h3>Keshav</h3>
                            <p><u>Annadanam (offering food)</u></p>
                            <a href="tel:+12603021008" className="priest-link">260-302-1009</a>
                        </div>
                        
                        <div className="priest-item">
                            <h3>Narayanaa</h3>
                            <p><u>Ashtothra Nama Archana (chanting 108 names)</u></p>
                            <a href="tel:+12603021008" className="priest-link">260-302-1010</a> (Limited Availability)
                        </div>

                        <div className="priest-item">
                            <h3>Parikshith</h3>
                            <p><u>Ayushya Homam(fire ritual for longevity)</u></p>
                            <a href="tel:+12603021008" className="priest-link">260-302-1011</a>
                        </div>
                        
                        <div className="priest-item">
                            <h3>Abhimanyu</h3>
                            <p><u>Grihapravesham(housewarming ceremony)</u></p>
                            <a href="tel:+12603021008" className="priest-link">260-302-1012</a>
                        </div>
                        
                        <div className="priest-item">
                            <h3>Mahadev</h3>
                            <p><u>Aksharabyasam (writing the first letter)</u></p>
                            <a href="tel:+12603021008" className="priest-link">260-302-1013</a> (Limited Availability)
                        </div>

                        <div className="priest-item">
                            <h3>Viswanath</h3>
                            <p><u>Homam (oblation through fire)</u></p>
                            <a href="tel:+12603021008" className="priest-link">260-302-1014</a>
                        </div>
                    </div>
                </div>            
           <Footer />
        </div>
    );
}

export default AboutPriest;