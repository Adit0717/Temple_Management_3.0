import React, { useEffect, useState } from "react";
import "../components/styles/services.css";
import { useNavigate } from "react-router-dom";
import Navbar from "./NavBar";
import Footer from "./Footer";

const Services = () => {
  const [services, setServices] = useState([]);
  const [userRole, setUserRole] = useState(localStorage.getItem("role"));
  //const [userRole, setUserRole] = useState("administrator"); // For local testing
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [newEvent, setNewEvent] = useState({ title: "", description: "" });

  const navigate = useNavigate();

  useEffect(() => {
    fetchServices();
  }, []);

  // Fetch Services
  const fetchServices = async () => {
    try {
      const response = await fetch("http://localhost:3001/services");
      const data = await response.json();
      setServices(data);
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };

  // Open Modal for Add or Edit Event
  const handleAddEvent = (category) => {
    setSelectedCategory(category);
    setEditingEvent(null);
    setShowModal(true);
  };

  const handleEditEvent = (event) => {
    setEditingEvent(event);
    setNewEvent({ title: event.title, description: event.description });
    setShowModal(true);
  };

  // Close Modal and Reset State
  const handleCloseModal = () => {
    setShowModal(false);
    setNewEvent({ title: "", description: "" });
    setEditingEvent(null);
  };

  // Save New or Edited Event
  const handleSaveEvent = async () => {
    try {
      const url = editingEvent
        ? `http://localhost:3001/services/${editingEvent._id}`
        : "http://localhost:3001/add-service";

      const method = editingEvent ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newEvent,
          category: selectedCategory || editingEvent.category,
        }),
      });

      if (response.ok) {
        fetchServices();
        handleCloseModal();
      }
    } catch (error) {
      console.error("Error saving the event:", error);
    }
  };

  // Delete Event
  const handleDeleteEvent = async (id) => {
    try {
      const response = await fetch(`http://localhost:3001/services/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setServices(services.filter((service) => service._id !== id));
      }
    } catch (error) {
      console.error("Error deleting the event:", error);
    }
  };

  return (
    <div>
    
      <div className="services-container">
        <h2 className="services-header">Our Services</h2>

        {/* Categories */}
        {["Pujas", "Homams", "Yajna", "Utsava", "Astrology", "Seva"].map(
          (category) => (
            <div key={category} className="service-category">
              <h3>{category}</h3>
              {userRole === "administrator" && (
                <button
                  className="add-service-button"
                  onClick={() => handleAddEvent(category)}
                >
                  Add New {category} Event
                </button>
              )}

              <div className="event-list">
                {services
                  .filter((service) => service.category === category)
                  .map((event) => (
                    <div key={event._id} className="event-card">
                      <h4>{event.title}</h4>
                      <p>{event.description}</p>

                      {/* Edit and Delete Buttons for Admin */}
                      {userRole === "administrator" && (
                        <div className="event-actions">
                          <button
                            className="edit-button"
                            onClick={() => handleEditEvent(event)}
                          >
                            Edit
                          </button>
                          <button
                            className="delete-button"
                            onClick={() => handleDeleteEvent(event._id)}
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          )
        )}
      </div>

      {/* Modal for Adding/Editing Event */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>
              {editingEvent ? "Edit Event" : "Add New Event for"}{" "}
              {selectedCategory}
            </h3>
            <label>Title:</label>
            <input
              type="text"
              value={newEvent.title}
              onChange={(e) =>
                setNewEvent({ ...newEvent, title: e.target.value })
              }
              placeholder="Enter event title"
            />
            <label>Description:</label>
            <textarea
              value={newEvent.description}
              onChange={(e) =>
                setNewEvent({ ...newEvent, description: e.target.value })
              }
              placeholder="Enter event description"
            />
            <div className="modal-actions">
              <button onClick={handleSaveEvent} className="save-button">
                {editingEvent ? "Update" : "Save"}
              </button>
              <button onClick={handleCloseModal} className="cancel-button">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Services;
