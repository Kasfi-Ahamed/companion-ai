const request = require("supertest");
const app = require("../app");
const mongoose = require("mongoose");
const User = require("../models/User");

let token;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  await User.deleteMany({});
  const user = new User({ name: "Test User", email: "testuser@example.com", password: "password123" });
  await user.save();

  const res = await request(app).post("/api/auth/login").send({
    email: "testuser@example.com",
    password: "password123",
  });

  token = res.body.token;
});

afterAll(async () => {
  await mongoose.disconnect();
});

describe("User Authentication", () => {
  test("Fetch user profile", async () => {
    const res = await request(app)
      .get("/api/profile")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("email", "testuser@example.com");
  });
});
