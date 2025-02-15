const request = require('supertest');
const app = require('../server'); // Import your Express app
const User = require('../class-models/User'); // Import the User model
const nodemailer = require('nodemailer'); // Import nodemailer

// Mock dependencies
jest.mock('../class-models/User');
jest.mock('nodemailer');

describe('POST /generate-otp', () => {
  let mockUser;
  let sendMailMock;

  beforeEach(() => {
    // Mock user data
    mockUser = {
      email: 'test@example.com',
      otp: '12345',
      otpExpiry: Date.now() + 15 * 60 * 1000,
    };

    // Mock nodemailer's sendMail function
    sendMailMock = jest.fn();
    nodemailer.createTransport.mockReturnValue({
      sendMail: sendMailMock,
    });

    // Mock Math.random to return a fixed value for predictable OTP
    jest.spyOn(global.Math, 'random').mockReturnValue(0.12345);
  });

  afterEach(() => {
    jest.restoreAllMocks(); // Restore all mocks after each test
  });

  it('should return 400 if the email is already registered', async () => {
    // Mock User.findOne to return an existing user
    User.findOne.mockResolvedValue(mockUser);

    const response = await request(app)
      .post('/generate-otp')
      .send({ email: 'test@example.com' });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Email already registered');
  });

  /*it('should return 200 and send OTP if email is not registered', async () => {
    // Mock User.findOne to return null (email not registered)
    User.findOne.mockResolvedValue(null);

    // Mock User.prototype.save to simulate saving a new user
    User.prototype.save.mockResolvedValue(mockUser);

    const response = await request(app)
      .post('/generate-otp')
      .send({ email: 'test@example.com' });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('OTP sent to email');

    // Verify that sendMail was called with the correct arguments
    expect(sendMailMock).toHaveBeenCalledWith({
      to: 'test@example.com',
      subject: 'Verify your Email - OTP for Signup',
      text: 'Your OTP for email verification is 12345. It is valid for 15 minutes.',
    });

    // Verify that the user was saved with the correct OTP and expiry
    expect(User.prototype.save).toHaveBeenCalled();
  });*/
  

  it('should return 500 if there is a server error', async () => {
    // Mock User.findOne to throw an error
    User.findOne.mockRejectedValue(new Error('Database error'));

    const response = await request(app)
      .post('/generate-otp')
      .send({ email: 'test@example.com' });

    expect(response.status).toBe(500);
    expect(response.body.message).toBe('Failed to send OTP');
  });
});