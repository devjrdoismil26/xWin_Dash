import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockFetch = vi.fn();

global.fetch = mockFetch;

const productsService = {
  getAll: async () => {
    const res = await fetch('/api/products');

    return res.json();

  },
  getById: async (id: number) => {
    const res = await fetch(`/api/products/${id}`);

    return res.json();

  },
  create: async (data: unknown) => {
    const res = await fetch('/api/products', { method: 'POST', body: JSON.stringify(data) });

    return res.json();

  },
  update: async (id: number, data: unknown) => {
    const res = await fetch(`/api/products/${id}`, { method: 'PUT', body: JSON.stringify(data) });

    return res.json();

  },
  delete: async (id: number) => {
    await fetch(`/api/products/${id}`, { method: 'DELETE' });

  },};

describe('productsService', () => {
  beforeEach(() => {
    mockFetch.mockClear();

  });

  it('should fetch all products', async () => {
    mockFetch.mockResolvedValue({ ok: true, json: async () => [{ id: 1 }] });

    const result = await productsService.getAll();

    expect(result).toEqual([{ id: 1 }]);

  });

  it('should fetch single product', async () => {
    mockFetch.mockResolvedValue({ ok: true, json: async () => ({ id: 1 }) });

    const result = await productsService.getById(1);

    expect(result).toEqual({ id: 1 });

  });

  it('should create product', async () => {
    mockFetch.mockResolvedValue({ ok: true, json: async () => ({ id: 1 }) });

    const result = await productsService.create({ name: 'Test' });

    expect(result).toEqual({ id: 1 });

  });

  it('should update product', async () => {
    mockFetch.mockResolvedValue({ ok: true, json: async () => ({ id: 1, name: 'Updated' }) });

    const result = await productsService.update(1, { name: 'Updated' });

    expect(result.name).toBe('Updated');

  });

  it('should delete product', async () => {
    mockFetch.mockResolvedValue({ ok: true });

    await productsService.delete(1);

    expect(mockFetch).toHaveBeenCalledWith('/api/products/1', { method: 'DELETE' });

  });

  it('should handle network errors', async () => {
    mockFetch.mockRejectedValue(new Error('Network error'));

    await expect(productsService.getAll()).rejects.toThrow('Network error');

  });

  it('should handle 404 errors', async () => {
    mockFetch.mockResolvedValue({ ok: false, status: 404 });

    const result = await productsService.getById(999);

    expect(result).toBeUndefined();

  });

  it('should handle validation errors', async () => {
    mockFetch.mockResolvedValue({ ok: false, status: 422, json: async () => ({ errors: {} ) });

    await expect(productsService.create({})).rejects.toBeDefined();

  });

});
