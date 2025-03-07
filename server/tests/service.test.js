const request = require("supertest");
const app = require("../server");
const Service = require("../class-models/Service");

jest.mock("../class-models/Service");

let consoleErrorMock;

beforeAll(() => {
  consoleErrorMock = jest.spyOn(console, "error").mockImplementation(() => {});
});


describe("GET /services", () => {
  afterEach(() => {
    jest.clearAllMocks();
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
    expect(Service.find).toHaveBeenCalledTimes(1);
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

describe("DELETE /services/:id", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should delete a service successfully and return 200", async () => {
    const serviceId = "67614ab0980d14bab88bd070";
    Service.findByIdAndDelete.mockResolvedValue({ _id: serviceId });

    const response = await request(app).delete(`/services/${serviceId}`);

    expect(response.status).toBe(200);
    expect(response.text).toBe(`Service with id ${serviceId} deleted successfully.`);
    expect(Service.findByIdAndDelete).toHaveBeenCalledWith(serviceId);
    expect(Service.findByIdAndDelete).toHaveBeenCalledTimes(1);
  });

  test("should return 404 when trying to delete a non-existent service", async () => {
    const nonExistentId = "67614abe980d14bab88bd073";
    Service.findByIdAndDelete.mockResolvedValue(null);

    const response = await request(app).delete(`/services/${nonExistentId}`);

    expect(response.status).toBe(404);
    expect(response.text).toBe("Service not found.");
    expect(Service.findByIdAndDelete).toHaveBeenCalledWith(nonExistentId);
    expect(Service.findByIdAndDelete).toHaveBeenCalledTimes(1);
  });

  test("should return 500 if there is a database error", async () => {
    const serviceId = "67614ab0980d14bab88bd070";
    Service.findByIdAndDelete.mockRejectedValue(new Error("Database error"));

    const response = await request(app).delete(`/services/${serviceId}`);

    expect(response.status).toBe(500);
    expect(response.text).toBe("Error deleting service from the database");
    expect(Service.findByIdAndDelete).toHaveBeenCalledWith(serviceId);
    expect(Service.findByIdAndDelete).toHaveBeenCalledTimes(1);
  });
});

describe("POST /add-service", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should add a new service successfully and return 201", async () => {
    const mockService = {
      title: "Ganesh Puja",
      description: "Performed to seek Lord Ganesha’s blessings for success.",
      category: "Pujas",
    };

    Service.mockImplementation(() => ({
      save: jest.fn().mockResolvedValue(mockService),
    }));

    const response = await request(app)
      .post("/add-service")
      .send(mockService);

    expect(response.status).toBe(201);
    expect(response.text).toBe("Service added successfully");
    expect(Service).toHaveBeenCalledTimes(1);
  });

  test("should return 500 if there is an error adding the service", async () => {
    Service.mockImplementation(() => ({
      save: jest.fn().mockRejectedValue(new Error("Database error")),
    }));

    const response = await request(app)
      .post("/add-service")
      .send({
        title: "Ganesh Puja",
        description: "Performed to seek Lord Ganesha’s blessings for success.",
        category: "Pujas",
      });

    expect(response.status).toBe(500);
    expect(response.text).toBe("Error adding service to the database");
    expect(Service).toHaveBeenCalledTimes(1);
  });
});

describe("PUT /services/:id", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should update a service successfully and return 200", async () => {
    const serviceId = "67614ab0980d14bab88bd070";
    const updatedService = {
      title: "Updated Ganesh Puja",
      description: "Updated description for Ganesh Puja",
    };

    Service.findByIdAndUpdate.mockResolvedValue({ _id: serviceId, ...updatedService });

    const response = await request(app)
      .put(`/services/${serviceId}`)
      .send(updatedService);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ _id: serviceId, ...updatedService });
    expect(Service.findByIdAndUpdate).toHaveBeenCalledWith(serviceId, updatedService, { new: true });
    expect(Service.findByIdAndUpdate).toHaveBeenCalledTimes(1);
  });

  test("should return 200 with null body if the service is not found", async () => {
    const serviceId = "67614abe980d14bab88bd073";
    Service.findByIdAndUpdate.mockResolvedValue(null);
  
    const response = await request(app)
      .put(`/services/${serviceId}`)
      .send({ title: "Updated Service" });
  
    expect(response.status).toBe(200);
    expect(response.body).toBeNull();
    expect(Service.findByIdAndUpdate).toHaveBeenCalledTimes(1);
  });
  

  test("should return 500 if there is an error updating the service", async () => {
    const serviceId = "67614ab0980d14bab88bd070";
    Service.findByIdAndUpdate.mockRejectedValue(new Error("Database error"));

    const response = await request(app)
      .put(`/services/${serviceId}`)
      .send({ title: "Updated Service" });

    expect(response.status).toBe(500);
    expect(response.text).toContain("Error updating announcement");
    expect(Service.findByIdAndUpdate).toHaveBeenCalledTimes(1);
  });
});
