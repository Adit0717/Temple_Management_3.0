jest.mock("../class-models/NewsLetter"); // Mock the NewsLetter model
const request = require("supertest");
const app = require("../server"); // Import the Express app
const NewsLetter = require("../class-models/NewsLetter"); // Mocked model

beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation(() => {}); // Suppress error logs in tests
});

afterAll(() => {
  jest.restoreAllMocks(); // Restore original console behavior after tests
});

beforeEach(() => {
  jest.clearAllMocks(); // Clear mocks before each test
});

describe("POST /subscribe-newsletter", () => {
  test("should subscribe a new email successfully and return 201", async () => {
    const mockSubscription = {
      _id: "67614ab0980d14bab88bd099",
      emailId: "test@example.com",
      date: "2025-06-15T23:57:52.4272",
    };

    NewsLetter.findOne.mockResolvedValue(null); // Simulate no existing subscription
    NewsLetter.prototype.save = jest.fn().mockResolvedValue(mockSubscription); // Mock DB save

    const response = await request(app)
      .post("/subscribe-newsletter")
      .send({ emailId: "test@example.com", date: "2025-06-15T23:37:52.4272" });

    expect(response.status).toBe(201);
    expect(NewsLetter.findOne).toHaveBeenCalledWith({ emailId: "test@example.com" });
    expect(NewsLetter.prototype.save).toHaveBeenCalledTimes(1);
  });

  test("should return 400 if the email is already subscribed", async () => {
    const existingSubscription = { emailId: "test@example.com", date: "2025-06-15" };

    NewsLetter.findOne.mockResolvedValue(existingSubscription); // Simulate existing email

    const response = await request(app)
      .post("/subscribe-newsletter")
      .send({ emailId: "test@example.com", date: "2025-06-15" });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: "You are already under our subscription" });
    expect(NewsLetter.findOne).toHaveBeenCalledWith({ emailId: "test@example.com" });
    expect(NewsLetter.prototype.save).not.toHaveBeenCalled();
  });

  test("should return 500 if an error occurs during subscription", async () => {
    NewsLetter.findOne.mockRejectedValue(new Error("Database error")); // Simulate DB error

    const response = await request(app)
      .post("/subscribe-newsletter")
      .send({ emailId: "test@example.com", date: "2025-06-15" });

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ message: "Error subscribing to the newsletter" });
    expect(NewsLetter.findOne).toHaveBeenCalledTimes(1);
    expect(NewsLetter.prototype.save).not.toHaveBeenCalled();
  });
});

describe("GET /newsletter-email-list", () => {
  test("should return all subscribed emails and return 200", async () => {
    const mockEmailList = [
      { emailId: "user1@example.com", date: "2025-06-10" },
      { emailId: "user2@example.com", date: "2025-06-11" },
    ];

    NewsLetter.find.mockResolvedValue(mockEmailList); // Mock DB fetch

    const response = await request(app).get("/newsletter-email-list");

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockEmailList);
    expect(NewsLetter.find).toHaveBeenCalledTimes(1);
  });

  test("should return 500 if an error occurs while fetching email list", async () => {
    NewsLetter.find.mockRejectedValue(new Error("Database error"));

    const response = await request(app).get("/newsletter-email-list");

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ message: "Error fetching events" });
    expect(NewsLetter.find).toHaveBeenCalledTimes(1);
  });
});
