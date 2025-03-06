jest.mock("../class-models/Event"); 
const request = require("supertest");
const app = require("../server"); 
const Event = require("../class-models/Event"); 

beforeAll(() => {
  jest.spyOn(console, "log").mockImplementation(() => {}); 
});

afterAll(() => {
  jest.restoreAllMocks(); 
});

beforeEach(() => {
  jest.clearAllMocks(); 
  
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

describe("PUT /events/:id", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should update an event successfully and return 200", async () => {
    const eventId = "67614ab0980d14bab88bd099";
    const updatedEvent = {
      title: "Updated Conference Meeting",
      start: "2025-07-20T00:00:00.000Z",
      allDay: false,
    };

    // ✅ Use jest.spyOn to properly mock the function
    jest.spyOn(Event, "findByIdAndUpdate").mockResolvedValue({ _id: eventId, ...updatedEvent });

    const response = await request(app)
      .put(`/events/${eventId}`)
      .send(updatedEvent);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ _id: eventId, ...updatedEvent });
    expect(Event.findByIdAndUpdate).toHaveBeenCalledTimes(1);
    expect(Event.findByIdAndUpdate).toHaveBeenCalledWith(
      expect.any(String), // Allow any string (fix for ObjectId issue)
      updatedEvent,
      { new: true, runValidators: true }
    );
  });

  it('should return 404 status if event is not found', async () => {
    Event.findByIdAndUpdate.mockResolvedValue(null);

    const response = await request(app)
      .put('/events/507f1f77bcf86cd799439011')
      .send({
        title: 'Updated Event',
        start: '2023-10-01T00:00:00.000Z',
        allDay: true,
      });

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: "Event not found" });
  });

  it('should return 500 status if there is an error', async () => {
    Event.findByIdAndUpdate.mockRejectedValue(new Error('Database error'));

    const response = await request(app)
      .put('/events/507f1f77bcf86cd799439011')
      .send({
        title: 'Updated Event',
        start: '2023-10-01T00:00:00.000Z',
        allDay: true,
      });

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ message: "Error saving event" });
  });
});
