import { useState, useCallback } from 'react';
import { z } from 'zod';
import { validatedApiClient } from '@/services';

/**
 * Hook genérico para chamadas API com validação Zod
 *
 * @example
 * const { data, loading, error, execute } = useValidatedApi(UserSchema);

 * await execute(() => validatedApiClient.get('/users', UserSchema));

 */
export function useValidatedApi<T>(schema: z.ZodSchema<T>) {
  const [data, setData] = useState<T | null>(null);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async (apiCall: () => Promise<T>) => {
    try {
      setLoading(true);

      setError(null);

      const result = await apiCall();

      setData(result);

      return result;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "API call failed";
      setError(errorMessage);

      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setData(null);

    setError(null);

    setLoading(false);

  }, []);

  return { data, loading, error, execute, reset};

}

/**
 * Hook para GET com validação
 */
export function useValidatedGet<T>(
  url: string,
  schema: z.ZodSchema<T>,
  autoFetch = false,
) {
  const { data, loading, error, execute, reset } = useValidatedApi(schema);

  const fetch = useCallback(() => {
    return execute(() => validatedApiClient.get(url, schema));

  }, [url, schema, execute]);

  // Auto-fetch on mount if enabled
  if (autoFetch && !data && !loading && !error) {
    fetch();

  }

  return { data, loading, error, fetch, reset};

}

/**
 * Hook para POST com validação
 */
export function useValidatedPost<T>(url: string, schema: z.ZodSchema<T>) {
  const { data, loading, error, execute, reset } = useValidatedApi(schema);

  const post = useCallback(
    (body: unknown) => {
      return execute(() => validatedApiClient.post(url, schema, body));

    },
    [url, schema, execute],);

  return { data, loading, error, post, reset};

}

/**
 * Hook para PUT com validação
 */

