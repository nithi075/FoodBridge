const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ msg: "No token, authorization denied" });
    }
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Attach user info (id, role) to req; fetch minimal user if needed
    req.user = { id: decoded.id, role: decoded.role };
    // Optionally attach user full document:
    req.userDoc = await User.findById(decoded.id).select("-password");
    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({ msg: "Token is not valid" });
  }
};

module.exports = { protect };
