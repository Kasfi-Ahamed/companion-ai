const express = require("express");
const protect = require("../middleware/auth");
const Reminder = require("../models/Reminder");

const router = express.Router();

router.get("/", protect, async (req, res) => {
  const reminders = await Reminder.find({ userId: req.user.id });
  res.json(reminders);
});

router.post("/", protect, async (req, res) => {
  const { task, time } = req.body;
  const reminder = await Reminder.create({ userId: req.user.id, task, time });
  res.status(201).json(reminder);
});

router.delete("/:id", protect, async (req, res) => {
  await Reminder.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

module.exports = router;
