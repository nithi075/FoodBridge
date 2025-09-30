const Food = require("../models/foodModel"); // Imports the Food Model

// 1. Add a new food donation
const addFood = async (req, res) => {
  try {
    const { foodName, quantityNumber, quantityUnit, expiryTime, contactNumber, location } = req.body;

    if (!foodName || !quantityNumber || !expiryTime || !contactNumber || !location?.city || !location?.address) {
      return res.status(400).json({ msg: "Missing required fields (foodName, quantity, expiryTime, city, address, contactNumber are required)" });
    }

    const food = await Food.create({
      provider: req.user.id,
      foodName,
      quantityNumber,
      quantityUnit: quantityUnit || "plates",
      expiryTime,
      contactNumber, // <-- Save contact number
      location,
      status: "available",
    });

    res.status(201).json({ msg: "Food donation added successfully", food });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error during food donation: " + err.message });
  }
};


// 2. Get all available food donations
const getAllFood = async (req, res) => {
  try {
    // Extract query parameters
    const { city, q, recent } = req.query;
    
    // Filtering conditions: must be 'available' status and not expired
    const filter = { status: "available", expiryTime: { $gt: new Date() } };

    if (city) filter["location.city"] = city; // Filter by city
    if (q) filter.foodName = { $regex: q, $options: "i" }; // Search by food name (Case-insensitive)

    let query = Food.find(filter).populate("provider", "name location"); // Join provider's name and location
    
    if (recent === "true") query = query.sort({ createdAt: -1 }).limit(6); // Get only the last 6 recent items

    const list = await query.exec();
    res.json(list);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error while fetching food list: " + err.message });
  }
};

// 3. Get nearby donations based on city
const getNearbyDonations = async (req, res) => {
  try {
    const { city, q } = req.query;

    if (!city || city.trim() === "") {
      return res.status(200).json([]); // Return an empty list if no city is provided
    }

    const filter = {
      status: "available",
      expiryTime: { $gt: new Date() },
      // Match the city name exactly (Case-insensitive)
      "location.city": { $regex: new RegExp(`^${city.trim()}$`, "i") }, 
    };

    if (q) filter.foodName = { $regex: q, $options: "i" };

    const donations = await Food.find(filter)
      .populate("provider", "name location")
      .sort({ createdAt: -1 });

    res.json(donations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error while fetching nearby donations: " + err.message });
  }
};

// 4. Update the status of a food donation
const updateFoodStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const allowed = ["available", "claimed", "delivered"]; // Allowed statuses

    if (!allowed.includes(status)) {
      return res.status(400).json({ msg: "Invalid status. Must be available, claimed, or delivered." });
    }

    const food = await Food.findById(id);
    if (!food) return res.status(404).json({ msg: "Food donation not found" });

    // Optional: Check if the user making the request is the original provider
    // if (food.provider.toString() !== req.user.id) {
    //   return res.status(401).json({ msg: "Not authorized to update this food status" });
    // }

    food.status = status;
    await food.save();

    res.json({ msg: "Status updated successfully", food });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error while updating food status: " + err.message });
  }
};

module.exports = {
  addFood,
  getAllFood,
  getNearbyDonations,
  updateFoodStatus,
};