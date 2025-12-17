import { render } from '@testing-library/react';
import { Badge } from '@/shared/components/ui/badge';

describe('UI - Badge', () => {
  it('should render badge', () => {
    const { getByText } = render(<Badge>New</Badge>);
    expect(getByText('New')).toBeInTheDocument();
  });

  it('should apply variant styles', () => {
    const { getByText } = render(<Badge variant="destructive">Error</Badge>);
    expect(getByText('Error')).toHaveClass('destructive');
  });

  it('should apply size styles', () => {
    const { getByText } = render(<Badge size="lg">Large</Badge>);
    expect(getByText('Large')).toHaveClass('lg');
  });
});
