import { describe, it, expect } from 'vitest';
import { FormatService } from '@/services/FormatService';

describe('FormatService', () => {
  describe('formatCurrency', () => {
    it('should format BRL currency', () => {
      expect(FormatService.formatCurrency(1234.56, 'BRL')).toBe('R$ 1.234,56');

      expect(FormatService.formatCurrency(0, 'BRL')).toBe('R$ 0,00');

    });

    it('should format USD currency', () => {
      expect(FormatService.formatCurrency(1234.56, 'USD')).toBe('$1,234.56');

    });

  });

  describe('formatDate', () => {
    it('should format date', () => {
      const date = new Date('2025-11-28T10:00:00Z');

      expect(FormatService.formatDate(date)).toBe('28/11/2025');

    });

    it('should format datetime', () => {
      const date = new Date('2025-11-28T10:30:00Z');

      expect(FormatService.formatDateTime(date)).toBe('28/11/2025 10:30');

    });

  });

  describe('formatPhone', () => {
    it('should format Brazilian phone', () => {
      expect(FormatService.formatPhone('11999999999')).toBe('(11) 99999-9999');

      expect(FormatService.formatPhone('1133334444')).toBe('(11) 3333-4444');

    });

  });

  describe('formatCPF', () => {
    it('should format CPF', () => {
      expect(FormatService.formatCPF('12345678909')).toBe('123.456.789-09');

    });

  });

  describe('formatCNPJ', () => {
    it('should format CNPJ', () => {
      expect(FormatService.formatCNPJ('11222333000181')).toBe('11.222.333/0001-81');

    });

  });

  describe('formatNumber', () => {
    it('should format number with decimals', () => {
      expect(FormatService.formatNumber(1234.567, 2)).toBe('1.234,57');

    });

    it('should format percentage', () => {
      expect(FormatService.formatPercentage(0.1234)).toBe('12,34%');

    });

  });

  describe('formatFileSize', () => {
    it('should format bytes', () => {
      expect(FormatService.formatFileSize(1024)).toBe('1 KB');

      expect(FormatService.formatFileSize(1048576)).toBe('1 MB');

      expect(FormatService.formatFileSize(1073741824)).toBe('1 GB');

    });

  });

  describe('truncateText', () => {
    it('should truncate long text', () => {
      const text = 'This is a very long text that needs to be truncated';
      expect(FormatService.truncateText(text, 20)).toBe('This is a very long...');

    });

    it('should not truncate short text', () => {
      const text = 'Short text';
      expect(FormatService.truncateText(text, 20)).toBe('Short text');

    });

  });

  describe('slugify', () => {
    it('should create slug from text', () => {
      expect(FormatService.slugify('Hello World')).toBe('hello-world');

      expect(FormatService.slugify('Olá Mundo!')).toBe('ola-mundo');

    });

  });

});
