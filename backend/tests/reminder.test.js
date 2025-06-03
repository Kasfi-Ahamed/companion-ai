const request = require("supertest");
const app = require("../app");
const mongoose = require("mongoose");
const User = require("../models/User");
const Reminder = require("../models/Reminder");

let token;
let reminderId;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  await User.deleteMany({});
  await Reminder.deleteMany({});

  const user = new User({ name: "Reminder Tester", email: "reminder@example.com", password: "password123" });
  await user.save();

  const loginRes = await request(app).post("/api/auth/login").send({
    email: "reminder@example.com",
    password: "password123",
  });

  token = loginRes.body.token;
});

afterAll(async () => {
  await mongoose.disconnect();
});

describe("Reminder API", () => {
  test("Create a reminder", async () => {
    const res = await request(app)
      .post("/api/reminder")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Doctor Appointment", time: "2025-06-02 10:00" });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("_id");
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
