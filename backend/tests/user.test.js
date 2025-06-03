const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');

let token;

beforeAll(async () => {
  await request(app).post('/api/auth/register').send({
    name: 'User Tester',
    email: 'user@test.com',
    password: 'test123'
  });

  const res = await request(app).post('/api/auth/login').send({
    email: 'user@test.com',
    password: 'test123'
  });

  token = res.body.token;
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('User/Profile API', () => {
  test('Get profile data', async () => {
    const res = await request(app)
      .get('/api/profile')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.email).toBe('user@test.com');
  });

  test('Update mood', async () => {
    const res = await request(app)
      .put('/api/profile/mood')
      .set('Authorization', `Bearer ${token}`)
      .send({ mood: 'Happy' });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Mood updated successfully');
  });
});
