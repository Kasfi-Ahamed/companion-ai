const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");
const User = require("../models/User");
const Reminder = require("../models/Reminder");

jest.setTimeout(20000);

let token;

beforeAll(async () => {
  let connected = false;
  let attempts = 0;

  while (!connected && attempts < 5) {
    try {
      await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      connected = true;
    } catch (err) {
      attempts++;
      console.log(`Retrying MongoDB connection (${attempts})...`);
      await new Promise((res) => setTimeout(res, 3000));
    }
  }

  // Register and login a user for auth token
  await User.deleteMany({});
  const res = await request(app).post("/api/auth/register").send({
    name: "Reminder User",
    email: "reminderuser@example.com",
    password: "test123",
  });

  token = res.body.token;
});

afterAll(async () => {
  await mongoose.connection.db.dropDatabase();
  await mongoose.disconnect();
});

describe("Reminder Routes", () => {
  it("should create a new reminder", async () => {
    const res = await request(app)
      .post("/api/reminder")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Test Reminder",
        description: "Test Description",
        time: "2025-06-01T10:00:00Z",
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("title", "Test Reminder");
  });

  it("should get all reminders", async () => {
    const res = await request(app)
      .get("/api/reminder")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
