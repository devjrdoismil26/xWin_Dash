import { render } from '@testing-library/react';
import { performance } from 'perf_hooks';
import { WidgetGrid } from '@/modules/Dashboard/components/WidgetGrid';

describe('Performance: Dashboard Widgets', () => {
  it('should render 20 widgets in under 1s', () => {
    const widgets = Array.from({ length: 20 }, (_, i) => ({ id: `w-${i}`, type: 'chart' }));
    const start = performance.now();
    render(<WidgetGrid widgets={widgets} />);
    const end = performance.now();
    expect(end - start).toBeLessThan(1000);
  });
});
