import { formatError, isNetworkError, getErrorMessage } from '@/utils/errorHelpers';

describe('Error Helpers', () => {
  describe('formatError', () => {
    it('should format error object', () => {
      const error = new Error('Test error');
      const formatted = formatError(error);
      expect(formatted).toContain('Test error');
    });

    it('should handle string errors', () => {
      const formatted = formatError('String error');
      expect(formatted).toBe('String error');
    });
  });

  describe('isNetworkError', () => {
    it('should detect network errors', () => {
      const error = { code: 'NETWORK_ERROR' };
      expect(isNetworkError(error)).toBe(true);
    });

    it('should return false for non-network errors', () => {
      const error = new Error('Regular error');
      expect(isNetworkError(error)).toBe(false);
    });
  });

  describe('getErrorMessage', () => {
    it('should extract error message', () => {
      const error = { message: 'Test message' };
      expect(getErrorMessage(error)).toBe('Test message');
    });

    it('should return default message', () => {
      expect(getErrorMessage(null)).toBe('An error occurred');
    });
  });
});
