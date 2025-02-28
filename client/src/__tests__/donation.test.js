import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Donations from "../components/Dontations"; // Adjust path if needed

// Mock useNavigate globally
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("Donations Page UI & Buttons", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mock calls before each test
  });

 
  test("Page should contain correct donation text", () => {
    render(
      <MemoryRouter>
        <Donations />
      </MemoryRouter>
    );

    // Select only the h2 heading for "Donations"
    const donationHeading = screen.getAllByText(/donations/i).find((el) => el.tagName === "H2");
    expect(donationHeading).toBeInTheDocument();

    expect(screen.getByText(/NPO ID#/i)).toBeInTheDocument();
    expect(screen.getByText(/17053281338009/i)).toBeInTheDocument();
    expect(
      screen.getByText(/The Ram Mandir Temple is a non-profit organization/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/By The Ram Mandir Administration/i)).toBeInTheDocument();
  });

  // ✅ Test 2: Check if dropdown contains correct donation values
  test("Dropdown should contain correct donation values", () => {
    render(
      <MemoryRouter>
        <Donations />
      </MemoryRouter>
    );

    const dropdown = screen.getByRole("combobox"); // Find dropdown
    expect(dropdown).toBeInTheDocument();

    // Check if dropdown contains expected options
    expect(screen.getByText("$25 per month")).toBeInTheDocument();
    expect(screen.getByText("$55 per month")).toBeInTheDocument();
    expect(screen.getByText("$100 per month")).toBeInTheDocument();
  });

  // ✅ Test 3: One-Time Donation button should be clickable
  test("One-Time Donation button should be clickable", () => {
    render(
      <MemoryRouter>
        <Donations />
      </MemoryRouter>
    );

    const oneTimeDonateButton = screen.getAllByText("Donate")[0]; // First Donate button
    fireEvent.click(oneTimeDonateButton);

    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith("/payment", { state: { donationAmount: 50 } });
  });

  // ✅ Test 4: Monthly Donation button should be clickable
  test("Monthly Donation button should be clickable", () => {
    render(
      <MemoryRouter>
        <Donations />
      </MemoryRouter>
    );

    const monthlyDonateButton = screen.getAllByText("Donate")[1]; // Second Donate button
    fireEvent.click(monthlyDonateButton);

    expect(mockNavigate).toHaveBeenCalled(); // Ensure navigation happens
  });

  // ✅ Test 5: Donation Form link should exist and have correct attributes
  test("Donation Form link should exist and have correct attributes", () => {
    render(
      <MemoryRouter>
        <Donations />
      </MemoryRouter>
    );

    const donationFormLink = screen.getByText("Donation Form");
    expect(donationFormLink).toBeInTheDocument();
    expect(donationFormLink).toHaveAttribute("href", expect.stringContaining(".pdf"));
    expect(donationFormLink).toHaveAttribute("target", "_blank");
  });
});
