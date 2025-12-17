import { truncate, slugify, capitalize, removeAccents } from '@/lib/utils/stringUtils';

describe('stringUtils', () => {
  describe('truncate', () => {
    it('should truncate long text', () => {
      expect(truncate('Hello World', 5)).toBe('Hello...');

    });

    it('should not truncate short text', () => {
      expect(truncate('Hi', 10)).toBe('Hi');

    });

  });

  describe('slugify', () => {
    it('should create slug from text', () => {
      expect(slugify('Hello World')).toBe('hello-world');

    });

    it('should handle special characters', () => {
      expect(slugify('Olá Mundo!')).toBe('ola-mundo');

    });

  });

  describe('capitalize', () => {
    it('should capitalize first letter', () => {
      expect(capitalize('hello')).toBe('Hello');

    });

    it('should handle empty string', () => {
      expect(capitalize('')).toBe('');

    });

  });

  describe('removeAccents', () => {
    it('should remove accents', () => {
      expect(removeAccents('José')).toBe('Jose');

      expect(removeAccents('São Paulo')).toBe('Sao Paulo');

    });

  });

});
