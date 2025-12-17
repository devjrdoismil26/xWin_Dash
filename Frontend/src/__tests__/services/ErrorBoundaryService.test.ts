import { describe, it, expect, vi } from 'vitest';
import { errorBoundaryService } from '@/services/errorBoundaryService';

describe('ErrorBoundaryService', () => {
  it('should log error', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const error = new Error('Test error');

    errorBoundaryService.logError(error);

    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Test error'));

    consoleSpy.mockRestore();

  });

  it('should handle error with context', () => {
    const error = new Error('Test');

    const context = { component: 'TestComponent'};

    const result = errorBoundaryService.handleError(error, context);

    expect(result).toHaveProperty('message');

    expect(result).toHaveProperty('context');

  });

  it('should report error to service', async () => {
    const error = new Error('Test');

    await expect(errorBoundaryService.reportError(error)).resolves.not.toThrow();

  });

});
