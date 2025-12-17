import { render } from '@testing-library/react';
import { UsersList } from '@/modules/Users/components/UsersList';
import { UserForm } from '@/modules/Users/components/UserForm';
import { UserCard } from '@/modules/Users/components/UserCard';

describe('Users Module Snapshots', () => {
  it('should match UsersList snapshot', () => {
    const { container } = render(<UsersList users={[]} />);
    expect(container).toMatchSnapshot();
  });

  it('should match UserForm snapshot', () => {
    const { container } = render(<UserForm onSubmit={jest.fn()} />);
    expect(container).toMatchSnapshot();
  });

  it('should match UserCard snapshot', () => {
    const user = { id: '1', name: 'John', email: 'john@test.com', role: 'admin' };
    const { container } = render(<UserCard user={user} />);
    expect(container).toMatchSnapshot();
  });
});
