const Community = require("../models/Community");

// Add new kitchen
// Add new kitchen
const addKitchen = async (req, res) => {
  try {
    const { name, location, volunteersNeeded, contact } = req.body;
    if (!name || !location || !contact)
      return res.status(400).json({ msg: "Name, location and contact are required" });

    const kitchen = await Community.create({
      type: "kitchen",
      name,
      location,
      volunteersNeeded,
      contact
    });

    res.status(201).json({ msg: "Kitchen added", kitchen });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error adding kitchen" });
  }
};

// Register volunteer
const registerVolunteer = async (req, res) => {
  try {
    const { name, contact, location, availability } = req.body;
    if (!name || !contact || !location || !availability)
      return res.status(400).json({ msg: "All fields are required" });

    const volunteer = await Community.create({
      type: "volunteer",
      name,
      contact,
      location,
      availability
    });

    res.status(201).json({ msg: "Volunteer registered", volunteer });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error registering volunteer" });
  }
};

// Add event
const addEvent = async (req, res) => {
  try {
    const { date, relatedKitchen, meals } = req.body;
    if (!date || !relatedKitchen || !meals)
      return res.status(400).json({ msg: "All fields are required" });

    const event = await Community.create({
      type: "event",
      date,
      relatedKitchen,
      meals
    });

    res.status(201).json({ msg: "Event added", event });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error adding event" });
  }
};

// Get kitchens
const getKitchens = async (req, res) => {
  try {
    const kitchens = await Community.find({ type: "kitchen" }).sort({ createdAt: -1 });
    res.json(kitchens);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error fetching kitchens" });
  }
};

// Get volunteers
const getVolunteers = async (req, res) => {
  try {
    const volunteers = await Community.find({ type: "volunteer" }).sort({ createdAt: -1 });
    res.json(volunteers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error fetching volunteers" });
  }
};

// Get events
const getEvents = async (req, res) => {
  try {
    const events = await Community.find({ type: "event" }).sort({ date: 1 });
    res.json(events);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error fetching events" });
  }
};

module.exports = {
  addKitchen,
  registerVolunteer,
  addEvent,
  getKitchens,
  getVolunteers,
  getEvents
};
