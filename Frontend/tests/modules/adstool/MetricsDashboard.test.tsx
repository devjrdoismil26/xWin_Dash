import { render } from '@testing-library/react';
import { MetricsDashboard } from '@/modules/ADStool/components/MetricsDashboard';

describe('ADStool - MetricsDashboard', () => {
  const mockMetrics = {
    impressions: 10000,
    clicks: 500,
    conversions: 50,
    cost: 1000,
    ctr: 5.0,
    cpc: 2.0,
  };

  it('should render all metrics', () => {
    const { getByText } = render(<MetricsDashboard metrics={mockMetrics} />);
    expect(getByText('10000')).toBeInTheDocument();
    expect(getByText('500')).toBeInTheDocument();
    expect(getByText('50')).toBeInTheDocument();
  });

  it('should calculate CTR', () => {
    const { getByText } = render(<MetricsDashboard metrics={mockMetrics} />);
    expect(getByText(/5\.0%/)).toBeInTheDocument();
  });

  it('should display cost per click', () => {
    const { getByText } = render(<MetricsDashboard metrics={mockMetrics} />);
    expect(getByText(/\$2\.0/)).toBeInTheDocument();
  });
});
