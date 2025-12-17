import { render } from '@testing-library/react';
import { ProductCard } from '@/modules/Products/components/ProductCard';
import { UserProfile } from '@/modules/Users/components/UserProfile';

describe('Security - Advanced XSS Prevention', () => {
  const xssPayloads = [
    '<script>alert("xss")</script>',
    '<img src=x onerror=alert(1)>',
    'javascript:alert(1)',
    '<iframe src="javascript:alert(1)">',
    '<svg onload=alert(1)>',
  ];

  xssPayloads.forEach(payload => {
    it(`should sanitize XSS payload: ${payload}`, () => {
      const product = { id: '1', name: payload, price: 100, stock: 10 };
      const { container } = render(<ProductCard product={product} />);
      
      expect(container.innerHTML).not.toContain('<script>');
      expect(container.innerHTML).not.toContain('onerror');
      expect(container.innerHTML).not.toContain('javascript:');
      expect(container.innerHTML).not.toContain('onload');
    });
  });

  it('should sanitize user input in profile', () => {
    const user = {
      id: '1',
      name: '<script>alert("xss")</script>',
      email: 'test@test.com',
      bio: '<img src=x onerror=alert(1)>',
    };
    
    const { container } = render(<UserProfile user={user} />);
    expect(container.innerHTML).not.toContain('<script>');
    expect(container.innerHTML).not.toContain('onerror');
  });
});
