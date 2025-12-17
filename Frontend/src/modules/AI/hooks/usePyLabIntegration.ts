import { useState, useCallback } from 'react';
import { pylabIntegrationService } from '../services/pylabIntegrationService';

export const usePyLabIntegration = () => {
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const [results, setResults] = useState<any>(null);

  const executeCode = useCallback(async (code: string, model: string) => {
    setLoading(true);

    setError(null);

    try {
      const data = await pylabIntegrationService.executeCode(code, model);

      setResults(data);

      return data;
    } catch (err: unknown) {
      setError(err.message);

      throw err;
    } finally {
      setLoading(false);

    } , []);

  const analyzeText = useCallback(async (text: string, options: unknown) => {
    setLoading(true);

    setError(null);

    try {
      const data = await pylabIntegrationService.analyzeText(text, options);

      setResults(data);

      return data;
    } catch (err: unknown) {
      setError(err.message);

      throw err;
    } finally {
      setLoading(false);

    } , []);

  return {
    loading,
    error,
    results,
    executeCode,
    analyzeText};
};
