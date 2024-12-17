import React, { useState, useEffect } from "react";
import "./styles/devoteeAppointments.css";
import Navbar from "./NavBar";
import Footer from "./Footer";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DevoteeAppointments = () => {
  const [priests, setPriests] = useState([]);
  const [priestId, setPriestId] = useState("");
  const [selectedPriest, setSelectedPriest] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [info, setInfo] = useState("");
  const [message, setMessage] = useState("");
  const email = localStorage.getItem("email");
  //const email = "krisa04@pfw.edu";

  useEffect(() => {
    fetchPriests();
  }, []);

  const fetchPriests = async () => {
    try {
      const response = await fetch("http://localhost:3001/get-priests");
      if (!response.ok) {
        throw new Error("Failed to fetch priests");
      }
      const data = await response.json();
      setPriests(data);
    } catch (error) {
      console.error("Error fetching priests:", error);
      setMessage("Failed to load priest information.");
    }
  };

  const handleBookAppointment = async (e) => {
    const userName = localStorage.getItem("userName") || "Unknown User";
    e.preventDefault();

    const appointmentData = {
      priestId: priestId,
      priest: selectedPriest,
      date: date,
      time: time,
      information: info,
      userName: userName, 
      email: email,
    };

    try {
      const response = await fetch("http://localhost:3001/book-appointment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(appointmentData),
      });

      if (response.ok) {
        toast.success("Appointment successfully booked!");
        setPriestId("");
        setSelectedPriest("");
        setDate("");
        setTime("");
        setInfo("");
      } else {
        alert("Failed to book the appointment.");
      }
    } catch (error) {
      toast.error("An error occurred while booking the appointment.");
      console.error("Error while booking appointment:", error);
      setMessage("An error occurred while booking the appointment.");
    }
  };

  return (
    <div>
      
      <div className="appointments-container">
        <h2 className="appointments-header">Book an Appointment with a priest</h2>
        <div className="appointments-content">
          {/* Left Side: Priest Information */}
          <div className="priest-info">
            <h3>Priest Information</h3>
            {priests.length === 0 ? (
              <p>No priests available.</p>
            ) : (
              <ul>
                {priests.map((priest) => (
                  <li key={priest._id}>
                    <strong>{priest.firstName} {priest.lastName}</strong> - {priest.service}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Right Side: Appointment Form */}
          <div className="appointment-form">
            <h3>Book your slot</h3>
            <form onSubmit={handleBookAppointment}>
              <div className="form-group">
                <label>Select Priest:</label>
                <select
                  value={priestId}
                  onChange={(e) => {
                    const selected = priests.find((priest) => priest._id === e.target.value);
                    setPriestId(selected._id);
                    setSelectedPriest(`${selected.firstName} ${selected.lastName}`);
                  }}
                  required
                >
                  <option value="">-- Select Priest --</option>
                  {priests.map((priest) => (
                    <option key={priest._id} value={priest._id}>
                      {priest.firstName} {priest.lastName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Date and Time:</label>
                <div className="date-time-inputs">
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                  />
                  <select
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    required
                  >
                    <option value="">-- Select Time --</option>
                    <option value="9:30 AM">9:30 AM</option>
                    <option value="5:30 PM">5:30 PM</option>
                    <option value="6:30 PM">6:30 PM</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Information to Priests:</label>
                <textarea
                  className="information-textarea"
                  value={info}
                  onChange={(e) => setInfo(e.target.value)}
                  placeholder="Enter any additional information for the priest..."
                />
              </div>

              <button type="submit" className="book-button">
                Book Appointment
              </button>
            </form>            
          </div>
        </div>
      </div>
      <ToastContainer position="top-center" autoClose={3000} />
      <Footer />
    </div>
  );
};

export default DevoteeAppointments;

//{message && <p className="status-message">{message}</p>}
