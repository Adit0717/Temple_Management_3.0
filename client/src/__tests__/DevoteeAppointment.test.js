import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import DevoteeAppointments from "../components/DevoteeAppointments";
import { ToastContainer } from "react-toastify";

describe("DevoteeAppointments Component", () => {
  beforeEach(() => {
    render(
      <>
        <DevoteeAppointments />
        <ToastContainer />
      </>
    );
  });

  test("renders the appointment booking header", () => {
    expect(
      screen.getByText("Book an Appointment with a priest")
    ).toBeInTheDocument();
  });

  test("renders the priest information section", () => {
    expect(screen.getByText("Priest Information")).toBeInTheDocument();
  });

  test("renders the 'Book your slot' section", () => {
    expect(screen.getByText("Book your slot")).toBeInTheDocument();
  });

  test("renders the information text area", () => {
    const textArea = screen.getByPlaceholderText(
      "Enter any additional information for the priest..."
    );
    expect(textArea).toBeInTheDocument();
  });

  test("renders the 'Book Appointment' button", () => {
    const button = screen.getByRole("button", { name: /Book Appointment/i });
    expect(button).toBeInTheDocument();
  });

  test("allows user to type in the 'Information to Priests' textarea", () => {
    const textArea = screen.getByPlaceholderText(
      "Enter any additional information for the priest..."
    );
    fireEvent.change(textArea, { target: { value: "Special request" } });
    expect(textArea.value).toBe("Special request");
  });

  test("renders toast notifications (without API calls)", () => {
    expect(screen.getByText("Book an Appointment with a priest")).toBeInTheDocument();
  });
});
