// =========================================
// ANALYTICS STORE ORQUESTRADOR - SOCIAL BUFFER
// =========================================

import { useAnalyticsMetricsStore } from './useAnalyticsMetricsStore';
import { useAnalyticsHashtagsStore } from './useAnalyticsHashtagsStore';
import { useAnalyticsReportsStore } from './useAnalyticsReportsStore';

// Re-exportar tipos dos sub-stores
export type {
  AnalyticsParams,
  BasicMetrics,
  PlatformMetrics,
  TimeSeriesMetrics,
  ContentMetrics
} from '../../services/analytics/analyticsMetricsService';

export type {
  HashtagMetrics,
  HashtagAnalysis,
  HashtagSuggestions
} from '../../services/analytics/analyticsHashtagsService';

export type {
  LinkMetrics,
  EngagementMetrics,
  AudienceMetrics,
  AnalyticsReport,
  PeriodComparison
} from '../../services/analytics/analyticsReportsService';

// =========================================
// HOOK ORQUESTRADOR DE ANALYTICS
// =========================================

export const useAnalyticsStore = () => {
  // Sub-stores
  const metricsStore = useAnalyticsMetricsStore();
  const hashtagsStore = useAnalyticsHashtagsStore();
  const reportsStore = useAnalyticsReportsStore();

  // ===== MÉTRICAS BÁSICAS =====

  const fetchBasicMetrics = async (params?: any) => {
    return metricsStore.fetchBasicMetrics(params);
  };

  const fetchPlatformMetrics = async (params?: any) => {
    return metricsStore.fetchPlatformMetrics(params);
  };

  const fetchTimeSeriesMetrics = async (params?: any) => {
    return metricsStore.fetchTimeSeriesMetrics(params);
  };

  const fetchContentMetrics = async (params?: any) => {
    return metricsStore.fetchContentMetrics(params);
  };

  // ===== MÉTRICAS DE HASHTAGS =====

  const fetchHashtagMetrics = async (params?: any) => {
    return hashtagsStore.fetchHashtagMetrics(params);
  };

  const analyzeHashtag = async (hashtag: string, platform: string) => {
    return hashtagsStore.analyzeHashtag(hashtag, platform);
  };

  const getHashtagSuggestions = async (content: string, platform: string) => {
    return hashtagsStore.getHashtagSuggestions(content, platform);
  };

  const fetchTrendingHashtags = async (platform: string, limit?: number) => {
    return hashtagsStore.fetchTrendingHashtags(platform, limit);
  };

  const fetchRelatedHashtags = async (hashtag: string, platform: string) => {
    return hashtagsStore.fetchRelatedHashtags(hashtag, platform);
  };

  // ===== MÉTRICAS DE LINKS =====

  const fetchLinkMetrics = async (params?: any) => {
    return reportsStore.fetchLinkMetrics(params);
  };

  const fetchEngagementMetrics = async (params?: any) => {
    return reportsStore.fetchEngagementMetrics(params);
  };

  const fetchAudienceMetrics = async (params?: any) => {
    return reportsStore.fetchAudienceMetrics(params);
  };

  // ===== RELATÓRIOS =====

  const generateReport = async (params: any) => {
    return reportsStore.generateReport(params);
  };

  const getReport = async (reportId: string) => {
    return reportsStore.getReport(reportId);
  };

  const listReports = async (params?: any) => {
    return reportsStore.listReports(params);
  };

  const exportReport = async (reportId: string, format?: 'pdf' | 'excel' | 'csv') => {
    return reportsStore.exportReport(reportId, format);
  };

  // ===== COMPARAÇÕES =====

  const comparePeriods = async (currentPeriod: any, previousPeriod: any, params?: any) => {
    return reportsStore.comparePeriods(currentPeriod, previousPeriod, params);
  };

  // ===== FILTROS =====

  const setFilters = (filters: any) => {
    metricsStore.setFilters(filters);
    hashtagsStore.setFilters(filters);
    reportsStore.setFilters(filters);
  };

  const clearFilters = () => {
    metricsStore.clearFilters();
    hashtagsStore.clearFilters();
    reportsStore.clearFilters();
  };

  // ===== ESTADO =====

  const setLoading = (loading: boolean) => {
    metricsStore.setLoading(loading);
    hashtagsStore.setLoading(loading);
    reportsStore.setLoading(loading);
  };

  const setError = (error: string | null) => {
    metricsStore.setError(error);
    hashtagsStore.setError(error);
    reportsStore.setError(error);
  };

  const clearError = () => {
    metricsStore.clearError();
    hashtagsStore.clearError();
    reportsStore.clearError();
  };

  // ===== CACHE =====

  const clearCache = () => {
    metricsStore.clearCache();
    hashtagsStore.clearCache();
    reportsStore.clearCache();
  };

  const invalidateCache = (pattern: string) => {
    metricsStore.invalidateCache(pattern);
    hashtagsStore.invalidateCache(pattern);
    reportsStore.invalidateCache(pattern);
  };

  // ===== ESTADO COMBINADO =====

  const loading = metricsStore.loading || hashtagsStore.loading || reportsStore.loading;
  const error = metricsStore.error || hashtagsStore.error || reportsStore.error;

  return {
    // Estado das métricas
    basicMetrics: metricsStore.basicMetrics,
    platformMetrics: metricsStore.platformMetrics,
    timeSeriesMetrics: metricsStore.timeSeriesMetrics,
    contentMetrics: metricsStore.contentMetrics,
    
    // Estado das hashtags
    hashtagMetrics: hashtagsStore.hashtagMetrics,
    hashtagAnalysis: hashtagsStore.hashtagAnalysis,
    hashtagSuggestions: hashtagsStore.hashtagSuggestions,
    trendingHashtags: hashtagsStore.trendingHashtags,
    relatedHashtags: hashtagsStore.relatedHashtags,
    
    // Estado dos relatórios
    linkMetrics: reportsStore.linkMetrics,
    engagementMetrics: reportsStore.engagementMetrics,
    audienceMetrics: reportsStore.audienceMetrics,
    currentReport: reportsStore.currentReport,
    reports: reportsStore.reports,
    periodComparison: reportsStore.periodComparison,
    
    // Estado de loading e erro
    loading,
    error,
    
    // Estado de operações
    fetchingBasic: metricsStore.fetchingBasic,
    fetchingPlatform: metricsStore.fetchingPlatform,
    fetchingTimeSeries: metricsStore.fetchingTimeSeries,
    fetchingContent: metricsStore.fetchingContent,
    fetchingMetrics: hashtagsStore.fetchingMetrics,
    analyzing: hashtagsStore.analyzing,
    suggesting: hashtagsStore.suggesting,
    fetchingTrending: hashtagsStore.fetchingTrending,
    fetchingRelated: hashtagsStore.fetchingRelated,
    fetchingLinks: reportsStore.fetchingLinks,
    fetchingEngagement: reportsStore.fetchingEngagement,
    fetchingAudience: reportsStore.fetchingAudience,
    generatingReport: reportsStore.generatingReport,
    exporting: reportsStore.exporting,
    comparing: reportsStore.comparing,
    
    // Estado de filtros
    filters: metricsStore.filters,
    
    // Ações de métricas básicas
    fetchBasicMetrics,
    fetchPlatformMetrics,
    fetchTimeSeriesMetrics,
    fetchContentMetrics,
    
    // Ações de métricas de hashtags
    fetchHashtagMetrics,
    analyzeHashtag,
    getHashtagSuggestions,
    fetchTrendingHashtags,
    fetchRelatedHashtags,
    
    // Ações de métricas de links
    fetchLinkMetrics,
    fetchEngagementMetrics,
    fetchAudienceMetrics,
    
    // Ações de relatórios
    generateReport,
    getReport,
    listReports,
    exportReport,
    
    // Ações de comparação
    comparePeriods,
    
    // Ações de filtros
    setFilters,
    clearFilters,
    
    // Ações de estado
    setLoading,
    setError,
    clearError,
    
    // Ações de cache
    clearCache,
    invalidateCache,
    
    // Ações específicas dos sub-stores
    getHashtagAnalysis: hashtagsStore.getHashtagAnalysis,
    getSuggestions: hashtagsStore.getSuggestions,
    getRelatedHashtags: hashtagsStore.getRelatedHashtags,
    
    // Refresh actions
    refreshBasicMetrics: metricsStore.refreshBasicMetrics,
    refreshPlatformMetrics: metricsStore.refreshPlatformMetrics,
    refreshTimeSeriesMetrics: metricsStore.refreshTimeSeriesMetrics,
    refreshContentMetrics: metricsStore.refreshContentMetrics,
    refreshHashtagMetrics: hashtagsStore.refreshHashtagMetrics,
    refreshTrendingHashtags: hashtagsStore.refreshTrendingHashtags,
    refreshLinkMetrics: reportsStore.refreshLinkMetrics,
    refreshEngagementMetrics: reportsStore.refreshEngagementMetrics,
    refreshAudienceMetrics: reportsStore.refreshAudienceMetrics
  };
};

export default useAnalyticsStore;
