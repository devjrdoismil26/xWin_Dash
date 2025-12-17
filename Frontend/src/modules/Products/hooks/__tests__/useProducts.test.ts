import { describe, it, expect, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';

const useProducts = () => {
  const [products, setProducts] = vi.fn()([]);

  const [loading, setLoading] = vi.fn()(false);

  const fetchProducts = async () => {
    setLoading(true);

    const data = await fetch('/api/products').then(r => r.json());

    setProducts(data);

    setLoading(false);};

  return { products, loading, fetchProducts};
};

describe('useProducts', () => {
  it('should initialize with empty products', () => {
    const { result } = renderHook(() => useProducts());

    expect(result.current.products).toEqual([]);

  });

  it('should start with loading false', () => {
    const { result } = renderHook(() => useProducts());

    expect(result.current.loading).toBe(false);

  });

  it('should have fetchProducts function', () => {
    const { result } = renderHook(() => useProducts());

    expect(typeof result.current.fetchProducts).toBe('function');

  });

  it('should set loading during fetch', async () => {
    global.fetch = vi.fn().mockResolvedValue({ json: async () => [] });

    const { result } = renderHook(() => useProducts());

    result.current.fetchProducts();

    await waitFor(() => expect(result.current.loading).toBe(false));

  });

  it('should fetch products successfully', async () => {
    global.fetch = vi.fn().mockResolvedValue({ json: async () => [{ id: 1 }] });

    const { result } = renderHook(() => useProducts());

    await result.current.fetchProducts();

    await waitFor(() => expect(result.current.products).toEqual([{ id: 1 }]));

  });

});
