import { apiClient } from '@/services';
import type { Lead, LeadsFilter } from '@/types/leads';

const BASE_URL = '/api/v1/leads';

export const leadsApi = {
  async getAll(filters: LeadsFilter = {}) {
    const params = new URLSearchParams(Object.entries(filters).map(([k, v]) => [k, String(v)]));

    const response = await apiClient.get(`${BASE_URL}?${params}`);

    return (response as any).data as any;
  },

  async getById(id: string) {
    const response = await apiClient.get(`${BASE_URL}/${id}`);

    return (response as any).data as any;
  },

  async update(id: string, data: Partial<Lead>) {
    const response = await apiClient.put(`${BASE_URL}/${id}`, data);

    return (response as any).data as any;
  },

  async delete(id: string) {
    const response = await apiClient.delete(`${BASE_URL}/${id}`);

    return (response as any).data as any;
  },

  async export(filters: LeadsFilter = {}) {
    const response = await apiClient.post(`${BASE_URL}/export`, filters, { responseType: 'blob' });

    return (response as any).data as any;
  },

  async getStats() {
    const response = await apiClient.get(`${BASE_URL}/stats`);

    return (response as any).data as any;
  } ;
