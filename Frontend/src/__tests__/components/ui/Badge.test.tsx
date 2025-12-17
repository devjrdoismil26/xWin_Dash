import { render, screen } from '@testing-library/react';
import { Badge } from '@/shared/components/ui/Badge';

describe('Badge', () => {
  it('should render badge with text', () => {
    render(<Badge>Test Badge</Badge>);

    expect(screen.getByText('Test Badge')).toBeInTheDocument();

  });

  it('should apply variant classes', () => {
    const { container } = render(<Badge variant="success">Success</Badge>);

    expect(container.firstChild).toHaveClass('badge-success');

  });

  it('should render different variants', () => {
    const { rerender } = render(<Badge variant="primary">Primary</Badge>);

    expect(screen.getByText('Primary')).toBeInTheDocument();

    rerender(<Badge variant="danger">Danger</Badge>);

    expect(screen.getByText('Danger')).toBeInTheDocument();

    rerender(<Badge variant="warning">Warning</Badge>);

    expect(screen.getByText('Warning')).toBeInTheDocument();

  });

  it('should render with custom className', () => {
    const { container } = render(<Badge className="custom-class">Badge</Badge>);

    expect(container.firstChild).toHaveClass('custom-class');

  });

});
