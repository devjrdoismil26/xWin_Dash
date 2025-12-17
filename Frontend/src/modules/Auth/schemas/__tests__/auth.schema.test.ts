import { describe, it, expect } from 'vitest';
import { loginSchema, registerSchema, changePasswordSchema } from '../auth.schema';

describe('Auth Schema', () => {
  describe('loginSchema', () => {
    it('should validate valid login', () => {
      const valid = { email: 'test@example.com', password: '123456'};

      expect(() => loginSchema.parse(valid)).not.toThrow();

    });

    it('should reject invalid email', () => {
      const invalid = { email: 'invalid', password: '123456'};

      expect(() => loginSchema.parse(invalid)).toThrow();

    });

    it('should reject short password', () => {
      const invalid = { email: 'test@example.com', password: '12345'};

      expect(() => loginSchema.parse(invalid)).toThrow();

    });

  });

  describe('registerSchema', () => {
    it('should validate valid registration', () => {
      const valid = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'Password123',
        password_confirmation: 'Password123',};

      expect(() => registerSchema.parse(valid)).not.toThrow();

    });

    it('should reject password without uppercase', () => {
      const invalid = {
        name: 'Test',
        email: 'test@example.com',
        password: 'password123',
        password_confirmation: 'password123',};

      expect(() => registerSchema.parse(invalid)).toThrow();

    });

    it('should reject mismatched passwords', () => {
      const invalid = {
        name: 'Test',
        email: 'test@example.com',
        password: 'Password123',
        password_confirmation: 'Different123',};

      expect(() => registerSchema.parse(invalid)).toThrow();

    });

  });

  describe('changePasswordSchema', () => {
    it('should validate password change', () => {
      const valid = {
        current_password: 'OldPass123',
        new_password: 'NewPass123',
        new_password_confirmation: 'NewPass123',};

      expect(() => changePasswordSchema.parse(valid)).not.toThrow();

    });

  });

});
