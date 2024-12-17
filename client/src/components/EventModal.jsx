import React, { useState, useEffect } from 'react';

const EventModal = ({ event, onSave, onDelete, onClose }) => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [allDay, setAllDay] = useState(false);

  // Sync state when event changes
  useEffect(() => {
    setTitle(event.title || '');
    setDate(event.start ? new Date(event.start).toISOString().split('T')[0] : '');
    setAllDay(event.allDay || false);
  }, [event]);

  const handleSubmit = () => {
    if (!title.trim()) {
      alert('Title cannot be empty');
      return;
    }
    onSave({
      ...event,
      title,
      start: new Date(date).toISOString(), // Ensure consistent date format
      allDay,
    });
    onClose();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h2>{event.id ? 'Edit Event' : 'Create Event'}</h2>
        
        <label>Event Title:</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Event Title"
        />

        <label>Event Date:</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <label>
          All Day:
          <input
            type="checkbox"
            checked={allDay}
            onChange={(e) => setAllDay(e.target.checked)}
          />
        </label>

        <div className="modal-buttons">
          <button onClick={handleSubmit} className="modal-save-button">Save</button>
          {event.id && (
            <button
              onClick={() => onDelete(event.id)}
              className="modal-delete-button"
            >
              Delete
            </button>
          )}
          <button onClick={onClose} className="modal-close-button">Close</button>
        </div>
      </div>
    </div>
  );
};

export default EventModal;
