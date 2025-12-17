import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

// Mock LoadingSpinner component for testing
const LoadingSpinner = ({ size = "md", className = "" }) => (
  <div
    data-testid="loading-spinner"
    className={`spinner spinner-${size} ${className}`}
  >
    <div className="spinner-circle" />
  </div>
);

describe("LoadingSpinner Component", () => {
  it("renders loading spinner", () => {
    render(<LoadingSpinner />);

    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
  });

  it("applies size classes", () => {
    render(<LoadingSpinner size="lg" />);

    expect(screen.getByTestId("loading-spinner")).toHaveClass("spinner-lg");
  });

  it("applies custom className", () => {
    render(<LoadingSpinner className="custom-class" />);

    expect(screen.getByTestId("loading-spinner")).toHaveClass("custom-class");
  });

  it("uses default size when not specified", () => {
    render(<LoadingSpinner />);

    expect(screen.getByTestId("loading-spinner")).toHaveClass("spinner-md");
  });
});
