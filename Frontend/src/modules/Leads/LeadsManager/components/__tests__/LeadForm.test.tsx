import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LeadForm } from '../LeadForm';

describe('LeadForm', () => {
  const mockOnSubmit = vi.fn();

  const mockOnCancel = vi.fn();

  it('should render all fields', () => {
    render(<LeadForm onSubmit={mockOnSubmit} onCancel={ mockOnCancel } />);

    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();

  });

  it('should validate required fields', async () => {
    render(<LeadForm onSubmit={mockOnSubmit} onCancel={ mockOnCancel } />);

    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(screen.getByText(/name is required/i)).toBeInTheDocument();

    });

  });

  it('should submit valid data', async () => {
    render(<LeadForm onSubmit={mockOnSubmit} onCancel={ mockOnCancel } />);

    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'John Doe' } );

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john@test.com' } );

    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalled();

    });

  });

  it('should validate email format', async () => {
    render(<LeadForm onSubmit={mockOnSubmit} onCancel={ mockOnCancel } />);

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'invalid' } );

    fireEvent.blur(screen.getByLabelText(/email/i));

    await waitFor(() => {
      expect(screen.getByText(/invalid email/i)).toBeInTheDocument();

    });

  });

  it('should call onCancel', () => {
    render(<LeadForm onSubmit={mockOnSubmit} onCancel={ mockOnCancel } />);

    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));

    expect(mockOnCancel).toHaveBeenCalled();

  });

  it('should populate with initial data', () => {
    const data = { name: 'Jane', email: 'jane@test.com'};

    render(<LeadForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} initialData={ data } />);

    expect(screen.getByLabelText(/name/i)).toHaveValue('Jane');

  });

});
