import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Modal } from '@/shared/components/ui/Modal';

// Mock framer-motion
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: unknown) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: unknown) => children,
}));

describe("Modal", () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

  });

  it("renders modal when open", () => {
    render(
      <Modal isOpen={true} onClose={ mockOnClose } />
        <Modal.Header />
          <Modal.Title>Test Modal</Modal.Title>
        </Modal.Header>
        <Modal.Body />
          <p>Modal content</p>
        </Modal.Body>
        <Modal.Footer />
          <button>Close</button>
        </Modal.Footer>
      </Modal>,);

    expect(screen.getByText("Test Modal")).toBeInTheDocument();

    expect(screen.getByText("Modal content")).toBeInTheDocument();

    expect(screen.getByRole("button", { name: "Close" })).toBeInTheDocument();

  });

  it("does not render modal when closed", () => {
    render(
      <Modal isOpen={false} onClose={ mockOnClose } />
        <Modal.Header />
          <Modal.Title>Test Modal</Modal.Title>
        </Modal.Header>
        <Modal.Body />
          <p>Modal content</p>
        </Modal.Body>
      </Modal>,);

    expect(screen.queryByText("Test Modal")).not.toBeInTheDocument();

  });

  it("calls onClose when close button is clicked", async () => {
    render(
      <Modal isOpen={true} onClose={ mockOnClose } />
        <Modal.Header />
          <Modal.Title>Test Modal</Modal.Title>
        </Modal.Header>
        <Modal.Body />
          <p>Modal content</p>
        </Modal.Body>
      </Modal>,);

    const closeButton = screen.getByRole("button", { name: /close/i });

    fireEvent.click(closeButton);

    await waitFor(() => {
      expect(mockOnClose).toHaveBeenCalledTimes(1);

    });

  });

  it("calls onClose when backdrop is clicked", async () => {
    render(
      <Modal isOpen={true} onClose={ mockOnClose } />
        <Modal.Header />
          <Modal.Title>Test Modal</Modal.Title>
        </Modal.Header>
        <Modal.Body />
          <p>Modal content</p>
        </Modal.Body>
      </Modal>,);

    const backdrop = screen.getByTestId("modal-backdrop");

    fireEvent.click(backdrop);

    await waitFor(() => {
      expect(mockOnClose).toHaveBeenCalledTimes(1);

    });

  });

  it("does not call onClose when modal content is clicked", async () => {
    render(
      <Modal isOpen={true} onClose={ mockOnClose } />
        <Modal.Header />
          <Modal.Title>Test Modal</Modal.Title>
        </Modal.Header>
        <Modal.Body />
          <p>Modal content</p>
        </Modal.Body>
      </Modal>,);

    const modalContent = screen.getByText("Modal content");

    fireEvent.click(modalContent);

    await waitFor(() => {
      expect(mockOnClose).not.toHaveBeenCalled();

    });

  });

  it("calls onClose when Escape key is pressed", async () => {
    render(
      <Modal isOpen={true} onClose={ mockOnClose } />
        <Modal.Header />
          <Modal.Title>Test Modal</Modal.Title>
        </Modal.Header>
        <Modal.Body />
          <p>Modal content</p>
        </Modal.Body>
      </Modal>,);

    fireEvent.keyDown(document, { key: "Escape", code: "Escape" });

    await waitFor(() => {
      expect(mockOnClose).toHaveBeenCalledTimes(1);

    });

  });

  it("renders with different sizes", () => {
    const { container: smContainer } = render(
      <Modal isOpen={true} onClose={mockOnClose} size="sm" />
        <Modal.Body>Small modal</Modal.Body>
      </Modal>,);

    const { container: lgContainer } = render(
      <Modal isOpen={true} onClose={mockOnClose} size="lg" />
        <Modal.Body>Large modal</Modal.Body>
      </Modal>,);

    expect(
      smContainer.querySelector('[data-testid="modal-content"]')!,
    ).toHaveClass("max-w-sm");

    expect(
      lgContainer.querySelector('[data-testid="modal-content"]')!,
    ).toHaveClass("max-w-4xl");

  });

  it("renders with custom className", () => {
    const { container } = render(
      <Modal isOpen={true} onClose={mockOnClose} className="custom-modal" />
        <Modal.Body>Custom modal</Modal.Body>
      </Modal>,);

    expect(
      container.querySelector('[data-testid="modal-content"]')!,
    ).toHaveClass("custom-modal");

  });

  it("renders loading state", () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose} loading />
        <Modal.Body>Loading modal</Modal.Body>
      </Modal>,);

    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();

  });

  it("renders with closeOnBackdropClick disabled", async () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose} closeOnBackdropClick={ false } />
        <Modal.Header />
          <Modal.Title>Test Modal</Modal.Title>
        </Modal.Header>
        <Modal.Body />
          <p>Modal content</p>
        </Modal.Body>
      </Modal>,);

    const backdrop = screen.getByTestId("modal-backdrop");

    fireEvent.click(backdrop);

    await waitFor(() => {
      expect(mockOnClose).not.toHaveBeenCalled();

    });

  });

  it("renders with closeOnEscape disabled", async () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose} closeOnEscape={ false } />
        <Modal.Header />
          <Modal.Title>Test Modal</Modal.Title>
        </Modal.Header>
        <Modal.Body />
          <p>Modal content</p>
        </Modal.Body>
      </Modal>,);

    fireEvent.keyDown(document, { key: "Escape", code: "Escape" });

    await waitFor(() => {
      expect(mockOnClose).not.toHaveBeenCalled();

    });

  });

  it("focuses first focusable element when opened", async () => {
    render(
      <Modal isOpen={true} onClose={ mockOnClose } />
        <Modal.Header />
          <Modal.Title>Test Modal</Modal.Title>
        </Modal.Header>
        <Modal.Body />
          <button>First button</button>
          <button>Second button</button>
        </Modal.Body>
      </Modal>,);

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "First button" }),
      ).toHaveFocus();

    });

  });

  it("traps focus within modal", async () => {
    render(
      <Modal isOpen={true} onClose={ mockOnClose } />
        <Modal.Header />
          <Modal.Title>Test Modal</Modal.Title>
        </Modal.Header>
        <Modal.Body />
          <button>First button</button>
          <button>Second button</button>
        </Modal.Body>
      </Modal>,);

    const firstButton = screen.getByRole("button", { name: "First button" });

    const secondButton = screen.getByRole("button", { name: "Second button" });

    firstButton.focus();

    fireEvent.keyDown(firstButton, { key: "Tab", shiftKey: true });

    await waitFor(() => {
      expect(secondButton).toHaveFocus();

    });

  });

});
