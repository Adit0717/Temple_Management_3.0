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
  expect(screen.getByText(/Calendar Events/i)).toBeInTheDocument();
  expect(screen.getByText(/Today/i)).toBeInTheDocument();
  expect(screen.getByText(/Month/i)).toBeInTheDocument();
  expect(screen.getByText(/Week/i)).toBeInTheDocument();
  expect(screen.getAllByText(/Day/i).length).toBeGreaterThan(0); 
  expect(screen.getByText(/List/i)).toBeInTheDocument();
  expect(
    screen.getByText(
      /\*All events located at main Temple site, unless otherwise specified./i
    )
  ).toBeInTheDocument();
});