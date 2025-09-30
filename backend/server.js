const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

dotenv.config();
const app = express();

// ✅ Global CORS middleware
app.use(cors({
  origin: "https://foodbridge-1-v01l.onrender.com",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

// ✅ Preflight handler
app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

// ✅ Middleware
app.use(express.json());

// ✅ Connect to DB
connectDB();

// ✅ Routes
app.use("/api/request", require("./routes/requestRoutes"));
app.use("/api/community", require("./routes/communityRoutes"));
app.use("/api/food", require("./routes/foodRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));

// ✅ Root route
app.get("/", (req, res) => {
  res.send("FoodBridge API Running ✅");
});

// ✅ Catch-all 404 handler
app.use((req, res, next) => {
  res.status(404).send("Route not found ❌");
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
