const express = require("express");
const Reminder = require("../models/Reminder");
const protect = require("../middleware/auth");

const router = express.Router();

// Get all reminders for the user
router.get("/", protect, async (req, res) => {
  try {
    const reminders = await Reminder.find({ user: req.user._id });
    res.status(200).json(reminders);
  } catch (err) {
    res.status(500).json({ message: "Error fetching reminders" });
  }
});

// Add a new reminder
router.post("/", protect, async (req, res) => {
  try {
    const { title, time } = req.body;
    const reminder = new Reminder({ user: req.user._id, title, time });
    await reminder.save();
    res.status(201).json(reminder);
  } catch (err) {
    res.status(500).json({ message: "Error creating reminder" });
  }
});

// Delete a reminder
router.delete("/:id", protect, async (req, res) => {
  try {
    await Reminder.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Reminder deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting reminder" });
  }
});

module.exports = router;
