import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Modal } from '@/shared/components/ui/Modal';

describe('Modal Component', () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

  });

  it('should render when open', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose} title="Test Modal" />
        <div>Modal Content</div>
      </Modal>);

    expect(screen.getByText('Test Modal')).toBeInTheDocument();

    expect(screen.getByText('Modal Content')).toBeInTheDocument();

  });

  it('should not render when closed', () => {
    render(
      <Modal isOpen={false} onClose={mockOnClose} title="Test Modal" />
        <div>Modal Content</div>
      </Modal>);

    expect(screen.queryByText('Test Modal')).not.toBeInTheDocument();

  });

  it('should call onClose when close button is clicked', async () => {
    const user = userEvent.setup();

    render(
      <Modal isOpen={true} onClose={mockOnClose} title="Test Modal" />
        Content
      </Modal>);

    const closeButton = screen.getByRole('button', { name: /close/i });

    await user.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);

  });

  it('should call onClose when overlay is clicked', async () => {
    const user = userEvent.setup();

    render(
      <Modal isOpen={true} onClose={mockOnClose} title="Test Modal" />
        Content
      </Modal>);

    const overlay = screen.getByTestId('modal-overlay');

    await user.click(overlay);

    expect(mockOnClose).toHaveBeenCalledTimes(1);

  });

  it('should not close when clicking inside modal', async () => {
    const user = userEvent.setup();

    render(
      <Modal isOpen={true} onClose={mockOnClose} title="Test Modal" />
        <button>Inside Button</button>
      </Modal>);

    const insideButton = screen.getByText('Inside Button');

    await user.click(insideButton);

    expect(mockOnClose).not.toHaveBeenCalled();

  });

  it('should close on Escape key', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose} title="Test Modal" />
        Content
      </Modal>);

    fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' });

    expect(mockOnClose).toHaveBeenCalledTimes(1);

  });

  it('should render footer actions', () => {
    const footer = (
      <div>
           
        </div><button>Cancel</button>
        <button>Confirm</button>
      </div>);

    render(
      <Modal isOpen={true} onClose={mockOnClose} title="Test Modal" footer={ footer } />
        Content
      </Modal>);

    expect(screen.getByText('Cancel')).toBeInTheDocument();

    expect(screen.getByText('Confirm')).toBeInTheDocument();

  });

  it('should apply custom size', () => {
    const { container } = render(
      <Modal isOpen={true} onClose={mockOnClose} title="Test Modal" size="large" />
        Content
      </Modal>);

    const modal = container.querySelector('[data-size="large"]');

    expect(modal).toBeInTheDocument();

  });

});
