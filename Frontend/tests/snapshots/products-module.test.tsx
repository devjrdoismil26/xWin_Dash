import { render } from '@testing-library/react';
import { ProductsList } from '@/modules/Products/components/ProductsList';
import { ProductForm } from '@/modules/Products/components/ProductForm';
import { ProductCard } from '@/modules/Products/components/ProductCard';

describe('Products Module Snapshots', () => {
  it('should match ProductsList snapshot', () => {
    const { container } = render(<ProductsList products={[]} />);
    expect(container).toMatchSnapshot();
  });

  it('should match ProductForm snapshot', () => {
    const { container } = render(<ProductForm onSubmit={jest.fn()} />);
    expect(container).toMatchSnapshot();
  });

  it('should match ProductCard snapshot', () => {
    const product = { id: '1', name: 'Test', price: 100, stock: 10 };
    const { container } = render(<ProductCard product={product} />);
    expect(container).toMatchSnapshot();
  });
});
