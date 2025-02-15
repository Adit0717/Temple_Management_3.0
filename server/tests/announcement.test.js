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
