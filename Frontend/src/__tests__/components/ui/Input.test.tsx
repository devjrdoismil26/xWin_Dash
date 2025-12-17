import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@test-utils/test-utils';
import Input from "@/shared/components/ui/Input";

describe("Input Component", () => {
  it("should render input with placeholder", () => {
    render(<Input placeholder="Enter text" />);

    expect(screen.getByPlaceholderText("Enter text")).toBeInTheDocument();

  });

  it("should render input with different types", () => {
    const { rerender } = render(<Input type="text" />);

    expect(screen.getByRole("textbox")).toHaveAttribute("type", "text");

    rerender(<Input type="email" />);

    expect(screen.getByRole("textbox")).toHaveAttribute("type", "email");

    rerender(<Input type="password" />);

    expect(screen.getByRole("textbox")).toHaveAttribute("type", "password");

    rerender(<Input type="number" />);

    expect(screen.getByRole("spinbutton")).toHaveAttribute("type", "number");

  });

  it("should handle value changes", () => { const handleChange = vi.fn();

    render(<Input onChange={handleChange } />);

    const input = screen.getByRole("textbox");

    fireEvent.change(input, { target: { value: "test value" } );

    expect(handleChange).toHaveBeenCalledTimes(1);

    expect(input).toHaveValue("test value");

  });

  it("should be controlled component", () => {
    const { rerender } = render(<Input value="initial" />);

    const input = screen.getByRole("textbox");

    expect(input).toHaveValue("initial");

    rerender(<Input value="updated" />);

    expect(input).toHaveValue("updated");

  });

  it("should be disabled when disabled prop is true", () => {
    render(<Input disabled />);

    const input = screen.getByRole("textbox");

    expect(input).toBeDisabled();

    expect(input).toHaveClass("opacity-50 cursor-not-allowed");

  });

  it("should show error state", () => {
    render(<Input error="This field is required" />);

    const input = screen.getByRole("textbox");

    expect(input).toHaveClass("border-red-500");

    expect(screen.getByText("This field is required")).toBeInTheDocument();

  });

  it("should show success state", () => {
    render(<Input success />);

    const input = screen.getByRole("textbox");

    expect(input).toHaveClass("border-green-500");

  });

  it("should support different sizes", () => {
    const { rerender } = render(<Input size="sm" />);

    expect(screen.getByRole("textbox")).toHaveClass("px-3 py-1.5 text-sm");

    rerender(<Input size="md" />);

    expect(screen.getByRole("textbox")).toHaveClass("px-3 py-2 text-sm");

    rerender(<Input size="lg" />);

    expect(screen.getByRole("textbox")).toHaveClass("px-4 py-3 text-base");

  });

  it("should support icons", () => { const TestIcon = () => <span data-testid="test-icon">Icon</span>;
    render(<Input icon={<TestIcon /> } />);

    expect(screen.getByTestId("test-icon")).toBeInTheDocument();

  });

  it("should support right icon", () => { const TestIcon = () => <span data-testid="right-icon">Right</span>;
    render(<Input rightIcon={<TestIcon /> } />);

    expect(screen.getByTestId("right-icon")).toBeInTheDocument();

  });

  it("should support custom className", () => {
    render(<Input className="custom-class" />);

    expect(screen.getByRole("textbox")).toHaveClass("custom-class");

  });

  it("should support dark theme", () => {
    render(<Input theme="dark" />);

    const input = screen.getByRole("textbox");

    expect(input).toHaveClass("dark:bg-gray-800");

  });

  it("should handle focus events", () => { const handleFocus = vi.fn();

    render(<Input onFocus={handleFocus } />);

    const input = screen.getByRole("textbox");

    fireEvent.focus(input);

    expect(handleFocus).toHaveBeenCalledTimes(1);

  });

  it("should handle blur events", () => { const handleBlur = vi.fn();

    render(<Input onBlur={handleBlur } />);

    const input = screen.getByRole("textbox");

    fireEvent.blur(input);

    expect(handleBlur).toHaveBeenCalledTimes(1);

  });

  it("should handle key events", () => { const handleKeyDown = vi.fn();

    render(<Input onKeyDown={handleKeyDown } />);

    const input = screen.getByRole("textbox");

    fireEvent.keyDown(input, { key: "Enter" });

    expect(handleKeyDown).toHaveBeenCalledTimes(1);

  });

  it("should support aria attributes", () => {
    render(
      <Input
        aria-label="Custom label"
        aria-describedby="description"
        aria-required="true" />,);

    const input = screen.getByRole("textbox");

    expect(input).toHaveAttribute("aria-label", "Custom label");

    expect(input).toHaveAttribute("aria-describedby", "description");

    expect(input).toHaveAttribute("aria-required", "true");

  });

  it("should support data attributes", () => {
    render(<Input data-testid="custom-input" />);

    expect(screen.getByTestId("custom-input")).toBeInTheDocument();

  });

  it("should support ref forwarding", () => { const ref = vi.fn();

    render(<Input ref={ref } />);

    expect(ref).toHaveBeenCalled();

  });

  it("should support maxLength", () => { render(<Input maxLength={10 } />);

    const input = screen.getByRole("textbox");

    expect(input).toHaveAttribute("maxLength", "10");

  });

  it("should support min and max for number inputs", () => {
    render(<Input type="number" min={0} max={ 100 } />);

    const input = screen.getByRole("spinbutton");

    expect(input).toHaveAttribute("min", "0");

    expect(input).toHaveAttribute("max", "100");

  });

  it("should support step for number inputs", () => { render(<Input type="number" step={0.1 } />);

    const input = screen.getByRole("spinbutton");

    expect(input).toHaveAttribute("step", "0.1");

  });

  it("should support pattern validation", () => {
    render(<Input pattern="[0-9]+" />);

    const input = screen.getByRole("textbox");

    expect(input).toHaveAttribute("pattern", "[0-9]+");

  });

  it("should support required validation", () => {
    render(<Input required />);

    const input = screen.getByRole("textbox");

    expect(input).toBeRequired();

  });

  it("should support autoComplete", () => {
    render(<Input autoComplete="email" />);

    const input = screen.getByRole("textbox");

    expect(input).toHaveAttribute("autoComplete", "email");

  });

  it("should support autoFocus", () => {
    render(<Input autoFocus />);

    const input = screen.getByRole("textbox");

    expect(input).toHaveFocus();

  });

  it("should support readOnly", () => {
    render(<Input readOnly />);

    const input = screen.getByRole("textbox");

    expect(input).toHaveAttribute("readOnly");

  });

});
