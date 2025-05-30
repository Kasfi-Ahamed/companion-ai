const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");
const Reminder = require("../models/Reminder");
const User = require("../models/User");

let token;
let reminderId;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  await Reminder.deleteMany({});
  await User.deleteMany({ email: "reminder@example.com" });

  // Register and login user
  await request(app).post("/api/auth/register").send({
    name: "Reminder User",
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
  await mongoose.connection.db.dropDatabase();
  await mongoose.connection.close();
});

describe("Reminder CRUD", () => {
  test("Create a new reminder", async () => {
    const res = await request(app)
      .post("/api/reminder")
      .set("Authorization", `Bearer ${token}`)
      .send({ task: "Buy milk", time: "10:00 AM" });

    expect(res.statusCode).toBe(200);
    expect(res.body.task).toBe("Buy milk");
    reminderId = res.body._id;
  });

  test("Get all reminders", async () => {
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
    expect(res.body.message).toMatch(/Reminder deleted/);
  });
});
