import { describe, it, expect } from 'vitest';
import { ValidationService } from '@/services/ValidationService';

describe('ValidationService', () => {
  describe('validateEmail', () => {
    it('should validate correct email', () => {
      expect(ValidationService.validateEmail('test@example.com')).toBe(true);

      expect(ValidationService.validateEmail('user.name@domain.co.uk')).toBe(true);

    });

    it('should reject invalid email', () => {
      expect(ValidationService.validateEmail('invalid')).toBe(false);

      expect(ValidationService.validateEmail('test@')).toBe(false);

      expect(ValidationService.validateEmail('@example.com')).toBe(false);

    });

  });

  describe('validatePhone', () => {
    it('should validate correct phone', () => {
      expect(ValidationService.validatePhone('+5511999999999')).toBe(true);

      expect(ValidationService.validatePhone('11999999999')).toBe(true);

    });

    it('should reject invalid phone', () => {
      expect(ValidationService.validatePhone('123')).toBe(false);

      expect(ValidationService.validatePhone('abc')).toBe(false);

    });

  });

  describe('validateCPF', () => {
    it('should validate correct CPF', () => {
      expect(ValidationService.validateCPF('123.456.789-09')).toBe(true);

      expect(ValidationService.validateCPF('12345678909')).toBe(true);

    });

    it('should reject invalid CPF', () => {
      expect(ValidationService.validateCPF('000.000.000-00')).toBe(false);

      expect(ValidationService.validateCPF('123')).toBe(false);

    });

  });

  describe('validateCNPJ', () => {
    it('should validate correct CNPJ', () => {
      expect(ValidationService.validateCNPJ('11.222.333/0001-81')).toBe(true);

      expect(ValidationService.validateCNPJ('11222333000181')).toBe(true);

    });

    it('should reject invalid CNPJ', () => {
      expect(ValidationService.validateCNPJ('00.000.000/0000-00')).toBe(false);

      expect(ValidationService.validateCNPJ('123')).toBe(false);

    });

  });

  describe('validateURL', () => {
    it('should validate correct URL', () => {
      expect(ValidationService.validateURL('https://example.com')).toBe(true);

      expect(ValidationService.validateURL('http://test.com.br')).toBe(true);

    });

    it('should reject invalid URL', () => {
      expect(ValidationService.validateURL('not-a-url')).toBe(false);

      expect(ValidationService.validateURL('ftp://invalid')).toBe(false);

    });

  });

  describe('validatePassword', () => {
    it('should validate strong password', () => {
      const result = ValidationService.validatePassword('StrongP@ss123');

      expect(result.isValid).toBe(true);

      expect(result.strength).toBe('strong');

    });

    it('should reject weak password', () => {
      const result = ValidationService.validatePassword('weak');

      expect(result.isValid).toBe(false);

      expect(result.strength).toBe('weak');

    });

    it('should require minimum length', () => {
      const result = ValidationService.validatePassword('Short1!');

      expect(result.isValid).toBe(false);

      expect(result.errors).toContain('Minimum 8 characters required');

    });

  });

  describe('validateCreditCard', () => {
    it('should validate correct credit card', () => {
      expect(ValidationService.validateCreditCard('4111111111111111')).toBe(true);

    });

    it('should reject invalid credit card', () => {
      expect(ValidationService.validateCreditCard('1234567890123456')).toBe(false);

    });

  });

  describe('sanitizeInput', () => {
    it('should remove HTML tags', () => {
      const input = '<script>alert("xss")</script>Hello';
      const result = ValidationService.sanitizeInput(input);

      expect(result).toBe('Hello');

    });

    it('should trim whitespace', () => {
      const input = '  Hello World  ';
      const result = ValidationService.sanitizeInput(input);

      expect(result).toBe('Hello World');

    });

  });

});
