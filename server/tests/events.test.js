jest.mock('../class-models/Event'); // Mock the Event model
const request = require('supertest');
const app = require('../server');
const Event = require('../class-models/Event'); // Mocked Event model



describe('GET /events', () => {
  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
    jest.resetModules();
  });

  test('should return all events with correctly formatted start dates', async () => {
    // Mock the data returned by Event.find()
    const mockEvents = [
      { "allDay": "false", "start": "2024-12-17T00:00:00.000Z", "title": "Rama Utsava"},
      { "allDay": "true", "start": "2024-12-26T00:00:00.000Z", "title": "Full moon day"},
      { "allDay": "false", "start": "2024-12-20T00:00:00.000Z", "title": "Ganapathi Homam"},
      { "allDay": "true", "start": "2024-12-02T00:00:00.000Z", "title": "Prayaschita and Karmakuti Poojan."},
      { "allDay": "true", "start": "2024-12-11T00:00:00.000Z", "title": "ganpati puja"}
    ];
    beforeAll(() => {
  Event.find = jest.fn().mockResolvedValue(mockEvents);
});

    Event.find.mockResolvedValue(mockEvents);

    const response = await request(app).get('/events');

    //expect(response.status).toBe(200);
    expect(response.body).toEqual(
      mockEvents.map(event => ({
        ...event,
        //start: new Date(event.start).toISOString()
      }))
    );
    expect(Event.find).toHaveBeenCalledTimes(1); // Ensure Event.find() is called
  });

  test('should return an empty array if no events exist', async () => {
    Event.find.mockResolvedValue([]);

    const response = await request(app).get('/events');

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
    expect(Event.find).toHaveBeenCalledTimes(1);
  });

  test('should return 500 if there is a database error', async () => {
    Event.find.mockRejectedValue(new Error('Database error'));

    const response = await request(app).get('/events');

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ message: 'Error fetching events' });
    expect(Event.find).toHaveBeenCalledTimes(1);
  });
});
