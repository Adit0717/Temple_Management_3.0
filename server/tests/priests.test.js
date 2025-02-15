const request = require('supertest');
const app = require('../server');
const Priest = require('../class-models/User'); 

jest.mock('../class-models/User'); 

describe('GET /get-priests', () => {
  afterEach(() => {
    jest.clearAllMocks(); 
  });

  test('should return all priests', async () => {
    
    const mockPriests = [
      {email: "iamnotbatman123456789@gmail.com", firstName: "Batman", lastName: "Iam", phone: "+12602068565", role: "priest", __v: 0, _id: "679bdb7d5557d712d5684acc"}
    ];
    Priest.find.mockResolvedValue(mockPriests);

    const response = await request(app).get('/get-priests');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockPriests);
    expect(Priest.find).toHaveBeenCalledTimes(1); 
  });

  test('should return an empty array if no priests exist', async () => {
   
    Priest.find.mockResolvedValue([]);

    const response = await request(app).get('/get-priests');

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
    expect(Priest.find).toHaveBeenCalledTimes(1); 
  });

  test('should return 500 if there is a database error', async () => {
    
    Priest.find.mockRejectedValue(new Error('Database error'));

    const response = await request(app).get('/get-priests');

    expect(response.status).toBe(500);
    expect(response.text).toContain('Server error');
    expect(Priest.find).toHaveBeenCalledTimes(1); 
  });
});