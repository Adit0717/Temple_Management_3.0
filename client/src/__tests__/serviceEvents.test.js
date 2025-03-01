import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Services from "../components/Services";
import { BrowserRouter } from "react-router-dom";

global.fetch = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
  localStorage.setItem("role", "administrator"); 
});

describe("Services Component", () => {
  test("fetches and displays services", async () => {
    const mockServices = [
      { _id: "1", title: "Ganapathi Puja", description: "Puja for Lord Ganesha", category: "Pujas" },
      { _id: "2", title: "Navagraha Homam", description: "Homam for planetary peace", category: "Homams" },
    ];

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockServices,
    });

    render(
      <BrowserRouter>
        <Services />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Ganapathi Puja")).toBeInTheDocument();
      expect(screen.getByText("Navagraha Homam")).toBeInTheDocument();
    });
  });

  test("opens and closes modal for adding a new event", async () => {
    render(
      <BrowserRouter>
        <Services />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByText(/Add New Pujas Event/i));

    await waitFor(() => {
      expect(screen.getByText(/Add New Event for Pujas/i)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText(/Cancel/i));

    await waitFor(() => {
      expect(screen.queryByText(/Add New Event for Pujas/i)).not.toBeInTheDocument();
    });
  });

  test("creates a new service event", async () => {
    fetch.mockResolvedValueOnce({ ok: true });

    render(
      <BrowserRouter>
        <Services />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByText(/Add New Pujas Event/i));

    await waitFor(() => {
      expect(screen.getByText(/Add New Event for Pujas/i)).toBeInTheDocument();
    });

    fireEvent.change(screen.getByPlaceholderText(/Enter event title/i), { target: { value: "Rudrabhishekam" } });
    fireEvent.change(screen.getByPlaceholderText(/Enter event description/i), { target: { value: "Powerful Shiva Puja" } });

    fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ _id: "3", title: "Rudrabhishekam", description: "Powerful Shiva Puja", category: "Pujas" }) });

    fireEvent.click(screen.getByText(/Save/i));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        "http://localhost:3001/add-service",
        expect.objectContaining({ method: "POST" })
      );
    });
  });

  test("edits an existing service event", async () => {
    const mockService = { _id: "1", title: "Ganapathi Puja", description: "Puja for Lord Ganesha", category: "Pujas" };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [mockService],
    });

    render(
      <BrowserRouter>
        <Services />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Ganapathi Puja")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText(/Edit/i));

    await waitFor(() => {
      expect(screen.getByText(/Edit Event/i)).toBeInTheDocument();
    });

    fireEvent.change(screen.getByPlaceholderText(/Enter event title/i), { target: { value: "Modified Puja" } });

    fetch.mockResolvedValueOnce({ ok: true });

    fireEvent.click(screen.getByText(/Update/i));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        `http://localhost:3001/services/${mockService._id}`,
        expect.objectContaining({ method: "PUT" })
      );
    });
  });

  test("deletes an event and verifies it's removed", async () => {
    const mockService = { _id: "1", title: "Ganapathi Puja", description: "Puja for Lord Ganesha", category: "Pujas" };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [mockService],
    });

    render(
      <BrowserRouter>
        <Services />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Ganapathi Puja")).toBeInTheDocument();
    });

    fetch.mockResolvedValueOnce({ ok: true });

    fireEvent.click(screen.getByText(/Delete/i));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        `http://localhost:3001/services/${mockService._id}`,
        expect.objectContaining({ method: "DELETE" })
      );
    });

    fetch.mockResolvedValueOnce({ ok: true, json: async () => [] });

    await waitFor(() => {
      expect(screen.queryByText("Ganapathi Puja")).not.toBeInTheDocument();
    });
  });
});
