const request = require("supertest");
const nodemailer = require('nodemailer');
const app = require("../server"); // Import your Express app
const Appointment = require("../class-models/Appointment"); // Mocked Appointment model

jest.mock("../class-models/Appointment"); // Mock the Appointment model
jest.mock('nodemailer');

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

describe('DELETE /delete-appointment/:id', () => {
  let sendMailMock;

  beforeEach(() => {
    jest.clearAllMocks(); // Clears mocks before each test

    sendMailMock = jest.fn().mockResolvedValue(true);
    nodemailer.createTransport.mockReturnValue({
      sendMail: sendMailMock,
    });
  });

  /*it('should return 200 and send email when appointment is successfully deleted', async () => {
    // Mocking Appointment.findById to return a mock appointment
    const mockAppointment = {
      _id: '123',
      priest: 'Father John',
      date: '2025-02-20',
      time: '10:00 AM',
      information: 'Important information for the priest',
      userName: 'John Doe',
      email: 'john@example.com',
    };

    Appointment.findById.mockResolvedValue(mockAppointment);
    Appointment.findByIdAndDelete.mockResolvedValue(mockAppointment);

    const response = await request(app).delete('/delete-appointment/123');

    expect(response.status).toBe(200);
    expect(response.text).toBe('Appointment with id 123 deleted successfully and confirmation email sent.');

    // Ensure sendMail was called with the correct email content
    expect(sendMailMock).toHaveBeenCalledWith(
      expect.objectContaining({
        to: 'john@example.com',
        subject: 'Appointment Cancellation',
        html: expect.stringContaining('Your appointment has been <b>cancelled</b> with <b>Father John</b>.'),
      })
    );
  });*/

  it('should return 404 if appointment is not found', async () => {
    // Mock Appointment.findById to return null (appointment not found)
    Appointment.findById.mockResolvedValue(null);

    const response = await request(app).delete('/delete-appointment/123');

    expect(response.status).toBe(404);
    expect(response.text).toBe('Appointment not found.');
  });

  it('should return 500 if there is an error while deleting the appointment', async () => {
    // Mock Appointment.findById to throw an error
    Appointment.findById.mockRejectedValue(new Error('Database error'));

    const response = await request(app).delete('/delete-appointment/123');

    expect(response.status).toBe(500);
    expect(response.text).toBe('Error deleting appointment from the database');
  });
});