jest.mock("../class-models/Event"); // Mock the Event model
const request = require("supertest");
const app = require("../server"); // Directly use Express app
const Event = require("../class-models/Event"); // Mocked Event model

// Suppress console logs during tests
beforeAll(() => {
  jest.spyOn(console, "log").mockImplementation(() => {}); // Mock console.log
});

afterAll(() => {
  jest.restoreAllMocks(); // Restore console.log after tests
});

beforeEach(() => {
  jest.clearAllMocks(); // Clear mocks before each test
});

describe("GET /events", () => {
  test("should return an empty array if no events exist", async () => {
    Event.find.mockResolvedValue([]);

    const response = await request(app).get("/events");

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
    expect(Event.find).toHaveBeenCalledTimes(1);
  });

  test("should return 500 if there is a database error", async () => {
    Event.find.mockRejectedValue(new Error("Database error"));

    const response = await request(app).get("/events");

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ message: "Error fetching events" });
    expect(Event.find).toHaveBeenCalledTimes(1);
  });
});

describe("POST /events", () => {
  test("should create a new event and return 201", async () => {
    const mockEvent = {
      title: "conference meeting",
      start: "2025-02-27T00:00:00.000Z",
      allDay: true,
    };

    // Properly mock the Event constructor
    Event.mockImplementation(function () {
      return {
        save: jest.fn().mockResolvedValue(mockEvent),
      };
    });

    const response = await request(app)
      .post("/events")
      .send({
        title: "conference meeting",
        start: "2025-02-27T00:00:00",
        allDay: true,
      });

    expect(response.status).toBe(201);
    
  });

  test("should return 500 if an error occurs while saving", async () => {
    Event.mockImplementation(function () {
      return {
        save: jest.fn().mockRejectedValue(new Error("Database error")),
      };
    });

    const response = await request(app)
      .post("/events")
      .send({
        title: "Conference Meeting",
        start: "2025-06-15",
        allDay: true,
      });

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ message: "Error saving event" });
    expect(Event).toHaveBeenCalledTimes(1);
  });
});

describe("DELETE /events/:id", () => {
  test("should delete an event successfully and return 204", async () => {
    const eventId = "67614ab0980d14bab88bd099";

    Event.findByIdAndDelete.mockResolvedValue({ _id: eventId });

    const response = await request(app).delete(`/events/${eventId}`);

    expect(response.status).toBe(204);
    expect(Event.findByIdAndDelete).toHaveBeenCalledWith(eventId);
    expect(Event.findByIdAndDelete).toHaveBeenCalledTimes(1);
  });
});
