import { renderHook, act, waitFor } from '@testing-library/react';
import { useDebounce } from '@/hooks/useDebounce';

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();

  });

  afterEach(() => {
    vi.useRealTimers();

  });

  it('should debounce value', async () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 500 } );

    expect(result.current).toBe('initial');

    rerender({ value: 'updated', delay: 500 });

    expect(result.current).toBe('initial');

    act(() => {
      vi.advanceTimersByTime(500);

    });

    await waitFor(() => {
      expect(result.current).toBe('updated');

    });

  });

  it('should cancel previous timeout', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 500),
      { initialProps: { value: 'first' } );

    rerender({ value: 'second' });

    act(() => vi.advanceTimersByTime(300));

    rerender({ value: 'third' });

    act(() => vi.advanceTimersByTime(500));

    expect(result.current).toBe('third');

  });

});
