import { apiClient } from '@/services';

export const auraAnalyticsService = {
  async getStats(params?: Record<string, any>) {
    return apiClient.get('/aura/analytics/stats', { params });

  },

  async getMetrics(params?: Record<string, any>) {
    return apiClient.get('/aura/analytics/metrics', { params });

  },

  async getReports(params?: Record<string, any>) {
    return apiClient.get('/aura/analytics/reports', { params });

  },

  async exportReport(params?: Record<string, any>) {
    return apiClient.get('/aura/analytics/export', { params, responseType: 'blob' });

  } ;
