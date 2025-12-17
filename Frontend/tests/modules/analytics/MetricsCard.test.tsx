import { render } from '@testing-library/react';
import { MetricsCard } from '@/modules/Analytics/components/MetricsCard';

describe('Analytics - MetricsCard', () => {
  it('should render metric value', () => {
    const { getByText } = render(<MetricsCard label="Revenue" value={1000} />);
    expect(getByText('Revenue')).toBeInTheDocument();
    expect(getByText('1000')).toBeInTheDocument();
  });

  it('should display positive change', () => {
    const { getByText } = render(<MetricsCard label="Sales" value={500} change={10} />);
    expect(getByText('+10%')).toBeInTheDocument();
  });

  it('should display negative change', () => {
    const { getByText } = render(<MetricsCard label="Costs" value={200} change={-5} />);
    expect(getByText('-5%')).toBeInTheDocument();
  });

  it('should format large numbers', () => {
    const { getByText } = render(<MetricsCard label="Views" value={1500000} />);
    expect(getByText('1.5M')).toBeInTheDocument();
  });
});
