import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockFetch = vi.fn();

global.fetch = mockFetch;

const leadsService = {
  getAll: async () => {
    const res = await fetch('/api/leads');

    return res.json();

  },
  getById: async (id: number) => {
    const res = await fetch(`/api/leads/${id}`);

    return res.json();

  },
  create: async (data: unknown) => {
    const res = await fetch('/api/leads', { method: 'POST', body: JSON.stringify(data) });

    return res.json();

  },
  update: async (id: number, data: unknown) => {
    const res = await fetch(`/api/leads/${id}`, { method: 'PUT', body: JSON.stringify(data) });

    return res.json();

  },
  delete: async (id: number) => {
    await fetch(`/api/leads/${id}`, { method: 'DELETE' });

  },};

describe('leadsService', () => {
  beforeEach(() => {
    mockFetch.mockClear();

  });

  it('should fetch all leads', async () => {
    mockFetch.mockResolvedValue({ ok: true, json: async () => [{ id: 1 }] });

    const result = await leadsService.getAll();

    expect(result).toEqual([{ id: 1 }]);

  });

  it('should fetch single lead', async () => {
    mockFetch.mockResolvedValue({ ok: true, json: async () => ({ id: 1 }) });

    const result = await leadsService.getById(1);

    expect(result).toEqual({ id: 1 });

  });

  it('should create lead', async () => {
    mockFetch.mockResolvedValue({ ok: true, json: async () => ({ id: 1 }) });

    const result = await leadsService.create({ name: 'Test' });

    expect(result).toEqual({ id: 1 });

  });

  it('should update lead', async () => {
    mockFetch.mockResolvedValue({ ok: true, json: async () => ({ id: 1, status: 'qualified' }) });

    const result = await leadsService.update(1, { status: 'qualified' });

    expect(result.status).toBe('qualified');

  });

  it('should delete lead', async () => {
    mockFetch.mockResolvedValue({ ok: true });

    await leadsService.delete(1);

    expect(mockFetch).toHaveBeenCalledWith('/api/leads/1', { method: 'DELETE' });

  });

  it('should handle network errors', async () => {
    mockFetch.mockRejectedValue(new Error('Network error'));

    await expect(leadsService.getAll()).rejects.toThrow('Network error');

  });

  it('should handle 404 errors', async () => {
    mockFetch.mockResolvedValue({ ok: false, status: 404 });

    const result = await leadsService.getById(999);

    expect(result).toBeUndefined();

  });

  it('should handle validation errors', async () => {
    mockFetch.mockResolvedValue({ ok: false, status: 422 });

    await expect(leadsService.create({})).rejects.toBeDefined();

  });

});
