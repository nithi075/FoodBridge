import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import API from "../../api"; // Axios instance
import "./Community.css";

export default function Community() {
  // Volunteer form state
  const [volunteerForm, setVolunteerForm] = useState({
    name: "",
    contact: "",
    location: "",
    availability: "",
  });
  const [message, setMessage] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [addKitchenOpen, setAddKitchenOpen] = useState(false);
  const [addEventOpen, setAddEventOpen] = useState(false);

  // Data
  const [kitchens, setKitchens] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [events, setEvents] = useState([]);

  const [newKitchen, setNewKitchen] = useState({
    name: "",
    location: "",
    contact: "",
    volunteersNeeded: 1,
  });

  const [newEvent, setNewEvent] = useState({
    date: "",
    meals: "",
    relatedKitchen: "",
  });

  const [searchTerm, setSearchTerm] = useState("");

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [kRes, vRes, eRes] = await Promise.all([
          API.get("/community/kitchens"),
          API.get("/community/volunteers"),
          API.get("/community/events"),
        ]);
        setKitchens(kRes.data);
        setVolunteers(vRes.data);
        setEvents(eRes.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchData();
  }, []);

  // Volunteer handlers
  const handleVolunteerChange = (e) =>
    setVolunteerForm({ ...volunteerForm, [e.target.name]: e.target.value });

  const handleVolunteerSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/community/volunteers", volunteerForm);
      setMessage(res.data.msg);
      setVolunteers([...volunteers, res.data.volunteer]);
      setVolunteerForm({ name: "", contact: "", location: "", availability: "" });
      setFormOpen(false);
    } catch (err) {
      setMessage(err.response?.data?.msg || "Error registering volunteer.");
    }
  };

  // Kitchen handlers
  const handleKitchenChange = (e) =>
    setNewKitchen({ ...newKitchen, [e.target.name]: e.target.value });

  const handleAddKitchen = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/community/kitchens", newKitchen);
      setKitchens([...kitchens, res.data.kitchen]);
      setNewKitchen({ name: "", location: "", contact: "", volunteersNeeded: 1 });
      setAddKitchenOpen(false);
    } catch (err) {
      console.error("Error adding kitchen:", err);
    }
  };

  // Event handlers
  const handleEventChange = (e) =>
    setNewEvent({ ...newEvent, [e.target.name]: e.target.value });

  const handleAddEvent = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/community/events", newEvent);
      setEvents([...events, res.data.event]);
      setNewEvent({ date: "", meals: "", relatedKitchen: "" });
      setAddEventOpen(false);
    } catch (err) {
      console.error("Error adding event:", err);
    }
  };

  // Geolocation helper
  const getUserLocation = async (setter, field) => {
    if (!navigator.geolocation) return alert("Geolocation not supported.");
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        const { latitude, longitude } = coords;
        try {
          const resGeo = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&zoom=18`
          );
          const data = await resGeo.json();
          const preciseAddress =
            data.display_name || `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;
          setter((prev) => ({ ...prev, [field]: preciseAddress }));
        } catch {
          setter((prev) => ({ ...prev, [field]: `${latitude.toFixed(5)}, ${longitude.toFixed(5)}` }));
        }
      },
      (err) => {
        console.error("Geolocation error:", err);
        alert("Unable to fetch location. Please allow location access.");
      },
      { enableHighAccuracy: true }
    );
  };

  // Filter kitchens
  const filteredKitchens = kitchens.filter(
    (kitchen) =>
      kitchen.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      kitchen.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Navbar />
      <section className="community-section">
        <h1>Community Kitchen</h1>
        <p>
          Join hands with local volunteers to prepare and distribute meals to those in need.
          Every helping hand makes a difference!
        </p>

        <div className="community-buttons">
          <button onClick={() => setFormOpen(true)}>Register as Volunteer</button>
          <button onClick={() => setAddKitchenOpen(true)}>Add a New Kitchen</button>
          <button onClick={() => setAddEventOpen(true)}>Add New Event</button>
        </div>

        {/* Volunteer Overlay */}
        {formOpen && (
          <div className="overlay">
            <div className="overlay-form">
              <button className="close-btn" onClick={() => setFormOpen(false)}>✖</button>
              <h2>Volunteer Registration</h2>
              <form onSubmit={handleVolunteerSubmit}>
                <input type="text" name="name" placeholder="Full Name" value={volunteerForm.name} onChange={handleVolunteerChange} required />
                <input type="text" name="contact" placeholder="Phone or Email" value={volunteerForm.contact} onChange={handleVolunteerChange} required />
                <input type="text" name="location" placeholder="Preferred Kitchen/Location" value={volunteerForm.location} onChange={handleVolunteerChange} required />
                <button type="button" className="use-location-btn" onClick={() => getUserLocation(setVolunteerForm, "location")}>📍 Use My Location</button>
                <input type="text" name="availability" placeholder="Availability (days/hours)" value={volunteerForm.availability} onChange={handleVolunteerChange} required />
                <button type="submit">Submit Registration</button>
                {message && <p className="form-message">{message}</p>}
              </form>
            </div>
          </div>
        )}

        {/* Add Kitchen Overlay */}
        {addKitchenOpen && (
          <div className="overlay">
            <div className="overlay-form">
              <button className="close-btn" onClick={() => setAddKitchenOpen(false)}>✖</button>
              <h2>Add New Kitchen</h2>
              <form onSubmit={handleAddKitchen}>
                <input type="text" name="name" placeholder="Kitchen Name" value={newKitchen.name} onChange={handleKitchenChange} required />
                <input type="text" name="location" placeholder="Location" value={newKitchen.location} onChange={handleKitchenChange} required />
                <input type="text" name="contact" placeholder="Contact Number" value={newKitchen.contact} onChange={handleKitchenChange} required />
                <button type="button" className="use-location-btn" onClick={() => getUserLocation(setNewKitchen, "location")}>📍 Use My Location</button>
                <input type="number" name="volunteersNeeded" min="1" placeholder="Volunteers Needed" value={newKitchen.volunteersNeeded} onChange={handleKitchenChange} required />
                <button type="submit">Add Kitchen</button>
              </form>
            </div>
          </div>
        )}

        {/* Add Event Overlay */}
        {addEventOpen && (
          <div className="overlay">
            <div className="overlay-form">
              <button className="close-btn" onClick={() => setAddEventOpen(false)}>✖</button>
              <h2>Add New Event</h2>
              <form onSubmit={handleAddEvent}>
                <input type="date" name="date" value={newEvent.date} onChange={handleEventChange} required />
                <input type="number" name="meals" placeholder="Meals to be served" value={newEvent.meals} onChange={handleEventChange} required />
                <select name="relatedKitchen" value={newEvent.relatedKitchen} onChange={handleEventChange} required>
                  <option value="">Select Kitchen</option>
                  {kitchens.map((k, i) => (
                    <option key={i} value={k.name}>{k.name} - {k.location}</option>
                  ))}
                </select>
                <button type="submit">Add Event</button>
              </form>
            </div>
          </div>
        )}

        {/* Kitchens */}
        <div className="community-find-kitchen">
          <h2>Find a Kitchen</h2>
          <input type="text" placeholder="Search by name or location..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          {filteredKitchens.length > 0 ? (
            <div className="card-grid">
              {filteredKitchens.map((kitchen, index) => (
                <div key={index} className="kitchen-card">
                  <h3>{kitchen.name}</h3>
                  <p>📍 {kitchen.location}</p>
                  <p>📞 {kitchen.contact}</p>
                  <p>👥 Volunteers Needed: {kitchen.volunteersNeeded}</p>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ textAlign: "center", marginTop: "2rem" }}>No kitchens match your search.</p>
          )}
        </div>

        {/* Events */}
        <div className="community-events">
          <h2>Upcoming Events</h2>
          {events.length > 0 ? (
            <div className="card-grid">
              {events.map((event, index) => (
                <div key={index} className="event-card">
                  <h3>{event.relatedKitchen}</h3>
                  <p>📅 {event.date}</p>
                  <p>🍽️ Meals: {event.meals}</p>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ textAlign: "center", marginTop: "2rem" }}>No upcoming events.</p>
          )}
        </div>

        {/* Volunteers */}
        <div className="community-volunteers">
          <h2>Our Volunteers</h2>
          {volunteers.length > 0 ? (
            <div className="card-grid">
              {volunteers.map((v, index) => (
                <div key={index} className="volunteer-card">
                  <h3>{v.name}</h3>
                  <p>📞 {v.contact}</p>
                  <p>📍 {v.location}</p>
                  <p>⏱ {v.availability}</p>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ textAlign: "center", marginTop: "2rem" }}>No volunteers registered yet.</p>
          )}
        </div>
      </section>
      
    </>
  );
}
