const request = require("supertest");
const app = require("../server"); 
const User = require("../class-models/User"); 
const bcrypt = require("bcrypt");

jest.mock("../class-models/User"); 
jest.mock("bcrypt");

beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation(() => {}); 
});

afterAll(() => {
  console.error.mockRestore(); 
});

describe("POST /verify-otp", () => {
  afterEach(() => {
    jest.clearAllMocks(); 
  });

  test("should return 400 if the OTP is incorrect", async () => {
    User.findOne.mockResolvedValue(null); 

    const response = await request(app).post("/verify-otp").send({
      email: "test@example.com",
      otp: "12345",
      firstName: "John",
      lastName: "Doe",
      phone: "1234567890",
      password: "SecurePass@123",
      role: "User",
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid OTP");
    expect(User.findOne).toHaveBeenCalledTimes(1);
  });

  test("should return 400 if the OTP has expired", async () => {
    const expiredUser = {
      email: "test@example.com",
      otp: "12345",
      otpExpiry: Date.now() - 1000,
    };

    User.findOne.mockResolvedValue(expiredUser);

    const response = await request(app).post("/verify-otp").send({
      email: "test@example.com",
      otp: "12345",
      firstName: "John",
      lastName: "Doe",
      phone: "1234567890",
      password: "SecurePass@123",
      role: "User",
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("OTP expired");
    expect(User.findOne).toHaveBeenCalledTimes(1);
  });

  test("should return 201 and redirect to /login if the OTP is correct", async () => {
    const validUser = {
      email: "test@example.com",
      otp: "12345",
      otpExpiry: Date.now() + 60000, 
      save: jest.fn(), 
    };

    User.findOne.mockResolvedValue(validUser);
    bcrypt.hash.mockResolvedValue("hashedPassword"); 

    const response = await request(app).post("/verify-otp").send({
      email: "test@example.com",
      otp: "12345",
      firstName: "John",
      lastName: "Doe",
      phone: "1234567890",
      password: "SecurePass@123",
      role: "User",
    });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("Signup successful");
    expect(User.findOne).toHaveBeenCalledTimes(1);
    expect(bcrypt.hash).toHaveBeenCalledTimes(1);
    expect(validUser.save).toHaveBeenCalledTimes(1);
  });

  it('should return 500 if there is a server error', async () => {    
    User.findOne.mockRejectedValue(new Error('Database error'));

    const response = await request(app)
      .post('/verify-otp')
      .send({
        email: 'test@example.com',
        otp: '12345',
        firstName: 'John',
        lastName: 'Doe',
        phone: '1234567890',
        password: 'password123',
        role: 'user',
      });

    expect(response.status).toBe(500);
    expect(response.body.message).toBe('Failed to verify OTP');
  });
});
