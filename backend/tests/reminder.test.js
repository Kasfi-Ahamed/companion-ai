const request = require("supertest");
const app = require("../app");
const mongoose = require("mongoose");
require("dotenv").config({ path: ".env.test" });

let token = "";
let reminderId = "";

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  await request(app).post("/api/auth/register").send({
    name: "Reminder Tester",
    email: "reminder@example.com",
    password: "test123",
  });

  const loginRes = await request(app).post("/api/auth/login").send({
    email: "reminder@example.com",
    password: "test123",
  });

  token = loginRes.body.token;
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Reminder API", () => {
  it("Create a reminder", async () => {
    const res = await request(app)
      .post("/api/reminder")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Doctor Appointment", time: "2025-06-02 10:00" });

    console.log("📅 CREATE REMINDER RESPONSE:", res.body);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("_id");
    reminderId = res.body._id;
  });

  it("Fetch all reminders", async () => {
    const res = await request(app)
      .get("/api/reminder")
      .set("Authorization", `Bearer ${token}`);

    console.log("📋 FETCH REMINDERS RESPONSE:", res.body);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("Delete reminder", async () => {
    const res = await request(app)
      .delete(`/api/reminder/${reminderId}`)
      .set("Authorization", `Bearer ${token}`);

    console.log("🗑 DELETE REMINDER RESPONSE:", res.body);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Reminder deleted");
  });
});
