import { useState, useCallback } from 'react';
import { getErrorMessage } from '@/utils/errorHelpers';

export const useAnalyticsState = <T>() => {
  const [data, setData] = useState<T | null>(null);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async (
    apiCall: () => Promise<{ success: boolean; data?: T; error?: string }>,
    errorMessage: string
  ): Promise<T | null> => {
    setLoading(true);

    setError(null);

    try {
      const result = await apiCall();

      if (result.success && result.data) {
        setData(result.data);

        return result.data;
      }
      setError(result.error || errorMessage);

      return null;
    } catch (err: unknown) {
      setError(getErrorMessage(err));

      return null;
    } finally {
      setLoading(false);

    } , []);

  const clearError = useCallback(() => setError(null), []);

  return { data, loading, error, execute, clearError, setData};
};
