import { renderHook, waitFor } from '@testing-library/react';
import { useAnalytics } from '@/modules/Analytics/hooks/useAnalytics';
import { vi } from 'vitest';

vi.mock('@/services/api', () => ({
  api: {
    get: vi.fn(() => Promise.resolve({ 
      data: { 
        metrics: { views: 100, clicks: 50 },
        period: '7d'
      } )),
  } ));

describe('useAnalytics', () => {
  it('should fetch analytics data', async () => {
    const { result } = renderHook(() => useAnalytics('7d'));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);

    });

    expect(result.current.data).toBeDefined();

    expect(result.current.data?.metrics).toBeDefined();

  });

  it('should handle period change', async () => {
    const { result, rerender } = renderHook(
      ({ period }) => useAnalytics(period),
      { initialProps: { period: '7d' } );

    rerender({ period: '30d' });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);

    });

  });

});
