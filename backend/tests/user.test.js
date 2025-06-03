const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
require('dotenv').config({ path: '.env.test' });

let token;

beforeAll(async () => {
  const dbUri = process.env.MONGO_URI;
  await mongoose.connect(dbUri);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

describe('User Authentication', () => {
  const testUser = {
    name: 'Test User',
    email: 'testuser@example.com',
    password: 'testpassword'
  };

  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(testUser);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('token');
  });

  it('should log in the user and return token', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: testUser.email, password: testUser.password });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
    token = res.body.token;
  });

  it('should fetch the user profile with token', async () => {
    const res = await request(app)
      .get('/api/profile')
      .set('Authorization', `Bearer ${token}`);

    console.log("👤 PROFILE RESPONSE:", res.body);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('email', testUser.email);
  });
});
