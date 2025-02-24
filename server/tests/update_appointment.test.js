const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app'); // Ensure this is the correct path to your Express app
const Appointment = require('../models/Appointment'); // Adjust as per your file structure

jest.mock('../models/Appointment'); // Mock Mongoose model to avoid real database calls

describe('PATCH /update-appointment/:id', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should update the status of an existing appointment and return 200', async () => {
    const appointmentId = new mongoose.Types.ObjectId();
    const updatedStatus = 'confirmed';
    const mockAppointment = {
      _id: appointmentId,
      status: updatedStatus,
    };

    Appointment.findByIdAndUpdate.mockResolvedValue(mockAppointment);

    const response = await request(app)
      .patch(`/update-appointment/${appointmentId}`)
      .send({ status: updatedStatus });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockAppointment);
    expect(Appointment.findByIdAndUpdate).toHaveBeenCalledWith(
      appointmentId.toString(),
      { status: updatedStatus },
      { new: true }
    );
  });

  it('should return 404 when the appointment does not exist', async () => {
    const appointmentId = new mongoose.Types.ObjectId();
    
    Appointment.findByIdAndUpdate.mockResolvedValue(null);

    const response = await request(app)
      .patch(`/update-appointment/${appointmentId}`)
      .send({ status: 'cancelled' });

    expect(response.status).toBe(404);
    expect(response.text).toBe('Appointment not found');
  });

  it('should return 500 when an internal server error occurs', async () => {
    const appointmentId = new mongoose.Types.ObjectId();

    Appointment.findByIdAndUpdate.mockRejectedValue(new Error('Database error'));

    const response = await request(app)
      .patch(`/update-appointment/${appointmentId}`)
      .send({ status: 'completed' });

    expect(response.status).toBe(500);
    expect(response.text).toBe('Server error');
  });
});
