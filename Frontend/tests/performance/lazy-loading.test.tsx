import { render, waitFor } from '@testing-library/react';
import { lazy, Suspense } from 'react';

const LazyComponent = lazy(() => import('@/modules/Products/pages/ProductsPage'));

describe('Performance: Lazy Loading', () => {
  it('should lazy load components', async () => {
    const { getByText } = render(
      <Suspense fallback={<div>Loading...</div>}>
        <LazyComponent />
      </Suspense>
    );
    expect(getByText('Loading...')).toBeInTheDocument();
    await waitFor(() => expect(getByText('Loading...')).not.toBeInTheDocument());
  });
});
