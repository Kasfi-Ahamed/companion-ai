const express = require('express');
const Reminder = require('../models/Reminder');
const protect = require('../middleware/auth');

const router = express.Router();

// Create reminder
router.post('/', protect, async (req, res) => {
  const { text, time } = req.body;
  const reminder = await Reminder.create({
    user: req.user.id,
    text,
    time
  });
  res.status(201).json(reminder);
});

// Get reminders
router.get('/', protect, async (req, res) => {
  const reminders = await Reminder.find({ user: req.user.id });
  res.json(reminders);
});

module.exports = router;
