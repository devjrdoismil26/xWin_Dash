import { renderHook, act } from '@testing-library/react';
import { useProductsStore } from '@/modules/Products/stores/productsStore';
import { performance } from 'perf_hooks';

describe('Performance: State Updates', () => {
  it('should update state in under 50ms', () => {
    const { result } = renderHook(() => useProductsStore());
    const start = performance.now();
    act(() => {
      result.current.setProducts([{ id: '1', name: 'Test', price: 100, stock: 10 }]);
    });
    const end = performance.now();
    expect(end - start).toBeLessThan(50);
  });
});
