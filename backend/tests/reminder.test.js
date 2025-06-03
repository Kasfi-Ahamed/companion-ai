const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');

let token;
let reminderId;

beforeAll(async () => {
  await request(app).post('/api/auth/register').send({
    name: 'Reminder Tester',
    email: 'reminder@test.com',
    password: 'test123'
  });

  const res = await request(app).post('/api/auth/login').send({
    email: 'reminder@test.com',
    password: 'test123'
  });

  token = res.body.token;
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Reminder API', () => {
  test('Create a new reminder', async () => {
    const res = await request(app)
      .post('/api/reminder')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Test Reminder',
        date: '2025-06-10',
        time: '15:30',
        description: 'Checkup reminder'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe('Test Reminder');
    reminderId = res.body._id;
  });

  test('Get all reminders', async () => {
    const res = await request(app)
      .get('/api/reminder')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('Delete the created reminder', async () => {
    const res = await request(app)
      .delete(`/api/reminder/${reminderId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Reminder deleted successfully');
  });
});
