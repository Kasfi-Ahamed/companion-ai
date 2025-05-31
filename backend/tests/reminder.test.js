const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");
const Reminder = require("../models/Reminder");
const User = require("../models/User"); // ✅ FIXED: Import User model

let token;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  await User.deleteOne({ email: "reminder@example.com" }); // ✅ AFTER DB CONNECT
  await Reminder.deleteMany({}); // Clean up reminders

  await request(app).post("/api/auth/register").send({
    name: "Test User",
    email: "reminder@example.com",
    password: "password123",
  });

  const loginRes = await request(app).post("/api/auth/login").send({
    email: "reminder@example.com",
    password: "password123",
  });

  token = loginRes.body.token;
});

afterAll(async () => {
  await mongoose.disconnect();
});

describe("Reminder CRUD", () => {
  let reminderId;

  it("Create a new reminder", async () => {
    const res = await request(app)
      .post("/api/reminder")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Test Reminder",
        date: "2025-12-31",
        time: "10:00 AM",
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.reminder.title).toBe("Test Reminder");
    reminderId = res.body.reminder._id;
  });

  it("Get all reminders", async () => {
    const res = await request(app)
      .get("/api/reminder")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("Delete the reminder", async () => {
    const res = await request(app)
      .delete(`/api/reminder/${reminderId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Reminder deleted");
  });
});
