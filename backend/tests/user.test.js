jest.setTimeout(20000);
const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");
const User = require("../models/User");

require("dotenv").config({ path: ".env.test" });

let token;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  await User.deleteOne({ email: "test@example.com" }); // clean up before test
});

afterAll(async () => {
  await User.deleteOne({ email: "test@example.com" }); // clean up after test
  await mongoose.connection.close();
});

describe("User Auth Flow", () => {
  test("Register a new user", async () => {
    const res = await request(app).post("/api/auth/register").send({
      name: "Test User",
      email: "test@example.com",
      password: "password123"
    });
    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe("Registered successfully");
  });

  test("Login with the new user", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "test@example.com",
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
    expect(res.body.email).toBe("test@example.com");
  });

  test("Update user mood", async () => {
    const res = await request(app)
      .put("/api/profile")
      .set("Authorization", `Bearer ${token}`)
      .send({ mood: "Happy" });
    expect(res.statusCode).toBe(200);
    expect(res.body.mood).toBe("Happy");
  });
});
