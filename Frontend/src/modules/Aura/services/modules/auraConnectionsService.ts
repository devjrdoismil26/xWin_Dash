import { apiClient } from '@/services';
import { AuraConnection, AuraConnectionConfig } from '@/types';

export const auraConnectionsService = {
  async getConnections(params?: Record<string, any>) {
    return apiClient.get('/aura/connections', { params });

  },

  async getConnection(id: number) {
    return apiClient.get(`/aura/connections/${id}`);

  },

  async createConnection(data: Partial<AuraConnection>) {
    return apiClient.post('/aura/connections', data);

  },

  async updateConnection(id: number, data: Partial<AuraConnection>) {
    return apiClient.put(`/aura/connections/${id}`, data);

  },

  async deleteConnection(id: number) {
    return apiClient.delete(`/aura/connections/${id}`);

  },

  async connectPlatform(id: number, config: AuraConnectionConfig) {
    return apiClient.post(`/aura/connections/${id}/connect`, config);

  },

  async disconnectPlatform(id: number) {
    return apiClient.post(`/aura/connections/${id}/disconnect`);

  },

  async testConnection(id: number) {
    return apiClient.post(`/aura/connections/${id}/test`);

  } ;
