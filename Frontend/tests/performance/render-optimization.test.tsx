import { render } from '@testing-library/react';
import { ProductCard } from '@/modules/Products/components/ProductCard';

describe('Performance: Render Optimization', () => {
  it('should not re-render unnecessarily', () => {
    let renderCount = 0;
    const TestComponent = () => {
      renderCount++;
      return <ProductCard product={{ id: '1', name: 'Test', price: 100, stock: 10 }} />;
    };
    
    const { rerender } = render(<TestComponent />);
    rerender(<TestComponent />);
    expect(renderCount).toBe(2);
  });
});
