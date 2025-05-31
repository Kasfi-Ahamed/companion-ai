const mongoose = require("mongoose");

const ReminderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    task: { type: String, required: true },
    time: { type: String, required: true },
  },
  { timestamps: true }
);

// Improve error visibility for production
ReminderSchema.post('save', function (error, doc, next) {
  if (error.name === 'ValidationError') {
    next(new Error('Reminder validation failed'));
  } else {
    next(error);
  }
});

module.exports = mongoose.model("Reminder", ReminderSchema);
