const request = require('supertest');
const app = require('../server');
const Announcement = require('../class-models/Announcement'); 

jest.mock('../class-models/Announcement');

describe('GET /announcements', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should return all announcements', async () => {
    const mockAnnouncements = [
      { _id: "676146b9980d14bab88bd031", title: "Launch of Temple Management System 3.0", description: "Dear Devotees, Priests, and Temple Administrators,  \n\nWe are delighted to announce the launch of the Temple Management System 2.0, a state-of-the-art platform designed to transform the way our temple operates and serves its community." },
      { _id: "67614a0d980d14bab88bd03c", title: "Temple Renovation", description: "Dear Devotees, The Temple will be closed from Dec 17, 2024 to Dec 31, 2024 for renovations.\n\"We apologize for any inconvenience caused.\"" },
    ];
    Announcement.find.mockResolvedValue(mockAnnouncements);

    const response = await request(app).get('/announcements');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockAnnouncements);
    expect(Announcement.find).toHaveBeenCalledTimes(1);
  });

  test('should return an empty array if no announcements exist', async () => {
    Announcement.find.mockResolvedValue([]);

    const response = await request(app).get('/announcements');

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
    expect(Announcement.find).toHaveBeenCalledTimes(1);
  });

  test('should return 500 if there is a database error', async () => {
    Announcement.find.mockRejectedValue(new Error('Database error'));

    const response = await request(app).get('/announcements');

    expect(response.status).toBe(500);
    expect(response.text).toContain('Error fetching announcements');
    expect(Announcement.find).toHaveBeenCalledTimes(1);
  });
});

describe('POST /add-announcement', () => {
  let mockAnnouncementData;

  beforeEach(() => {
    mockAnnouncementData = {
      title: 'New Event',
      description: 'We are hosting a new event!'
    };
    jest.clearAllMocks();
  });

  it('should return 201 and create an announcement successfully', async () => {
    Announcement.prototype.save.mockResolvedValue(mockAnnouncementData);

    const response = await request(app)
      .post('/add-announcement')
      .send(mockAnnouncementData);

    expect(response.status).toBe(201);
    expect(response.body).toEqual(mockAnnouncementData);
    expect(Announcement.prototype.save).toHaveBeenCalledTimes(1);
  });

  it('should return 500 if there is an error saving the announcement', async () => {
    const errorMessage = 'Database error';
    Announcement.prototype.save.mockRejectedValue(new Error(errorMessage));

    const response = await request(app)
      .post('/add-announcement')
      .send(mockAnnouncementData);

    expect(response.status).toBe(500);
    expect(response.text).toBe('Error adding announcement: ' + errorMessage);
    expect(Announcement.prototype.save).toHaveBeenCalledTimes(1);
  });
});

describe('DELETE /announcements/:id', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should return 200 if announcement is deleted successfully', async () => {
    Announcement.findByIdAndDelete.mockResolvedValue(true);
    const id = '676146b9980d14bab88bd031';

    const response = await request(app).delete(`/announcements/${id}`);

    expect(response.status).toBe(200);
    expect(response.text).toBe(`Announcement with id ${id} deleted successfully.`);
    expect(Announcement.findByIdAndDelete).toHaveBeenCalledTimes(1);
  });

  test('should return 404 if announcement does not exist', async () => {
    Announcement.findByIdAndDelete.mockResolvedValue(null);
    const id = 'nonexistent-id';

    const response = await request(app).delete(`/announcements/${id}`);

    expect(response.status).toBe(404);
    expect(response.text).toBe('Announcement not found.');
    expect(Announcement.findByIdAndDelete).toHaveBeenCalledTimes(1);
  });

  test('should return 500 if there is an internal server error', async () => {
    Announcement.findByIdAndDelete.mockRejectedValue(new Error('Internal server error'));
    const id = '676146b9980d14bab88bd031';

    const response = await request(app).delete(`/announcements/${id}`);

    expect(response.status).toBe(500);
    expect(response.text).toBe('Error deleting announcement from the database');
    expect(Announcement.findByIdAndDelete).toHaveBeenCalledTimes(1);
  });
});

describe('PUT /announcements/:id', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should return 200 if announcement is updated successfully', async () => {
    const id = '676146b9980d14bab88bd031';
    const updatedData = { title: 'Updated Title', description: 'Updated description' };

    Announcement.findByIdAndUpdate.mockResolvedValue(updatedData);

    const response = await request(app)
      .put(`/announcements/${id}`)
      .send(updatedData);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(updatedData);
    expect(Announcement.findByIdAndUpdate).toHaveBeenCalledTimes(1);
  });

  test('should return 500 if there is an internal server error', async () => {
    const id = '676146b9980d14bab88bd031';
    const updatedData = { title: 'Updated Title', description: 'Updated description' };

    Announcement.findByIdAndUpdate.mockRejectedValue(new Error('Internal server error'));

    const response = await request(app)
      .put(`/announcements/${id}`)
      .send(updatedData);

    expect(response.status).toBe(500);
    expect(response.text).toBe('Error updating announcement: Internal server error');
    expect(Announcement.findByIdAndUpdate).toHaveBeenCalledTimes(1);
  });
});
