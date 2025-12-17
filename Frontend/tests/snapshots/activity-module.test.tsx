import { render } from '@testing-library/react';
import { ActivityFeed } from '@/modules/Activity/components/ActivityFeed';
import { ActivityItem } from '@/modules/Activity/components/ActivityItem';
import { ActivityFilters } from '@/modules/Activity/components/ActivityFilters';

describe('Activity Module Snapshots', () => {
  it('should match ActivityFeed snapshot', () => {
    const { container } = render(<ActivityFeed activities={[]} />);
    expect(container).toMatchSnapshot();
  });

  it('should match ActivityItem snapshot', () => {
    const activity = { id: '1', type: 'create', user: 'John', timestamp: '2025-01-01' };
    const { container } = render(<ActivityItem activity={activity} />);
    expect(container).toMatchSnapshot();
  });

  it('should match ActivityFilters snapshot', () => {
    const { container } = render(<ActivityFilters onFilter={jest.fn()} />);
    expect(container).toMatchSnapshot();
  });
});
