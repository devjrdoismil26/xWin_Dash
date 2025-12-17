import { render } from '@testing-library/react';
import { PostsList } from '@/modules/SocialBuffer/components/PostsList';
import { PostForm } from '@/modules/SocialBuffer/components/PostForm';
import { ScheduleCalendar } from '@/modules/SocialBuffer/components/ScheduleCalendar';

describe('SocialBuffer Module Snapshots', () => {
  it('should match PostsList snapshot', () => {
    const { container } = render(<PostsList posts={[]} />);
    expect(container).toMatchSnapshot();
  });

  it('should match PostForm snapshot', () => {
    const { container } = render(<PostForm onSubmit={jest.fn()} />);
    expect(container).toMatchSnapshot();
  });

  it('should match ScheduleCalendar snapshot', () => {
    const { container } = render(<ScheduleCalendar posts={[]} />);
    expect(container).toMatchSnapshot();
  });
});
