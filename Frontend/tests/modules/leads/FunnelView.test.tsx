import { render } from '@testing-library/react';
import { FunnelView } from '@/modules/Leads/components/FunnelView';

describe('Leads - FunnelView', () => {
  const mockStages = [
    { id: '1', name: 'New', count: 10, leads: [] },
    { id: '2', name: 'Contacted', count: 5, leads: [] },
    { id: '3', name: 'Qualified', count: 3, leads: [] },
  ];

  it('should render funnel stages', () => {
    const { getByText } = render(<FunnelView stages={mockStages} />);
    expect(getByText('New')).toBeInTheDocument();
    expect(getByText('Contacted')).toBeInTheDocument();
    expect(getByText('Qualified')).toBeInTheDocument();
  });

  it('should display lead counts', () => {
    const { getByText } = render(<FunnelView stages={mockStages} />);
    expect(getByText('10')).toBeInTheDocument();
    expect(getByText('5')).toBeInTheDocument();
    expect(getByText('3')).toBeInTheDocument();
  });

  it('should calculate conversion rates', () => {
    const { container } = render(<FunnelView stages={mockStages} />);
    expect(container.textContent).toContain('50%'); // 5/10
    expect(container.textContent).toContain('60%'); // 3/5
  });
});
