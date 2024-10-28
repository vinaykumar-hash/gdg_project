import React, { useState, useEffect } from 'react';

const Card = ({ event, onDelete, onEdit, onViewDetails, isAdmin }) => {
  return (
    <div className="w-80 bg-gray-200 rounded-lg overflow-hidden cursor-pointer" onClick={() => onViewDetails(event)}>
      <div className="h-1/2 w-full overflow-hidden">
        <img className="h-full w-full object-cover" src={event.image} alt={event.title} />
      </div>
      <div className="py-4 px-6">
        <h2 className="text-3xl font-bold tracking-tighter opacity-90">{event.title}</h2>
        <p className="font-medium opacity-70">{event.dateTime}</p>
        <p className="font-medium opacity-70">{event.location}</p>
        <p className="font-normal opacity-70">{event.description}</p>
        <div className="flex justify-between mt-2">
          {isAdmin ? (
            <>
              <button className="bg-basecl-200 text-white rounded-lg text-medium py-1 px-4" onClick={(e) => { e.stopPropagation(); onEdit(event); }}>
                Edit
              </button>
              <button className="bg-red-500 text-white rounded-lg text-medium py-1 px-4" onClick={(e) => { e.stopPropagation(); onDelete(event); }}>
                Delete
              </button>
            </>
          ) : (
            <button className="bg-basecl-200 text-white rounded-lg text-medium py-1 px-4 w-full">
              Register
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const Cards = () => {
  const [events, setEvents] = useState([]);
  const [formData, setFormData] = useState({
    image: '',
    title: '',
    dateTime: '',
    location: '',
    description: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [currentEventId, setCurrentEventId] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const isAdmin = localStorage.getItem('admin') === 'true';

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/events');
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error('Error fetching events', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isEditing) {
      await updateEvent(currentEventId, formData);
    } else {
      await addEvent(formData);
    }
    setFormData({ image: '', title: '', dateTime: '', location: '', description: '' });
    setIsEditing(false);
    setCurrentEventId(null);
  };

  const addEvent = async (event) => {
    try {
      const response = await fetch('http://localhost:5000/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const newEvent = await response.json();
      setEvents([...events, newEvent]);
    } catch (error) {
      console.error('Error adding event:', error);
    }
  };

  const updateEvent = async (id, updatedEvent) => {
    try {
      const response = await fetch(`http://localhost:5000/api/events/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedEvent),
      });
      const data = await response.json();
      setEvents(events.map((event) => (event._id === id ? data : event)));
    } catch (error) {
      console.error('Error updating event:', error);
    }
  };

  const handleDelete = async (event) => {
    try {
      await fetch(`http://localhost:5000/api/events/${event._id}`, { method: 'DELETE' });
      setEvents(events.filter((e) => e._id !== event._id));
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  const handleEdit = (event) => {
    setFormData(event);
    setCurrentEventId(event._id);
    setIsEditing(true);
  };

  const handleViewDetails = (event) => {
    setSelectedEvent(event);
  };

  const closeModal = () => {
    setSelectedEvent(null);
  };

  return (
    <div className="p-10 font-fustat">
      {isAdmin && (
        <form onSubmit={handleSubmit} className="mb-8 flex justify-center items-center gap-2 flex-wrap">
          <input
            type="text"
            name="image"
            placeholder="Image URL"
            value={formData.image}
            onChange={handleChange}
            className="p-2 border rounded h-10 w-60"
            required
          />
          <input
            type="text"
            name="title"
            placeholder="Event Title"
            value={formData.title}
            onChange={handleChange}
            className="p-2 border rounded h-10 w-60"
            required
          />
          <input
            type="text"
            name="dateTime"
            placeholder="Date and Time"
            value={formData.dateTime}
            onChange={handleChange}
            className="p-2 border rounded h-10 w-60"
            required
          />
          <input
            type="text"
            name="location"
            placeholder="Event Location"
            value={formData.location}
            onChange={handleChange}
            className="p-2 border rounded h-10 w-60"
            required
          />
          <textarea
            name="description"
            placeholder="Event Description"
            value={formData.description}
            onChange={handleChange}
            className="p-2 border rounded h-10 w-60 resize-none"
            required
          />
          <button type="submit" className="bg-basecl-200 text-white rounded h-10 px-4">
            {isEditing ? 'Update Event' : 'Add Event'}
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-1">
        {events.map((event) => (
          <Card
            key={event._id}
            event={event}
            onDelete={handleDelete}
            onEdit={handleEdit}
            onViewDetails={handleViewDetails}
            isAdmin={isAdmin}
          />
        ))}
      </div>

      {selectedEvent && (
        <div className="font-fustat fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-11/12 md:w-1/2 p-6 relative">
            <button onClick={closeModal} className="absolute top-2 right-2 text-xl font-bold">&times;</button>
            <h2 className="text-3xl font-bold mb-4">{selectedEvent.title}</h2>
            <img src={selectedEvent.image} alt={selectedEvent.title} className="w-full mb-4 rounded-lg" />
            <p className="font-medium mb-2">{selectedEvent.dateTime}</p>
            <p className="font-medium mb-2">{selectedEvent.location}</p>
            <p className="font-normal mb-4">{selectedEvent.description}</p>
            {isAdmin ? (
              <button className="bg-red-500 text-white rounded-lg py-1 px-4" onClick={() => handleDelete(selectedEvent)}>
                Delete
              </button>
            ) : (
              <button className="bg-basecl-200 text-white rounded-lg py-1 px-4">Register</button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Cards;
