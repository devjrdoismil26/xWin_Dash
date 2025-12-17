import { describe, it, expect } from 'vitest';
import { productSchema, productFormSchema, productFilterSchema } from '../product.schema';

describe('Product Schema', () => {
  describe('productSchema', () => {
    it('should validate valid product', () => {
      const valid = {
        name: 'Test Product',
        price: 99.99,
        sku: 'TEST-001',
        stock: 10,
        status: 'active' as const,};

      expect(() => productSchema.parse(valid)).not.toThrow();

    });

    it('should reject negative price', () => {
      const invalid = { name: 'Test', price: -10, sku: 'TEST', stock: 0, status: 'active' as const};

      expect(() => productSchema.parse(invalid)).toThrow();

    });

    it('should reject negative stock', () => {
      const invalid = { name: 'Test', price: 10, sku: 'TEST', stock: -5, status: 'active' as const};

      expect(() => productSchema.parse(invalid)).toThrow();

    });

    it('should reject empty name', () => {
      const invalid = { name: '', price: 10, sku: 'TEST', stock: 0, status: 'active' as const};

      expect(() => productSchema.parse(invalid)).toThrow();

    });

  });

  describe('productFilterSchema', () => {
    it('should apply defaults', () => {
      const result = productFilterSchema.parse({});

      expect(result.page).toBe(1);

      expect(result.limit).toBe(10);

    });

    it('should validate price range', () => {
      const valid = { min_price: 10, max_price: 100};

      expect(() => productFilterSchema.parse(valid)).not.toThrow();

    });

  });

});
