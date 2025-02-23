import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import Donations from "../Donations"; // Adjust path if needed
import Payment from "../Payment"; // Ensure Payment component is included
import { toast } from "react-toastify";

// Mock the toast library
jest.mock("react-toastify", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe("Donations Page", () => {
  const mockNavigate = jest.fn();

  jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: () => mockNavigate,
  }));

  test("Clicking 'Donate' redirects to payment page with correct amount", () => {
    render(
      <MemoryRouter>
        <Donations />
      </MemoryRouter>
    );

    const donateButton = screen.getByText("Donate");
    fireEvent.click(donateButton);

    expect(mockNavigate).toHaveBeenCalledWith("/payment", { state: { donationAmount: 50 } });
  });
});
