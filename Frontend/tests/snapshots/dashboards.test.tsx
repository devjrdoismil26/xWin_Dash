import { render } from '@testing-library/react';
import { MainDashboard } from '@/modules/Dashboard/components/MainDashboard';
import { WidgetGrid } from '@/modules/Dashboard/components/WidgetGrid';
import { DashboardCard } from '@/modules/Dashboard/components/DashboardCard';

describe('Dashboards Snapshots', () => {
  it('should match MainDashboard snapshot', () => {
    const { container } = render(<MainDashboard />);
    expect(container).toMatchSnapshot();
  });

  it('should match WidgetGrid snapshot', () => {
    const widgets = [{ id: '1', type: 'chart', data: {} }];
    const { container } = render(<WidgetGrid widgets={widgets} />);
    expect(container).toMatchSnapshot();
  });

  it('should match DashboardCard snapshot', () => {
    const { container } = render(<DashboardCard title="Revenue" value={1000} />);
    expect(container).toMatchSnapshot();
  });
});
