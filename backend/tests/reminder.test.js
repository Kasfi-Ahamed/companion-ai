require('dotenv').config({ path: '.env.test' });

const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const Reminder = require('../models/Reminder');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

describe('Reminder API', () => {
  let token;
  let reminderId;

  beforeAll(async () => {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/companion-ai-test';
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    await Reminder.deleteMany({});
    await User.deleteMany({});

    const testUser = new User({
      name: 'Reminder User',
      email: 'reminder@example.com',
      password: 'password123',
    });
    await testUser.save();

    token = jwt.sign({ id: testUser._id }, process.env.JWT_SECRET || 'secretkey');
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  test('Create a reminder', async () => {
    const res = await request(app)
      .post('/api/reminder')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Doctor Appointment', time: '2025-06-02 10:00' });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('_id');
    reminderId = res.body._id;
  });

  test('Fetch all reminders', async () => {
    const res = await request(app)
      .get('/api/reminder')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('Delete reminder', async () => {
    const res = await request(app)
      .delete(`/api/reminder/${reminderId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Reminder deleted');
  });
});
