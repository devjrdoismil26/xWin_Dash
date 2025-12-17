import { describe, it, expect, vi, beforeEach } from 'vitest';
import { validatedApiClient } from '../validatedApiClient';
import { apiClient } from '../apiClient';
import { z } from 'zod';

vi.mock('../apiClient');

const TestSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email()
  });

describe('validatedApiClient', () => {
  beforeEach(() => {
    vi.clearAllMocks();

  });

  describe('get', () => {
    it('should validate and return data on success', async () => {
      const mockData = { id: 1, name: 'Test', email: 'test@example.com'};

      vi.spyOn(apiClient, 'get').mockResolvedValue({ data: mockData });

      const result = await validatedApiClient.get('/test', TestSchema);

      expect(result).toEqual(mockData);

      expect(apiClient.get).toHaveBeenCalledWith('/test', undefined);

    });

    it('should throw on invalid data', async () => {
      const invalidData = { id: 1, name: 'Test', email: 'invalid-email'};

      vi.spyOn(apiClient, 'get').mockResolvedValue({ data: invalidData });

      await expect(validatedApiClient.get('/test', TestSchema)).rejects.toThrow();

    });

  });

  describe('post', () => {
    it('should validate and return data on success', async () => {
      const mockData = { id: 1, name: 'Test', email: 'test@example.com'};

      vi.spyOn(apiClient, 'post').mockResolvedValue({ data: mockData });

      const result = await validatedApiClient.post('/test', TestSchema, { name: 'Test' });

      expect(result).toEqual(mockData);

    });

  });

  describe('safeGet', () => {
    it('should return data on valid response', async () => {
      const mockData = { id: 1, name: 'Test', email: 'test@example.com'};

      vi.spyOn(apiClient, 'get').mockResolvedValue({ data: mockData });

      const result = await validatedApiClient.safeGet('/test', TestSchema);

      expect(result).toEqual(mockData);

    });

    it('should return null on invalid data', async () => {
      const invalidData = { id: 1, name: 'Test', email: 'invalid'};

      vi.spyOn(apiClient, 'get').mockResolvedValue({ data: invalidData });

      const result = await validatedApiClient.safeGet('/test', TestSchema);

      expect(result).toBeNull();

    });

  });

});
