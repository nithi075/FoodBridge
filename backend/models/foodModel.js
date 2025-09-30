const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema(
  {
    provider: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    foodName: { type: String, required: true },
    quantityNumber: { type: Number, required: true },
    quantityUnit: { type: String, default: "plates" },
    expiryTime: { type: Date, required: true },

    contactNumber: { type: String, required: true }, // <-- NEW FIELD

    location: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      district: { type: String },
      state: { type: String },
      country: { type: String },
    },

    status: {
      type: String,
      enum: ["available", "claimed", "delivered"],
      default: "available",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Food", foodSchema);
