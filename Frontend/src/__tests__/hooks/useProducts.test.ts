import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useProducts } from '@/hooks/useProducts';
import { productsAPI } from '@/api/products';

vi.mock('@/api/products');

describe('useProducts Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();

  });

  it('should fetch products on mount', async () => {
    const mockProducts = [
      { id: '1', name: 'Product 1', price: 99.90, stock: 10 },
      { id: '2', name: 'Product 2', price: 149.90, stock: 5 },
    ];

    vi.mocked(productsAPI.getProducts).mockResolvedValue(mockProducts);

    const { result } = renderHook(() => useProducts());

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);

    });

    expect(result.current.products).toEqual(mockProducts);

    expect(result.current.error).toBeNull();

  });

  it('should create a new product', async () => {
    const newProduct = {
      name: 'New Product',
      sku: 'PRD-001',
      price: 199.90,
      stock: 20,
      project_id: 'project-1',};

    const createdProduct = { id: '3', ...newProduct, status: 'active'};

    vi.mocked(productsAPI.createProduct).mockResolvedValue(createdProduct);

    vi.mocked(productsAPI.getProducts).mockResolvedValue([createdProduct]);

    const { result } = renderHook(() => useProducts());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);

    });

    await result.current.createProduct(newProduct);

    await waitFor(() => {
      expect(result.current.products).toContainEqual(createdProduct);

    });

  });

  it('should update product stock', async () => {
    const mockProducts = [
      { id: '1', name: 'Product 1', stock: 10 },
    ];

    vi.mocked(productsAPI.getProducts).mockResolvedValue(mockProducts);

    const { result } = renderHook(() => useProducts());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);

    });

    const updatedProduct = { id: '1', name: 'Product 1', stock: 20};

    vi.mocked(productsAPI.updateStock).mockResolvedValue(updatedProduct);

    await result.current.updateStock('1', 10, 'add');

    await waitFor(() => {
      expect(result.current.products[0].stock).toBe(20);

    });

  });

  it('should filter products by status', async () => {
    const mockProducts = [
      { id: '1', name: 'Product 1', status: 'active' },
      { id: '2', name: 'Product 2', status: 'inactive' },
    ];

    vi.mocked(productsAPI.getProducts).mockResolvedValue(mockProducts);

    const { result } = renderHook(() => useProducts({ status: 'active' }));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);

    });

    expect(productsAPI.getProducts).toHaveBeenCalledWith({ status: 'active' });

  });

  it('should calculate total inventory value', async () => {
    const mockProducts = [
      { id: '1', name: 'Product 1', price: 100, stock: 10 },
      { id: '2', name: 'Product 2', price: 50, stock: 20 },
    ];

    vi.mocked(productsAPI.getProducts).mockResolvedValue(mockProducts);

    const { result } = renderHook(() => useProducts());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);

    });

    expect(result.current.totalInventoryValue).toBe(2000); // (100*10) + (50*20)
  });

});
