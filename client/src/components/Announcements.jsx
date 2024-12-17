import React, { useEffect, useState } from "react";
import "./styles/announcements.css";
import Newsletter from "./Newsletter";
import logo from '../assets/google-maps-hd-logo.png'

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [filteredAnnouncements, setFilteredAnnouncements] = useState([]);
  const [formData, setFormData] = useState({ title: "", description: "" });
  const [editId, setEditId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [role, setRole] = useState(localStorage.getItem("role"));

  const fetchAnnouncements = async () => {
    try {
      const response = await fetch("http://localhost:3001/announcements");
      const data = await response.json();
      setAnnouncements(data); 
      setFilteredAnnouncements(data);
    } catch (error) {
      console.error("Error fetching announcements:", error);
    }
  };
	useEffect(() => {
      fetchAnnouncements();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editId) {
      try {
        const response = await fetch(`http://localhost:3001/announcements/${editId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        if (response.ok) {
          setIsModalOpen(false);
          setEditId(null);
          setFormData({ title: "", description: "" });
          fetchAnnouncements();

        }
      } catch (error) {
        console.error("Error updating announcement:", error);
      }
    } else {      
      try {
        const response = await fetch("http://localhost:3001/add-announcement", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        if (response.ok) {
	        setIsModalOpen(false);
        	setFormData({ title: "", description: "" });
    		fetchAnnouncements();   
        }
      } catch (error) {
        console.error("Error adding announcement:", error);
      }
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:3001/announcements/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        fetchAnnouncements();
      }
    } catch (error) {
      console.error("Error deleting announcement:", error);
    }
  };

  const openModal = (announcement = null) => {
    if (announcement) {
      setFormData({ title: announcement.title, description: announcement.description });
      setEditId(announcement._id);
    } else {
      setFormData({ title: "", description: "" });
      setEditId(null);
    }
    setIsModalOpen(true);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    const lowercasedQuery = query.toLowerCase();
    const filtered = announcements.filter(
      (announcement) =>
        announcement.title.toLowerCase().includes(lowercasedQuery) ||
        announcement.description.toLowerCase().includes(lowercasedQuery)
    );
    setFilteredAnnouncements(filtered);
  };
  //role = "administrator";
  return (
    <div className="announcements-container">
      <div className="announcements-left">
        <h2>
          <span role="img" aria-label="announcement">
            📢
          </span>{" "}
          Announcements
        </h2>

        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search announcements..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="search-bar"
        />
        
        {role === "administrator" && (
          <button
            onClick={() => openModal()}
            className="add-announcement-button"
          >
            Add New Announcement
          </button>
        )}

        <div className="announcements-list">
          {filteredAnnouncements.map((announcement) => (
            <div key={announcement._id} className="announcement-item">
              <h3>{announcement.title}</h3>
              <p>{announcement.description}</p>
              {role === "administrator" && (
                <div className="announcement-actions">
                  <button
                    onClick={() => openModal(announcement)}
                    className="edit-button"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(announcement._id)}
                    className="delete-button"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="announcements-right">
        <div className="temple-details">
          <h3><u>Daily Schedule</u></h3>
          <p>Morning: 9:30am - 12:00am </p>
          <p>Evening: 5:30pm - 8:00pm</p>

          <h3><u>Temple Office Hours:</u></h3>
          <p>Mon - Fri: 10:00am - 6:00pm</p>
          <p>Sat & Sun: 10:00am - 5:00pm</p>
  

          <h3><u>Special Pooja Timings</u></h3>
          <p>Abhishekam(Ritual Bathing): 6:00pm</p>
          <p>Teerth Poojan, Jal Yatra: 6:30pm</p>
          
          <section className="location-section">
            <h3> <img src={logo} alt="Maps logo" width="15" height="15" /> <u>Location</u></h3>
            <span> 3411 Sherman Blvd, Fort Wayne, IN 46808 </span>
            
            <iframe
              className="map-style"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d28492.600538784554!2d82.17317883697011!3d26.789812019619127!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399a07cd3079f0bf%3A0x5589e823b23ba9dc!2sShree%20Ram%20Janmabhoomi%20Mandir!5e0!3m2!1sen!2sus!4v1734257224715!5m2!1sen!2sus"
              width="400"
              height="250"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              ></iframe>

        </section>
        </div>
        <Newsletter />
      </div>

      {isModalOpen && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>{editId ? "Edit Announcement" : "Add Announcement"}</h3>
            <form onSubmit={handleSubmit}>
              <label>
                Title:
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                />
              </label>
              <label>
                Description:
                <textarea
                  rows="4"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  required
                ></textarea>
              </label>
              <div className="modal-actions">
                <button type="submit">Save</button>
                <button type="button" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Announcements;
