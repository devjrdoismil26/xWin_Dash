import { formatCurrency, parseCurrency, formatPercentage } from '@/lib/utils/currencyUtils';

describe('currencyUtils', () => {
  describe('formatCurrency', () => {
    it('should format BRL currency', () => {
      expect(formatCurrency(1000, 'BRL')).toBe('R$ 1.000,00');

    });

    it('should format USD currency', () => {
      expect(formatCurrency(1000, 'USD')).toBe('$ 1,000.00');

    });

    it('should handle zero', () => {
      expect(formatCurrency(0)).toBe('R$ 0,00');

    });

  });

  describe('parseCurrency', () => {
    it('should parse BRL string', () => {
      expect(parseCurrency('R$ 1.000,00')).toBe(1000);

    });

    it('should parse USD string', () => {
      expect(parseCurrency('$ 1,000.00')).toBe(1000);

    });

    it('should handle invalid input', () => {
      expect(parseCurrency('invalid')).toBe(0);

    });

  });

  describe('formatPercentage', () => {
    it('should format percentage', () => {
      expect(formatPercentage(0.5)).toBe('50%');

      expect(formatPercentage(0.755)).toBe('75.5%');

    });

  });

});
