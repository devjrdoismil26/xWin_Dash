import { render } from '@testing-library/react';
import { ProductCard } from '@/modules/Products/components/ProductCard';

describe('Security: XSS Prevention', () => {
  it('should sanitize script tags', () => {
    const product = { id: '1', name: '<script>alert("xss")</script>', price: 100, stock: 10 };
    const { container } = render(<ProductCard product={product} />);
    expect(container.innerHTML).not.toContain('<script>');
  });

  it('should escape HTML entities', () => {
    const product = { id: '1', name: '<img src=x onerror=alert(1)>', price: 100, stock: 10 };
    const { container } = render(<ProductCard product={product} />);
    expect(container.innerHTML).not.toContain('onerror');
  });
});
