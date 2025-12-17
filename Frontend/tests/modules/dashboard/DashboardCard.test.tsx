import { render } from '@testing-library/react';
import { DashboardCard } from '@/modules/Dashboard/components/DashboardCard';

describe('Dashboard - DashboardCard', () => {
  it('should render title and value', () => {
    const { getByText } = render(<DashboardCard title="Revenue" value={1000} />);
    expect(getByText('Revenue')).toBeInTheDocument();
    expect(getByText('$1,000')).toBeInTheDocument();
  });

  it('should display icon', () => {
    const { container } = render(<DashboardCard title="Sales" value={500} icon="chart" />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('should show trend indicator', () => {
    const { getByText } = render(<DashboardCard title="Users" value={100} trend="up" />);
    expect(getByText(/↑/)).toBeInTheDocument();
  });
});
