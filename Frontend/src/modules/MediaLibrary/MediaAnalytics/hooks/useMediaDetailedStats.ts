import { useCallback } from 'react';
import { useAnalyticsState } from './useAnalyticsState';
import { getMediaPerformanceStats, getMediaEngagementStats, getMediaHealthStats } from '../services/mediaAnalyticsService';

export const useMediaDetailedStats = () => {
  const { data: performanceStats, loading: perfLoading, error: perfError, execute: executePerf, clearError: clearPerfError } = useAnalyticsState<any>();

  const { data: engagementStats, loading: engLoading, error: engError, execute: executeEng, clearError: clearEngError } = useAnalyticsState<any>();

  const { data: healthStats, loading: healthLoading, error: healthError, execute: executeHealth, clearError: clearHealthError } = useAnalyticsState<any>();

  const getPerformance = useCallback((filters: unknown = {}) => 
    executePerf(() => getMediaPerformanceStats(filters), 'Erro ao buscar estatísticas de performance'), [executePerf]);

  const getEngagement = useCallback((filters: unknown = {}) => 
    executeEng(() => getMediaEngagementStats(filters), 'Erro ao buscar estatísticas de engajamento'), [executeEng]);

  const getHealth = useCallback((filters: unknown = {}) => 
    executeHealth(() => getMediaHealthStats(filters), 'Erro ao buscar estatísticas de saúde'), [executeHealth]);

  return {
    performanceStats, perfLoading, perfError, getPerformance, clearPerfError,
    engagementStats, engLoading, engError, getEngagement, clearEngError,
    healthStats, healthLoading, healthError, getHealth, clearHealthError};
};
