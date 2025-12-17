import { validateProduct } from '@/modules/Products/utils/validation';

describe('Edge Cases: Data Validation', () => {
  it('should reject invalid data', () => {
    expect(() => validateProduct({ name: '', price: -1 })).toThrow();
  });

  it('should accept valid data', () => {
    expect(() => validateProduct({ name: 'Test', price: 100, stock: 10 })).not.toThrow();
  });

  it('should handle missing fields', () => {
    expect(() => validateProduct({})).toThrow();
  });
});
