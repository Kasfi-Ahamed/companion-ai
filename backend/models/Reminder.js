// backend/models/Reminder.js
const mongoose = require("mongoose");

const ReminderSchema = new mongoose.Schema({
  title: { type: String, required: true },
  time: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
}, { timestamps: true });

module.exports = mongoose.model("Reminder", ReminderSchema);
