import { render } from '@testing-library/react';
import { ChartContainer } from '@/modules/Analytics/components/ChartContainer';

describe('Analytics - ChartContainer', () => {
  const mockData = [
    { date: '2025-01-01', value: 100 },
    { date: '2025-01-02', value: 150 },
    { date: '2025-01-03', value: 200 },
  ];

  it('should render chart', () => {
    const { container } = render(<ChartContainer data={mockData} type="line" />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('should handle empty data', () => {
    const { getByText } = render(<ChartContainer data={[]} type="line" />);
    expect(getByText(/no data/i)).toBeInTheDocument();
  });

  it('should render different chart types', () => {
    const { rerender, container } = render(<ChartContainer data={mockData} type="line" />);
    expect(container.querySelector('.line-chart')).toBeInTheDocument();
    
    rerender(<ChartContainer data={mockData} type="bar" />);
    expect(container.querySelector('.bar-chart')).toBeInTheDocument();
  });
});
