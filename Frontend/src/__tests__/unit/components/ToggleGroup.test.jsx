import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

const ToggleGroup = ({ value, onValueChange, children }) => (
  <div data-testid="toggle-group" role="group">
    {React.Children.map(children, (child, index) =>
      React.cloneElement(child, {
        key: index,
        isSelected: value === child.props.value,
        onClick: () => onValueChange(child.props.value),
      }),
    )}
  </div>
);

const ToggleItem = ({ value, children, isSelected, onClick }) => (
  <button
    data-testid={`toggle-item-${value}`}
    className={isSelected ? "selected" : ""}
    onClick={onClick}
  >
    {children}
  </button>
);

describe("ToggleGroup Component", () => {
  it("renders toggle group", () => {
    render(
      <ToggleGroup value="option1" onValueChange={() => {}}>
        <ToggleItem value="option1">Option 1</ToggleItem>
        <ToggleItem value="option2">Option 2</ToggleItem>
      </ToggleGroup>,
    );

    expect(screen.getByTestId("toggle-group")).toBeInTheDocument();
  });

  it("handles value changes", () => {
    const handleChange = vi.fn();
    render(
      <ToggleGroup value="option1" onValueChange={handleChange}>
        <ToggleItem value="option1">Option 1</ToggleItem>
        <ToggleItem value="option2">Option 2</ToggleItem>
      </ToggleGroup>,
    );

    fireEvent.click(screen.getByTestId("toggle-item-option2"));
    expect(handleChange).toHaveBeenCalledWith("option2");
  });
});
