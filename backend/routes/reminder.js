// backend/routes/reminder.js
const express = require("express");
const router = express.Router();
const Reminder = require("../models/Reminder");
const protect = require("../middleware/auth");

// Create Reminder
router.post("/", protect, async (req, res) => {
  try {
    const { title, time } = req.body;
    const reminder = new Reminder({ title, time, user: req.user._id });
    const saved = await reminder.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("Create reminder error:", err.message);
    res.status(500).json({ message: "Error creating reminder" });
  }
});

// Get All Reminders
router.get("/", protect, async (req, res) => {
  try {
    const reminders = await Reminder.find({ user: req.user._id });
    res.status(200).json(reminders);
  } catch (err) {
    console.error("Fetch reminders error:", err.message);
    res.status(500).json({ message: "Error fetching reminders" });
  }
});

// Delete Reminder
router.delete("/:id", protect, async (req, res) => {
  try {
    const reminder = await Reminder.findById(req.params.id);
    if (!reminder) return res.status(404).json({ message: "Reminder not found" });

    if (reminder.user.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Not authorized" });

    await reminder.deleteOne();
    res.status(200).json({ message: "Reminder deleted" });
  } catch (err) {
    console.error("Delete reminder error:", err.message);
    res.status(500).json({ message: "Error deleting reminder" });
  }
});

module.exports = router;
