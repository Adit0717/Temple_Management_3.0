import React from "react";
import { render, screen } from "@testing-library/react";
import Events from "../components/Events";
import { BrowserRouter } from "react-router-dom";
test("renders Events page correctly", () => {
  render(
    <BrowserRouter>
      <Events />
    </BrowserRouter>
  );
  // Check for Calendar heading
  expect(screen.getByText(/Calendar Events/i)).toBeInTheDocument();
  // Check for Calendar navigation buttons uniquely
  expect(screen.getByText(/Today/i)).toBeInTheDocument();
  expect(screen.getByText(/Month/i)).toBeInTheDocument();
  expect(screen.getByText(/Week/i)).toBeInTheDocument();
  expect(screen.getAllByText(/Day/i).length).toBeGreaterThan(0); // Since "Day" appears multiple times
  expect(screen.getByText(/List/i)).toBeInTheDocument();
  // Check for Calendar note
  expect(
    screen.getByText(
      /\*All events located at main Temple site, unless otherwise specified./i
    )
  ).toBeInTheDocument();
});