const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");
const User = require("../models/User");

const testEmail = `testuser_${Date.now()}@example.com`;
let token;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);
});

afterAll(async () => {
  await mongoose.connection.db.dropDatabase();
  await mongoose.connection.close();
});

describe("User Auth Flow", () => {
  test("Register a new user", async () => {
    const res = await request(app).post("/api/auth/register").send({
      name: "Test User",
      email: testEmail,
      password: "password123"
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  test("Login with the new user", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: testEmail,
      password: "password123"
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
    token = res.body.token;
  });

  test("Get user profile", async () => {
    const res = await request(app)
      .get("/api/profile")
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.email).toBe(testEmail);
  });

  test("Update user mood", async () => {
    const res = await request(app)
      .put("/api/profile/mood")
      .set("Authorization", `Bearer ${token}`)
      .send({ mood: "Happy" });
    expect(res.statusCode).toBe(200);
    expect(res.body.mood).toBe("Happy");
  });
});
