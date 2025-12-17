import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@test-utils/test-utils';
import React from "react";

// Mock simples do componente Button
const Button = ({
  children,
  onClick,
  disabled = false,
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: {
  children: React.ReactNode;
  onClick?: (e: any) => void;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
  [key: string]: unknown;
}) => {
  const baseClasses =
    "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";

  const variantClasses = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    secondary: "bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500",
    outline:
      "border border-gray-300 bg-transparent text-gray-700 hover:bg-gray-50 focus:ring-blue-500",
    ghost: "bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-blue-500",};

  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",};

  const disabledClasses = disabled ? "opacity-50 cursor-not-allowed" : "";

  return (
            <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClasses} ${className}`}
      onClick={ onClick }
      disabled={ disabled }
      { ...props } />
      {children}
    </button>);};

describe("Button Component", () => {
  it("should render button with text", () => {
    render(<Button>Click me</Button>);

    expect(
      screen.getByRole("button", { name: "Click me" }),
    ).toBeInTheDocument();

  });

  it("should render button with different variants", () => {
    const { rerender } = render(<Button variant="primary">Primary</Button>);

    expect(screen.getByRole("button")).toHaveClass("bg-blue-600");

    rerender(<Button variant="secondary">Secondary</Button>);

    expect(screen.getByRole("button")).toHaveClass("bg-gray-600");

    rerender(<Button variant="outline">Outline</Button>);

    expect(screen.getByRole("button")).toHaveClass("border-gray-300");

    rerender(<Button variant="ghost">Ghost</Button>);

    expect(screen.getByRole("button")).toHaveClass("bg-transparent");

  });

  it("should render button with different sizes", () => {
    const { rerender } = render(<Button size="sm">Small</Button>);

    expect(screen.getByRole("button")).toHaveClass("px-3 py-1.5 text-sm");

    rerender(<Button size="md">Medium</Button>);

    expect(screen.getByRole("button")).toHaveClass("px-4 py-2 text-sm");

    rerender(<Button size="lg">Large</Button>);

    expect(screen.getByRole("button")).toHaveClass("px-6 py-3 text-base");

  });

  it("should handle click events", () => {
    const handleClick = vi.fn();

    render(<Button onClick={ handleClick }>Click me</Button>);

    fireEvent.click(screen.getByRole("button"));

    expect(handleClick).toHaveBeenCalledTimes(1);

  });

  it("should be disabled when disabled prop is true", () => {
    render(<Button disabled>Disabled</Button>);

    const button = screen.getByRole("button");

    expect(button).toBeDisabled();

    expect(button).toHaveClass("opacity-50 cursor-not-allowed");

  });

  it("should not trigger click when disabled", () => { const handleClick = vi.fn();

    render(
      <Button disabled onClick={handleClick } />
        Disabled
      </Button>,);

    fireEvent.click(screen.getByRole("button"));

    expect(handleClick).not.toHaveBeenCalled();

  });

  it("should support custom className", () => {
    render(<Button className="custom-class">Custom</Button>);

    expect(screen.getByRole("button")).toHaveClass("custom-class");

  });

  it("should support data attributes", () => {
    render(<Button data-testid="custom-button">Data</Button>);

    expect(screen.getByTestId("custom-button")).toBeInTheDocument();

  });

});
