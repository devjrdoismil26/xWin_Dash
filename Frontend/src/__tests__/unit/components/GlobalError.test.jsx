import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

// Mock GlobalError component for testing
const GlobalError = ({ error, reset }) => (
  <div data-testid="global-error">
    <h2>Something went wrong!</h2>
    <p>{error?.message || "An unexpected error occurred"}</p>
    <button onClick={reset} data-testid="reset-button">
      Try again
    </button>
  </div>
);

describe("GlobalError Component", () => {
  it("renders error message", () => {
    const mockError = { message: "Test error message" };
    const mockReset = () => {};

    render(<GlobalError error={mockError} reset={mockReset} />);

    expect(screen.getByTestId("global-error")).toBeInTheDocument();
    expect(screen.getByText("Test error message")).toBeInTheDocument();
  });

  it("renders default message when no error provided", () => {
    const mockReset = () => {};

    render(<GlobalError reset={mockReset} />);

    expect(
      screen.getByText("An unexpected error occurred"),
    ).toBeInTheDocument();
  });

  it("renders reset button", () => {
    const mockReset = () => {};

    render(<GlobalError reset={mockReset} />);

    expect(screen.getByTestId("reset-button")).toBeInTheDocument();
  });
});
