import { apiClient } from '@/services';
import type { LeadCaptureForm, FormsFilter, CreateFormData, UpdateFormData } from '../../types';

const BASE_URL = '/api/v1/lead-capture-forms';

export const leadCaptureFormsApi = {
  async getAll(filters: FormsFilter = {}) {
    const params = new URLSearchParams(Object.entries(filters).map(([k, v]) => [k, String(v)]));

    const response = await apiClient.get(`${BASE_URL}?${params}`);

    return (response as any).data as any;
  },

  async getById(id: string) {
    const response = await apiClient.get(`${BASE_URL}/${id}`);

    return (response as any).data as any;
  },

  async create(data: CreateFormData) {
    const response = await apiClient.post(BASE_URL, data);

    return (response as any).data as any;
  },

  async update(id: string, data: UpdateFormData) {
    const response = await apiClient.put(`${BASE_URL}/${id}`, data);

    return (response as any).data as any;
  },

  async delete(id: string) {
    const response = await apiClient.delete(`${BASE_URL}/${id}`);

    return (response as any).data as any;
  },

  async getSubmissions(id: string) {
    const response = await apiClient.get(`${BASE_URL}/${id}/submissions`);

    return (response as any).data as any;
  },

  async getStats(id: string) {
    const response = await apiClient.get(`${BASE_URL}/${id}/stats`);

    return (response as any).data as any;
  } ;
