import { useState, useCallback } from 'react';

export const useAnalyticsMetrics = () => {
  const [metrics, setMetrics] = useState([]);

  const [loading, setLoading] = useState(false);

  const fetchMetrics = useCallback(async () => {
    setLoading(true);

    try {
      // API call
      setMetrics([]);

    } finally {
      setLoading(false);

    } , []);

  return { metrics, loading, fetchMetrics};
};
