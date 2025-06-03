const request = require('supertest');
const app = require('../app');

describe('Smoke Test', () => {
  test('API root should respond with 404 or custom message', async () => {
    const res = await request(app).get('/');
    // You can change the expectations depending on how the root route is handled
    expect([404, 200]).toContain(res.statusCode);
  });

  test('Auth login route should respond with 400 on missing data', async () => {
    const res = await request(app).post('/api/auth/login').send({});
    expect(res.statusCode).toBe(400);
  });
});
