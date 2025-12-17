import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ProductForm } from '@/modules/Products/components/ProductForm';

describe('ProductForm', () => {
  const mockOnSubmit = vi.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();

  });

  it('should render form fields', () => { render(<ProductForm onSubmit={mockOnSubmit } />);

    expect(screen.getByLabelText(/nome/i)).toBeInTheDocument();

    expect(screen.getByLabelText(/sku/i)).toBeInTheDocument();

    expect(screen.getByLabelText(/preço/i)).toBeInTheDocument();

  });

  it('should validate required fields', async () => { render(<ProductForm onSubmit={mockOnSubmit } />);

    fireEvent.click(screen.getByRole('button', { name: /salvar/i }));

    await waitFor(() => {
      expect(screen.getByText(/nome é obrigatório/i)).toBeInTheDocument();

    });

  });

  it('should submit valid data', async () => { render(<ProductForm onSubmit={mockOnSubmit } />);

    fireEvent.change(screen.getByLabelText(/nome/i), { target: { value: 'Product 1' } );

    fireEvent.change(screen.getByLabelText(/sku/i), { target: { value: 'SKU001' } );

    fireEvent.change(screen.getByLabelText(/preço/i), { target: { value: '99.90' } );

    fireEvent.click(screen.getByRole('button', { name: /salvar/i }));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        name: 'Product 1',
        sku: 'SKU001',
        price: 99.90
      });

    });

  });

});
