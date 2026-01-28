import { describe, it, expect } from 'vitest';

// Mock utility functions
const formatCurrency = (amount: number, currency = 'BRL'): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: currency
  }).format(amount);
};

const formatDate = (date: Date | string): string => {
  const d = new Date(date);
  return d.toLocaleDateString('pt-BR');
};

const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

describe('Utility Functions', () => {
  describe('formatCurrency', () => {
    it('should format currency in BRL', () => {
      const result = formatCurrency(1000);
      expect(result).toContain('R$');
      expect(result).toContain('1.000,00');
    });

    it('should format currency in USD', () => {
      expect(formatCurrency(1000, 'USD')).toContain('1.000,00');
    });
  });

  describe('formatDate', () => {
    it('should format date string', () => {
      const date = '2023-12-25';
      const formatted = formatDate(date);
      expect(formatted).toMatch(/\d{2}\/\d{2}\/\d{4}/);
    });

    it('should format Date object', () => {
      const date = new Date('2023-12-25');
      const formatted = formatDate(date);
      expect(formatted).toMatch(/\d{2}\/\d{2}\/\d{4}/);
    });
  });

  describe('slugify', () => {
    it('should create slug from text', () => {
      expect(slugify('Hello World')).toBe('hello-world');
    });

    it('should handle special characters', () => {
      expect(slugify('Olá Mundo!')).toBe('ola-mundo');
    });

    it('should handle multiple spaces', () => {
      expect(slugify('Hello    World')).toBe('hello-world');
    });
  });
});
