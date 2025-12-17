import { renderHook } from '@testing-library/react';
import { useDebounce } from '@/hooks/useDebounce';
import { useLocalStorage } from '@/hooks/useLocalStorage';

describe('Hooks Performance', () => {
  it('should debounce efficiently', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: 'initial' } );

    const start = performance.now();

    for (let i = 0; i < 100; i++) {
      rerender({ value: `value-${i}` });

    }
    const end = performance.now();

    expect(end - start).toBeLessThan(100);

  });

  it('should handle localStorage efficiently', () => {
    const start = performance.now();

    for (let i = 0; i < 50; i++) {
      const { result } = renderHook(() => useLocalStorage(`key-${i}`, 'default'));

    }
    
    const end = performance.now();

    expect(end - start).toBeLessThan(500);

  });

});
