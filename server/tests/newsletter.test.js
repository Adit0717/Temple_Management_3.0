jest.mock("../class-models/NewsLetter"); 
const request = require("supertest");
const app = require("../server"); 
const NewsLetter = require("../class-models/NewsLetter"); 

beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation(() => {}); 
});

afterAll(() => {
  jest.restoreAllMocks(); 
});

beforeEach(() => {
  jest.clearAllMocks(); 
});

describe("POST /subscribe-newsletter", () => {
  test("should subscribe a new email successfully and return 201", async () => {
    const mockSubscription = {
      _id: "67614ab0980d14bab88bd099",
      emailId: "test@example.com",
      date: "2025-06-15T23:57:52.4272",
    };

    NewsLetter.findOne.mockResolvedValue(null); 
    NewsLetter.prototype.save = jest.fn().mockResolvedValue(mockSubscription); 

    const response = await request(app)
      .post("/subscribe-newsletter")
      .send({ emailId: "test@example.com", date: "2025-06-15T23:37:52.4272" });

    expect(response.status).toBe(201);
    expect(NewsLetter.findOne).toHaveBeenCalledWith({ emailId: "test@example.com" });
    expect(NewsLetter.prototype.save).toHaveBeenCalledTimes(1);
  });

  test("should return 400 if the email is already subscribed", async () => {
    const existingSubscription = { emailId: "test@example.com", date: "2025-06-15" };

    NewsLetter.findOne.mockResolvedValue(existingSubscription); 

    const response = await request(app)
      .post("/subscribe-newsletter")
      .send({ emailId: "test@example.com", date: "2025-06-15" });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: "You are already under our subscription" });
    expect(NewsLetter.findOne).toHaveBeenCalledWith({ emailId: "test@example.com" });
    expect(NewsLetter.prototype.save).not.toHaveBeenCalled();
  });

  test("should return 500 if an error occurs during subscription", async () => {
    NewsLetter.findOne.mockRejectedValue(new Error("Database error")); 

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

    NewsLetter.find.mockResolvedValue(mockEmailList); 

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
