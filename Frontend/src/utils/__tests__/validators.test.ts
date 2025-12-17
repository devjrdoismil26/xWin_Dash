import { describe, it, expect } from 'vitest';

const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const validatePhone = (phone: string) => /^\+?[1-9]\d{1,14}$/.test(phone);

const validateURL = (url: string) => {
  try { new URL(url); return true; } catch { return false; } ;

const validatePassword = (pwd: string) => 
  pwd.length >= 8 && /[A-Z]/.test(pwd) && /[0-9]/.test(pwd);

describe('validators', () => {
  describe('validateEmail', () => {
    it('should validate correct email', () => {
      expect(validateEmail('test@example.com')).toBe(true);

    });

    it('should reject invalid email', () => {
      expect(validateEmail('invalid')).toBe(false);

      expect(validateEmail('test@')).toBe(false);

    });

  });

  describe('validatePhone', () => {
    it('should validate correct phone', () => {
      expect(validatePhone('+1234567890')).toBe(true);

    });

    it('should reject invalid phone', () => {
      expect(validatePhone('abc')).toBe(false);

    });

  });

  describe('validateURL', () => {
    it('should validate correct URL', () => {
      expect(validateURL('https://example.com')).toBe(true);

    });

    it('should reject invalid URL', () => {
      expect(validateURL('not-a-url')).toBe(false);

    });

  });

  describe('validatePassword', () => {
    it('should validate strong password', () => {
      expect(validatePassword('Password123')).toBe(true);

    });

    it('should reject weak password', () => {
      expect(validatePassword('weak')).toBe(false);

      expect(validatePassword('nouppercaseornumber')).toBe(false);

    });

  });

});
