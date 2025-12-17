import { render, screen } from '@testing-library/react';
import { Progress } from '@/shared/components/ui/Progress';

describe('Progress', () => { it('should render progress bar', () => {
    render(<Progress value={50 } />);

    const progressBar = screen.getByRole('progressbar');

    expect(progressBar).toHaveAttribute('aria-valuenow', '50');

  });

  it('should show percentage', () => {
    render(<Progress value={75} showLabel />);

    expect(screen.getByText('75%')).toBeInTheDocument();

  });

  it('should render different colors', () => {
    const { rerender } = render(<Progress value={50} color="success" />);

    expect(screen.getByRole('progressbar')).toHaveClass('progress-success');

    rerender(<Progress value={50} color="danger" />);

    expect(screen.getByRole('progressbar')).toHaveClass('progress-danger');

  });

  it('should handle max value', () => {
    render(<Progress value={100} max={ 200 } />);

    const progressBar = screen.getByRole('progressbar');

    expect(progressBar).toHaveAttribute('aria-valuemax', '200');

  });

});
