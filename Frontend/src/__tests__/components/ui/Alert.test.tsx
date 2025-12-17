import { render, screen, fireEvent } from '@testing-library/react';
import { Alert } from '@/shared/components/ui/Alert';

describe('Alert', () => {
  it('should render alert', () => {
    render(<Alert>Test message</Alert>);

    expect(screen.getByText('Test message')).toBeInTheDocument();

  });

  it('should render different variants', () => {
    const { rerender } = render(<Alert variant="success">Success</Alert>);

    expect(screen.getByText('Success')).toBeInTheDocument();

    rerender(<Alert variant="error">Error</Alert>);

    expect(screen.getByText('Error')).toBeInTheDocument();

    rerender(<Alert variant="warning">Warning</Alert>);

    expect(screen.getByText('Warning')).toBeInTheDocument();

  });

  it('should close on dismiss', () => {
    const onClose = vi.fn();

    render(<Alert onClose={ onClose }>Dismissible</Alert>);

    const closeButton = screen.getByRole('button');

    fireEvent.click(closeButton);

    expect(onClose).toHaveBeenCalled();

  });

});
