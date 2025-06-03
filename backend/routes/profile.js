// backend/routes/profile.js
const express = require("express");
const router = express.Router();
const protect = require("../middleware/auth");

router.get("/", protect, async (req, res) => {
  try {
    res.status(200).json({
      name: req.user.name,
      email: req.user.email,
      mood: req.user.mood,
    });
  } catch (err) {
    console.error("Profile error:", err.message);
    res.status(500).json({ message: "Error fetching user profile" });
  }
});

module.exports = router;
