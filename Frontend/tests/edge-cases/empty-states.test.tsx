import { render } from '@testing-library/react';
import { ProductsList } from '@/modules/Products/components/ProductsList';

describe('Edge Cases: Empty States', () => {
  it('should render empty state', () => {
    const { getByText } = render(<ProductsList products={[]} />);
    expect(getByText(/no products/i)).toBeInTheDocument();
  });

  it('should handle null data', () => {
    const { container } = render(<ProductsList products={null} />);
    expect(container).toBeInTheDocument();
  });
});
