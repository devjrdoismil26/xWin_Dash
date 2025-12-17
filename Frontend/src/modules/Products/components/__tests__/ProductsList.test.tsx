import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

const ProductsList = ({ products, onEdit, onDelete }: unknown) => (
  <div>
           
        </div>{products.length === 0 ? <p>No products</p> : null}
    {products.map((p: unknown) => (
      <div key={p.id} data-testid={`product-${p.id}`}>
           
        </div><span>{p.name}</span>
        <button onClick={ () => onEdit(p.id) }>Edit</button>
        <button onClick={ () => onDelete(p.id) }>Delete</button>
      </div>
    </>
  ))}
  </div>);

describe('ProductsList', () => {
  const mockProducts = [
    { id: 1, name: 'Product 1', price: 10 },
    { id: 2, name: 'Product 2', price: 20 },
  ];

  it('should render all products', () => {
    render(<ProductsList products={mockProducts} onEdit={vi.fn()} onDelete={ vi.fn() } />);

    expect(screen.getByText('Product 1')).toBeInTheDocument();

    expect(screen.getByText('Product 2')).toBeInTheDocument();

  });

  it('should show empty state', () => {
    render(<ProductsList products={[]} onEdit={vi.fn()} onDelete={ vi.fn() } />);

    expect(screen.getByText('No products')).toBeInTheDocument();

  });

  it('should call onEdit', () => {
    const onEdit = vi.fn();

    render(<ProductsList products={mockProducts} onEdit={onEdit} onDelete={ vi.fn() } />);

    fireEvent.click(screen.getAllByText('Edit')[0]);

    expect(onEdit).toHaveBeenCalledWith(1);

  });

  it('should call onDelete', () => {
    const onDelete = vi.fn();

    render(<ProductsList products={mockProducts} onEdit={vi.fn()} onDelete={ onDelete } />);

    fireEvent.click(screen.getAllByText('Delete')[0]);

    expect(onDelete).toHaveBeenCalledWith(1);

  });

  it('should render correct number of items', () => {
    render(<ProductsList products={mockProducts} onEdit={vi.fn()} onDelete={ vi.fn() } />);

    expect(screen.getByTestId('product-1')).toBeInTheDocument();

    expect(screen.getByTestId('product-2')).toBeInTheDocument();

  });

});
