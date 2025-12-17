import { render, fireEvent, waitFor } from '@testing-library/react';
import { UserProfile } from '@/modules/Users/components/UserProfile';

describe('Users - UserProfile', () => {
  const mockUser = {
    id: '1',
    name: 'John Doe',
    email: 'john@test.com',
    role: 'admin',
    avatar: 'https://example.com/avatar.jpg',
  };

  it('should render user information', () => {
    const { getByText } = render(<UserProfile user={mockUser} />);
    expect(getByText('John Doe')).toBeInTheDocument();
    expect(getByText('john@test.com')).toBeInTheDocument();
    expect(getByText('admin')).toBeInTheDocument();
  });

  it('should display avatar', () => {
    const { getByAltText } = render(<UserProfile user={mockUser} />);
    expect(getByAltText('John Doe')).toHaveAttribute('src', mockUser.avatar);
  });

  it('should allow editing profile', async () => {
    const onUpdate = jest.fn();
    const { getByRole } = render(<UserProfile user={mockUser} onUpdate={onUpdate} />);
    
    fireEvent.click(getByRole('button', { name: /edit/i }));
    await waitFor(() => {
      expect(getByRole('button', { name: /save/i })).toBeInTheDocument();
    });
  });
});
