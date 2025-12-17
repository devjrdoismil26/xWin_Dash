import { apiClient } from '@/services';
import { Project, ProjectFormData, ProjectFilters, ProjectResponse } from '@/types/projectsTypes';

export const projectsApi = {
  getAll: async (filters?: ProjectFilters, page = 1, perPage = 10): Promise<ProjectResponse> => {
    const response = await apiClient.get('/projects', { params: { ...filters, page, per_page: perPage } );

    return (response as any).data as any;
  },

  getById: async (id: string): Promise<Project> => {
    const response = await apiClient.get(`/projects/${id}`);

    return (response as any).data.data;
  },

  create: async (data: ProjectFormData): Promise<Project> => {
    const response = await apiClient.post('/projects', data);

    return (response as any).data.data;
  },

  update: async (id: string, data: Partial<ProjectFormData>): Promise<Project> => {
    const response = await apiClient.put(`/projects/${id}`, data);

    return (response as any).data.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/projects/${id}`);

  },

  archive: async (id: string): Promise<Project> => {
    const response = await apiClient.post(`/projects/${id}/archive`);

    return (response as any).data.data;
  },

  restore: async (id: string): Promise<Project> => {
    const response = await apiClient.post(`/projects/${id}/restore`);

    return (response as any).data.data;
  },

  duplicate: async (id: string, name: string): Promise<Project> => {
    const response = await apiClient.post(`/projects/${id}/duplicate`, { name });

    return (response as any).data.data;
  } ;
