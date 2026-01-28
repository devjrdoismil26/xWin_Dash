// =========================================
// USE MEDIA ANALYTICS - HOOK ESPECIALIZADO
// =========================================
// Hook para análises e estatísticas de mídia
// Máximo: 200 linhas

import { useState, useCallback } from 'react';
import {
  MediaStats
} from '../types';
import {
  getMediaStats,
  getStorageStats,
  getMediaStatsByPeriod,
  getUploadStats,
  getDownloadStats,
  getMediaPerformanceStats,
  getMediaEngagementStats,
  getMediaHealthStats,
  getMediaAttributionStats,
  getMediaSourceStats,
  getMediaForecasting,
  getMediaTrends,
  getMediaROI,
  getMediaCostAnalysis
} from '../services/mediaAnalyticsService';

interface UseMediaAnalyticsReturn {
  // State
  stats: MediaStats | null;
  periodStats: any;
  uploadStats: any;
  downloadStats: any;
  performanceStats: any;
  engagementStats: any;
  healthStats: any;
  attributionStats: any;
  sourceStats: any;
  forecasting: any;
  trends: any;
  roi: any;
  costAnalysis: any;
  loading: boolean;
  error: string | null;
  
  // General Stats
  getStats: (filters?: any) => Promise<MediaStats | null>;
  getStorageStats: () => Promise<MediaStats | null>;
  
  // Period Stats
  getStatsByPeriod: (period: 'day' | 'week' | 'month' | 'year', filters?: any) => Promise<any>;
  getUploadStats: (period: 'day' | 'week' | 'month' | 'year', filters?: any) => Promise<any>;
  getDownloadStats: (period: 'day' | 'week' | 'month' | 'year', filters?: any) => Promise<any>;
  
  // Detailed Stats
  getPerformanceStats: (filters?: any) => Promise<any>;
  getEngagementStats: (filters?: any) => Promise<any>;
  getHealthStats: (filters?: any) => Promise<any>;
  
  // Attribution & Sources
  getAttributionStats: (filters?: any) => Promise<any>;
  getSourceStats: (filters?: any) => Promise<any>;
  
  // Forecasting & Trends
  getForecasting: (period: 'week' | 'month' | 'quarter' | 'year', filters?: any) => Promise<any>;
  getTrends: (period: 'week' | 'month' | 'quarter' | 'year', filters?: any) => Promise<any>;
  
  // Business Metrics
  getROI: (filters?: any) => Promise<any>;
  getCostAnalysis: (filters?: any) => Promise<any>;
  
  // Utilities
  clearError: () => void;
}

export const useMediaAnalytics = (): UseMediaAnalyticsReturn => {
  const [stats, setStats] = useState<MediaStats | null>(null);
  const [periodStats, setPeriodStats] = useState<any>(null);
  const [uploadStats, setUploadStats] = useState<any>(null);
  const [downloadStats, setDownloadStats] = useState<any>(null);
  const [performanceStats, setPerformanceStats] = useState<any>(null);
  const [engagementStats, setEngagementStats] = useState<any>(null);
  const [healthStats, setHealthStats] = useState<any>(null);
  const [attributionStats, setAttributionStats] = useState<any>(null);
  const [sourceStats, setSourceStats] = useState<any>(null);
  const [forecasting, setForecasting] = useState<any>(null);
  const [trends, setTrends] = useState<any>(null);
  const [roi, setROI] = useState<any>(null);
  const [costAnalysis, setCostAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // =========================================
  // GENERAL STATS
  // =========================================

  const getStats = useCallback(async (filters: any = {}): Promise<MediaStats | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await getMediaStats(filters);
      if (result.success && result.data) {
        setStats(result.data);
        return result.data;
      } else {
        setError(result.error || 'Erro ao buscar estatísticas');
        return null;
      }
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getStorageStats = useCallback(async (): Promise<MediaStats | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await getStorageStats();
      if (result.success && result.data) {
        setStats(result.data);
        return result.data;
      } else {
        setError(result.error || 'Erro ao buscar estatísticas de armazenamento');
        return null;
      }
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // =========================================
  // PERIOD STATS
  // =========================================

  const getStatsByPeriod = useCallback(async (period: 'day' | 'week' | 'month' | 'year', filters: any = {}): Promise<any> => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await getMediaStatsByPeriod(period, filters);
      if (result.success && result.data) {
        setPeriodStats(result.data);
        return result.data;
      } else {
        setError(result.error || 'Erro ao buscar estatísticas por período');
        return null;
      }
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getUploadStats = useCallback(async (period: 'day' | 'week' | 'month' | 'year', filters: any = {}): Promise<any> => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await getUploadStats(period, filters);
      if (result.success && result.data) {
        setUploadStats(result.data);
        return result.data;
      } else {
        setError(result.error || 'Erro ao buscar estatísticas de upload');
        return null;
      }
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getDownloadStats = useCallback(async (period: 'day' | 'week' | 'month' | 'year', filters: any = {}): Promise<any> => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await getDownloadStats(period, filters);
      if (result.success && result.data) {
        setDownloadStats(result.data);
        return result.data;
      } else {
        setError(result.error || 'Erro ao buscar estatísticas de download');
        return null;
      }
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // =========================================
  // DETAILED STATS
  // =========================================

  const getPerformanceStats = useCallback(async (filters: any = {}): Promise<any> => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await getMediaPerformanceStats(filters);
      if (result.success && result.data) {
        setPerformanceStats(result.data);
        return result.data;
      } else {
        setError(result.error || 'Erro ao buscar estatísticas de performance');
        return null;
      }
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getEngagementStats = useCallback(async (filters: any = {}): Promise<any> => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await getMediaEngagementStats(filters);
      if (result.success && result.data) {
        setEngagementStats(result.data);
        return result.data;
      } else {
        setError(result.error || 'Erro ao buscar estatísticas de engajamento');
        return null;
      }
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getHealthStats = useCallback(async (filters: any = {}): Promise<any> => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await getMediaHealthStats(filters);
      if (result.success && result.data) {
        setHealthStats(result.data);
        return result.data;
      } else {
        setError(result.error || 'Erro ao buscar estatísticas de saúde');
        return null;
      }
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // =========================================
  // ATTRIBUTION & SOURCES
  // =========================================

  const getAttributionStats = useCallback(async (filters: any = {}): Promise<any> => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await getMediaAttributionStats(filters);
      if (result.success && result.data) {
        setAttributionStats(result.data);
        return result.data;
      } else {
        setError(result.error || 'Erro ao buscar estatísticas de atribuição');
        return null;
      }
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getSourceStats = useCallback(async (filters: any = {}): Promise<any> => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await getMediaSourceStats(filters);
      if (result.success && result.data) {
        setSourceStats(result.data);
        return result.data;
      } else {
        setError(result.error || 'Erro ao buscar estatísticas de fontes');
        return null;
      }
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // =========================================
  // FORECASTING & TRENDS
  // =========================================

  const getForecasting = useCallback(async (period: 'week' | 'month' | 'quarter' | 'year', filters: any = {}): Promise<any> => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await getMediaForecasting(period, filters);
      if (result.success && result.data) {
        setForecasting(result.data);
        return result.data;
      } else {
        setError(result.error || 'Erro ao buscar previsões');
        return null;
      }
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getTrends = useCallback(async (period: 'week' | 'month' | 'quarter' | 'year', filters: any = {}): Promise<any> => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await getMediaTrends(period, filters);
      if (result.success && result.data) {
        setTrends(result.data);
        return result.data;
      } else {
        setError(result.error || 'Erro ao buscar tendências');
        return null;
      }
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // =========================================
  // BUSINESS METRICS
  // =========================================

  const getROI = useCallback(async (filters: any = {}): Promise<any> => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await getMediaROI(filters);
      if (result.success && result.data) {
        setROI(result.data);
        return result.data;
      } else {
        setError(result.error || 'Erro ao buscar ROI');
        return null;
      }
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getCostAnalysis = useCallback(async (filters: any = {}): Promise<any> => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await getMediaCostAnalysis(filters);
      if (result.success && result.data) {
        setCostAnalysis(result.data);
        return result.data;
      } else {
        setError(result.error || 'Erro ao buscar análise de custos');
        return null;
      }
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // =========================================
  // UTILITIES
  // =========================================

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // State
    stats,
    periodStats,
    uploadStats,
    downloadStats,
    performanceStats,
    engagementStats,
    healthStats,
    attributionStats,
    sourceStats,
    forecasting,
    trends,
    roi,
    costAnalysis,
    loading,
    error,
    
    // General Stats
    getStats,
    getStorageStats,
    
    // Period Stats
    getStatsByPeriod,
    getUploadStats,
    getDownloadStats,
    
    // Detailed Stats
    getPerformanceStats,
    getEngagementStats,
    getHealthStats,
    
    // Attribution & Sources
    getAttributionStats,
    getSourceStats,
    
    // Forecasting & Trends
    getForecasting,
    getTrends,
    
    // Business Metrics
    getROI,
    getCostAnalysis,
    
    // Utilities
    clearError
  };
};
