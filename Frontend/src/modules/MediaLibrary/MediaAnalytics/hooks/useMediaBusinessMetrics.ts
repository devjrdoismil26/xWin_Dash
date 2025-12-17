import { useCallback } from 'react';
import { useAnalyticsState } from './useAnalyticsState';
import { getMediaAttributionStats, getMediaSourceStats, getMediaForecasting, getMediaTrends, getMediaROI, getMediaCostAnalysis } from '../services/mediaAnalyticsService';

type ForecastPeriod = 'week' | 'month' | 'quarter' | 'year';

export const useMediaBusinessMetrics = () => {
  const { data: attributionStats, execute: executeAttribution } = useAnalyticsState<any>();

  const { data: sourceStats, execute: executeSource } = useAnalyticsState<any>();

  const { data: forecasting, execute: executeForecast } = useAnalyticsState<any>();

  const { data: trends, execute: executeTrends } = useAnalyticsState<any>();

  const { data: roi, execute: executeROI } = useAnalyticsState<any>();

  const { data: costAnalysis, execute: executeCost } = useAnalyticsState<any>();

  const getAttribution = useCallback((filters: unknown = {}) => 
    executeAttribution(() => getMediaAttributionStats(filters), 'Erro ao buscar estatísticas de atribuição'), [executeAttribution]);

  const getSource = useCallback((filters: unknown = {}) => 
    executeSource(() => getMediaSourceStats(filters), 'Erro ao buscar estatísticas de fonte'), [executeSource]);

  const getForecast = useCallback((period: ForecastPeriod, filters: unknown = {}) => 
    executeForecast(() => getMediaForecasting(period, filters), 'Erro ao buscar previsões'), [executeForecast]);

  const getTrends = useCallback((period: ForecastPeriod, filters: unknown = {}) => 
    executeTrends(() => getMediaTrends(period, filters), 'Erro ao buscar tendências'), [executeTrends]);

  const getROI = useCallback((filters: unknown = {}) => 
    executeROI(() => getMediaROI(filters), 'Erro ao buscar ROI'), [executeROI]);

  const getCostAnalysis = useCallback((filters: unknown = {}) => 
    executeCost(() => getMediaCostAnalysis(filters), 'Erro ao buscar análise de custos'), [executeCost]);

  return {
    attributionStats, getAttribution,
    sourceStats, getSource,
    forecasting, getForecast,
    trends, getTrends,
    roi, getROI,
    costAnalysis, getCostAnalysis};
};
