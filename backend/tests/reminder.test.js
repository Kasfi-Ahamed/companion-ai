const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");
const User = require("../models/User");
const Reminder = require("../models/Reminder");

let token;
let reminderId;

beforeAll(async () => {
  const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/companion-ai-test";
  await mongoose.connect(mongoUri);
  await Reminder.deleteMany({});
  await User.deleteMany({});

  await request(app).post("/api/auth/register").send({
    name: "Reminder User",
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
  await mongoose.connection.close();
});

describe("Reminder API", () => {
  test("Create a reminder", async () => {
    const res = await request(app)
      .post("/api/reminder")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Take medicine",
        time: "09:00 AM",
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe("Take medicine");
    reminderId = res.body._id;
  });

  test("Fetch all reminders", async () => {
    const res = await request(app)
      .get("/api/reminder")
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test("Delete reminder", async () => {
    const res = await request(app)
      .delete(`/api/reminder/${reminderId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Reminder deleted");
  });
});
