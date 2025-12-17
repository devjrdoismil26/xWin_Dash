import { render } from '@testing-library/react';
import { performance } from 'perf_hooks';
import { ProductsList } from '@/modules/Products/components/ProductsList';
import { DataTable } from '@/shared/components/DataTable';

describe('Performance - Advanced Render Optimization', () => {
  it('should render large list efficiently', () => {
    const products = Array.from({ length: 1000 }, (_, i) => ({
      id: `${i}`,
      name: `Product ${i}`,
      price: 100,
      stock: 10,
    }));
    
    const start = performance.now();
    render(<ProductsList products={products} />);
    const end = performance.now();
    
    expect(end - start).toBeLessThan(1000);
  });

  it('should use virtualization for large datasets', () => {
    const data = Array.from({ length: 10000 }, (_, i) => ({ id: i, name: `Item ${i}` }));
    const { container } = render(<DataTable data={data} virtualized />);
    
    const renderedRows = container.querySelectorAll('tr');
    expect(renderedRows.length).toBeLessThan(100);
  });

  it('should memoize expensive computations', () => {
    let computeCount = 0;
    const ExpensiveComponent = ({ data }: any) => {
      computeCount++;
      return <div>{data.reduce((a: number, b: number) => a + b, 0)}</div>;
    };
    
    const { rerender } = render(<ExpensiveComponent data={[1, 2, 3]} />);
    rerender(<ExpensiveComponent data={[1, 2, 3]} />);
    
    expect(computeCount).toBe(1);
  });
});
