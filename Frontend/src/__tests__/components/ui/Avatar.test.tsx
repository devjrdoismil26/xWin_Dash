import { render, screen } from '@testing-library/react';
import { Avatar } from '@/shared/components/ui/Avatar';

describe('Avatar', () => {
  it('should render with image', () => {
    render(<Avatar src="/avatar.jpg" alt="User" />);

    const img = screen.getByRole('img');

    expect(img).toHaveAttribute('src', '/avatar.jpg');

  });

  it('should render initials fallback', () => {
    render(<Avatar name="John Doe" />);

    expect(screen.getByText('JD')).toBeInTheDocument();

  });

  it('should render different sizes', () => {
    const { rerender } = render(<Avatar size="sm" name="Test" />);

    expect(screen.getByText('T')).toBeInTheDocument();

    rerender(<Avatar size="lg" name="Test" />);

    expect(screen.getByText('T')).toBeInTheDocument();

  });

});
