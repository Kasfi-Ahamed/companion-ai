const request = require("supertest");
const app = require("../app");
const mongoose = require("mongoose");
require("dotenv").config({ path: ".env.test" });

let token = "";

beforeAll(async () => {
  const registerRes = await request(app).post("/api/auth/register").send({
    name: "Test User",
    email: "testuser@example.com",
    password: "testpassword",
  });

  const loginRes = await request(app).post("/api/auth/login").send({
    email: "testuser@example.com",
    password: "testpassword",
  });

  token = loginRes.body.token;
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("User Authentication", () => {
  it("Fetch user profile", async () => {
    const res = await request(app)
      .get("/api/profile")
      .set("Authorization", `Bearer ${token}`);

    console.log("👤 PROFILE RESPONSE:", res.body);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("email", "testuser@example.com");
  });
});
