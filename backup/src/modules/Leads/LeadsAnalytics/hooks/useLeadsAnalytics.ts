// ========================================
// LEADS ANALYTICS HOOK
// ========================================
// Hook especializado para analytics e métricas de leads
// Máximo: 200 linhas

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import leadsAnalyticsService from '../services/leadsAnalyticsService';
import { LeadMetrics, LeadAnalytics, LeadFilters } from '../types';

interface UseLeadsAnalyticsState {
  metrics: LeadMetrics | null;
  analytics: LeadAnalytics | null;
  loading: boolean;
  error: string | null;
}

interface UseLeadsAnalyticsActions {
  fetchMetrics: (filters?: LeadFilters) => Promise<void>;
  fetchAnalytics: (filters?: LeadFilters) => Promise<void>;
  refreshMetrics: () => Promise<void>;
  refreshAnalytics: () => Promise<void>;
  clearError: () => void;
  reset: () => void;
}

export const useLeadsAnalytics = (): UseLeadsAnalyticsState & UseLeadsAnalyticsActions => {
  const [state, setState] = useState<UseLeadsAnalyticsState>({
    metrics: null,
    analytics: null,
    loading: false,
    error: null
  });

  // Actions
  const fetchMetrics = useCallback(async (filters?: LeadFilters): Promise<void> => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const result = await leadsAnalyticsService.fetchMetrics(filters);
      
      if (result.success && result.data) {
        setState(prev => ({
          ...prev,
          metrics: result.data!,
          loading: false
        }));
      } else {
        throw new Error(result.message || 'Erro ao buscar métricas');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      setState(prev => ({ ...prev, loading: false, error: errorMessage }));
      toast.error(errorMessage);
    }
  }, []);

  const fetchAnalytics = useCallback(async (filters?: LeadFilters): Promise<void> => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const result = await leadsAnalyticsService.fetchAnalytics(filters);
      
      if (result.success && result.data) {
        setState(prev => ({
          ...prev,
          analytics: result.data!,
          loading: false
        }));
      } else {
        throw new Error(result.message || 'Erro ao buscar analytics');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      setState(prev => ({ ...prev, loading: false, error: errorMessage }));
      toast.error(errorMessage);
    }
  }, []);

  const refreshMetrics = useCallback(async (): Promise<void> => {
    await fetchMetrics();
  }, [fetchMetrics]);

  const refreshAnalytics = useCallback(async (): Promise<void> => {
    await fetchAnalytics();
  }, [fetchAnalytics]);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  const reset = useCallback(() => {
    setState({
      metrics: null,
      analytics: null,
      loading: false,
      error: null
    });
  }, []);

  // Initialize data on mount
  useEffect(() => {
    fetchMetrics();
    fetchAnalytics();
  }, [fetchMetrics, fetchAnalytics]);

  return {
    ...state,
    fetchMetrics,
    fetchAnalytics,
    refreshMetrics,
    refreshAnalytics,
    clearError,
    reset
  };
};

export default useLeadsAnalytics;
