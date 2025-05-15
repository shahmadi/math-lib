const request = require('supertest');

// Base URL of your running server
const BASE_URL = 'http://localhost:3000';

describe('Math Library Express Integration', () => {
  // Check if server is running before tests
  beforeAll(async () => {
    try {
      await request(BASE_URL).get('/');
    } catch {
      throw new Error('Server must be running to execute these tests');
    }
  });

  test.skip('GET /add/:a/:b returns correct sum', async () => {
    const response = await request(BASE_URL)
      .get('/add/5/3')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body).toEqual({ result: 8 });
  });

  test.skip('handles negative numbers', async () => {
    const response = await request(BASE_URL)
      .get('/add/-5/3')
      .expect(200);

    expect(response.body).toEqual({ result: -2 });
  });
});
