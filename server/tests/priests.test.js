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

describe('POST /create-priest', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should create a new priest successfully and return 201', async () => {
    const mockPriest = {
      firstName: "Bruce",
      lastName: "Wayne",
      email: "bruce.wayne@example.com",
      phone: "+1234567890",
      password: "securepassword",
      role: "Priest",
      empId: "12345",
    };

    const savedPriest = {
      ...mockPriest,
      _id: "679bdb7d5557d712d5684acc",
      password: "hashedpassword",
    };

    Priest.mockImplementation(() => ({
      save: jest.fn().mockResolvedValue(savedPriest),
    }));

    const response = await request(app)
      .post('/create-priest')
      .send(mockPriest);

    expect(response.status).toBe(201);
    expect(response.body).toEqual(savedPriest);
    expect(Priest).toHaveBeenCalledTimes(1);
  });

  test('should return 400 if password is missing or invalid', async () => {
    const response = await request(app)
      .post('/create-priest')
      .send({
        firstName: "Bruce",
        lastName: "Wayne",
        email: "bruce.wayne@example.com",
        phone: "+1234567890",
      });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: "Invalid password" });
  });

  test('should return 500 if there is a server error', async () => {
    Priest.mockImplementation(() => ({
      save: jest.fn().mockRejectedValue(new Error("Database error")),
    }));

    const response = await request(app)
      .post('/create-priest')
      .send({
        firstName: "Bruce",
        lastName: "Wayne",
        email: "bruce.wayne@example.com",
        phone: "+1234567890",
        password: "securepassword",
      });

    expect(response.status).toBe(500);
    expect(response.text).toContain('Server Error');
    expect(Priest).toHaveBeenCalledTimes(1);
  });
});
