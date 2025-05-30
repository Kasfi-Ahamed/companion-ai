const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const profileRoutes = require("./routes/profile");
const reminderRoutes = require("./routes/reminder");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/reminder", reminderRoutes);

// ✅ Dummy Prometheus metrics endpoint (for Monitoring stage)
app.get("/metrics", (req, res) => {
  res.set("Content-Type", "text/plain");
  res.send("# HELP dummy_metric Just a dummy\n# TYPE dummy_metric counter\ndummy_metric 1");
});

app.get("/", (req, res) => res.send("Companion AI Backend Running"));

module.exports = app;
