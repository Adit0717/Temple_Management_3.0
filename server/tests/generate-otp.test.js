const request = require('supertest');
const app = require('../server'); 
const User = require('../class-models/User'); 
const transporter = require('../mailer'); 

jest.mock('../class-models/User');
jest.mock('../mailer', () => ({
  sendMail: jest.fn((mailOptions, callback) => callback(null)),
}));

describe('POST /generate-otp', () => {
  let mockUser;
  let sendMailMock;

  beforeEach(() => {
    mockUser = {
      email: 'test@example.com',
      otp: '12345',
      otpExpiry: Date.now() + 15 * 60 * 1000,
    };

    jest.spyOn(global.Math, 'random').mockReturnValue(0.12345);
  });

  afterEach(() => {
    jest.restoreAllMocks(); 
  });

  it('should return 400 if the email is already registered', async () => {
    User.findOne.mockResolvedValue(mockUser);

    const response = await request(app)
      .post('/generate-otp')
      .send({ email: 'test@example.com' });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Email already registered');
  });

  it('should generate OTP and return 200 status if email is not registered', async () => {    
    User.findOne.mockResolvedValue(null);
    
    User.prototype.save.mockResolvedValue(mockUser);

    const response = await request(app)
      .post('/generate-otp')
      .send({ email: 'test@example.com' });
    
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "OTP sent to email" });
    expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
    expect(User.prototype.save).toHaveBeenCalled();
  });

  it('should return 500 if there is a server error', async () => {
    User.findOne.mockRejectedValue(new Error('Database error'));

    const response = await request(app)
      .post('/generate-otp')
      .send({ email: 'test@example.com' });

    expect(response.status).toBe(500);
    expect(response.body.message).toBe('Failed to send OTP');
  });
});

describe("POST /send-otp", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("should send OTP if user exists", async () => {
    const mockUser = {
      email: "krisa04@pfw.edu",
      save: jest.fn(),
    };
    User.findOne.mockResolvedValue(mockUser);
    const response = await request(app)
      .post("/send-otp")
      .send({ email: "krisa04@pfw.edu" });
    expect(response.status).toBe(200);
    expect(response.text).toBe("OTP sent successfully");
    expect(User.findOne).toHaveBeenCalledWith({ email: "krisa04@pfw.edu" });
    expect(mockUser.otp).toBeDefined(); // OTP should be set
    expect(mockUser.save).toHaveBeenCalled();
  });
  it("should return 400 if user is not found", async () => {
    User.findOne.mockResolvedValue(null);
    const response = await request(app)
      .post("/send-otp")
      .send({ email: "unknown@example.com" });
    expect(response.status).toBe(400);
    expect(response.text).toBe("User not found");
  });
  it("should return 500 on server error", async () => {
    User.findOne.mockRejectedValue(new Error("DB failure"));
    const response = await request(app)
      .post("/send-otp")
      .send({ email: "test@example.com" });
    expect(response.status).toBe(500);
    expect(response.text).toBe("Server error");
  });
});