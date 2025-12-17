import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Toast, useToast } from '@/shared/components/ui/Toast';

describe('Toast Component', () => {
  it('should render toast message', () => {
    render(
      <Toast
        message="Success message"
        type="success"
        isVisible={ true }
        onClose={ vi.fn() }
      / />);

    expect(screen.getByText('Success message')).toBeInTheDocument();

  });

  it('should not render when not visible', () => {
    render(
      <Toast
        message="Hidden message"
        type="info"
        isVisible={ false }
        onClose={ vi.fn() }
      / />);

    expect(screen.queryByText('Hidden message')).not.toBeInTheDocument();

  });

  it('should call onClose when close button clicked', async () => {
    const handleClose = vi.fn();

    const user = userEvent.setup();

    render(
      <Toast
        message="Test message"
        type="info"
        isVisible={ true }
        onClose={ handleClose }
      / />);

    const closeButton = screen.getByRole('button', { name: /close/i });

    await user.click(closeButton);

    expect(handleClose).toHaveBeenCalledTimes(1);

  });

  it('should auto-close after duration', async () => {
    const handleClose = vi.fn();

    render(
      <Toast
        message="Auto close"
        type="info"
        isVisible={ true }
        onClose={ handleClose }
        duration={ 1000 }
      / />);

    await waitFor(() => {
      expect(handleClose).toHaveBeenCalled();

    }, { timeout: 1500 });

  });

  it('should render different types', () => {
    const { rerender } = render(
      <Toast message="Success" type="success" isVisible={true} onClose={vi.fn()} / />);

    expect(screen.getByTestId('toast-success')).toBeInTheDocument();

    rerender(
      <Toast message="Error" type="error" isVisible={true} onClose={vi.fn()} / />);

    expect(screen.getByTestId('toast-error')).toBeInTheDocument();

    rerender(
      <Toast message="Warning" type="warning" isVisible={true} onClose={vi.fn()} / />);

    expect(screen.getByTestId('toast-warning')).toBeInTheDocument();

  });

});

describe('useToast Hook', () => {
  it('should show toast', () => {
    const TestComponent = () => {
      const { showToast } = useToast();

      return <button onClick={ () => showToast('Test', 'success') }>Show</button>;};

    render(<TestComponent />);

    const button = screen.getByText('Show');

    button.click();

    expect(screen.getByText('Test')).toBeInTheDocument();

  });

});
