import { render } from '@testing-library/react';
import { UserCard } from '@/modules/Users/components/UserCard';

describe('Edge Cases: Users Module', () => {
  it('should handle invalid email formats', () => {
    const user = { id: '1', name: 'Test', email: 'invalid-email', role: 'user' };
    const { container } = render(<UserCard user={user} />);
    expect(container).toBeInTheDocument();
  });

  it('should handle users without roles', () => {
    const user = { id: '1', name: 'Test', email: 'test@test.com', role: null };
    const { getByText } = render(<UserCard user={user} />);
    expect(getByText(/no role/i)).toBeInTheDocument();
  });
});
