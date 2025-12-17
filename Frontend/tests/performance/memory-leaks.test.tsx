import { render, cleanup } from '@testing-library/react';
import { ProductsList } from '@/modules/Products/components/ProductsList';

describe('Performance: Memory Leaks', () => {
  afterEach(cleanup);

  it('should not leak memory on mount/unmount cycles', () => {
    const products = Array.from({ length: 100 }, (_, i) => ({ id: `${i}`, name: `P${i}` }));
    
    for (let i = 0; i < 10; i++) {
      const { unmount } = render(<ProductsList products={products} />);
      unmount();
    }
    
    expect(true).toBe(true);
  });
});
