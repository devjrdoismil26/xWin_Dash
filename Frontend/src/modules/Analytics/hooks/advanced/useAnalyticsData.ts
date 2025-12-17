import { useState, useCallback } from 'react';

export const useAnalyticsData = () => {
  const [data, setData] = useState(null);

  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async (params?: Record<string, any>) => {
    setLoading(true);

    try {
      // API call
      setData(null);

    } finally {
      setLoading(false);

    } , []);

  return { data, loading, fetchData};
};
