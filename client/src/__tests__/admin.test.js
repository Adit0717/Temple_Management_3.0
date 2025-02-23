import React from "react";
import { render, screen } from "@testing-library/react";
import AdminView from "../AdminView"; // Adjust path if needed
import { MemoryRouter } from "react-router-dom";

describe("Admin Donation Management", () => {
  test("Admin should see 'View Donation Records'", () => {
    render(
      <MemoryRouter>
        <AdminView />
      </MemoryRouter>
    );

    expect(screen.getByText("View Donation Records")).toBeInTheDocument();
  });
});
