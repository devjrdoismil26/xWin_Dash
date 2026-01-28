// ========================================
// LEADS ANALYTICS SERVICE
// ========================================
// Serviço para analytics e métricas de leads
// Máximo: 300 linhas

import { apiClient } from '@/services';
import {
  LeadMetrics,
  LeadAnalytics,
  LeadPerformance,
  LeadEngagement,
  LeadHealthScore,
  LeadAttribution,
  LeadForecast,
  LeadSource,
  LeadROI,
  LeadFilters,
  LeadMetricsResponse,
  LeadAnalyticsResponse
} from '../types';

// ========================================
// CONFIGURAÇÃO E UTILITÁRIOS
// ========================================

const getCurrentProjectId = (): string | null => {
  return localStorage.getItem('current_project_id');
};

const getAuthHeaders = (): Record<string, string> => {
  const token = localStorage.getItem('auth_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// ========================================
// MÉTRICAS GERAIS
// ========================================

/**
 * Buscar métricas gerais de leads
 */
export const fetchLeadMetrics = async (filters?: LeadFilters): Promise<LeadMetricsResponse> => {
  try {
    const projectId = getCurrentProjectId();
    if (!projectId) {
      throw new Error('Project ID not found');
    }

    const params = new URLSearchParams();
    if (filters?.date_range) {
      params.append('date_start', filters.date_range.start);
      params.append('date_end', filters.date_range.end);
    }
    if (filters?.status?.length) params.append('status', filters.status.join(','));
    if (filters?.origin?.length) params.append('origin', filters.origin.join(','));

    const response = await apiClient.get(`/projects/${projectId}/leads/metrics?${params}`, {
      headers: getAuthHeaders()
    });

    return {
      success: true,
      data: response.data,
      message: 'Lead metrics fetched successfully'
    };
  } catch (error: any) {
    console.error('Error fetching lead metrics:', error);
    return {
      success: false,
      data: {} as LeadMetrics,
      message: error.response?.data?.message || 'Failed to fetch lead metrics'
    };
  }
};

/**
 * Buscar métricas por período
 */
export const fetchMetricsByPeriod = async (period: 'day' | 'week' | 'month' | 'quarter' | 'year', filters?: LeadFilters): Promise<{ success: boolean; data: LeadMetrics[]; message?: string }> => {
  try {
    const projectId = getCurrentProjectId();
    if (!projectId) {
      throw new Error('Project ID not found');
    }

    const params = new URLSearchParams();
    params.append('period', period);
    if (filters?.date_range) {
      params.append('date_start', filters.date_range.start);
      params.append('date_end', filters.date_range.end);
    }

    const response = await apiClient.get(`/projects/${projectId}/leads/metrics/period?${params}`, {
      headers: getAuthHeaders()
    });

    return {
      success: true,
      data: response.data,
      message: 'Period metrics fetched successfully'
    };
  } catch (error: any) {
    console.error('Error fetching period metrics:', error);
    return {
      success: false,
      data: [],
      message: error.response?.data?.message || 'Failed to fetch period metrics'
    };
  }
};

// ========================================
// ANALYTICS DETALHADOS
// ========================================

/**
 * Buscar analytics de leads
 */
export const fetchLeadAnalytics = async (leadId: number, filters?: { start_date?: string; end_date?: string }): Promise<LeadAnalyticsResponse> => {
  try {
    const projectId = getCurrentProjectId();
    if (!projectId) {
      throw new Error('Project ID not found');
    }

    const params = new URLSearchParams();
    if (filters?.start_date) params.append('start_date', filters.start_date);
    if (filters?.end_date) params.append('end_date', filters.end_date);

    const response = await apiClient.get(`/projects/${projectId}/leads/${leadId}/analytics?${params}`, {
      headers: getAuthHeaders()
    });

    return {
      success: true,
      data: response.data,
      message: 'Lead analytics fetched successfully'
    };
  } catch (error: any) {
    console.error('Error fetching lead analytics:', error);
    return {
      success: false,
      data: [],
      message: error.response?.data?.message || 'Failed to fetch lead analytics'
    };
  }
};

/**
 * Buscar performance de leads
 */
export const fetchLeadPerformance = async (filters?: LeadFilters): Promise<{ success: boolean; data: LeadPerformance[]; message?: string }> => {
  try {
    const projectId = getCurrentProjectId();
    if (!projectId) {
      throw new Error('Project ID not found');
    }

    const params = new URLSearchParams();
    if (filters?.date_range) {
      params.append('date_start', filters.date_range.start);
      params.append('date_end', filters.date_range.end);
    }
    if (filters?.status?.length) params.append('status', filters.status.join(','));

    const response = await apiClient.get(`/projects/${projectId}/leads/performance?${params}`, {
      headers: getAuthHeaders()
    });

    return {
      success: true,
      data: response.data,
      message: 'Lead performance fetched successfully'
    };
  } catch (error: any) {
    console.error('Error fetching lead performance:', error);
    return {
      success: false,
      data: [],
      message: error.response?.data?.message || 'Failed to fetch lead performance'
    };
  }
};

/**
 * Buscar engagement de leads
 */
export const fetchLeadEngagement = async (filters?: LeadFilters): Promise<{ success: boolean; data: LeadEngagement[]; message?: string }> => {
  try {
    const projectId = getCurrentProjectId();
    if (!projectId) {
      throw new Error('Project ID not found');
    }

    const params = new URLSearchParams();
    if (filters?.date_range) {
      params.append('date_start', filters.date_range.start);
      params.append('date_end', filters.date_range.end);
    }

    const response = await apiClient.get(`/projects/${projectId}/leads/engagement?${params}`, {
      headers: getAuthHeaders()
    });

    return {
      success: true,
      data: response.data,
      message: 'Lead engagement fetched successfully'
    };
  } catch (error: any) {
    console.error('Error fetching lead engagement:', error);
    return {
      success: false,
      data: [],
      message: error.response?.data?.message || 'Failed to fetch lead engagement'
    };
  }
};

// ========================================
// HEALTH SCORE
// ========================================

/**
 * Buscar health scores de leads
 */
export const fetchLeadHealthScores = async (filters?: LeadFilters): Promise<{ success: boolean; data: LeadHealthScore[]; message?: string }> => {
  try {
    const projectId = getCurrentProjectId();
    if (!projectId) {
      throw new Error('Project ID not found');
    }

    const params = new URLSearchParams();
    if (filters?.score_range) {
      params.append('score_min', filters.score_range.min.toString());
      params.append('score_max', filters.score_range.max.toString());
    }

    const response = await apiClient.get(`/projects/${projectId}/leads/health-scores?${params}`, {
      headers: getAuthHeaders()
    });

    return {
      success: true,
      data: response.data,
      message: 'Lead health scores fetched successfully'
    };
  } catch (error: any) {
    console.error('Error fetching lead health scores:', error);
    return {
      success: false,
      data: [],
      message: error.response?.data?.message || 'Failed to fetch lead health scores'
    };
  }
};

/**
 * Calcular health score de um lead
 */
export const calculateLeadHealthScore = async (leadId: number): Promise<{ success: boolean; data: LeadHealthScore; message?: string }> => {
  try {
    const projectId = getCurrentProjectId();
    if (!projectId) {
      throw new Error('Project ID not found');
    }

    const response = await apiClient.post(`/projects/${projectId}/leads/${leadId}/health-score`, {}, {
      headers: getAuthHeaders()
    });

    return {
      success: true,
      data: response.data,
      message: 'Lead health score calculated successfully'
    };
  } catch (error: any) {
    console.error('Error calculating lead health score:', error);
    return {
      success: false,
      data: {} as LeadHealthScore,
      message: error.response?.data?.message || 'Failed to calculate lead health score'
    };
  }
};

// ========================================
// ATTRIBUTION
// ========================================

/**
 * Buscar attribution de leads
 */
export const fetchLeadAttribution = async (filters?: LeadFilters): Promise<{ success: boolean; data: LeadAttribution[]; message?: string }> => {
  try {
    const projectId = getCurrentProjectId();
    if (!projectId) {
      throw new Error('Project ID not found');
    }

    const params = new URLSearchParams();
    if (filters?.origin?.length) params.append('origin', filters.origin.join(','));
    if (filters?.date_range) {
      params.append('date_start', filters.date_range.start);
      params.append('date_end', filters.date_range.end);
    }

    const response = await apiClient.get(`/projects/${projectId}/leads/attribution?${params}`, {
      headers: getAuthHeaders()
    });

    return {
      success: true,
      data: response.data,
      message: 'Lead attribution fetched successfully'
    };
  } catch (error: any) {
    console.error('Error fetching lead attribution:', error);
    return {
      success: false,
      data: [],
      message: error.response?.data?.message || 'Failed to fetch lead attribution'
    };
  }
};

/**
 * Buscar attribution de um lead específico
 */
export const fetchLeadAttributionById = async (leadId: number): Promise<{ success: boolean; data: LeadAttribution; message?: string }> => {
  try {
    const projectId = getCurrentProjectId();
    if (!projectId) {
      throw new Error('Project ID not found');
    }

    const response = await apiClient.get(`/projects/${projectId}/leads/${leadId}/attribution`, {
      headers: getAuthHeaders()
    });

    return {
      success: true,
      data: response.data,
      message: 'Lead attribution fetched successfully'
    };
  } catch (error: any) {
    console.error('Error fetching lead attribution:', error);
    return {
      success: false,
      data: {} as LeadAttribution,
      message: error.response?.data?.message || 'Failed to fetch lead attribution'
    };
  }
};

// ========================================
// FORECASTING
// ========================================

/**
 * Buscar forecasts de leads
 */
export const fetchLeadForecasts = async (period: string = 'month'): Promise<{ success: boolean; data: LeadForecast[]; message?: string }> => {
  try {
    const projectId = getCurrentProjectId();
    if (!projectId) {
      throw new Error('Project ID not found');
    }

    const response = await apiClient.get(`/projects/${projectId}/leads/forecasts?period=${period}`, {
      headers: getAuthHeaders()
    });

    return {
      success: true,
      data: response.data,
      message: 'Lead forecasts fetched successfully'
    };
  } catch (error: any) {
    console.error('Error fetching lead forecasts:', error);
    return {
      success: false,
      data: [],
      message: error.response?.data?.message || 'Failed to fetch lead forecasts'
    };
  }
};

/**
 * Gerar forecast personalizado
 */
export const generateLeadForecast = async (period: string, factors?: Record<string, number>): Promise<{ success: boolean; data: LeadForecast; message?: string }> => {
  try {
    const projectId = getCurrentProjectId();
    if (!projectId) {
      throw new Error('Project ID not found');
    }

    const response = await apiClient.post(`/projects/${projectId}/leads/forecasts/generate`, {
      period,
      factors
    }, {
      headers: getAuthHeaders()
    });

    return {
      success: true,
      data: response.data,
      message: 'Lead forecast generated successfully'
    };
  } catch (error: any) {
    console.error('Error generating lead forecast:', error);
    return {
      success: false,
      data: {} as LeadForecast,
      message: error.response?.data?.message || 'Failed to generate lead forecast'
    };
  }
};

// ========================================
// FONTES E ROI
// ========================================

/**
 * Buscar fontes de leads
 */
export const fetchLeadSources = async (): Promise<{ success: boolean; data: LeadSource[]; message?: string }> => {
  try {
    const projectId = getCurrentProjectId();
    if (!projectId) {
      throw new Error('Project ID not found');
    }

    const response = await apiClient.get(`/projects/${projectId}/leads/sources`, {
      headers: getAuthHeaders()
    });

    return {
      success: true,
      data: response.data,
      message: 'Lead sources fetched successfully'
    };
  } catch (error: any) {
    console.error('Error fetching lead sources:', error);
    return {
      success: false,
      data: [],
      message: error.response?.data?.message || 'Failed to fetch lead sources'
    };
  }
};

/**
 * Buscar ROI de leads
 */
export const fetchLeadROI = async (filters?: LeadFilters): Promise<{ success: boolean; data: LeadROI[]; message?: string }> => {
  try {
    const projectId = getCurrentProjectId();
    if (!projectId) {
      throw new Error('Project ID not found');
    }

    const params = new URLSearchParams();
    if (filters?.date_range) {
      params.append('date_start', filters.date_range.start);
      params.append('date_end', filters.date_range.end);
    }
    if (filters?.origin?.length) params.append('origin', filters.origin.join(','));

    const response = await apiClient.get(`/projects/${projectId}/leads/roi?${params}`, {
      headers: getAuthHeaders()
    });

    return {
      success: true,
      data: response.data,
      message: 'Lead ROI fetched successfully'
    };
  } catch (error: any) {
    console.error('Error fetching lead ROI:', error);
    return {
      success: false,
      data: [],
      message: error.response?.data?.message || 'Failed to fetch lead ROI'
    };
  }
};

/**
 * Calcular ROI de um lead específico
 */
export const calculateLeadROI = async (leadId: number): Promise<{ success: boolean; data: LeadROI; message?: string }> => {
  try {
    const projectId = getCurrentProjectId();
    if (!projectId) {
      throw new Error('Project ID not found');
    }

    const response = await apiClient.post(`/projects/${projectId}/leads/${leadId}/roi`, {}, {
      headers: getAuthHeaders()
    });

    return {
      success: true,
      data: response.data,
      message: 'Lead ROI calculated successfully'
    };
  } catch (error: any) {
    console.error('Error calculating lead ROI:', error);
    return {
      success: false,
      data: {} as LeadROI,
      message: error.response?.data?.message || 'Failed to calculate lead ROI'
    };
  }
};

export default leadsAnalyticsService;
