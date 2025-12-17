import { ApiResponse } from '@/types/common';
import { analyticsApiService } from './analyticsApiService';
import { analyticsCacheService } from './analyticsCacheService';
import { analyticsValidationService } from './analyticsValidationService';

export const analyticsService = {
  async fetchMetrics(params: unknown) {
    const cached = analyticsCacheService.get('metrics', params);

    if (cached) return cached;

    const data = await analyticsApiService.getMetrics(params);

    analyticsCacheService.set('metrics', params, data);

    return data;
  },

  async fetchReports(params: unknown) {
    const cached = analyticsCacheService.get('reports', params);

    if (cached) return cached;

    const data = await analyticsApiService.getReports(params);

    analyticsCacheService.set('reports', params, data);

    return data;
  },

  async createReport(data: unknown) {
    analyticsValidationService.validateReport(data);

    return await analyticsApiService.createReport(data);

  },

  async updateReport(id: string, data: unknown) {
    analyticsValidationService.validateReport(data);

    return await analyticsApiService.updateReport(id, data);

  },

  async deleteReport(id: string) {
    return await analyticsApiService.deleteReport(id);

  },

  clearCache() {
    analyticsCacheService.clear();

  } ;

export { getCurrentProjectId };

export { getAuthHeaders };

export default analyticsService;
