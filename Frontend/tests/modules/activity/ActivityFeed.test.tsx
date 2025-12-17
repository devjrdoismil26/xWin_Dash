import { render } from '@testing-library/react';
import { ActivityFeed } from '@/modules/Activity/components/ActivityFeed';

describe('Activity - ActivityFeed', () => {
  const mockActivities = [
    { id: '1', type: 'create', user: 'John', resource: 'Product', timestamp: new Date() },
    { id: '2', type: 'update', user: 'Jane', resource: 'User', timestamp: new Date() },
  ];

  it('should render activity list', () => {
    const { getByText } = render(<ActivityFeed activities={mockActivities} />);
    expect(getByText(/john/i)).toBeInTheDocument();
    expect(getByText(/jane/i)).toBeInTheDocument();
  });

  it('should display activity types', () => {
    const { getByText } = render(<ActivityFeed activities={mockActivities} />);
    expect(getByText(/create/i)).toBeInTheDocument();
    expect(getByText(/update/i)).toBeInTheDocument();
  });

  it('should render empty state', () => {
    const { getByText } = render(<ActivityFeed activities={[]} />);
    expect(getByText(/no activities/i)).toBeInTheDocument();
  });
});
