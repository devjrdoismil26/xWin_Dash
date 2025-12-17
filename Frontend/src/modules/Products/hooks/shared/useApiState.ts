import { useState, useCallback } from 'react';
import { getErrorMessage } from '@/utils/errorHelpers';

export const useApiState = <T>() => {
  const [data, setData] = useState<T | null>(null);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async (
    apiCall: () => Promise<any>,
    onSuccess??: (e: any) => void
  ): Promise<T | null> => {
    setLoading(true);

    setError(null);

    try {
      const response = await apiCall();

      const result = (response as any).data || response;
      setData(result);

      onSuccess?.(result);

      return result;
    } catch (err) {
      const errorMsg = getErrorMessage(err);

      setError(errorMsg);

      return null;
    } finally {
      setLoading(false);

    } , []);

  const clearError = useCallback(() => setError(null), []);

  const reset = useCallback(() => {
    setData(null);

    setError(null);

    setLoading(false);

  }, []);

  return { data, loading, error, execute, clearError, reset, setData};
};
