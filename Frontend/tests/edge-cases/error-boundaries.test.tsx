import { render } from '@testing-library/react';
import { ErrorBoundary } from '@/shared/components/ErrorBoundary';

const ThrowError = () => {
  throw new Error('Test error');
};

describe('Edge Cases: Error Boundaries', () => {
  it('should catch errors', () => {
    const { getByText } = render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );
    expect(getByText(/something went wrong/i)).toBeInTheDocument();
  });
});
