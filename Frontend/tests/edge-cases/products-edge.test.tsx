import { render } from '@testing-library/react';
import { ProductCard } from '@/modules/Products/components/ProductCard';

describe('Edge Cases: Products Module', () => {
  it('should handle very long names', () => {
    const product = { id: '1', name: 'A'.repeat(1000), price: 100, stock: 10 };
    const { container } = render(<ProductCard product={product} />);
    expect(container).toBeInTheDocument();
  });

  it('should handle zero stock', () => {
    const product = { id: '1', name: 'Test', price: 100, stock: 0 };
    const { getByText } = render(<ProductCard product={product} />);
    expect(getByText(/out of stock/i)).toBeInTheDocument();
  });
});
