import { apiClient } from '@/services';
import type { Product, ProductsFilter, CreateProductData, UpdateProductData } from '../../types';

const BASE_URL = '/api/v1/products';

export const productsApi = {
  async getAll(filters: ProductsFilter = {}) {
    const params = new URLSearchParams(Object.entries(filters).map(([k, v]) => [k, String(v)]));

    const response = await apiClient.get(`${BASE_URL}?${params}`);

    return (response as any).data as any;
  },

  async getById(id: string) {
    const response = await apiClient.get(`${BASE_URL}/${id}`);

    return (response as any).data as any;
  },

  async create(data: CreateProductData) {
    const response = await apiClient.post(BASE_URL, data);

    return (response as any).data as any;
  },

  async update(id: string, data: UpdateProductData) {
    const response = await apiClient.put(`${BASE_URL}/${id}`, data);

    return (response as any).data as any;
  },

  async delete(id: string) {
    const response = await apiClient.delete(`${BASE_URL}/${id}`);

    return (response as any).data as any;
  },

  async bulkDelete(ids: string[]) {
    const response = await apiClient.post(`${BASE_URL}/bulk-delete`, { ids });

    return (response as any).data as any;
  },

  async getStats() {
    const response = await apiClient.get(`${BASE_URL}/stats`);

    return (response as any).data as any;
  } ;
