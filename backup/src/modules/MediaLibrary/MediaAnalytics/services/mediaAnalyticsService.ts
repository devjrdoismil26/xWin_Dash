// =========================================
// MEDIA ANALYTICS SERVICE - ANÁLISES E ESTATÍSTICAS
// =========================================
// Serviço para análises e estatísticas de mídia
// Máximo: 200 linhas

import { apiClient } from '@/services';
import {
  MediaStats,
  MediaApiResponse
} from '../types';

// =========================================
// ESTATÍSTICAS GERAIS
// =========================================

export const getMediaStats = async (filters: any = {}): Promise<MediaApiResponse<MediaStats>> => {
  try {
    const response = await apiClient.get('/media-library/stats', { params: filters });
    return {
      success: true,
      data: response.data
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message
    };
  }
};

export const getStorageStats = async (): Promise<MediaApiResponse<MediaStats>> => {
  try {
    const response = await apiClient.get('/media-library/storage-stats');
    return {
      success: true,
      data: response.data
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message
    };
  }
};

// =========================================
// ESTATÍSTICAS POR PERÍODO
// =========================================

export const getMediaStatsByPeriod = async (period: 'day' | 'week' | 'month' | 'year', filters: any = {}): Promise<MediaApiResponse<any>> => {
  try {
    const response = await apiClient.get(`/media-library/stats/period/${period}`, { params: filters });
    return {
      success: true,
      data: response.data
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message
    };
  }
};

export const getUploadStats = async (period: 'day' | 'week' | 'month' | 'year', filters: any = {}): Promise<MediaApiResponse<any>> => {
  try {
    const response = await apiClient.get(`/media-library/stats/uploads/${period}`, { params: filters });
    return {
      success: true,
      data: response.data
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message
    };
  }
};

export const getDownloadStats = async (period: 'day' | 'week' | 'month' | 'year', filters: any = {}): Promise<MediaApiResponse<any>> => {
  try {
    const response = await apiClient.get(`/media-library/stats/downloads/${period}`, { params: filters });
    return {
      success: true,
      data: response.data
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message
    };
  }
};

// =========================================
// ESTATÍSTICAS DETALHADAS
// =========================================

export const getMediaPerformanceStats = async (filters: any = {}): Promise<MediaApiResponse<any>> => {
  try {
    const response = await apiClient.get('/media-library/stats/performance', { params: filters });
    return {
      success: true,
      data: response.data
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message
    };
  }
};

export const getMediaEngagementStats = async (filters: any = {}): Promise<MediaApiResponse<any>> => {
  try {
    const response = await apiClient.get('/media-library/stats/engagement', { params: filters });
    return {
      success: true,
      data: response.data
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message
    };
  }
};

export const getMediaHealthStats = async (filters: any = {}): Promise<MediaApiResponse<any>> => {
  try {
    const response = await apiClient.get('/media-library/stats/health', { params: filters });
    return {
      success: true,
      data: response.data
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message
    };
  }
};

// =========================================
// ATRIBUIÇÃO E FONTES
// =========================================

export const getMediaAttributionStats = async (filters: any = {}): Promise<MediaApiResponse<any>> => {
  try {
    const response = await apiClient.get('/media-library/stats/attribution', { params: filters });
    return {
      success: true,
      data: response.data
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message
    };
  }
};

export const getMediaSourceStats = async (filters: any = {}): Promise<MediaApiResponse<any>> => {
  try {
    const response = await apiClient.get('/media-library/stats/sources', { params: filters });
    return {
      success: true,
      data: response.data
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message
    };
  }
};

// =========================================
// PREVISÕES E TENDÊNCIAS
// =========================================

export const getMediaForecasting = async (period: 'week' | 'month' | 'quarter' | 'year', filters: any = {}): Promise<MediaApiResponse<any>> => {
  try {
    const response = await apiClient.get(`/media-library/stats/forecasting/${period}`, { params: filters });
    return {
      success: true,
      data: response.data
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message
    };
  }
};

export const getMediaTrends = async (period: 'week' | 'month' | 'quarter' | 'year', filters: any = {}): Promise<MediaApiResponse<any>> => {
  try {
    const response = await apiClient.get(`/media-library/stats/trends/${period}`, { params: filters });
    return {
      success: true,
      data: response.data
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message
    };
  }
};

// =========================================
// ROI E MÉTRICAS DE NEGÓCIO
// =========================================

export const getMediaROI = async (filters: any = {}): Promise<MediaApiResponse<any>> => {
  try {
    const response = await apiClient.get('/media-library/stats/roi', { params: filters });
    return {
      success: true,
      data: response.data
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message
    };
  }
};

export const getMediaCostAnalysis = async (filters: any = {}): Promise<MediaApiResponse<any>> => {
  try {
    const response = await apiClient.get('/media-library/stats/cost-analysis', { params: filters });
    return {
      success: true,
      data: response.data
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message
    };
  }
};
