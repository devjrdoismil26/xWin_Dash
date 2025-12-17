import { renderHook, act } from '@testing-library/react';
import { useApp } from '@/hooks/useApp';

describe('useApp Hook', () => {
  it('should initialize with default state', () => {
    const { result } = renderHook(() => useApp());
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should handle loading state', () => {
    const { result } = renderHook(() => useApp());
    act(() => {
      result.current.setLoading(true);
    });
    expect(result.current.isLoading).toBe(true);
  });

  it('should handle error state', () => {
    const { result } = renderHook(() => useApp());
    act(() => {
      result.current.setError('Test error');
    });
    expect(result.current.error).toBe('Test error');
  });
});
