import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockFetch = vi.fn();

global.fetch = mockFetch;

const workflowsService = {
  getAll: async () => (await fetch('/api/workflows')).json(),
  getById: async (id: number) => (await fetch(`/api/workflows/${id}`)).json(),
  create: async (data: unknown) => (await fetch('/api/workflows', { method: 'POST', body: JSON.stringify(data) })).json(),
  update: async (id: number, data: unknown) => (await fetch(`/api/workflows/${id}`, { method: 'PUT', body: JSON.stringify(data) })).json(),
  delete: async (id: number) => await fetch(`/api/workflows/${id}`, { method: 'DELETE' }),
  execute: async (id: number) => (await fetch(`/api/workflows/${id}/execute`, { method: 'POST' })).json(),};

describe('workflowsService', () => {
  beforeEach(() => mockFetch.mockClear());

  it('should fetch all workflows', async () => {
    mockFetch.mockResolvedValue({ ok: true, json: async () => [{ id: 1 }] });

    expect(await workflowsService.getAll()).toEqual([{ id: 1 }]);

  });

  it('should fetch single workflow', async () => {
    mockFetch.mockResolvedValue({ ok: true, json: async () => ({ id: 1 }) });

    expect(await workflowsService.getById(1)).toEqual({ id: 1 });

  });

  it('should create workflow', async () => {
    mockFetch.mockResolvedValue({ ok: true, json: async () => ({ id: 1 }) });

    expect(await workflowsService.create({ name: 'Test' })).toEqual({ id: 1 });

  });

  it('should update workflow', async () => {
    mockFetch.mockResolvedValue({ ok: true, json: async () => ({ id: 1, name: 'Updated' }) });

    expect((await workflowsService.update(1, { name: 'Updated' })).name).toBe('Updated');

  });

  it('should delete workflow', async () => {
    mockFetch.mockResolvedValue({ ok: true });

    await workflowsService.delete(1);

    expect(mockFetch).toHaveBeenCalledWith('/api/workflows/1', { method: 'DELETE' });

  });

  it('should execute workflow', async () => {
    mockFetch.mockResolvedValue({ ok: true, json: async () => ({ status: 'running' }) });

    expect((await workflowsService.execute(1)).status).toBe('running');

  });

  it('should handle network errors', async () => {
    mockFetch.mockRejectedValue(new Error('Network error'));

    await expect(workflowsService.getAll()).rejects.toThrow('Network error');

  });

  it('should handle 404 errors', async () => {
    mockFetch.mockResolvedValue({ ok: false, status: 404 });

    expect(await workflowsService.getById(999)).toBeUndefined();

  });

});
