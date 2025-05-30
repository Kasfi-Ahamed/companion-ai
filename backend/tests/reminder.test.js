jest.setTimeout(20000);
const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");
const Reminder = require("../models/Reminder");

require("dotenv").config({ path: ".env.test" });

let token, reminderId;

beforeAll(async () => {
  await User.deleteOne({ email: "reminder@example.com" });
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

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
  await Reminder.deleteMany({});
  await mongoose.connection.close();
});

describe("Reminder CRUD", () => {
  test("Create a new reminder", async () => {
    const res = await request(app)
      .post("/api/reminder")
      .set("Authorization", `Bearer ${token}`)
      .send({
        task: "Take medicine",
        time: "09:00"
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.task).toBe("Take medicine");
    reminderId = res.body._id;
  });

  test("Get all reminder", async () => {
    const res = await request(app)
      .get("/api/reminder")
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  test("Delete the reminder", async () => {
    const res = await request(app)
      .delete(`/api/reminder/${reminderId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Deleted");
  });
});
