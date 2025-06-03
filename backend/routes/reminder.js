// routes/reminder.js
const express = require("express");
const router = express.Router();
const Reminder = require("../models/Reminder");
const protect = require("../middleware/auth");

router.post("/", protect, async (req, res) => {
  try {
    const reminder = new Reminder({
      user: req.user.id,
      title: req.body.title,
      time: req.body.time,
    });
    const saved = await reminder.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("❌ Error creating reminder:", err.message);
    res.status(500).json({ message: "Error creating reminder" });
  }
});

router.get("/", protect, async (req, res) => {
  try {
    const reminders = await Reminder.find({ user: req.user.id });
    res.status(200).json(reminders);
  } catch (err) {
    console.error("❌ Error fetching reminders:", err.message);
    res.status(500).json({ message: "Error fetching reminders" });
  }
});

router.delete("/:id", protect, async (req, res) => {
  try {
    const reminder = await Reminder.findById(req.params.id);
    if (!reminder) return res.status(404).json({ message: "Reminder not found" });

    if (reminder.user.toString() !== req.user.id)
      return res.status(403).json({ message: "Not authorized to delete this reminder" });

    await reminder.deleteOne();
    res.status(200).json({ message: "Reminder deleted" });
  } catch (err) {
    console.error("❌ Error deleting reminder:", err.message);
    res.status(500).json({ message: "Error deleting reminder" });
  }
});

module.exports = router;
