const express = require("express");
const protect = require("../middleware/auth");
const User = require("../models/User");

const router = express.Router();

router.get("/", protect, async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  res.json(user);
});

router.put("/", protect, async (req, res) => {
  const updates = req.body;
  const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true });
  res.json(user);
});

module.exports = router;
