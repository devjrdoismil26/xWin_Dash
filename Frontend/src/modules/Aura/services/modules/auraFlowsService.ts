import { apiClient } from '@/services';
import { AuraFlow } from '@/types';

export const auraFlowsService = {
  async getFlows(params?: Record<string, any>) {
    return apiClient.get('/aura/flows', { params });

  },

  async getFlow(id: number) {
    return apiClient.get(`/aura/flows/${id}`);

  },

  async createFlow(data: Partial<AuraFlow>) {
    return apiClient.post('/aura/flows', data);

  },

  async updateFlow(id: number, data: Partial<AuraFlow>) {
    return apiClient.put(`/aura/flows/${id}`, data);

  },

  async deleteFlow(id: number) {
    return apiClient.delete(`/aura/flows/${id}`);

  },

  async activateFlow(id: number) {
    return apiClient.post(`/aura/flows/${id}/activate`);

  },

  async deactivateFlow(id: number) {
    return apiClient.post(`/aura/flows/${id}/deactivate`);

  },

  async executeFlow(id: number, data?: Record<string, any>) {
    return apiClient.post(`/aura/flows/${id}/execute`, data);

  } ;
