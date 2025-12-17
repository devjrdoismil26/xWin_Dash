import { describe, it, expect } from 'vitest';

const formatCurrency = (value: number) => 
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);

const formatDate = (date: string | Date) => 
  new Date(date).toLocaleDateString();

const formatPercentage = (value: number) => 
  `${(value * 100).toFixed(1)}%`;

const formatNumber = (value: number) => 
  new Intl.NumberFormat('en-US').format(value);

const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;};

describe('formatters', () => {
  describe('formatCurrency', () => {
    it('should format currency correctly', () => {
      expect(formatCurrency(1234.56)).toBe('$1,234.56');

    });

    it('should handle zero', () => {
      expect(formatCurrency(0)).toBe('$0.00');

    });

  });

  describe('formatDate', () => {
    it('should format date correctly', () => {
      const result = formatDate('2025-01-15');

      expect(result).toContain('2025');

    });

  });

  describe('formatPercentage', () => {
    it('should format percentage correctly', () => {
      expect(formatPercentage(0.156)).toBe('15.6%');

    });

    it('should handle zero', () => {
      expect(formatPercentage(0)).toBe('0.0%');

    });

  });

  describe('formatNumber', () => {
    it('should format number with commas', () => {
      expect(formatNumber(1234567)).toBe('1,234,567');

    });

  });

  describe('formatFileSize', () => {
    it('should format bytes', () => {
      expect(formatFileSize(500)).toBe('500 B');

    });

    it('should format KB', () => {
      expect(formatFileSize(2048)).toBe('2.0 KB');

    });

    it('should format MB', () => {
      expect(formatFileSize(2097152)).toBe('2.0 MB');

    });

  });

});
