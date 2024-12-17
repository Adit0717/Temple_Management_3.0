import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import EventModal from './EventModal';
import Navbar from './NavBar';
import Footer from './Footer';
import './styles/events.css';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch('http://localhost:3001/events');
      if (response.ok) {
        const data = await response.json();
          
        setEvents(
          data.map((event) => ({
            id: event._id,
            title: event.title,
            start: new Date(event.start).toISOString().split('T')[0] + 'T00:00:00Z',
            allDay: true,
          }))
        );
      } else {
        console.error('Failed to fetch events:', response.statusText);
      }
    } catch (err) {
      console.error('Error fetching events:', err);
    }
  };
  
  const handleEventClick = (clickInfo) => {
    setSelectedEvent({
      id: clickInfo.event.id,
      title: clickInfo.event.title,
      start: clickInfo.event.start
        ? new Date(clickInfo.event.start).toISOString().split('T')[0] + 'T00:00:00Z'
        : '',
      allDay: clickInfo.event.allDay,
    });
    setModalOpen(true);
  };

  const handleDateClick = (arg) => {
    setSelectedEvent({
      title: '',
      start: new Date(arg.dateStr).toISOString().split('T')[0] + 'T00:00:00Z', 
      allDay: arg.allDay,
    });
    setModalOpen(true);
  };

  const saveEvent = async (eventData) => {
    const method = eventData.id ? 'PUT' : 'POST';
    try {
      const response = await fetch(
        `http://localhost:3001/events/${eventData.id || ''}`,
        {
          method: method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...eventData,
            start: new Date(eventData.start).toISOString().split('T')[0] + 'T00:00:00Z', 
          }),
        }
      );
      if (response.ok) {
        fetchEvents();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const deleteEvent = async (id) => {
    try {
      const response = await fetch(`http://localhost:3001/events/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        fetchEvents();
        setModalOpen(false);
        setSelectedEvent(null);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      
      <div className="container">
        <main className="main-content">
          <div className="about-us-card">
            <h1><u>Calendar Events</u></h1>
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth',
              }}
              buttonText={{
                today: 'Today',
                month: 'Month',
                week: 'Week',
                day: 'Day',
                list: 'List'
              }}
              selectable={true}
              timeZone="UTC"
              businessHours={true}
              weekNumbers={true}
              events={events}
              eventClick={handleEventClick}
              dateClick={handleDateClick}
              height="100%"
              width="100%"
            />
            <p className="calendar-note">
              *All events located at main Temple site, unless otherwise specified.
            </p>
            {modalOpen && (
              <EventModal
                event={selectedEvent}
                onSave={saveEvent}
                onDelete={deleteEvent}
                onClose={() => setModalOpen(false)}
              />
            )}
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Events;
