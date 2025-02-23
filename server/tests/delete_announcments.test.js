const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app'); // Adjust this path to your Express app
const Announcement = require('../models/Announcement'); // Adjust this path as needed

jest.mock('../models/Announcement'); // Mock Mongoose model to prevent real DB interactions

describe('DELETE /announcements/:id', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should delete an existing announcement and return 200', async () => {
    const announcementId = new mongoose.Types.ObjectId();
    
    // Mocking the deleted announcement
    const mockDeletedAnnouncement = {
      _id: announcementId,
      title: "Sample Announcement",
      content: "This announcement will be deleted."
    };

    Announcement.findByIdAndDelete.mockResolvedValue(mockDeletedAnnouncement);

    const response = await request(app)
      .delete(`/announcements/${announcementId}`);

    expect(response.status).toBe(200);
    expect(response.text).toBe(`Announcement with id ${announcementId} deleted successfully.`);
    expect(Announcement.findByIdAndDelete).toHaveBeenCalledWith(announcementId.toString());
  });

  it('should return 404 when the announcement does not exist', async () => {
    const announcementId = new mongoose.Types.ObjectId();

    Announcement.findByIdAndDelete.mockResolvedValue(null);

    const response = await request(app)
      .delete(`/announcements/${announcementId}`);

    expect(response.status).toBe(404);
    expect(response.text).toBe("Announcement not found.");
  });

  it('should return 500 when an internal server error occurs', async () => {
    const announcementId = new mongoose.Types.ObjectId();

    Announcement.findByIdAndDelete.mockRejectedValue(new Error('Database error'));

    const response = await request(app)
      .delete(`/announcements/${announcementId}`);

    expect(response.status).toBe(500);
    expect(response.text).toBe("Error deleting announcement from the database");
  });
});
