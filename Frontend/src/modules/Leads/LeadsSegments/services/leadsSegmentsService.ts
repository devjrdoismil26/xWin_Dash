import { apiClient } from '@/services';

export const leadsSegmentsService = {
  async getSegments(params?: Record<string, any>) {
    const response = await apiClient.get('/leads/segments', { params });

    return (response as any).data as any;
  },

  async getSegment(id: number) {
    const response = await apiClient.get(`/leads/segments/${id}`);

    return (response as any).data as any;
  },

  async createSegment(data: unknown) {
    const response = await apiClient.post('/leads/segments', data);

    return (response as any).data as any;
  },

  async updateSegment(id: number, data: unknown) {
    const response = await apiClient.put(`/leads/segments/${id}`, data);

    return (response as any).data as any;
  },

  async deleteSegment(id: number) {
    const response = await apiClient.delete(`/leads/segments/${id}`);

    return (response as any).data as any;
  },

  async getSegmentLeads(id: number, params?: Record<string, any>) {
    const response = await apiClient.get(`/leads/segments/${id}/leads`, { params });

    return (response as any).data as any;
  } ;

export default leadsSegmentsService;
