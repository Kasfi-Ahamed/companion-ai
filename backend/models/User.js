const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    mood: { type: String, default: "Neutral" }
  },
  { timestamps: true }
);

// Indexing for faster lookup during login
UserSchema.index({ email: 1 });

module.exports = mongoose.model("User", UserSchema);
