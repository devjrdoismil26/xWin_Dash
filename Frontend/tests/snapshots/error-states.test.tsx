import { render } from '@testing-library/react';
import { ErrorBoundary } from '@/shared/components/ErrorBoundary';
import { NotFound } from '@/shared/components/NotFound';
import { ErrorMessage } from '@/shared/components/ErrorMessage';

describe('Error States Snapshots', () => {
  it('should match ErrorBoundary snapshot', () => {
    const { container } = render(<ErrorBoundary><div>Content</div></ErrorBoundary>);
    expect(container).toMatchSnapshot();
  });

  it('should match NotFound snapshot', () => {
    const { container } = render(<NotFound />);
    expect(container).toMatchSnapshot();
  });

  it('should match ErrorMessage snapshot', () => {
    const { container } = render(<ErrorMessage message="Something went wrong" />);
    expect(container).toMatchSnapshot();
  });
});
