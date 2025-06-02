const express = require('express');
const User = require('../models/User');
const protect = require('../middleware/auth');

const router = express.Router();

// Get profile
router.get('/', protect, async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  res.json(user);
});

// Update profile
router.put('/', protect, async (req, res) => {
  const { name, email } = req.body;
  const user = await User.findByIdAndUpdate(req.user.id, { name, email }, { new: true });
  res.json(user);
});

module.exports = router;
