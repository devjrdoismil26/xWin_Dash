import { renderHook } from '@testing-library/react';
import { usePerformance } from '@/hooks/usePerformance';

describe('usePerformance Hook', () => {
  it('should track render time', () => {
    const { result } = renderHook(() => usePerformance('TestComponent'));
    expect(result.current.renderTime).toBeGreaterThanOrEqual(0);
  });

  it('should measure performance metrics', () => {
    const { result } = renderHook(() => usePerformance('TestComponent'));
    expect(result.current.metrics).toBeDefined();
  });
});
