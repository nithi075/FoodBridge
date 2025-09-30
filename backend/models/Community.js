const mongoose = require("mongoose");

const communitySchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["kitchen", "volunteer", "event"],
    required: true,
  },
  // Kitchen fields
  name: { type: String },
  location: { type: String },
  volunteersNeeded: { type: Number }, // only for kitchens
  contact: { type: String },           // new contact field for kitchen/volunteer

  // Volunteer fields
  availability: { type: String },      // only for volunteers

  // Event fields
  date: { type: String },
  meals: { type: Number },
  relatedKitchen: { type: String },

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Community", communitySchema);
