// routes/profile.js
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const protect = require("../middleware/auth");

router.get("/", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (err) {
    console.error("❌ Error in /api/profile:", err.message);
    res.status(500).json({ message: "Error fetching user profile" });
  }
});

module.exports = router;
