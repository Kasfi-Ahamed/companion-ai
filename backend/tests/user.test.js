const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");
const Reminder = require("../models/Reminder");
const User = require("../models/User"); // ✅ FIXED MISSING IMPORT
const jwt = require("jsonwebtoken");

let token;
let reminderId;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  await User.deleteOne({ email: "reminder@example.com" });
  const user = await User.create({
    name: "Reminder Tester",
    email: "reminder@example.com",
    password: "testpass",
  });

  token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
});

afterAll(async () => {
  await Reminder.deleteMany({}); // Clean reminders
  await User.deleteOne({ email: "reminder@example.com" }); // Clean user
  await mongoose.connection.close();
});

describe("Reminder CRUD", () => {
  it("Create a new reminder", async () => {
    const res = await request(app)
      .post("/api/reminder")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Test Reminder",
        time: "10:00 AM",
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe("Test Reminder");
    reminderId = res.body._id;
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
  });
});
