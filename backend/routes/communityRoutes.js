const express = require("express");
const {
  addKitchen,
  registerVolunteer,
  addEvent,
  getKitchens,
  getVolunteers,
  getEvents
} = require("../controllers/communityController");

const router = express.Router();

// Kitchens
router.post("/kitchens", addKitchen);
router.get("/kitchens", getKitchens);

// Volunteers
router.post("/volunteers", registerVolunteer);
router.get("/volunteers", getVolunteers);

// Events
router.post("/events", addEvent);
router.get("/events", getEvents);

module.exports = router;
