const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");
const User = require("../models/User");
const Reminder = require("../models/Reminder");

let token;
let reminderId;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  await User.deleteOne({ email: "reminder@example.com" });

  await request(app).post("/api/auth/register").send({
    name: "Reminder Tester",
    email: "reminder@example.com",
    password: "123456"
  });

  const res = await request(app).post("/api/auth/login").send({
    email: "reminder@example.com",
    password: "123456"
  });

  token = res.body.token;
});

afterAll(async () => {
  await Reminder.deleteMany({});
  await User.deleteOne({ email: "reminder@example.com" });
  await mongoose.connection.close();
});

describe("Reminder CRUD", () => {
  it("should create a new reminder", async () => {
    const res = await request(app)
      .post("/api/reminder")
      .set("Authorization", `Bearer ${token}`)
      .send({
        task: "Test Reminder Task",
        time: "12:00 PM"
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.task).toBe("Test Reminder Task");
    reminderId = res.body._id;
  });

  it("should get all reminders", async () => {
    const res = await request(app)
      .get("/api/reminder")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("should delete the reminder", async () => {
    const res = await request(app)
      .delete(`/api/reminder/${reminderId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Reminder deleted");
  });
});
