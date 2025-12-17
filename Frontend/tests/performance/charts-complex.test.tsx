import { render } from '@testing-library/react';
import { performance } from 'perf_hooks';
import { LineChart } from '@/shared/components/charts/LineChart';

describe('Performance: Complex Charts', () => {
  it('should render chart with 1000 data points in under 1s', () => {
    const data = Array.from({ length: 1000 }, (_, i) => ({ x: i, y: Math.random() * 100 }));
    const start = performance.now();
    render(<LineChart data={data} />);
    const end = performance.now();
    expect(end - start).toBeLessThan(1000);
  });
});
