import { apiClient } from '@/services';
import type { UniverseProject, UniverseTemplate, UniverseSnapshot, UniverseAnalytics, AISuggestion } from '../types/universe';

export const universeService = {
  // Projects/Instances
  async getProjects(params?: Record<string, any>) {
    return apiClient.get('/universe/projects', { params });

  },

  async getProject(id: string) {
    return apiClient.get(`/universe/projects/${id}`);

  },

  async createProject(data: unknown) {
    return apiClient.post('/universe/projects', data);

  },

  async updateProject(id: string, data: unknown) {
    return apiClient.put(`/universe/projects/${id}`, data);

  },

  async deleteProject(id: string) {
    return apiClient.delete(`/universe/projects/${id}`);

  },

  // Aliases for compatibility with store
  async getInstances(params?: Record<string, any>) {
    return this.getProjects(params);

  },

  async getInstanceById(id: string) {
    return this.getProject(id);

  },

  async createInstance(data: unknown) {
    return this.createProject(data);

  },

  async updateInstance(id: string, data: unknown) {
    return this.updateProject(id, data);

  },

  async deleteInstance(id: string) {
    return this.deleteProject(id);

  },

  // Templates
  async getTemplates(params?: Record<string, any>) {
    return apiClient.get('/universe/templates', { params });

  },

  async useTemplate(templateId: string, projectData?: Record<string, any>) {
    return apiClient.post(`/universe/templates/${templateId}/use`, projectData);

  },

  // AI Suggestions
  async getAISuggestions(projectId: string, context?: Record<string, any>) {
    return apiClient.post(`/universe/projects/${projectId}/ai-suggestions`, context);

  },

  async personalizeTemplate(templateId: string, preferences: Record<string, any>) {
    return apiClient.post(`/universe/templates/${templateId}/personalize`, preferences);

  },

  // Analytics
  async getDashboardData(projectId?: string) {
    const url = projectId 
      ? `/universe/projects/${projectId}/dashboard`
      : '/universe/dashboard';
    return apiClient.get(url);

  },

  async getAnalyticsStatus(projectId?: string) {
    const url = projectId
      ? `/universe/projects/${projectId}/analytics/status`
      : '/universe/analytics/status';
    return apiClient.get(url);

  },

  // Snapshots
  async getSnapshots(projectId: string) {
    return apiClient.get(`/universe/projects/${projectId}/snapshots`);

  },

  async createSnapshot(projectId: string, data: Record<string, any>) {
    return apiClient.post(`/universe/projects/${projectId}/snapshots`, data);

  } ;

export default universeService;
