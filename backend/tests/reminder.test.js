const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
require('dotenv').config({ path: '.env.test' });

let token;
let reminderId;

beforeAll(async () => {
  const dbUri = process.env.MONGO_URI;
  await mongoose.connect(dbUri);

  const testUser = {
    name: 'Reminder Tester',
    email: 'reminder@example.com',
    password: 'testpassword'
  };

  // Register
  await request(app).post('/api/auth/register').send(testUser);

  // Login
  const loginRes = await request(app)
    .post('/api/auth/login')
    .send({ email: testUser.email, password: testUser.password });

  token = loginRes.body.token;
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

describe('Reminder API', () => {
  it('should create a reminder', async () => {
    const res = await request(app)
      .post('/api/reminder')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Test Reminder',
        date: '2025-12-31',
        time: '23:59'
      });

    console.log('📅 CREATE REMINDER RESPONSE:', res.body);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('_id');
    reminderId = res.body._id;
  });

  it('should fetch all reminders', async () => {
    const res = await request(app)
      .get('/api/reminder')
      .set('Authorization', `Bearer ${token}`);

    console.log('📋 FETCH REMINDERS RESPONSE:', res.body);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should delete the reminder', async () => {
    const res = await request(app)
      .delete(`/api/reminder/${reminderId}`)
      .set('Authorization', `Bearer ${token}`);

    console.log('🗑 DELETE REMINDER RESPONSE:', res.body);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Reminder deleted');
  });
});
