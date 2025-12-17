import { describe, it, expect } from 'vitest';
import { paginationSchema, dateRangeSchema, sortSchema } from '../core.schema';

describe('Core Schema', () => {
  describe('paginationSchema', () => {
    it('should apply defaults', () => {
      const result = paginationSchema.parse({});

      expect(result.page).toBe(1);

      expect(result.limit).toBe(10);

    });

    it('should reject invalid page', () => {
      expect(() => paginationSchema.parse({ page: 0 })).toThrow();

    });

    it('should reject limit > 100', () => {
      expect(() => paginationSchema.parse({ limit: 101 })).toThrow();

    });

  });

  describe('dateRangeSchema', () => {
    it('should validate valid range', () => {
      const valid = {
        start_date: '2024-01-01T00:00:00Z',
        end_date: '2024-12-31T23:59:59Z',};

      expect(() => dateRangeSchema.parse(valid)).not.toThrow();

    });

    it('should reject invalid range', () => {
      const invalid = {
        start_date: '2024-12-31T00:00:00Z',
        end_date: '2024-01-01T00:00:00Z',};

      expect(() => dateRangeSchema.parse(invalid)).toThrow();

    });

  });

  describe('sortSchema', () => {
    it('should apply default order', () => {
      const result = sortSchema.parse({ field: 'name' });

      expect(result.order).toBe('asc');

    });

  });

});
