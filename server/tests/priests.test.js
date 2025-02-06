const request = require('supertest');
const app = require('../server');
const Priest = require('../class-models/User'); // Mocked User model

jest.mock('../class-models/User'); // Mock the User model

describe('GET /get-priests', () => {
  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
  });

  test('should return all priests', async () => {
    // Mock the data returned by Priest.find()
    const mockPriests = [
      {email: "iamnotbatman123456789@gmail.com", firstName: "Batman", lastName: "Iam", phone: "+12602068565", role: "priest", __v: 0, _id: "679bdb7d5557d712d5684acc"}
    ];
    Priest.find.mockResolvedValue(mockPriests);

    const response = await request(app).get('/get-priests');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockPriests);
    expect(Priest.find).toHaveBeenCalledTimes(1); // Ensure Priest.find() is called
  });

  test('should return an empty array if no priests exist', async () => {
    // Mock the data returned by Priest.find() as an empty array
    Priest.find.mockResolvedValue([]);

    const response = await request(app).get('/get-priests');

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
    expect(Priest.find).toHaveBeenCalledTimes(1); // Ensure Priest.find() is called
  });

  test('should return 500 if there is a database error', async () => {
    // Mock an error being thrown by Priest.find()
    Priest.find.mockRejectedValue(new Error('Database error'));

    const response = await request(app).get('/get-priests');

    expect(response.status).toBe(500);
    expect(response.text).toContain('Server error');
    expect(Priest.find).toHaveBeenCalledTimes(1); // Ensure Priest.find() is called
  });
});