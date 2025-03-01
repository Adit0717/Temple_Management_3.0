const request = require('supertest');
const app = require('../server'); 
const User = require('../class-models/User'); 
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

jest.mock('../class-models/User');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('POST /login', () => {
  let mockUser;

  beforeEach(() => {
    mockUser = {
      empId: '12345',
      email: 'test@example.com',
      password: '$2b$10$w5fnfoiL6FET9oA0S91yTeZc8G0NSP8N8wQFX3q5sUsY6bUzCEXl2',
      role: 'admin'
    };
  });

  it('should return 400 if user is not found', async () => {
    User.findOne.mockResolvedValue(null);

    const response = await request(app)
      .post('/login')
      .send({ email: 'test@example.com', password: 'password123', role: 'admin' });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('User not found');
  });

  it('should return 400 if credentials are invalid', async () => {
    User.findOne.mockResolvedValue(mockUser);
    
    bcrypt.compare.mockResolvedValue(false);

    const response = await request(app)
      .post('/login')
      .send({ email: 'test@example.com', password: 'wrongpassword', role: 'admin' });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Invalid credentials');
  });

  it('should return 200 with token if login is successful', async () => {
    User.findOne.mockResolvedValue(mockUser);

    bcrypt.compare.mockResolvedValue(true);

    jwt.sign.mockReturnValue('fake-jwt-token');

    const response = await request(app)
      .post('/login')
      .send({ email: 'test@example.com', password: 'password123', role: 'admin' });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Logged successfully');
    expect(response.body.token).toBe('fake-jwt-token');
    expect(response.body.user).toEqual(mockUser);
  });

});
