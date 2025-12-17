import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockFetch = vi.fn();

global.fetch = mockFetch;

const socialBufferService = {
  getPosts: async () => (await fetch('/api/posts')).json(),
  getPost: async (id: number) => (await fetch(`/api/posts/${id}`)).json(),
  createPost: async (data: unknown) => (await fetch('/api/posts', { method: 'POST', body: JSON.stringify(data) })).json(),
  updatePost: async (id: number, data: unknown) => (await fetch(`/api/posts/${id}`, { method: 'PUT', body: JSON.stringify(data) })).json(),
  deletePost: async (id: number) => await fetch(`/api/posts/${id}`, { method: 'DELETE' }),
  schedulePost: async (id: number, date: string) => (await fetch(`/api/posts/${id}/schedule`, { method: 'POST', body: JSON.stringify({ date }) })).json(),};

describe('socialBufferService', () => {
  beforeEach(() => mockFetch.mockClear());

  it('should fetch all posts', async () => {
    mockFetch.mockResolvedValue({ ok: true, json: async () => [{ id: 1 }] });

    expect(await socialBufferService.getPosts()).toEqual([{ id: 1 }]);

  });

  it('should fetch single post', async () => {
    mockFetch.mockResolvedValue({ ok: true, json: async () => ({ id: 1 }) });

    expect(await socialBufferService.getPost(1)).toEqual({ id: 1 });

  });

  it('should create post', async () => {
    mockFetch.mockResolvedValue({ ok: true, json: async () => ({ id: 1 }) });

    expect(await socialBufferService.createPost({ content: 'Test' })).toEqual({ id: 1 });

  });

  it('should update post', async () => {
    mockFetch.mockResolvedValue({ ok: true, json: async () => ({ id: 1, content: 'Updated' }) });

    expect((await socialBufferService.updatePost(1, { content: 'Updated' })).content).toBe('Updated');

  });

  it('should delete post', async () => {
    mockFetch.mockResolvedValue({ ok: true });

    await socialBufferService.deletePost(1);

    expect(mockFetch).toHaveBeenCalledWith('/api/posts/1', { method: 'DELETE' });

  });

  it('should schedule post', async () => {
    mockFetch.mockResolvedValue({ ok: true, json: async () => ({ scheduled: true }) });

    expect((await socialBufferService.schedulePost(1, '2025-12-01')).scheduled).toBe(true);

  });

  it('should handle network errors', async () => {
    mockFetch.mockRejectedValue(new Error('Network error'));

    await expect(socialBufferService.getPosts()).rejects.toThrow('Network error');

  });

  it('should handle 404 errors', async () => {
    mockFetch.mockResolvedValue({ ok: false, status: 404 });

    expect(await socialBufferService.getPost(999)).toBeUndefined();

  });

});
