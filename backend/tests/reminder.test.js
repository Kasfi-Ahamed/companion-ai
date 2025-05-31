// reminder.test.js
const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");
const Reminder = require("../models/Reminder");
const User = require("../models/User"); // ✅ FIXED: Import User model

let token;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  await User.deleteOne({ email: "reminder@example.com" });

  // Register test user
  await request(app).post("/api/auth/register").send({
    name: "Reminder User",
    email: "reminder@example.com",
    password: "test123"
  });

  // Login to get token
  const res = await request(app).post("/api/auth/login").send({
    email: "reminder@example.com",
    password: "test123"
  });
  token = res.body.token;
});

afterAll(async () => {
  await Reminder.deleteMany({});
  await User.deleteOne({ email: "reminder@example.com" });
  await mongoose.connection.close();
});

describe("Reminder CRUD", () => {
  let reminderId;

  it("Create a new reminder", async () => {
    const res = await request(app)
      .post("/api/reminder")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Buy groceries",
        date: "2025-12-01"
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe("Buy groceries");
    reminderId = res.body._id;
  });

  it("Get all reminder", async () => {
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
    expect(res.body.message).toBe("Reminder deleted successfully");
  });
});
