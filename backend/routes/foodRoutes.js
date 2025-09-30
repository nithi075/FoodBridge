const express = require("express");
const {
  addFood,
  getAllFood,
  updateFoodStatus,
  getNearbyDonations, // <-- Correctly imported
} = require("../controllers/foodController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Add a new food donation
router.post("/add", protect, addFood);

// Get all food donations (with optional filters)
router.get("/", getAllFood);

// Get nearby donations (by city)
router.get("/nearby-donations", getNearbyDonations); // <-- Correct route path

// Update food status
router.put("/:id/status", protect, updateFoodStatus);

module.exports = router;