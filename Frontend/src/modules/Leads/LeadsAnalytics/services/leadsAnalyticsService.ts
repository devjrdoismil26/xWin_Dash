import { apiClient } from '@/services';

export const leadsAnalyticsService = {
  async getMetrics(params?: Record<string, any>) {
    const response = await apiClient.get('/leads/analytics/metrics', { params });

    return (response as any).data as any;
  },

  async getConversionRate(params?: Record<string, any>) {
    const response = await apiClient.get('/leads/analytics/conversion', { params });

    return (response as any).data as any;
  },

  async getSourceAnalytics(params?: Record<string, any>) {
    const response = await apiClient.get('/leads/analytics/sources', { params });

    return (response as any).data as any;
  },

  async getEngagement(leadId: number) {
    const response = await apiClient.get(`/leads/${leadId}/engagement`);

    return (response as any).data as any;
  },

  async exportReport(params?: Record<string, any>) {
    const response = await apiClient.get('/leads/analytics/export', { params, responseType: 'blob' });

    return (response as any).data as any;
  } ;

export default leadsAnalyticsService;
