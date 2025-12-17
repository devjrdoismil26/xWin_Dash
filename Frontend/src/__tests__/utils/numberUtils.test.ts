import { formatNumber, parseNumber, clamp, randomInt } from '@/lib/utils/numberUtils';

describe('numberUtils', () => {
  describe('formatNumber', () => {
    it('should format number with locale', () => {
      expect(formatNumber(1000)).toBe('1.000');

      expect(formatNumber(1000000)).toBe('1.000.000');

    });

    it('should format with decimals', () => {
      expect(formatNumber(1000.5, 2)).toBe('1.000,50');

    });

  });

  describe('parseNumber', () => {
    it('should parse formatted number', () => {
      expect(parseNumber('1.000')).toBe(1000);

      expect(parseNumber('1.000,50')).toBe(1000.5);

    });

    it('should handle invalid input', () => {
      expect(parseNumber('invalid')).toBe(0);

    });

  });

  describe('clamp', () => {
    it('should clamp value between min and max', () => {
      expect(clamp(5, 0, 10)).toBe(5);

      expect(clamp(-5, 0, 10)).toBe(0);

      expect(clamp(15, 0, 10)).toBe(10);

    });

  });

  describe('randomInt', () => {
    it('should generate random integer', () => {
      const result = randomInt(1, 10);

      expect(result).toBeGreaterThanOrEqual(1);

      expect(result).toBeLessThanOrEqual(10);

      expect(Number.isInteger(result)).toBe(true);

    });

  });

});
