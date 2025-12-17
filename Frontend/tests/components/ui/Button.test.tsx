import { render, fireEvent } from '@testing-library/react';
import { Button } from '@/shared/components/ui/button';

describe('UI - Button', () => {
  it('should render button', () => {
    const { getByRole } = render(<Button>Click me</Button>);
    expect(getByRole('button')).toBeInTheDocument();
  });

  it('should handle click', () => {
    const onClick = jest.fn();
    const { getByRole } = render(<Button onClick={onClick}>Click</Button>);
    fireEvent.click(getByRole('button'));
    expect(onClick).toHaveBeenCalled();
  });

  it('should be disabled', () => {
    const { getByRole } = render(<Button disabled>Disabled</Button>);
    expect(getByRole('button')).toBeDisabled();
  });

  it('should apply variant styles', () => {
    const { getByRole } = render(<Button variant="destructive">Delete</Button>);
    expect(getByRole('button')).toHaveClass('destructive');
  });

  it('should apply size styles', () => {
    const { getByRole } = render(<Button size="lg">Large</Button>);
    expect(getByRole('button')).toHaveClass('lg');
  });
});
