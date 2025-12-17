import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

const Tooltip = ({ content, children }) => (
  <div data-testid="tooltip-wrapper">
    {children}
    <div data-testid="tooltip-content" className="tooltip">
      {content}
    </div>
  </div>
);

describe("Tooltip Component", () => {
  it("renders tooltip with content", () => {
    render(
      <Tooltip content="Tooltip text">
        <button>Hover me</button>
      </Tooltip>,
    );

    expect(screen.getByTestId("tooltip-wrapper")).toBeInTheDocument();
    expect(screen.getByTestId("tooltip-content")).toBeInTheDocument();
    expect(screen.getByText("Tooltip text")).toBeInTheDocument();
  });

  it("renders children", () => {
    render(
      <Tooltip content="Tooltip text">
        <button>Hover me</button>
      </Tooltip>,
    );

    expect(screen.getByText("Hover me")).toBeInTheDocument();
  });
});
