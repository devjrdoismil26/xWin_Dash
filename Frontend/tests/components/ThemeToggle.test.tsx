import { render, fireEvent } from '@testing-library/react';
import { ThemeToggle } from '@/shared/components/ThemeToggle';

describe('ThemeToggle', () => {
  it('should render toggle button', () => {
    const { getByRole } = render(<ThemeToggle />);
    expect(getByRole('button')).toBeInTheDocument();
  });

  it('should toggle theme on click', () => {
    const { getByRole } = render(<ThemeToggle />);
    const button = getByRole('button');
    fireEvent.click(button);
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('should show correct icon', () => {
    const { container } = render(<ThemeToggle />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });
});
