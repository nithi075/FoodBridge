const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },       // Name of requester
    phone: { type: String, required: true },      // Contact number
    meals: { type: Number, required: true },      // Number of meals
    location: { type: String, required: true },   // Address / location
    coordinates: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], required: true }, // [lng, lat]
    },
    notes: { type: String },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "delivered"],
      default: "pending",
    },
    requester: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

// 2dsphere index for geospatial queries
requestSchema.index({ coordinates: "2dsphere" });

module.exports = mongoose.model("Request", requestSchema);
