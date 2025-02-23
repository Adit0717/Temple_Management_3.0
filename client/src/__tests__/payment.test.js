import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, useLocation } from "react-router-dom";
import Payment from "../Payment";
import { toast } from "react-toastify";

// Mock the toast library
jest.mock("react-toastify", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useLocation: jest.fn(),
  useNavigate: () => jest.fn(),
}));

describe("Payment Page", () => {
  beforeEach(() => {
    useLocation.mockReturnValue({
      state: { donationAmount: 100 },
    });
  });

  test("Displays correct donation amount", () => {
    render(
      <MemoryRouter>
        <Payment />
      </MemoryRouter>
    );

    expect(screen.getByText("Donation Amount:")).toBeInTheDocument();
    expect(screen.getByText("$100")).toBeInTheDocument();
  });

  test("Displays success message when payment is successful", async () => {
    render(
      <MemoryRouter>
        <Payment />
      </MemoryRouter>
    );

    fireEvent.submit(screen.getByRole("form"));

    expect(toast.success).toHaveBeenCalledWith("Payment submitted successfully!");
  });

  test("Displays error message when payment fails", async () => {
    jest.spyOn(global, "fetch").mockRejectedValue(new Error("Payment Failed"));

    render(
      <MemoryRouter>
        <Payment />
      </MemoryRouter>
    );

    fireEvent.submit(screen.getByRole("form"));

    expect(toast.error).toHaveBeenCalledWith("Payment failed. Please try again.");
  });
});
