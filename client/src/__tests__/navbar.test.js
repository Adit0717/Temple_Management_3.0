import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom"; // Needed for <Link> components
import NavbarAdmin from "../NavbarAdmin"; // Adjust path based on your structure
import NavbarDevotee from "../NavbarDevotee"; // Adjust path based on your structure

describe("Navbar role-based navigation", () => {
  
  test("renders correct navigation links for an Admin", () => {
    render(
      <BrowserRouter>
        <NavbarAdmin />
      </BrowserRouter>
    );

    // General links (common for all users)
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Live-Stream")).toBeInTheDocument();
    expect(screen.getByText("About")).toBeInTheDocument();
    expect(screen.getByText("Events")).toBeInTheDocument();
    expect(screen.getByText("Services")).toBeInTheDocument();
    expect(screen.getByText("Logout")).toBeInTheDocument();

    // Admin-specific links
    expect(screen.getByText("View Appointments")).toBeInTheDocument();

    // Devotee-only links should NOT be present
    expect(screen.queryByText("Donations")).not.toBeInTheDocument();
    expect(screen.queryByText("Book Appointments")).not.toBeInTheDocument();
  });

  test("renders correct navigation links for a Devotee", () => {
    render(
      <BrowserRouter>
        <NavbarDevotee />
      </BrowserRouter>
    );

    // General links (common for all users)
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Live-Stream")).toBeInTheDocument();
    expect(screen.getByText("About")).toBeInTheDocument();
    expect(screen.getByText("Events")).toBeInTheDocument();
    expect(screen.getByText("Services")).toBeInTheDocument();
    expect(screen.getByText("Logout")).toBeInTheDocument();

    // Devotee-specific links
    expect(screen.getByText("Donations")).toBeInTheDocument();
    expect(screen.getByText("Book Appointments")).toBeInTheDocument();

    // Admin-only links should NOT be present
    expect(screen.queryByText("View Appointments")).not.toBeInTheDocument();
  });
});
