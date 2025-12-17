import React from "react";
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

// Mock Input component for testing
const Input: React.FC<{
  value?: string;
  onChange?: (e: any) => void;
  placeholder?: string;
  type?: string;
  disabled?: boolean;
}> = ({
  value,
  onChange,
  placeholder = "",
  type = "text",
  disabled = false,
}) => (
  <input
    type={ type }
    value={ value }
    onChange={ onChange }
    placeholder={ placeholder }
    disabled={ disabled }
    data-testid="input"
  / />);

describe("Input Component", () => {
  it("renders input field", () => {
    render(<Input placeholder="Enter text" />);

    expect(screen.getByTestId("input")).toBeInTheDocument();

    expect(screen.getByPlaceholderText("Enter text")).toBeInTheDocument();

  });

  it("handles value changes", () => { const handleChange = vi.fn();

    render(<Input value="test" onChange={handleChange } />);

    const input = screen.getByTestId("input");

    fireEvent.change(input, { target: { value: "new value" } );

    expect(handleChange).toHaveBeenCalled();

  });

  it("handles different input types", () => {
    render(<Input type="email" />);

    expect(screen.getByTestId("input")).toHaveAttribute("type", "email");

  });

  it("handles disabled state", () => {
    render(<Input disabled />);

    expect(screen.getByTestId("input")).toBeDisabled();

  });

});
