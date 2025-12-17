import React from "react";
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

// Mock UI Components for testing
const Card = ({ children, className = "" }) => (
  <div data-testid="card" className={`card ${className} `}>
           
        </div>{children}
  </div>);

const Badge = ({ children, variant = "default" }) => (
  <span data-testid="badge" className={`badge badge-${variant} `}>
           
        </span>{children}
  </span>);

describe("UI Components", () => {
  describe("Card", () => {
    it("renders card component", () => {
      render(<Card>Card content</Card>);

      expect(screen.getByTestId("card")).toBeInTheDocument();

      expect(screen.getByText("Card content")).toBeInTheDocument();

    });

    it("applies custom className", () => {
      render(<Card className="custom-class">Card content</Card>);

      expect(screen.getByTestId("card")).toHaveClass("custom-class");

    });

  });

  describe("Badge", () => {
    it("renders badge component", () => {
      render(<Badge>Badge text</Badge>);

      expect(screen.getByTestId("badge")).toBeInTheDocument();

      expect(screen.getByText("Badge text")).toBeInTheDocument();

    });

    it("applies variant classes", () => {
      render(<Badge variant="success">Success badge</Badge>);

      expect(screen.getByTestId("badge")).toHaveClass("badge-success");

    });

  });

});
