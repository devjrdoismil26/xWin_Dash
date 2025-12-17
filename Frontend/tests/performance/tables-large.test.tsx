import { render } from '@testing-library/react';
import { performance } from 'perf_hooks';
import { DataTable } from '@/shared/components/DataTable';

describe('Performance: Large Tables', () => {
  it('should render 1000 rows in under 500ms', () => {
    const data = Array.from({ length: 1000 }, (_, i) => ({ id: i, name: `Item ${i}` }));
    const start = performance.now();
    render(<DataTable data={data} />);
    const end = performance.now();
    expect(end - start).toBeLessThan(500);
  });

  it('should handle sorting without lag', () => {
    const data = Array.from({ length: 500 }, (_, i) => ({ id: i, name: `Item ${i}` }));
    const start = performance.now();
    const { rerender } = render(<DataTable data={data} sortBy="name" />);
    rerender(<DataTable data={data} sortBy="id" />);
    const end = performance.now();
    expect(end - start).toBeLessThan(200);
  });
});
