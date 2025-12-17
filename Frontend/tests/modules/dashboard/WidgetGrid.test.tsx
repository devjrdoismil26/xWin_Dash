import { render } from '@testing-library/react';
import { WidgetGrid } from '@/modules/Dashboard/components/WidgetGrid';

describe('Dashboard - WidgetGrid', () => {
  const mockWidgets = [
    { id: '1', type: 'chart', title: 'Revenue', data: {} },
    { id: '2', type: 'metric', title: 'Users', data: {} },
  ];

  it('should render widgets', () => {
    const { getByText } = render(<WidgetGrid widgets={mockWidgets} />);
    expect(getByText('Revenue')).toBeInTheDocument();
    expect(getByText('Users')).toBeInTheDocument();
  });

  it('should handle empty widgets', () => {
    const { getByText } = render(<WidgetGrid widgets={[]} />);
    expect(getByText(/no widgets/i)).toBeInTheDocument();
  });

  it('should support drag and drop', () => {
    const { container } = render(<WidgetGrid widgets={mockWidgets} draggable />);
    expect(container.querySelector('[draggable="true"]')).toBeInTheDocument();
  });
});
