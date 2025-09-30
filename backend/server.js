const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

dotenv.config();
const app = express();

// ✅ CORS middleware
app.use(cors({
  origin: "https://foodbridge-1-v01l.onrender.com", // frontend URL
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

// ✅ Handle preflight requests for all routes (fixed wildcard)
app.options("/:path(*)", cors());

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

// ✅ Optional: Catch-all route for unknown paths
app.all("*", (req, res) => {
  res.status(404).send("Route not found ❌");
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
