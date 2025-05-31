require("dotenv").config({ path: ".env.test" });
const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");
const Reminder = require("../models/Reminder");
const User = require("../models/User");

let token;
let reminderId;

jest.setTimeout(60000); // Extend timeout to 60s for Docker

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  // Clear the entire DB to avoid duplicates
  await mongoose.connection.dropDatabase();

  // Register and login to get token
  await request(app).post("/api/auth/register").send({
    name: "Reminder Tester",
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

describe("Reminder CRUD", () => {
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
