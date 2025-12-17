import { formatDate, parseDate, isValidDate, getRelativeTime } from '@/lib/utils/dateUtils';

describe('dateUtils', () => {
  describe('formatDate', () => {
    it('should format date correctly', () => {
      const date = new Date('2025-01-15T10:30:00');

      expect(formatDate(date, 'DD/MM/YYYY')).toBe('15/01/2025');

    });

    it('should handle invalid date', () => {
      expect(formatDate(null)).toBe('');

    });

  });

  describe('parseDate', () => {
    it('should parse date string', () => {
      const result = parseDate('2025-01-15');

      expect(result).toBeInstanceOf(Date);

      expect(result?.getFullYear()).toBe(2025);

    });

    it('should return null for invalid string', () => {
      expect(parseDate('invalid')).toBeNull();

    });

  });

  describe('isValidDate', () => {
    it('should validate correct date', () => {
      expect(isValidDate(new Date())).toBe(true);

    });

    it('should reject invalid date', () => {
      expect(isValidDate(new Date('invalid'))).toBe(false);

    });

  });

  describe('getRelativeTime', () => {
    it('should return relative time', () => {
      const now = new Date();

      const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);

      expect(getRelativeTime(yesterday)).toContain('dia');

    });

  });

});
