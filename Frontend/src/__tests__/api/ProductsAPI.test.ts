import { describe, it, expect, vi, beforeEach } from 'vitest';
import { apiClient } from '@/api/client';
import { productsAPI } from '@/api/products';

vi.mock('@/api/client');

describe('Products API', () => {
  beforeEach(() => {
    vi.clearAllMocks();

  });

  describe('getProducts', () => {
    it('should fetch products list', async () => {
      const mockProducts = [
        { id: '1', name: 'Product 1', price: 99.90, stock: 10 },
        { id: '2', name: 'Product 2', price: 149.90, stock: 5 },
      ];

      vi.mocked(apiClient.get).mockResolvedValue({ data: mockProducts });

      const result = await productsAPI.getProducts({ status: 'active' });

      expect(apiClient.get).toHaveBeenCalledWith('/products', {
        params: { status: 'active' },
      });

      expect(result).toEqual(mockProducts);

    });

  });

  describe('createProduct', () => {
    it('should create a new product', async () => {
      const newProduct = {
        name: 'New Product',
        sku: 'PRD-001',
        price: 199.90,
        stock: 20,
        project_id: 'project-1',};

      const mockResponse = { id: '3', ...newProduct, status: 'active'};

      vi.mocked(apiClient.post).mockResolvedValue({ data: mockResponse });

      const result = await productsAPI.createProduct(newProduct);

      expect(apiClient.post).toHaveBeenCalledWith('/products', newProduct);

      expect(result).toEqual(mockResponse);

    });

  });

  describe('updateStock', () => {
    it('should update product stock', async () => {
      const mockResponse = { id: '1', stock: 30};

      vi.mocked(apiClient.patch).mockResolvedValue({ data: mockResponse });

      const result = await productsAPI.updateStock('1', 10, 'add');

      expect(apiClient.patch).toHaveBeenCalledWith('/products/1/stock', {
        quantity: 10,
        operation: 'add',
      });

      expect(result).toEqual(mockResponse);

    });

  });

});
