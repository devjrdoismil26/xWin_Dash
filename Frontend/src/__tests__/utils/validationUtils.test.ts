import { isEmail, isPhone, isURL, isCPF, isCNPJ } from '@/lib/utils/validationUtils';

describe('validationUtils', () => {
  describe('isEmail', () => {
    it('should validate correct email', () => {
      expect(isEmail('test@example.com')).toBe(true);

      expect(isEmail('user.name@domain.co.uk')).toBe(true);

    });

    it('should reject invalid email', () => {
      expect(isEmail('invalid')).toBe(false);

      expect(isEmail('test@')).toBe(false);

      expect(isEmail('@domain.com')).toBe(false);

    });

  });

  describe('isPhone', () => {
    it('should validate BR phone', () => {
      expect(isPhone('11999999999')).toBe(true);

      expect(isPhone('(11) 99999-9999')).toBe(true);

    });

    it('should reject invalid phone', () => {
      expect(isPhone('123')).toBe(false);

      expect(isPhone('abc')).toBe(false);

    });

  });

  describe('isURL', () => {
    it('should validate URL', () => {
      expect(isURL('https://example.com')).toBe(true);

      expect(isURL('http://test.com/path')).toBe(true);

    });

    it('should reject invalid URL', () => {
      expect(isURL('not-a-url')).toBe(false);

      expect(isURL('ftp://invalid')).toBe(false);

    });

  });

  describe('isCPF', () => {
    it('should validate CPF', () => {
      expect(isCPF('12345678909')).toBe(true);

    });

    it('should reject invalid CPF', () => {
      expect(isCPF('00000000000')).toBe(false);

      expect(isCPF('123')).toBe(false);

    });

  });

  describe('isCNPJ', () => {
    it('should validate CNPJ', () => {
      expect(isCNPJ('11222333000181')).toBe(true);

    });

    it('should reject invalid CNPJ', () => {
      expect(isCNPJ('00000000000000')).toBe(false);

    });

  });

});
