import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Footer from "../components/Footer";

describe("Footer Component", () => {
  beforeEach(() => {
    render(<Footer />);
  });

  test("displays clickable social media links", () => {
    const socialLinks = [
      { name: "Facebook", href: "https://www.facebook.com/srjbtkshetra/" },
      { name: "Instagram", href: "https://www.instagram.com/shriramteerthkshetra/?hl=en" },
      { name: "Twitter", href: "https://twitter.com" },
      { name: "YouTube", href: "https://youtube.com" },
    ];

    socialLinks.forEach(({ name, href }) => {
      const linkElement = screen.getByRole("link", { name });
      expect(linkElement).toBeInTheDocument();
      expect(linkElement).toHaveAttribute("href", href);
      expect(linkElement).toHaveAttribute("target", "_blank");
      expect(linkElement).toHaveAttribute("rel", "noopener noreferrer");
    });
  });

  test("includes copyright text and developer credit", () => {
    expect(screen.getByText(/© 2024 Ram Mandir Temple/i)).toBeInTheDocument();
    expect(screen.getByText(/Developed by/i)).toBeInTheDocument();
  });

  test("displays the temple logo centered for branding", () => {
    const logo = screen.getByAltText(/Logo/i);
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute("src"); // Ensures there's an image source
  });

  test("shows scroll-to-top button when scrolled to bottom", () => {
    fireEvent.scroll(window, { target: { scrollY: 1000 } });
    const scrollToTopBtn = screen.getByRole("button");
    expect(scrollToTopBtn).toBeInTheDocument();
  });

  test("clicking scroll-to-top button scrolls back to top", () => {
    // Mock window.scrollTo
    window.scrollTo = jest.fn();
    
    fireEvent.scroll(window, { target: { scrollY: 1000 } });
    const scrollToTopBtn = screen.getByRole("button");

    fireEvent.click(scrollToTopBtn);
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });
  });
});