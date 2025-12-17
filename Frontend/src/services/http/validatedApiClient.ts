import { z } from 'zod';
import { apiClient } from './apiClient';
import { ApiRequestConfig } from './types';

/**
 * Validated API Client
 * Wrapper around apiClient that validates responses with Zod schemas
 */
class ValidatedApiClient {
  async get<T>(url: string, schema: z.ZodSchema<T>, config?: ApiRequestConfig): Promise<T> {
    const data = await apiClient.get(url, config);

    return schema.parse(data);

  }

  async post<T>(url: string, schema: z.ZodSchema<T>, body?: string, config?: ApiRequestConfig): Promise<T> {
    const data = await apiClient.post(url, body, config);

    return schema.parse(data);

  }

  async put<T>(url: string, schema: z.ZodSchema<T>, body?: string, config?: ApiRequestConfig): Promise<T> {
    const data = await apiClient.put(url, body, config);

    return schema.parse(data);

  }

  async patch<T>(url: string, schema: z.ZodSchema<T>, body?: string, config?: ApiRequestConfig): Promise<T> {
    const data = await apiClient.patch(url, body, config);

    return schema.parse(data);

  }

  async delete<T>(url: string, schema?: z.ZodSchema<T>, config?: ApiRequestConfig): Promise<T | void> {
    const data = await apiClient.delete(url, config);

    return schema ? schema.parse(data) : undefined;
  }

  // Safe versions that return null on validation error
  async safeGet<T>(url: string, schema: z.ZodSchema<T>, config?: ApiRequestConfig): Promise<T | null> {
    try {
      const data = await apiClient.get(url, config);

      const result = schema.safeParse(data);

      return result.success ? result.data : null;
    } catch {
      return null;
    } async safePost<T>(url: string, schema: z.ZodSchema<T>, body?: string, config?: ApiRequestConfig): Promise<T | null> {
    try {
      const data = await apiClient.post(url, body, config);

      const result = schema.safeParse(data);

      return result.success ? result.data : null;
    } catch {
      return null;
    } }

export const validatedApiClient = new ValidatedApiClient();

export default validatedApiClient;
