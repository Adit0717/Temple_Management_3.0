import React, { useState, useEffect } from "react";
import Navbar from "./NavBar";
import Footer from "./Footer";
import Announcements from "./Announcements";

const HomePage = () => {
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await fetch("http://localhost:3001/announcements");
        const data = await response.json();
        setAnnouncements(data);
      } catch (error) {
        console.error("Error fetching announcements:", error);
      }
    };

    fetchAnnouncements();
  }, []);

  const handleAdd = async (newAnnouncement) => {
    try {
      const response = await fetch("http://localhost:3001/add-announcement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAnnouncement),
      });
      if (response.ok) {
        const createdAnnouncement = await response.json();
        setAnnouncements([...announcements, createdAnnouncement]);
      }
    } catch (error) {
      console.error("Error adding announcement:", error);
    }
  };

  const handleEdit = async (updatedAnnouncement) => {
    try {
      const response = await fetch(
        `http://localhost:3001/announcements/${updatedAnnouncement._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedAnnouncement),
        }
      );
      if (response.ok) {
        const editedAnnouncement = await response.json();
        setAnnouncements(
          announcements.map((item) =>
            item._id === editedAnnouncement._id ? editedAnnouncement : item
          )
        );
      }
    } catch (error) {
      console.error("Error editing announcement:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:3001/announcements/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setAnnouncements(announcements.filter((item) => item._id !== id));
      }
    } catch (error) {
      console.error("Error deleting announcement:", error);
    }
  };

  return (
    <div>
  
      <Announcements
        announcements={announcements}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      <Footer />
    </div>
  );
};

export default HomePage;
