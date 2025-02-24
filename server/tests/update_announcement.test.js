const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app'); // Adjust the path to your Express app
const Announcement = require('../models/Announcement'); // Adjust the path as needed

jest.mock('../models/Announcement'); // Mock Mongoose model to prevent real DB interactions

describe('PUT /announcements/:id', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should update an announcement and return 200', async () => {
    const announcementId = new mongoose.Types.ObjectId();
    const updatedData = {
      title: 'Updated Announcement',
      content: 'This is the updated content.',
    };

    const mockUpdatedAnnouncement = {
      _id: announcementId,
      ...updatedData,
    };

    Announcement.findByIdAndUpdate.mockResolvedValue(mockUpdatedAnnouncement);

    const response = await request(app)
      .put(`/announcements/${announcementId}`)
      .send(updatedData);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockUpdatedAnnouncement);
    expect(Announcement.findByIdAndUpdate).toHaveBeenCalledWith(
      announcementId.toString(),
      updatedData,
      { new: true }
    );
  });

  it('should return 500 when an internal server error occurs', async () => {
    const announcementId = new mongoose.Types.ObjectId();

    Announcement.findByIdAndUpdate.mockRejectedValue(new Error('Database error'));

    const response = await request(app)
      .put(`/announcements/${announcementId}`)
      .send({ title: 'Test', content: 'Error test' });

    expect(response.status).toBe(500);
    expect(response.text).toBe('Error updating announcement: Database error');
  });
});
