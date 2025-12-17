import { apiClient } from '@/services';

export const productsService = {
  async getProducts(params?: Record<string, any>) {
    const response = await apiClient.get('/products', { params });

    return (response as any).data as any;
  },

  async getProduct(id: string) {
    const response = await apiClient.get(`/products/${id}`);

    return (response as any).data as any;
  },

  async createProduct(data: unknown) {
    const response = await apiClient.post('/products', data);

    return (response as any).data as any;
  },

  async updateProduct(id: string, data: unknown) {
    const response = await apiClient.put(`/products/${id}`, data);

    return (response as any).data as any;
  },

  async deleteProduct(id: string) {
    const response = await apiClient.delete(`/products/${id}`);

    return (response as any).data as any;
  },

  async getVariations(productId: string) {
    const response = await apiClient.get(`/products/${productId}/variations`);

    return (response as any).data as any;
  },

  async updateStock(id: string, quantity: number) {
    const response = await apiClient.post(`/products/${id}/stock`, { quantity });

    return (response as any).data as any;
  } ;

export const getCurrentProjectId = (): string | null => {
  return localStorage.getItem('currentProjectId');};

export const getAuthHeaders = (): Record<string, string> => {
  const token = localStorage.getItem('authToken');

  return token ? { Authorization: `Bearer ${token}` } : {};
};

export default productsService;
