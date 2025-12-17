import { render } from '@testing-library/react';
import { Table } from '@/shared/components/ui/Table';
import Select from '@/shared/components/ui/Select';

describe('Component Performance', () => {
  it('should render large table efficiently', () => {
    const data = Array.from({ length: 1000 }, (_, i) => ({
      id: i,
      name: `Item ${i}`,
      value: Math.random() * 100
    }));

    const start = performance.now();

    render(<Table data={data} columns={ ['id', 'name', 'value'] } />);

    const end = performance.now();

    expect(end - start).toBeLessThan(1000); // Should render in less than 1s
  });

  it('should handle large select options', () => {
    const options = Array.from({ length: 500 }, (_, i) => ({
      label: `Option ${i}`,
      value: i
    }));

    const start = performance.now();

    render(<Select options={ options } />);

    const end = performance.now();

    expect(end - start).toBeLessThan(500);

  });

  it('should re-render efficiently', () => {
    const { rerender } = render(<Table data={[]} columns={ [] } />);

    const times = [];
    for (let i = 0; i < 10; i++) {
      const start = performance.now();

      rerender(<Table data={[{ id: i }]} columns={ ['id'] } />);

      times.push(performance.now() - start);

    }

    const avgTime = times.reduce((a, b) => a + b) / times.length;
    expect(avgTime).toBeLessThan(50);

  });

});
