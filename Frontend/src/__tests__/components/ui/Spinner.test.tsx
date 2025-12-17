import { render, screen } from '@testing-library/react';
import { Spinner } from '@/shared/components/ui/Spinner';

describe('Spinner', () => {
  it('should render spinner', () => {
    render(<Spinner />);

    expect(screen.getByTestId('spinner')).toBeInTheDocument();

  });

  it('should render with different sizes', () => {
    const { rerender } = render(<Spinner size="sm" />);

    expect(screen.getByTestId('spinner')).toHaveClass('spinner-sm');

    rerender(<Spinner size="lg" />);

    expect(screen.getByTestId('spinner')).toHaveClass('spinner-lg');

  });

  it('should render with custom color', () => {
    render(<Spinner color="primary" />);

    expect(screen.getByTestId('spinner')).toHaveClass('spinner-primary');

  });

});
