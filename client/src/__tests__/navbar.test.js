import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom"; 
import NavbarAdmin from '../components/NavBarAdmin'
import NavbarDevotee from '../components/NavBarDevotee'

describe("Navbar role-based navigation", () => {
  
  test("renders correct navigation links for an Admin", () => {
    render(
      <BrowserRouter>
        <NavbarAdmin />
      </BrowserRouter>
    );

    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Live-Stream")).toBeInTheDocument();
    expect(screen.getByText("About")).toBeInTheDocument();
    expect(screen.getByText("Events")).toBeInTheDocument();
    expect(screen.getByText("Services")).toBeInTheDocument();
    expect(screen.getByText("Logout")).toBeInTheDocument();

    expect(screen.getByText("View Appointments")).toBeInTheDocument();

    expect(screen.queryByText("Donations")).not.toBeInTheDocument();
    expect(screen.queryByText("Book Appointments")).not.toBeInTheDocument();
  });

  test("renders correct navigation links for a Devotee", () => {
    render(
      <BrowserRouter>
        <NavbarDevotee />
      </BrowserRouter>
    );

    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Live-Stream")).toBeInTheDocument();
    expect(screen.getByText("About")).toBeInTheDocument();
    expect(screen.getByText("Events")).toBeInTheDocument();
    expect(screen.getByText("Services")).toBeInTheDocument();
    expect(screen.getByText("Logout")).toBeInTheDocument();

    expect(screen.getByText("Donations")).toBeInTheDocument();
    expect(screen.getByText("Book Appointments")).toBeInTheDocument();

    expect(screen.queryByText("View Appointments")).not.toBeInTheDocument();
  });
});
