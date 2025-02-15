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

describe("POST /login", () => {
  afterEach(() => {
    jest.clearAllMocks(); 
  });

  test("should log in successfully and return a token", async () => {
    const mockUser = {
      email: "johndoe@example.com",
      password: "hashedPassword",
      empId: "12345",
      role: "Devotee",
    };

    User.findOne.mockResolvedValue(mockUser);
    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockReturnValue("mockedToken");

    const response = await request(app).post("/login").send({
      email: "johndoe@example.com",
      password: "SecurePass@123",
      role: "Devotee",
    });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Logged successfully");
    expect(response.body.token).toBe("mockedToken");
    expect(User.findOne).toHaveBeenCalledTimes(1);
    expect(bcrypt.compare).toHaveBeenCalledTimes(1);
    expect(jwt.sign).toHaveBeenCalledTimes(1);
  });

  test("should return 400 if user does not exist", async () => {
    User.findOne.mockResolvedValue(null);

    const response = await request(app).post("/login").send({
      email: "nonexistent@example.com",
      password: "WrongPass@123",
      role: "Devotee",
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("User not found");
    expect(User.findOne).toHaveBeenCalledTimes(1);
    expect(bcrypt.compare).not.toHaveBeenCalled();
  });

  test("should return 400 if password is incorrect", async () => {
    const mockUser = {
      email: "johndoe@example.com",
      password: "hashedPassword",
      empId: "12345",
      role: "Devotee",
    };

    User.findOne.mockResolvedValue(mockUser);
    bcrypt.compare.mockResolvedValue(false);

    const response = await request(app).post("/login").send({
      email: "johndoe@example.com",
      password: "WrongPass@123",
      role: "Devotee",
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid credentials");
    expect(User.findOne).toHaveBeenCalledTimes(1);
    expect(bcrypt.compare).toHaveBeenCalledTimes(1);
  });
});
