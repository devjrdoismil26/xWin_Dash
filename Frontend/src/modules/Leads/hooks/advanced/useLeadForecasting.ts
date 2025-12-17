// ========================================
// HOOK DE PREVISÃO DE LEADS
// ========================================
import { useState, useCallback } from 'react';
import { leadsService } from '@/services/leadsService';
import { LeadForecast, UseLeadForecastingReturn } from '@/types';
import { getErrorMessage } from '@/utils/errorHelpers';

export const useLeadForecasting = (): UseLeadForecastingReturn => {
  const [forecasts, setForecasts] = useState<LeadForecast[]>([]);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const generateForecast = useCallback(async (period: string) => {
    setLoading(true);

    setError(null);

    try {
      const response = await leadsService.generateForecast(period);

      if (response.success) {
        const forecastData = (response as any).data;
        setForecasts(forecastData);

        return forecastData;
      } else {
        setError(response.error || 'Erro ao gerar previsão');

        return [];
      } catch (err: unknown) {
      const errorMessage = err instanceof Error
        ? getErrorMessage(err)
        : (err as { response?: { data?: { message?: string } })?.response?.data?.message || 'Erro desconhecido';
      setError(errorMessage);

      return [];
    } finally {
      setLoading(false);

    } , []);

  const refreshForecasts = useCallback(async () => {
    setLoading(true);

    setError(null);

    try {
      const response = await leadsService.getAllForecasts();

      if (response.success) {
        setForecasts(response.data);

      } else {
        setError(response.error || 'Erro ao carregar previsões');

      } catch (err: unknown) {
      const errorMessage = err instanceof Error
        ? getErrorMessage(err)
        : (err as { response?: { data?: { message?: string } })?.response?.data?.message || 'Erro desconhecido';
      setError(errorMessage);

    } finally {
      setLoading(false);

    } , []);

  return {
    forecasts,
    loading,
    error,
    generateForecast,
    refreshForecasts};
};
