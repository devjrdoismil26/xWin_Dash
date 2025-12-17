import { render } from '@testing-library/react';
import { Alert, AlertTitle, AlertDescription } from '@/shared/components/ui/alert';

describe('UI - Alert', () => {
  it('should render alert', () => {
    const { getByText } = render(
      <Alert>
        <AlertTitle>Warning</AlertTitle>
        <AlertDescription>This is a warning message</AlertDescription>
      </Alert>
    );
    expect(getByText('Warning')).toBeInTheDocument();
    expect(getByText('This is a warning message')).toBeInTheDocument();
  });

  it('should apply variant styles', () => {
    const { container } = render(<Alert variant="destructive">Error</Alert>);
    expect(container.firstChild).toHaveClass('destructive');
  });
});
