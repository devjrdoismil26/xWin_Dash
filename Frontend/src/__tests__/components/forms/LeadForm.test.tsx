import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LeadForm } from '@/shared/components/forms/LeadForm';

describe('LeadForm Component', () => {
  const mockOnSubmit = vi.fn();

  const mockOnCancel = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

  });

  it('should render all form fields', () => {
    render(<LeadForm onSubmit={mockOnSubmit} onCancel={ mockOnCancel } />);

    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();

    expect(screen.getByLabelText(/phone/i)).toBeInTheDocument();

    expect(screen.getByLabelText(/company/i)).toBeInTheDocument();

  });

  it('should validate required fields', async () => {
    render(<LeadForm onSubmit={mockOnSubmit} onCancel={ mockOnCancel } />);

    const submitButton = screen.getByRole('button', { name: /submit/i });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/name is required/i)).toBeInTheDocument();

      expect(screen.getByText(/email is required/i)).toBeInTheDocument();

    });

    expect(mockOnSubmit).not.toHaveBeenCalled();

  });

  it('should validate email format', async () => {
    const user = userEvent.setup();

    render(<LeadForm onSubmit={mockOnSubmit} onCancel={ mockOnCancel } />);

    const emailInput = screen.getByLabelText(/email/i);

    await user.type(emailInput, 'invalid-email');

    const submitButton = screen.getByRole('button', { name: /submit/i });

    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/invalid email format/i)).toBeInTheDocument();

    });

  });

  it('should submit form with valid data', async () => {
    const user = userEvent.setup();

    render(<LeadForm onSubmit={mockOnSubmit} onCancel={ mockOnCancel } />);

    await user.type(screen.getByLabelText(/name/i), 'John Doe');

    await user.type(screen.getByLabelText(/email/i), 'john@example.com');

    await user.type(screen.getByLabelText(/phone/i), '+5511999999999');

    await user.type(screen.getByLabelText(/company/i), 'ACME Corp');

    const submitButton = screen.getByRole('button', { name: /submit/i });

    await user.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+5511999999999',
        company: 'ACME Corp',
      });

    });

  });

  it('should call onCancel when cancel button is clicked', async () => {
    const user = userEvent.setup();

    render(<LeadForm onSubmit={mockOnSubmit} onCancel={ mockOnCancel } />);

    const cancelButton = screen.getByRole('button', { name: /cancel/i });

    await user.click(cancelButton);

    expect(mockOnCancel).toHaveBeenCalledTimes(1);

  });

  it('should populate form with initial data', () => {
    const initialData = {
      name: 'Jane Doe',
      email: 'jane@example.com',
      phone: '+5511888888888',
      company: 'Tech Inc',};

    render(
      <LeadForm
        initialData={ initialData }
        onSubmit={ mockOnSubmit }
        onCancel={ mockOnCancel }
      / />);

    expect(screen.getByLabelText(/name/i)).toHaveValue('Jane Doe');

    expect(screen.getByLabelText(/email/i)).toHaveValue('jane@example.com');

    expect(screen.getByLabelText(/phone/i)).toHaveValue('+5511888888888');

    expect(screen.getByLabelText(/company/i)).toHaveValue('Tech Inc');

  });

  it('should disable submit button while submitting', async () => {
    mockOnSubmit.mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100)));

    const user = userEvent.setup();

    render(<LeadForm onSubmit={mockOnSubmit} onCancel={ mockOnCancel } />);

    await user.type(screen.getByLabelText(/name/i), 'Test');

    await user.type(screen.getByLabelText(/email/i), 'test@example.com');

    const submitButton = screen.getByRole('button', { name: /submit/i });

    await user.click(submitButton);

    expect(submitButton).toBeDisabled();

    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();

    });

  });

});
