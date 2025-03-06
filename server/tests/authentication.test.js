const request = require("supertest");
const app = require("../server"); 
const User = require("../class-models/User"); 
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

jest.mock("../class-models/User"); 
jest.mock("bcrypt");
jest.mock("jsonwebtoken");

beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation(() => {}); 
});

afterAll(() => {
  console.error.mockRestore(); 
});

describe("POST /sign-up", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should register a new user and return 201", async () => {
    const mockUser = {
      firstName: "John",
      lastName: "Doe",
      email: "johndoe@example.com",
      phone: "1234567890",
      password: "SecurePass@123",
      role: "Devotee",
      empId: "12345",
    };

    User.prototype.save = jest.fn().mockResolvedValue(mockUser);
    bcrypt.hash.mockResolvedValue("hashedPassword");

    const response = await request(app).post("/sign-up").send(mockUser);

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject(mockUser);
    expect(bcrypt.hash).toHaveBeenCalledTimes(1);
    expect(User.prototype.save).toHaveBeenCalledTimes(1);
  });

  test("should return 400 if email already exists", async () => {
    const existingUser = {
      firstName: "Jane",
      lastName: "Doe",
      email: "janedoe@example.com",
      phone: "1234567890",
      password: "SecurePass@123",
    };

    User.prototype.save = jest.fn().mockRejectedValue({ code: 11000, keyValue: { email: existingUser.email } });

    const response = await request(app).post("/sign-up").send(existingUser);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(`Email  '${existingUser.email}' already exists`);
    expect(User.prototype.save).toHaveBeenCalledTimes(1);
  });

  test("should return 500 if server error occurs", async () => {
    User.prototype.save = jest.fn().mockRejectedValue(new Error("Database error"));

    const response = await request(app).post("/sign-up").send({
      firstName: "John",
      lastName: "Doe",
      email: "johndoe@example.com",
      phone: "1234567890",
      password: "SecurePass@123",
    });

    expect(response.status).toBe(500);
    expect(response.text).toContain("Server Error");
    expect(User.prototype.save).toHaveBeenCalledTimes(1);
  });
});

describe("PATCH /reset-password", () => {
  let mockUser;

  beforeEach(() => {
    mockUser = {
      email: 'test@example.com',
      otp: '12345',
      password: 'oldPassword',
      save: jest.fn().mockResolvedValue({}),
    };

    bcrypt.hash.mockResolvedValue('hashedPassword');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return 400 if the OTP or email is invalid', async () => {
    User.findOne.mockResolvedValue(null);

    const response = await request(app)
      .patch('/reset-password')
      .send({
        email: 'test@example.com',
        otp: '12345',
        password: 'newPassword123',
      });

    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid OTP or email');
    expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com', otp: '12345' });
  });

  it('should reset the password and return success message if the OTP and email are valid', async () => {
    User.findOne.mockResolvedValue(mockUser);

    const response = await request(app)
      .patch('/reset-password')
      .send({
        email: 'test@example.com',
        otp: '12345',
        password: 'newPassword123',
      });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Password reset successful!');
    expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com', otp: '12345' });
    expect(bcrypt.hash).toHaveBeenCalledWith('newPassword123', 10);
    expect(mockUser.save).toHaveBeenCalled();
    expect(mockUser.password).toBe('hashedPassword');
    expect(mockUser.otp).toBe('');
  });

  it('should return 500 if there is a server error', async () => {
    User.findOne.mockRejectedValue(new Error('Database error'));

    const response = await request(app)
      .patch('/reset-password')
      .send({
        email: 'test@example.com',
        otp: '12345',
        password: 'newPassword123',
      });

    expect(response.status).toBe(500);
    expect(response.text).toBe('Server error');
  });
});