const Request = require("../models/requestModel");

// Create a new food request
const createRequest = async (req, res) => {
  try {
    const { name, phone, meals, location, notes, coordinates } = req.body;

    if (!name || !phone || !meals || !location || !coordinates) {
      return res.status(400).json({
        msg: "Required fields missing: Name, Phone, Meals, Location, Coordinates",
      });
    }

    const request = await Request.create({
      name,
      phone,               // Include phone
      meals,
      location,
      notes: notes || "",
      coordinates: { type: "Point", coordinates }, 
      requester: req.user.id,
    });

    res.status(201).json({ msg: "Request created", request });
  } catch (err) {
    console.error("Error creating request:", err);
    res.status(500).json({ msg: "Server error during request creation." });
  }
};

// Get all requests (or filtered by foodId in future)
const getRequestsForFood = async (req, res) => {
  try {
    const requests = await Request.find().sort({ createdAt: -1 });
    res.status(200).json(requests);
  } catch (err) {
    console.error("Error fetching requests:", err);
    res.status(500).json({ msg: "Server error fetching requests." });
  }
};

// Get nearby donations
const getNearbyDonations = async (req, res) => {
  try {
    const { lat, lng, radius = 10 } = req.query;
    if (!lat || !lng)
      return res.status(400).json({ msg: "Latitude and longitude required" });

    const nearby = await Request.find({
      status: "pending",
      coordinates: {
        $near: {
          $geometry: { type: "Point", coordinates: [parseFloat(lng), parseFloat(lat)] },
          $maxDistance: radius * 1000, // km → meters
        },
      },
    });

    res.json(nearby);
  } catch (err) {
    console.error("Error fetching nearby donations:", err);
    res.status(500).json({ msg: "Server error fetching nearby donations." });
  }
};

// Update request status (placeholder)
const updateRequestStatus = async (req, res) => {
  res.status(501).json({ msg: "Update Request Status not implemented yet." });
};

module.exports = {
  createRequest,
  getRequestsForFood,
  getNearbyDonations,
  updateRequestStatus,
};
