const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../server"); // Ensure correct path
const Appointment = require("../class-models/Appointment"); // Adjust path as needed
const nodemailer = require("nodemailer");

jest.mock("../class-models/Appointment"); // Mock Mongoose model
jest.mock("../mailer", () => ({
  sendMail: jest.fn().mockResolvedValue({ messageId: "mock-email-id" }),
}));
jest.mock("nodemailer");

describe("Appointments API Tests", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /get-appointments", () => {
    test("should return all appointments", async () => {
      const mockAppointments = [
        { _id: "1", userName: "John Doe", date: "2025-03-10", time: "10:00 AM", information: "Blessing" },
        { _id: "2", userName: "Jane Smith", date: "2025-03-11", time: "12:00 PM", information: "Healing" },
      ];
      Appointment.find.mockResolvedValue(mockAppointments);

      const response = await request(app).get("/get-appointments");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockAppointments);
      expect(Appointment.find).toHaveBeenCalledTimes(1);
    });

    test("should return an empty array if no appointments exist", async () => {
      Appointment.find.mockResolvedValue([]);
      const response = await request(app).get("/get-appointments");
      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
      expect(Appointment.find).toHaveBeenCalledTimes(1);
    });

    test("should return 500 if there is a database error", async () => {
      Appointment.find.mockRejectedValue(new Error("Database error"));
      const response = await request(app).get("/get-appointments");
      expect(response.status).toBe(500);
      expect(response.text).toContain("Error fetching appointments");
      expect(Appointment.find).toHaveBeenCalledTimes(1);
    });
  });

  describe("POST /book-appointment", () => {
    test("should return 500 on server error", async () => {
      Appointment.prototype.save = jest.fn().mockRejectedValue(new Error("Database error"));

      const response = await request(app).post("/book-appointment").send({
        priestId: "123",
        priest: "John Doe",
        date: "2025-03-10",
        time: "10:00 AM",
        information: "Special Pooja",
        userName: "Jane Doe",
        email: "janedoe@example.com",
      });

      expect(response.status).toBe(500);
      expect(response.text).toContain("Error inserting appointment");
      expect(Appointment.prototype.save).toHaveBeenCalledTimes(1);
    });
  });

  describe("DELETE /delete-appointment/:id", () => {
    let sendMailMock;

    beforeEach(() => {
      jest.clearAllMocks();
      sendMailMock = jest.fn().mockResolvedValue(true);
      nodemailer.createTransport.mockReturnValue({ sendMail: sendMailMock });
    });

    test("should return 404 if appointment is not found", async () => {
      Appointment.findById.mockResolvedValue(null);
      const response = await request(app).delete("/delete-appointment/123");
      expect(response.status).toBe(404);
      expect(response.text).toBe("Appointment not found.");
    });

    test("should return 500 if there is an error while deleting the appointment", async () => {
      Appointment.findById.mockRejectedValue(new Error("Database error"));
      const response = await request(app).delete("/delete-appointment/123");
      expect(response.status).toBe(500);
      expect(response.text).toBe("Error deleting appointment from the database");
    });
  });

  describe("PATCH /update-appointment/:id", () => {
    test("should update the status of an existing appointment and return 200", async () => {
      const appointmentId = new mongoose.Types.ObjectId();
      const updatedStatus = "confirmed";
      const mockAppointment = {
        _id: appointmentId.toString(), // Convert ObjectId to string
        status: updatedStatus,
      };

      Appointment.findByIdAndUpdate.mockResolvedValue(mockAppointment);

      const response = await request(app)
        .patch(`/update-appointment/${appointmentId}`)
        .send({ status: updatedStatus });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        _id: appointmentId.toString(), // Convert ObjectId to string before comparison
        status: updatedStatus,
      });

      expect(Appointment.findByIdAndUpdate).toHaveBeenCalledWith(
        appointmentId.toString(),
        { status: updatedStatus },
        { new: true }
      );
    });

    test("should return 404 when the appointment does not exist", async () => {
      const appointmentId = new mongoose.Types.ObjectId();
      Appointment.findByIdAndUpdate.mockResolvedValue(null);
      const response = await request(app)
        .patch(`/update-appointment/${appointmentId}`)
        .send({ status: "cancelled" });

      expect(response.status).toBe(404);
      expect(response.text).toBe("Appointment not found");
    });

    test("should return 500 when an internal server error occurs", async () => {
      const appointmentId = new mongoose.Types.ObjectId();
      Appointment.findByIdAndUpdate.mockRejectedValue(new Error("Database error"));
      const response = await request(app)
        .patch(`/update-appointment/${appointmentId}`)
        .send({ status: "completed" });

      expect(response.status).toBe(500);
      expect(response.text).toBe("Server error");
    });
  });
});