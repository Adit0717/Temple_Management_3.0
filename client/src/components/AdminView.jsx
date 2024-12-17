import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import "./styles/adminView.css";
import Navbar from "./NavBar";
import Footer from "./Footer";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const AdminAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await fetch("http://localhost:3001/get-appointments");
      if (!response.ok) throw new Error("Failed to fetch appointments.");
      const data = await response.json();
      setAppointments(data);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  const openModal = (appointmentId) => {
    setSelectedAppointmentId(appointmentId);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedAppointmentId(null);
  };

  const handleCancelAppointment = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/delete-appointment/${selectedAppointmentId}`,
        { method: "DELETE" }
      );

      if (response.ok) {
        toast.success("Appointment cancelled successfully.");        
        fetchAppointments();
      } else {
        toast.success("Failed to cancel the appointment.");
        alert("Failed to cancel the appointment.");
      }
    } catch (error) {
      console.error("Error cancelling appointment:", error);
    } finally {
      closeModal();
    }
  };

  return (
    <div>
    
      <div className="appointments-container">
        <h2 className="appointments-header">Administrator: Manage Appointments</h2>
        <table className="appointments-table">
          <thead>
            <tr>
              <th>DEVOTEE NAME</th>
              <th>PRIEST NAME</th>
              <th>DATE</th>
              <th>TIME</th>
              <th>INFORMATION</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appointment) => (
              <tr key={appointment._id}>
                <td>{appointment.userName}</td>
                <td>{appointment.priest}</td>
                <td>{new Date(appointment.date).toLocaleDateString()}</td>
                <td>{appointment.time}</td>
                <td>{appointment.information}</td>
                <td>
                  <button
                    className="cancel-button"
                    onClick={() => openModal(appointment._id)}
                  >
                    Cancel Appointment
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for Confirmation */}
      <Modal
        isOpen={showModal}
        onRequestClose={closeModal}
        contentLabel="Cancel Appointment Confirmation"
        ariaHideApp={false}
        className="confirmation-modal"
        overlayClassName="modal-overlay"
      >
        <h2>Confirm Cancellation</h2>
        <p>Are you sure you want to cancel this appointment?</p>
        <div className="modal-actions">
          <button onClick={handleCancelAppointment} className="confirm-button">
            Yes, Cancel
          </button>
          <button onClick={closeModal} className="cancel-button">
            No, Go Back
          </button>
        </div>
      </Modal>
      <ToastContainer position="top-center" autoClose={3000} />
      <Footer />
    </div>
  );
};

export default AdminAppointments;
