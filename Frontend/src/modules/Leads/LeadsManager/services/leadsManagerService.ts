import { apiClient } from '@/services';

export const leadsManagerService = {
  async getLeads(params?: Record<string, any>) {
    const response = await apiClient.get('/leads', { params });

    return (response as any).data as any;
  },

  async getLead(id: number) {
    const response = await apiClient.get(`/leads/${id}`);

    return (response as any).data as any;
  },

  async createLead(data: unknown) {
    const response = await apiClient.post('/leads', data);

    return (response as any).data as any;
  },

  async updateLead(id: number, data: unknown) {
    const response = await apiClient.put(`/leads/${id}`, data);

    return (response as any).data as any;
  },

  async deleteLead(id: number) {
    const response = await apiClient.delete(`/leads/${id}`);

    return (response as any).data as any;
  },

  async updateScore(id: number, score: number) {
    const response = await apiClient.post(`/leads/${id}/score`, { score });

    return (response as any).data as any;
  },

  async assignTo(id: number, userId: number) {
    const response = await apiClient.post(`/leads/${id}/assign`, { user_id: userId });

    return (response as any).data as any;
  } ;

export default leadsManagerService;
