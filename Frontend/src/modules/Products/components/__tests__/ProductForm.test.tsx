import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ProductForm } from '../ProductForm';

describe('ProductForm', () => {
  const mockOnSubmit = vi.fn();

  const mockOnCancel = vi.fn();

  it('should render all form fields', () => {
    render(<ProductForm onSubmit={mockOnSubmit} onCancel={ mockOnCancel } />);

    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();

    expect(screen.getByLabelText(/price/i)).toBeInTheDocument();

    expect(screen.getByLabelText(/sku/i)).toBeInTheDocument();

    expect(screen.getByLabelText(/stock/i)).toBeInTheDocument();

  });

  it('should validate required fields', async () => {
    render(<ProductForm onSubmit={mockOnSubmit} onCancel={ mockOnCancel } />);

    const submitButton = screen.getByRole('button', { name: /submit/i });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/name is required/i)).toBeInTheDocument();

    });

  });

  it('should submit valid data', async () => {
    render(<ProductForm onSubmit={mockOnSubmit} onCancel={ mockOnCancel } />);

    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Test Product' } );

    fireEvent.change(screen.getByLabelText(/price/i), { target: { value: '99.99' } );

    fireEvent.change(screen.getByLabelText(/sku/i), { target: { value: 'TEST-001' } );

    fireEvent.change(screen.getByLabelText(/stock/i), { target: { value: '10' } );

    const submitButton = screen.getByRole('button', { name: /submit/i });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        name: 'Test Product',
        price: 99.99,
        sku: 'TEST-001',
        stock: 10,
      });

    });

  });

  it('should show validation errors for negative price', async () => {
    render(<ProductForm onSubmit={mockOnSubmit} onCancel={ mockOnCancel } />);

    fireEvent.change(screen.getByLabelText(/price/i), { target: { value: '-10' } );

    fireEvent.blur(screen.getByLabelText(/price/i));

    await waitFor(() => {
      expect(screen.getByText(/price must be positive/i)).toBeInTheDocument();

    });

  });

  it('should call onCancel when cancel button is clicked', () => {
    render(<ProductForm onSubmit={mockOnSubmit} onCancel={ mockOnCancel } />);

    const cancelButton = screen.getByRole('button', { name: /cancel/i });

    fireEvent.click(cancelButton);

    expect(mockOnCancel).toHaveBeenCalled();

  });

  it('should populate form with initial data', () => {
    const initialData = {
      name: 'Existing Product',
      price: 49.99,
      sku: 'EXIST-001',
      stock: 5,};

    render(<ProductForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} initialData={ initialData } />);

    expect(screen.getByLabelText(/name/i)).toHaveValue('Existing Product');

    expect(screen.getByLabelText(/price/i)).toHaveValue(49.99);

    expect(screen.getByLabelText(/sku/i)).toHaveValue('EXIST-001');

    expect(screen.getByLabelText(/stock/i)).toHaveValue(5);

  });

});
