import { apiClient } from '@/services';
import { ProjectManager, ProjectManagerFilters, ProjectManagerMetrics, ProjectMember, ProjectInvitation, ProjectRole, ProjectPermission, ProjectSettings, ProjectManagerResponse } from '../types/projectsManagerTypes';

class ProjectsManagerService {
  private baseUrl = '/api/projects/manager';

  // Project management operations
  async getManagedProjects(filters?: ProjectManagerFilters, pagination?: { page: number; limit: number }): Promise<ProjectManagerResponse<ProjectManager[]>> {
    try {
      const params = new URLSearchParams();

      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            params.append(key, value.toString());

          } );

      }
      
      if (pagination) {
        params.append('page', pagination.page.toString());

        params.append('limit', pagination.limit.toString());

      }

      const response = await apiClient.get(`${this.baseUrl}?${params.toString()}`);

      return (response as any).data as any;
    } catch (error) {
      console.error('Error fetching managed projects:', error);

      throw error;
    } async getProjectManager(id: string): Promise<ProjectManagerResponse<ProjectManager>> {
    try {
      const response = await apiClient.get(`${this.baseUrl}/${id}`);

      return (response as any).data as any;
    } catch (error) {
      console.error('Error fetching project manager:', error);

      throw error;
    } async updateProjectMode(id: string, mode: 'normal' | 'universe'): Promise<ProjectManagerResponse<ProjectManager>> {
    try {
      const response = await apiClient.patch(`${this.baseUrl}/${id}/mode`, { mode });

      return (response as any).data as any;
    } catch (error) {
      console.error('Error updating project mode:', error);

      throw error;
    } async updateProjectModules(id: string, modules: string[]): Promise<ProjectManagerResponse<ProjectManager>> {
    try {
      const response = await apiClient.patch(`${this.baseUrl}/${id}/modules`, { modules });

      return (response as any).data as any;
    } catch (error) {
      console.error('Error updating project modules:', error);

      throw error;
    } // Member management
  async getProjectMembers(projectId: string): Promise<ProjectManagerResponse<ProjectMember[]>> {
    try {
      const response = await apiClient.get(`${this.baseUrl}/${projectId}/members`);

      return (response as any).data as any;
    } catch (error) {
      console.error('Error fetching project members:', error);

      throw error;
    } async addProjectMember(projectId: string, memberData: {
    userId: string;
    role: ProjectRole;
    permissions: ProjectPermission[];
  }): Promise<ProjectManagerResponse<ProjectMember>> {
    try {
      const response = await apiClient.post(`${this.baseUrl}/${projectId}/members`, memberData);

      return (response as any).data as any;
    } catch (error) {
      console.error('Error adding project member:', error);

      throw error;
    } async updateProjectMember(projectId: string, memberId: string, memberData: {
    role?: ProjectRole;
    permissions?: ProjectPermission[];
    status?: 'active' | 'inactive';
  }): Promise<ProjectManagerResponse<ProjectMember>> {
    try {
      const response = await apiClient.put(`${this.baseUrl}/${projectId}/members/${memberId}`, memberData);

      return (response as any).data as any;
    } catch (error) {
      console.error('Error updating project member:', error);

      throw error;
    } async removeProjectMember(projectId: string, memberId: string): Promise<ProjectManagerResponse<boolean>> {
    try {
      const response = await apiClient.delete(`${this.baseUrl}/${projectId}/members/${memberId}`);

      return (response as any).data as any;
    } catch (error) {
      console.error('Error removing project member:', error);

      throw error;
    } // Invitation management
  async sendProjectInvitation(projectId: string, invitationData: {
    email: string;
    role: ProjectRole;
    permissions: ProjectPermission[];
    message?: string;
  }): Promise<ProjectManagerResponse<ProjectInvitation>> {
    try {
      const response = await apiClient.post(`${this.baseUrl}/${projectId}/invitations`, invitationData);

      return (response as any).data as any;
    } catch (error) {
      console.error('Error sending project invitation:', error);

      throw error;
    } async getProjectInvitations(projectId: string): Promise<ProjectManagerResponse<ProjectInvitation[]>> {
    try {
      const response = await apiClient.get(`${this.baseUrl}/${projectId}/invitations`);

      return (response as any).data as any;
    } catch (error) {
      console.error('Error fetching project invitations:', error);

      throw error;
    } async cancelProjectInvitation(projectId: string, invitationId: string): Promise<ProjectManagerResponse<boolean>> {
    try {
      const response = await apiClient.delete(`${this.baseUrl}/${projectId}/invitations/${invitationId}`);

      return (response as any).data as any;
    } catch (error) {
      console.error('Error cancelling project invitation:', error);

      throw error;
    } async resendProjectInvitation(projectId: string, invitationId: string): Promise<ProjectManagerResponse<ProjectInvitation>> {
    try {
      const response = await apiClient.post(`${this.baseUrl}/${projectId}/invitations/${invitationId}/resend`);

      return (response as any).data as any;
    } catch (error) {
      console.error('Error resending project invitation:', error);

      throw error;
    } // Settings management
  async getProjectSettings(projectId: string): Promise<ProjectManagerResponse<ProjectSettings>> {
    try {
      const response = await apiClient.get(`${this.baseUrl}/${projectId}/settings`);

      return (response as any).data as any;
    } catch (error) {
      console.error('Error fetching project settings:', error);

      throw error;
    } async updateProjectSettings(projectId: string, settings: Partial<ProjectSettings>): Promise<ProjectManagerResponse<ProjectSettings>> {
    try {
      const response = await apiClient.put(`${this.baseUrl}/${projectId}/settings`, settings);

      return (response as any).data as any;
    } catch (error) {
      console.error('Error updating project settings:', error);

      throw error;
    } async updateNotificationSettings(projectId: string, notificationSettings: Partial<ProjectSettings['notifications']>): Promise<ProjectManagerResponse<ProjectSettings>> {
    try {
      const response = await apiClient.patch(`${this.baseUrl}/${projectId}/settings/notifications`, notificationSettings);

      return (response as any).data as any;
    } catch (error) {
      console.error('Error updating notification settings:', error);

      throw error;
    } async updatePrivacySettings(projectId: string, privacySettings: Partial<ProjectSettings['privacy']>): Promise<ProjectManagerResponse<ProjectSettings>> {
    try {
      const response = await apiClient.patch(`${this.baseUrl}/${projectId}/settings/privacy`, privacySettings);

      return (response as any).data as any;
    } catch (error) {
      console.error('Error updating privacy settings:', error);

      throw error;
    } async updateIntegrationSettings(projectId: string, integrationSettings: Partial<ProjectSettings['integrations']>): Promise<ProjectManagerResponse<ProjectSettings>> {
    try {
      const response = await apiClient.patch(`${this.baseUrl}/${projectId}/settings/integrations`, integrationSettings);

      return (response as any).data as any;
    } catch (error) {
      console.error('Error updating integration settings:', error);

      throw error;
    } async updateAutomationSettings(projectId: string, automationSettings: Partial<ProjectSettings['automation']>): Promise<ProjectManagerResponse<ProjectSettings>> {
    try {
      const response = await apiClient.patch(`${this.baseUrl}/${projectId}/settings/automation`, automationSettings);

      return (response as any).data as any;
    } catch (error) {
      console.error('Error updating automation settings:', error);

      throw error;
    } // Statistics and metrics
  async getProjectStatistics(projectId: string): Promise<ProjectManagerResponse<ProjectManager['statistics']>> {
    try {
      const response = await apiClient.get(`${this.baseUrl}/${projectId}/statistics`);

      return (response as any).data as any;
    } catch (error) {
      console.error('Error fetching project statistics:', error);

      throw error;
    } async getManagerMetrics(): Promise<ProjectManagerResponse<ProjectManagerMetrics>> {
    try {
      const response = await apiClient.get(`${this.baseUrl}/metrics`);

      return (response as any).data as any;
    } catch (error) {
      console.error('Error fetching manager metrics:', error);

      throw error;
    } // Bulk operations
  async bulkUpdateMemberRoles(projectId: string, updates: Array<{
    memberId: string;
    role: ProjectRole;
    permissions: ProjectPermission[];
  }>): Promise<ProjectManagerResponse<boolean>> {
    try {
      const response = await apiClient.patch(`${this.baseUrl}/${projectId}/members/bulk`, { updates });

      return (response as any).data as any;
    } catch (error) {
      console.error('Error bulk updating member roles:', error);

      throw error;
    } async bulkRemoveMembers(projectId: string, memberIds: string[]): Promise<ProjectManagerResponse<boolean>> {
    try {
      const response = await apiClient.delete(`${this.baseUrl}/${projectId}/members/bulk`, {
        data: { memberIds } );

      return (response as any).data as any;
    } catch (error) {
      console.error('Error bulk removing members:', error);

      throw error;
    } // Permission management
  async checkUserPermission(projectId: string, permission: ProjectPermission): Promise<ProjectManagerResponse<{ hasPermission: boolean }>> {
    try {
      const response = await apiClient.get(`${this.baseUrl}/${projectId}/permissions/check`, {
        params: { permission } );

      return (response as any).data as any;
    } catch (error) {
      console.error('Error checking user permission:', error);

      throw error;
    } async getUserPermissions(projectId: string): Promise<ProjectManagerResponse<ProjectPermission[]>> {
    try {
      const response = await apiClient.get(`${this.baseUrl}/${projectId}/permissions`);

      return (response as any).data as any;
    } catch (error) {
      console.error('Error fetching user permissions:', error);

      throw error;
    } // Activity tracking
  async getProjectActivity(projectId: string, limit?: number): Promise<ProjectManagerResponse<unknown[]>> {
    try {
      const params = limit ? `?limit=${limit}` : '';
      const response = await apiClient.get(`${this.baseUrl}/${projectId}/activity${params}`);

      return (response as any).data as any;
    } catch (error) {
      console.error('Error fetching project activity:', error);

      throw error;
    } // Export functionality
  async exportProjectMembers(projectId: string, format: 'csv' | 'excel' | 'pdf'): Promise<Blob> {
    try {
      const response = await apiClient.get(`${this.baseUrl}/${projectId}/members/export`, {
        params: { format },
        responseType: 'blob'
      });

      return (response as any).data as any;
    } catch (error) {
      console.error('Error exporting project members:', error);

      throw error;
    } // Health check
  async healthCheck(): Promise<ProjectManagerResponse<{ status: string; timestamp: string }>> {
    try {
      const response = await apiClient.get(`${this.baseUrl}/health`);

      return (response as any).data as any;
    } catch (error) {
      console.error('Error checking service health:', error);

      throw error;
    } }

export default new ProjectsManagerService();
