import { renderHook, act } from '@testing-library/react';
import { useProductsStore } from '@/modules/Products/stores/productsStore';

describe('Edge Cases: Race Conditions', () => {
  it('should handle concurrent updates', async () => {
    const { result } = renderHook(() => useProductsStore());
    
    await act(async () => {
      await Promise.all([
        result.current.fetchProducts(),
        result.current.fetchProducts(),
      ]);
    });
    
    expect(result.current.products).toBeDefined();
  });
});
