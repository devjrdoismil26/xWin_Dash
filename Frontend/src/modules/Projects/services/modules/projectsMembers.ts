import { apiClient } from '@/services';
import { ProjectMember, ProjectRole, ProjectPermission } from '@/types/projectsTypes';

export const projectsMembers = {
  getMembers: async (projectId: string): Promise<ProjectMember[]> => {
    const response = await apiClient.get(`/projects/${projectId}/members`);

    return (response as any).data.data;
  },

  addMember: async (projectId: string, data: { user_id: string; role: ProjectRole; permissions: ProjectPermission[] }): Promise<ProjectMember> => {
    const response = await apiClient.post(`/projects/${projectId}/members`, data);

    return (response as any).data.data;
  },

  updateMember: async (projectId: string, memberId: string, data: Partial<{ role: ProjectRole; permissions: ProjectPermission[] }>): Promise<ProjectMember> => {
    const response = await apiClient.put(`/projects/${projectId}/members/${memberId}`, data);

    return (response as any).data.data;
  },

  removeMember: async (projectId: string, memberId: string): Promise<void> => {
    await apiClient.delete(`/projects/${projectId}/members/${memberId}`);

  },

  checkPermission: async (projectId: string, permission: ProjectPermission): Promise<boolean> => {
    const response = await apiClient.get(`/projects/${projectId}/permissions/check`, { params: { permission } );

    return (response as any).data.data.has_permission;
  },

  getUserPermissions: async (projectId: string): Promise<ProjectPermission[]> => {
    const response = await apiClient.get(`/projects/${projectId}/permissions`);

    return (response as any).data.data;
  } ;
