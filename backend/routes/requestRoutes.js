const express = require("express");
// 🚨 NOTE: getRequestsForFood is needed for the /all route
const { 
    createRequest, 
    getRequestsForFood, // Assuming this function gets ALL or filtered by foodId
    getNearbyDonations, // This function must be imported to handle '/nearby'
    updateRequestStatus 
} = require("../controllers/requestController"); 
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

// Create a new request
router.post("/create", protect, createRequest);

// 1. GET NEARBY: Must be specific and come first. Frontend uses '/request/nearby?...'
router.get("/nearby", protect, getNearbyDonations); 

// 2. GET ALL: Must be specific and come before the dynamic ID route. Frontend uses '/request/all'
router.get("/all", protect, getRequestsForFood); 

// 3. GET BY ID (or specific food): The dynamic route
router.get("/:foodId", protect, getRequestsForFood);

// Update request status
router.put("/:id/status", protect, updateRequestStatus);

module.exports = router;