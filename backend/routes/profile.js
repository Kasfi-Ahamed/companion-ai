const express = require("express");
const User = require("../models/User");
const protect = require("../middleware/auth");

const router = express.Router();

// Get profile
router.get("/", protect, async (req, res) => {
  res.status(200).json(req.user);
});

// Update mood
router.post("/mood", protect, async (req, res) => {
  try {
    const { mood } = req.body;
    req.user.mood = mood;
    await req.user.save();
    res.status(200).json({ message: "Mood updated", mood });
  } catch (err) {
    res.status(500).json({ message: "Error updating mood" });
  }
});

// Update profile
router.put("/", protect, async (req, res) => {
  try {
    const { name, email } = req.body;
    req.user.name = name || req.user.name;
    req.user.email = email || req.user.email;
    await req.user.save();
    res.status(200).json({ message: "Profile updated", user: req.user });
  } catch (err) {
    res.status(500).json({ message: "Error updating profile" });
  }
});

module.exports = router;
