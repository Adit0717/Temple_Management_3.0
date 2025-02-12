const request = require("supertest");
const app = require("../server"); // Import your Express app
const Service = require("../class-models/Service"); // Mocked Service model

jest.mock("../class-models/Service"); // Mock the Service model

// Fully suppress console.error during all tests
let consoleErrorMock;

beforeAll(() => {
  consoleErrorMock = jest.spyOn(console, "error").mockImplementation(() => {}); // Mute error logs in tests
});

afterAll(() => {
  consoleErrorMock.mockRestore(); // Restore original console.error after tests
});

describe("GET /services", () => {
  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
  });

  test("should return all temple services", async () => {
    const mockServices = [
      {
        _id: "67614ab0980d14bab88bd070",
        title: "Ganesh Puja",
        description:
          "Performed to seek Lord Ganesha’s blessings for removing obstacles and ensuring success in new beginnings.\nDate: Jan 1, 2025",
        category: "Pujas",
      },
      {
        _id: "67614abe980d14bab88bd073",
        title: "Lakshmi Puja",
        description:
          "Dedicated to Goddess Lakshmi, this puja invites prosperity, wealth, and harmony into homes and lives.\nDate: Jan 1, 2025",
        category: "Pujas",
      },
    ];
    Service.find.mockResolvedValue(mockServices);

    const response = await request(app).get("/services");

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockServices);
    expect(Service.find).toHaveBeenCalledTimes(1); // Ensure Service.find() is called
  });

  test("should return an empty array if no services exist", async () => {
    Service.find.mockResolvedValue([]);

    const response = await request(app).get("/services");

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
    expect(Service.find).toHaveBeenCalledTimes(1);
  });

  test("should return 500 if there is a database error", async () => {
    Service.find.mockRejectedValue(new Error("Database error"));

    const response = await request(app).get("/services");

    expect(response.status).toBe(500);
    expect(response.text).toContain("Error retrieving services");
    expect(Service.find).toHaveBeenCalledTimes(1);
  });
});


