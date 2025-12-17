import { apiClient } from '@/services';
import { ProjectCore, ProjectCoreFilters, ProjectCoreMetrics, ProjectCoreActivity, ProjectCoreResponse, ProjectCorePagination, ProjectCoreSearchResult, ProjectStatus } from '../types/projectsCoreTypes';

class ProjectsCoreService {
  private baseUrl = '/api/projects/core';

  // Basic CRUD operations
  async getProjects(filters?: ProjectCoreFilters, pagination?: { page: number; limit: number }): Promise<ProjectCoreSearchResult> {
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
      console.error('Error fetching projects:', error);

      throw error;
    } async getProjectById(id: string): Promise<ProjectCoreResponse<ProjectCore>> {
    try {
      const response = await apiClient.get(`${this.baseUrl}/${id}`);

      return (response as any).data as any;
    } catch (error) {
      console.error('Error fetching project:', error);

      throw error;
    } async createProject(projectData: Partial<ProjectCore>): Promise<ProjectCoreResponse<ProjectCore>> {
    try {
      const response = await apiClient.post(this.baseUrl, projectData);

      return (response as any).data as any;
    } catch (error) {
      console.error('Error creating project:', error);

      throw error;
    } async updateProject(id: string, projectData: Partial<ProjectCore>): Promise<ProjectCoreResponse<ProjectCore>> {
    try {
      const response = await apiClient.put(`${this.baseUrl}/${id}`, projectData);

      return (response as any).data as any;
    } catch (error) {
      console.error('Error updating project:', error);

      throw error;
    } async deleteProject(id: string): Promise<ProjectCoreResponse<boolean>> {
    try {
      const response = await apiClient.delete(`${this.baseUrl}/${id}`);

      return (response as any).data as any;
    } catch (error) {
      console.error('Error deleting project:', error);

      throw error;
    } // Status management
  async updateProjectStatus(id: string, status: ProjectStatus): Promise<ProjectCoreResponse<ProjectCore>> {
    try {
      const response = await apiClient.patch(`${this.baseUrl}/${id}/status`, { status });

      return (response as any).data as any;
    } catch (error) {
      console.error('Error updating project status:', error);

      throw error;
    } async archiveProject(id: string): Promise<ProjectCoreResponse<ProjectCore>> {
    try {
      const response = await apiClient.patch(`${this.baseUrl}/${id}/archive`);

      return (response as any).data as any;
    } catch (error) {
      console.error('Error archiving project:', error);

      throw error;
    } async restoreProject(id: string): Promise<ProjectCoreResponse<ProjectCore>> {
    try {
      const response = await apiClient.patch(`${this.baseUrl}/${id}/restore`);

      return (response as any).data as any;
    } catch (error) {
      console.error('Error restoring project:', error);

      throw error;
    } // Metrics and analytics
  async getProjectMetrics(): Promise<ProjectCoreResponse<ProjectCoreMetrics>> {
    try {
      const response = await apiClient.get(`${this.baseUrl}/metrics`);

      return (response as any).data as any;
    } catch (error) {
      console.error('Error fetching project metrics:', error);

      throw error;
    } async getProjectActivity(id: string, limit?: number): Promise<ProjectCoreResponse<ProjectCoreActivity[]>> {
    try {
      const params = limit ? `?limit=${limit}` : '';
      const response = await apiClient.get(`${this.baseUrl}/${id}/activity${params}`);

      return (response as any).data as any;
    } catch (error) {
      console.error('Error fetching project activity:', error);

      throw error;
    } // Search and filtering
  async searchProjects(query: string, filters?: ProjectCoreFilters): Promise<ProjectCoreSearchResult> {
    try {
      const params = new URLSearchParams();

      params.append('q', query);

      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            params.append(key, value.toString());

          } );

      }

      const response = await apiClient.get(`${this.baseUrl}/search?${params.toString()}`);

      return (response as any).data as any;
    } catch (error) {
      console.error('Error searching projects:', error);

      throw error;
    } // Bulk operations
  async bulkUpdateStatus(projectIds: string[], status: ProjectStatus): Promise<ProjectCoreResponse<boolean>> {
    try {
      const response = await apiClient.patch(`${this.baseUrl}/bulk/status`, {
        projectIds,
        status
      });

      return (response as any).data as any;
    } catch (error) {
      console.error('Error bulk updating project status:', error);

      throw error;
    } async bulkDelete(projectIds: string[]): Promise<ProjectCoreResponse<boolean>> {
    try {
      const response = await apiClient.delete(`${this.baseUrl}/bulk`, {
        data: { projectIds } );

      return (response as any).data as any;
    } catch (error) {
      console.error('Error bulk deleting projects:', error);

      throw error;
    } // Export functionality
  async exportProjects(format: 'csv' | 'excel' | 'pdf', filters?: ProjectCoreFilters): Promise<Blob> {
    try {
      const params = new URLSearchParams();

      params.append('format', format);

      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            params.append(key, value.toString());

          } );

      }

      const response = await apiClient.get(`${this.baseUrl}/export?${params.toString()}`, {
        responseType: 'blob'
      });

      return (response as any).data as any;
    } catch (error) {
      console.error('Error exporting projects:', error);

      throw error;
    } // Validation
  async validateProjectName(name: string, excludeId?: string): Promise<ProjectCoreResponse<{ valid: boolean; message?: string }>> {
    try {
      const params = new URLSearchParams();

      params.append('name', name);

      if (excludeId) {
        params.append('excludeId', excludeId);

      }

      const response = await apiClient.get(`${this.baseUrl}/validate/name?${params.toString()}`);

      return (response as any).data as any;
    } catch (error) {
      console.error('Error validating project name:', error);

      throw error;
    } // Cache management
  async clearCache(): Promise<ProjectCoreResponse<boolean>> {
    try {
      const response = await apiClient.delete(`${this.baseUrl}/cache`);

      return (response as any).data as any;
    } catch (error) {
      console.error('Error clearing cache:', error);

      throw error;
    } // Health check
  async healthCheck(): Promise<ProjectCoreResponse<{ status: string; timestamp: string }>> {
    try {
      const response = await apiClient.get(`${this.baseUrl}/health`);

      return (response as any).data as any;
    } catch (error) {
      console.error('Error checking service health:', error);

      throw error;
    } }

export default new ProjectsCoreService();
