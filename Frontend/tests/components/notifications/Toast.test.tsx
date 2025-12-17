import { render, fireEvent, waitFor } from '@testing-library/react';
import { Toast } from '@/shared/components/Notifications/Toast';

describe('Notifications - Toast', () => {
  it('should render toast message', () => {
    const { getByText } = render(<Toast message="Success!" type="success" />);
    expect(getByText('Success!')).toBeInTheDocument();
  });

  it('should auto-dismiss after timeout', async () => {
    const onDismiss = jest.fn();
    const { queryByText } = render(
      <Toast message="Auto dismiss" duration={1000} onDismiss={onDismiss} />
    );
    
    await waitFor(() => expect(onDismiss).toHaveBeenCalled(), { timeout: 1500 });
  });

  it('should dismiss on close click', () => {
    const onDismiss = jest.fn();
    const { getByRole } = render(<Toast message="Dismiss me" onDismiss={onDismiss} />);
    
    fireEvent.click(getByRole('button', { name: /close/i }));
    expect(onDismiss).toHaveBeenCalled();
  });

  it('should apply type styles', () => {
    const { container, rerender } = render(<Toast message="Test" type="success" />);
    expect(container.firstChild).toHaveClass('success');
    
    rerender(<Toast message="Test" type="error" />);
    expect(container.firstChild).toHaveClass('error');
  });
});
