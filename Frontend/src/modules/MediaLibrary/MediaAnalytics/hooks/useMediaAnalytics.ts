import { useMediaStats } from './useMediaStats';
import { useMediaPeriodStats } from './useMediaPeriodStats';
import { useMediaDetailedStats } from './useMediaDetailedStats';
import { useMediaBusinessMetrics } from './useMediaBusinessMetrics';

export const useMediaAnalytics = () => {
  const statsHook = useMediaStats();

  const periodHook = useMediaPeriodStats();

  const detailedHook = useMediaDetailedStats();

  const businessHook = useMediaBusinessMetrics();

  return {
    // General Stats
    stats: statsHook.stats,
    loading: statsHook.loading,
    error: statsHook.error,
    getStats: statsHook.getStats,
    getStorageStats: statsHook.getStorage,
    clearError: statsHook.clearError,

    // Period Stats
    periodStats: periodHook.periodStats,
    uploadStats: periodHook.uploadStats,
    downloadStats: periodHook.downloadStats,
    getStatsByPeriod: periodHook.getByPeriod,
    getUploadStats: periodHook.getUploads,
    getDownloadStats: periodHook.getDownloads,

    // Detailed Stats
    performanceStats: detailedHook.performanceStats,
    engagementStats: detailedHook.engagementStats,
    healthStats: detailedHook.healthStats,
    getPerformanceStats: detailedHook.getPerformance,
    getEngagementStats: detailedHook.getEngagement,
    getHealthStats: detailedHook.getHealth,

    // Business Metrics
    attributionStats: businessHook.attributionStats,
    sourceStats: businessHook.sourceStats,
    forecasting: businessHook.forecasting,
    trends: businessHook.trends,
    roi: businessHook.roi,
    costAnalysis: businessHook.costAnalysis,
    getAttributionStats: businessHook.getAttribution,
    getSourceStats: businessHook.getSource,
    getForecasting: businessHook.getForecast,
    getTrends: businessHook.getTrends,
    getROI: businessHook.getROI,
    getCostAnalysis: businessHook.getCostAnalysis};
};
