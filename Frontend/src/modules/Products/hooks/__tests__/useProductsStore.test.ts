import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useProductsStore } from '../useProductsStore';

describe('useProductsStore', () => {
  beforeEach(() => {
    const { result } = renderHook(() => useProductsStore());

    act(() => {
      result.current.reset();

    });

  });

  it('should initialize with default state', () => {
    const { result } = renderHook(() => useProductsStore());

    expect(result.current.products).toEqual([]);

    expect(result.current.loading).toBe(false);

    expect(result.current.error).toBeNull();

  });

  it('should set loading state', () => {
    const { result } = renderHook(() => useProductsStore());

    act(() => {
      result.current.setLoading(true);

    });

    expect(result.current.loading).toBe(true);

  });

  it('should set products', () => {
    const { result } = renderHook(() => useProductsStore());

    const mockProducts = [
      { id: 1, name: 'Product 1', price: 10, sku: 'P1', stock: 5, status: 'active' as const },
      { id: 2, name: 'Product 2', price: 20, sku: 'P2', stock: 10, status: 'active' as const },
    ];
    
    act(() => {
      result.current.setProducts(mockProducts);

    });

    expect(result.current.products).toEqual(mockProducts);

  });

  it('should add product', () => {
    const { result } = renderHook(() => useProductsStore());

    const newProduct = { id: 1, name: 'New Product', price: 15, sku: 'NP1', stock: 3, status: 'active' as const};

    act(() => {
      result.current.addProduct(newProduct);

    });

    expect(result.current.products).toHaveLength(1);

    expect(result.current.products[0]).toEqual(newProduct);

  });

  it('should update product', () => {
    const { result } = renderHook(() => useProductsStore());

    const product = { id: 1, name: 'Product', price: 10, sku: 'P1', stock: 5, status: 'active' as const};

    act(() => {
      result.current.setProducts([product]);

      result.current.updateProduct(1, { name: 'Updated Product' });

    });

    expect(result.current.products[0].name).toBe('Updated Product');

  });

  it('should delete product', () => {
    const { result } = renderHook(() => useProductsStore());

    const products = [
      { id: 1, name: 'Product 1', price: 10, sku: 'P1', stock: 5, status: 'active' as const },
      { id: 2, name: 'Product 2', price: 20, sku: 'P2', stock: 10, status: 'active' as const },
    ];
    
    act(() => {
      result.current.setProducts(products);

      result.current.deleteProduct(1);

    });

    expect(result.current.products).toHaveLength(1);

    expect(result.current.products[0].id).toBe(2);

  });

  it('should set error', () => {
    const { result } = renderHook(() => useProductsStore());

    const error = 'Failed to fetch products';
    
    act(() => {
      result.current.setError(error);

    });

    expect(result.current.error).toBe(error);

  });

  it('should filter products by status', () => {
    const { result } = renderHook(() => useProductsStore());

    const products = [
      { id: 1, name: 'Product 1', price: 10, sku: 'P1', stock: 5, status: 'active' as const },
      { id: 2, name: 'Product 2', price: 20, sku: 'P2', stock: 10, status: 'inactive' as const },
    ];
    
    act(() => {
      result.current.setProducts(products);

      result.current.setFilter({ status: 'active' });

    });

    const filtered = result.current.filteredProducts;
    expect(filtered).toHaveLength(1);

    expect(filtered[0].status).toBe('active');

  });

});
