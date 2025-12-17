import { apiClient } from '@/services';

export const leadsCustomFieldsService = {
  async getFields(params?: Record<string, any>) {
    const response = await apiClient.get('/leads/custom-fields', { params });

    return (response as any).data as any;
  },

  async getField(id: number) {
    const response = await apiClient.get(`/leads/custom-fields/${id}`);

    return (response as any).data as any;
  },

  async createField(data: unknown) {
    const response = await apiClient.post('/leads/custom-fields', data);

    return (response as any).data as any;
  },

  async updateField(id: number, data: unknown) {
    const response = await apiClient.put(`/leads/custom-fields/${id}`, data);

    return (response as any).data as any;
  },

  async deleteField(id: number) {
    const response = await apiClient.delete(`/leads/custom-fields/${id}`);

    return (response as any).data as any;
  } ;

export default leadsCustomFieldsService;
