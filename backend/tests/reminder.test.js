const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");
const User = require("../models/User");
const Reminder = require("../models/Reminder");

let token;
let reminderId;

jest.setTimeout(20000);

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  await User.deleteOne({ email: "reminder@example.com" });

  await request(app).post("/api/auth/register").send({
    name: "Reminder Tester",
    email: "reminder@example.com",
    password: "password123"
  });

  const res = await request(app).post("/api/auth/login").send({
    email: "reminder@example.com",
    password: "password123"
  });

  token = res.body.token;
});

afterAll(async () => {
  await Reminder.deleteMany({});
  await User.deleteOne({ email: "reminder@example.com" });
  await mongoose.connection.close();
});

describe("Reminder CRUD", () => {
  test("Create a new reminder", async () => {
    const res = await request(app)
      .post("/api/reminder")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Test Reminder",
        description: "This is a test",
        time: "2025-12-31T23:59"
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe("Test Reminder");
    reminderId = res.body._id;
  });

  test("Get all reminder", async () => {
    const res = await request(app)
      .get("/api/reminder")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test("Delete the reminder", async () => {
    const res = await request(app)
      .delete(`/api/reminder/${reminderId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/deleted/i);
  });
});
