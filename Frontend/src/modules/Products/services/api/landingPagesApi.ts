import { apiClient } from '@/services';
import type { LandingPage, LandingPagesFilter, CreateLandingPageData, UpdateLandingPageData } from '../../types';

const BASE_URL = '/api/v1/landing-pages';

export const landingPagesApi = {
  async getAll(filters: LandingPagesFilter = {}) {
    const params = new URLSearchParams(Object.entries(filters).map(([k, v]) => [k, String(v)]));

    const response = await apiClient.get(`${BASE_URL}?${params}`);

    return (response as any).data as any;
  },

  async getById(id: string) {
    const response = await apiClient.get(`${BASE_URL}/${id}`);

    return (response as any).data as any;
  },

  async getBySlug(slug: string) {
    const response = await apiClient.get(`${BASE_URL}/slug/${slug}`);

    return (response as any).data as any;
  },

  async create(data: CreateLandingPageData) {
    const response = await apiClient.post(BASE_URL, data);

    return (response as any).data as any;
  },

  async update(id: string, data: UpdateLandingPageData) {
    const response = await apiClient.put(`${BASE_URL}/${id}`, data);

    return (response as any).data as any;
  },

  async delete(id: string) {
    const response = await apiClient.delete(`${BASE_URL}/${id}`);

    return (response as any).data as any;
  },

  async publish(id: string) {
    const response = await apiClient.post(`${BASE_URL}/${id}/publish`);

    return (response as any).data as any;
  },

  async unpublish(id: string) {
    const response = await apiClient.post(`${BASE_URL}/${id}/unpublish`);

    return (response as any).data as any;
  },

  async getStats(id: string) {
    const response = await apiClient.get(`${BASE_URL}/${id}/stats`);

    return (response as any).data as any;
  } ;
