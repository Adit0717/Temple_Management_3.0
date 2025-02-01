import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Navbar from "../components/NavBar";

test("renders correct navbar options for /home route", () => {
  render(
    <BrowserRouter>
      <Navbar />
    </BrowserRouter>
  );

  expect(screen.getByAltText(/Temple Logo/i)).toBeInTheDocument();
  expect(screen.getByText(/Ram Mandir/i)).toBeInTheDocument();

  expect(screen.getByText(/Home/i)).toBeInTheDocument();
  expect(screen.getByText(/Live-Stream/i)).toBeInTheDocument();  
  expect(screen.getByText(/Events/i)).toBeInTheDocument();
  expect(screen.getByText(/Login/i)).toBeInTheDocument();
  expect(screen.getByText(/Signup/i)).toBeInTheDocument();
  
  expect(screen.getByText(/Mission/i)).toBeInTheDocument();
  expect(screen.getByText(/Contact Us/i)).toBeInTheDocument();
  expect(screen.getByText(/About the Priest/i)).toBeInTheDocument();
});
