import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

// Mock Button component for testing
const Button: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  variant?: string;
  disabled?: boolean;
}> = ({ 
  children, 
  onClick, 
  variant = 'default',
  disabled = false
}) => (
  <button 
    onClick={onClick}
    disabled={disabled}
    className={`btn btn-${variant}`}
    data-testid="button"
  >
    {children}
  </button>
);

describe('Button Component', () => {
  it('renders button with text', () => {
    render(<Button>Click Me</Button>);
    
    expect(screen.getByTestId('button')).toBeInTheDocument();
    expect(screen.getByText('Click Me')).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click Me</Button>);
    
    fireEvent.click(screen.getByTestId('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies variant classes', () => {
    render(<Button variant="primary">Primary Button</Button>);
    
    expect(screen.getByTestId('button')).toHaveClass('btn-primary');
  });

  it('handles disabled state', () => {
    render(<Button disabled>Disabled Button</Button>);
    
    const button = screen.getByTestId('button');
    expect(button).toBeDisabled();
  });
});
