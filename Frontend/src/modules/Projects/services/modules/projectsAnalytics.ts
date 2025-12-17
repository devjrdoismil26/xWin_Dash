import { apiClient } from '@/services';
import { ProjectMetrics, ProjectAnalytics, ProjectActivity, ProjectReport } from '@/types/projectsTypes';

export const projectsAnalytics = {
  getMetrics: async (projectId: string): Promise<ProjectMetrics> => {
    const response = await apiClient.get(`/projects/${projectId}/metrics`);

    return (response as any).data.data;
  },

  getAnalytics: async (projectId: string, params?: string): Promise<ProjectAnalytics> => {
    const response = await apiClient.get(`/projects/${projectId}/analytics`, { params });

    return (response as any).data.data;
  },

  getActivities: async (projectId: string, page = 1): Promise<ProjectActivity[]> => {
    const response = await apiClient.get(`/projects/${projectId}/activities`, { params: { page } );

    return (response as any).data.data;
  },

  getReports: async (projectId: string): Promise<ProjectReport[]> => {
    const response = await apiClient.get(`/projects/${projectId}/reports`);

    return (response as any).data.data;
  },

  generateReport: async (projectId: string, type: string): Promise<ProjectReport> => {
    const response = await apiClient.post(`/projects/${projectId}/reports`, { type });

    return (response as any).data.data;
  },

  exportData: async (projectId: string, format: string): Promise<Blob> => {
    const response = await apiClient.get(`/projects/${projectId}/export`, {
      params: { format },
      responseType: 'blob'
    });

    return (response as any).data as any;
  } ;
