const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env.test") });

const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");
const User = require("../models/User");

jest.setTimeout(60000); // Extend timeout to 60s for Docker

beforeAll(async () => {
  if (!process.env.MONGO_URI) throw new Error("❌ MONGO_URI is undefined");
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  await mongoose.connection.dropDatabase();
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("User Auth Flow", () => {
  it("should register a new user", async () => {
    const res = await request(app).post("/api/auth/register").send({
      name: "Test User",
      email: "testuser@example.com",
      password: "123456"
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.token).toBeDefined();
  });

  it("should log in the user", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "testuser@example.com",
      password: "123456"
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
  });
});
