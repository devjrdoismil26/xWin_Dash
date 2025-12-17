import { describe, it, expect, vi, beforeEach } from 'vitest';
import { httpService } from '@/services/httpService';

describe('HttpService', () => {
  beforeEach(() => {
    vi.clearAllMocks();

  });

  it('should make GET request', async () => {
    const mockData = { id: 1, name: 'Test'};

    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockData),
      } as Response));

    const result = await httpService.get('/test');

    expect(result).toEqual(mockData);

    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/test'), expect.any(Object));

  });

  it('should make POST request', async () => {
    const postData = { name: 'New Item'};

    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ id: 1, ...postData }),
      } as Response));

    const result = await httpService.post('/test', postData);

    expect(result.name).toBe('New Item');

  });

  it('should handle errors', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      } as Response));

    await expect(httpService.get('/test')).rejects.toThrow();

  });

  it('should add auth token to headers', async () => {
    const token = 'test-token';
    httpService.setAuthToken(token);

    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
      } as Response));

    await httpService.get('/test');

    expect(fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: `Bearer ${token}`,
        }),
      }));

  });

});
