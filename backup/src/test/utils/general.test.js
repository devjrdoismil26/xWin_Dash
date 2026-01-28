import { describe, it, expect } from 'vitest';

// Mock general utility functions
const isEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidPhone = (phone) => {
  const phoneRegex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
  return phoneRegex.test(phone);
};

const generateId = () => {
  return Math.random().toString(36).substr(2, 9);
};

const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

describe('General Utilities', () => {
  describe('isEmail', () => {
    it('should validate correct email', () => {
      expect(isEmail('test@example.com')).toBe(true);
    });

    it('should reject invalid email', () => {
      expect(isEmail('invalid-email')).toBe(false);
    });
  });

  describe('isValidPhone', () => {
    it('should validate correct phone format', () => {
      expect(isValidPhone('(11) 99999-9999')).toBe(true);
    });

    it('should reject invalid phone format', () => {
      expect(isValidPhone('11999999999')).toBe(false);
    });
  });

  describe('generateId', () => {
    it('should generate unique IDs', () => {
      const id1 = generateId();
      const id2 = generateId();
      
      expect(id1).not.toBe(id2);
      expect(typeof id1).toBe('string');
      expect(id1.length).toBeGreaterThan(0);
    });
  });

  describe('debounce', () => {
    it('should create debounced function', () => {
      const mockFn = vi.fn();
      const debouncedFn = debounce(mockFn, 100);
      
      expect(typeof debouncedFn).toBe('function');
    });
  });
});
