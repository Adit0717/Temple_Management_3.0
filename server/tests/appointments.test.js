const request = require("supertest");
const app = require("../server"); // Import your Express app
const Appointment = require("../class-models/Appointment"); // Mocked Appointment model

jest.mock("../class-models/Appointment"); // Mock the Appointment model

describe("GET /get-appointments", () => {
  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
  });

  test("should return all appointments", async () => {
    // Mock the data returned by Appointment.find()
    const mockAppointments = [
      { _id: "1", userName: "John Doe", date: "2025-03-10", time: "10:00 AM", information: "Blessing" },
      { _id: "2", userName: "Jane Smith", date: "2025-03-11", time: "12:00 PM", information: "Healing" },
    ];
    Appointment.find.mockResolvedValue(mockAppointments);

    const response = await request(app).get("/get-appointments");

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockAppointments);
    expect(Appointment.find).toHaveBeenCalledTimes(1); // Ensure Appointment.find() is called
  });

  test("should return an empty array if no appointments exist", async () => {
    // Mock the data returned by Appointment.find() as an empty array
    Appointment.find.mockResolvedValue([]);

    const response = await request(app).get("/get-appointments");

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
    expect(Appointment.find).toHaveBeenCalledTimes(1); // Ensure Appointment.find() is called
  });

  test("should return 500 if there is a database error", async () => {
    // Mock an error being thrown by Appointment.find()
    Appointment.find.mockRejectedValue(new Error("Database error"));

    const response = await request(app).get("/get-appointments");

    expect(response.status).toBe(500);
    expect(response.text).toContain("Error fetching appointments");
    expect(Appointment.find).toHaveBeenCalledTimes(1); // Ensure Appointment.find() is called
  });
});
