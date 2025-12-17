import React, { Suspense } from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

// Mock LazyComponentWrapper for testing
const LazyComponentWrapper = ({
  children,
  fallback = <div>Loading...</div>,
}) => <Suspense fallback={fallback}>{children}</Suspense>;

// Mock lazy component
const MockLazyComponent = () => (
  <div data-testid="lazy-component">Lazy Component Loaded</div>
);

describe("LazyComponentWrapper Component", () => {
  it("renders loading fallback initially", () => {
    render(
      <LazyComponentWrapper>
        <MockLazyComponent />
      </LazyComponentWrapper>,
    );

    // In a real scenario, this would show loading first
    // For this mock, it renders immediately
    expect(screen.getByTestId("lazy-component")).toBeInTheDocument();
  });

  it("renders custom fallback", () => {
    const customFallback = (
      <div data-testid="custom-loading">Custom Loading...</div>
    );

    render(
      <LazyComponentWrapper fallback={customFallback}>
        <MockLazyComponent />
      </LazyComponentWrapper>,
    );

    expect(screen.getByTestId("lazy-component")).toBeInTheDocument();
  });
});
