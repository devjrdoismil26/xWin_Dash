import { render } from '@testing-library/react';
import { AnalyticsDashboard } from '@/modules/Analytics/components/AnalyticsDashboard';
import { MetricsCard } from '@/modules/Analytics/components/MetricsCard';
import { ChartContainer } from '@/modules/Analytics/components/ChartContainer';

describe('Analytics Module Snapshots', () => {
  it('should match AnalyticsDashboard snapshot', () => {
    const { container } = render(<AnalyticsDashboard />);
    expect(container).toMatchSnapshot();
  });

  it('should match MetricsCard snapshot', () => {
    const metric = { label: 'Revenue', value: 1000, change: 10 };
    const { container } = render(<MetricsCard metric={metric} />);
    expect(container).toMatchSnapshot();
  });

  it('should match ChartContainer snapshot', () => {
    const data = [{ date: '2025-01-01', value: 100 }];
    const { container } = render(<ChartContainer data={data} />);
    expect(container).toMatchSnapshot();
  });
});
