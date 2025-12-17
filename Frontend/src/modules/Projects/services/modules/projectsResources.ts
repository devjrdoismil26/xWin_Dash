import { apiClient } from '@/services';
import { ProjectTemplate, ProjectTimeline, ProjectMilestone, ProjectResource, ProjectBudget, ProjectRisk } from '@/types/projectsTypes';

export const projectsResources = {
  // Templates
  getTemplates: async (): Promise<ProjectTemplate[]> => {
    const response = await apiClient.get('/projects/templates');

    return (response as any).data.data;
  },

  createFromTemplate: async (templateId: string, data: unknown): Promise<any> => {
    const response = await apiClient.post(`/projects/templates/${templateId}/create`, data);

    return (response as any).data.data;
  },

  // Timeline
  getTimeline: async (projectId: string): Promise<ProjectTimeline> => {
    const response = await apiClient.get(`/projects/${projectId}/timeline`);

    return (response as any).data.data;
  },

  updateTimeline: async (projectId: string, data: Partial<ProjectTimeline>): Promise<ProjectTimeline> => {
    const response = await apiClient.put(`/projects/${projectId}/timeline`, data);

    return (response as any).data.data;
  },

  // Milestones
  getMilestones: async (projectId: string): Promise<ProjectMilestone[]> => {
    const response = await apiClient.get(`/projects/${projectId}/milestones`);

    return (response as any).data.data;
  },

  createMilestone: async (projectId: string, data: Partial<ProjectMilestone>): Promise<ProjectMilestone> => {
    const response = await apiClient.post(`/projects/${projectId}/milestones`, data);

    return (response as any).data.data;
  },

  // Resources
  getResources: async (projectId: string): Promise<ProjectResource[]> => {
    const response = await apiClient.get(`/projects/${projectId}/resources`);

    return (response as any).data.data;
  },

  allocateResource: async (projectId: string, data: unknown): Promise<ProjectResource> => {
    const response = await apiClient.post(`/projects/${projectId}/resources`, data);

    return (response as any).data.data;
  },

  // Budget
  getBudget: async (projectId: string): Promise<ProjectBudget> => {
    const response = await apiClient.get(`/projects/${projectId}/budget`);

    return (response as any).data.data;
  },

  updateBudget: async (projectId: string, data: Partial<ProjectBudget>): Promise<ProjectBudget> => {
    const response = await apiClient.put(`/projects/${projectId}/budget`, data);

    return (response as any).data.data;
  },

  // Risks
  getRisks: async (projectId: string): Promise<ProjectRisk[]> => {
    const response = await apiClient.get(`/projects/${projectId}/risks`);

    return (response as any).data.data;
  },

  createRisk: async (projectId: string, data: Partial<ProjectRisk>): Promise<ProjectRisk> => {
    const response = await apiClient.post(`/projects/${projectId}/risks`, data);

    return (response as any).data.data;
  } ;
