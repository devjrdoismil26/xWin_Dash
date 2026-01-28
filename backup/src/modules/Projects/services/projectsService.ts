import { apiClient } from '@/services';
import {
  Project,
  ProjectFormData,
  ProjectFilters,
  ProjectMetrics,
  ProjectActivity,
  ProjectTemplate,
  ProjectInvitation,
  ProjectTask,
  ProjectMilestone,
  ProjectFile,
  ProjectComment,
  ProjectTag,
  ProjectCategory,
  ProjectBudget,
  ProjectTimeEntry,
  ProjectReport,
  ProjectDashboard,
  ProjectIntegration,
  ProjectWebhook,
  ProjectExport,
  ProjectAnalytics,
  ProjectResponse,
  ProjectPagination,
  ProjectSearchResult,
  ProjectStatus,
  ProjectUser,
  ProjectMember,
  ProjectRole,
  ProjectPermission,
  ProjectSettings,
  ProjectSortBy,
  ProjectSortOrder,
  ProjectActivityType,
  ProjectTemplateCategory,
  ProjectTaskStatus,
  ProjectTaskPriority,
  ProjectReportType,
  ProjectDashboardWidgetType,
  ProjectWebhookEvent,
  ProjectExportFormat,
  ProjectExportStatus,
  ProjectAnalyticsEvent,
  // New endpoint types
  ProjectTemplateAdvanced,
  ProjectTimeline,
  ProjectMilestoneAdvanced,
  ProjectResource,
  ProjectBudgetAdvanced,
  ProjectRisk,
  ProjectTemplateResponse,
  ProjectTimelineResponse,
  ProjectMilestoneResponse,
  ProjectResourceResponse,
  ProjectBudgetResponse,
  ProjectRiskResponse
} from '../types/projectsTypes';

export interface ProjectStats {
  total_projects: number;
  active_projects: number;
  inactive_projects: number;
  archived_projects: number;
  projects_by_status: { [status: string]: number };
  projects_by_month: Array<{
    month: string;
    count: number;
  }>;
  recent_projects: Project[];
  top_owners: Array<{
    owner_id: string;
    owner_name: string;
    project_count: number;
  }>;
}

export interface ProjectMember {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  permissions: string[];
  joined_at: string;
}

export interface ProjectActivity {
  id: string;
  project_id: string;
  user_id: string;
  user_name: string;
  action: string;
  description: string;
  metadata?: any;
  created_at: string;
}

export interface ProjectData {
  id: string;
  [key: string]: any;
}

export interface ProjectResponse {
  success: boolean;
  data?: ProjectData | ProjectData[];
  message?: string;
  error?: string;
}

class ProjectsService {
  private api = apiClient;

  // ===== CRUD OPERATIONS =====
  async getProjects(filters: ProjectFilters = {}): Promise<ProjectResponse> {
    try {
      const response = await this.api.get('/projects', { params: filters });
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async getProject(id: string): Promise<ProjectResponse> {
    try {
      const response = await this.api.get(`/projects/${id}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async createProject(data: ProjectFormData): Promise<ProjectResponse> {
    try {
      const response = await this.api.post('/projects', data);
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async updateProject(id: string, data: Partial<ProjectFormData>): Promise<ProjectResponse> {
    try {
      const response = await this.api.put(`/projects/${id}`, data);
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async deleteProject(id: string): Promise<ProjectResponse> {
    try {
      const response = await this.api.delete(`/projects/${id}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // ===== PROJECT ACTIONS =====
  async duplicateProject(id: string, newName?: string): Promise<ProjectResponse> {
    try {
      const response = await this.api.post(`/projects/${id}/duplicate`, { name: newName });
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async archiveProject(id: string): Promise<ProjectResponse> {
    try {
      const response = await this.api.put(`/projects/${id}/archive`);
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async restoreProject(id: string): Promise<ProjectResponse> {
    try {
      const response = await this.api.put(`/projects/${id}/restore`);
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async transferOwnership(id: string, newOwnerId: string): Promise<ProjectResponse> {
    try {
      const response = await this.api.put(`/projects/${id}/transfer-ownership`, { 
        new_owner_id: newOwnerId 
      });
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // ===== MEMBER MANAGEMENT =====
  async getProjectMembers(id: string): Promise<ProjectResponse> {
    try {
      const response = await this.api.get(`/projects/${id}/members`);
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async addProjectMember(id: string, userId: string, role: string): Promise<ProjectResponse> {
    try {
      const response = await this.api.post(`/projects/${id}/members`, { 
        user_id: userId, 
        role 
      });
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async updateProjectMember(id: string, userId: string, role: string): Promise<ProjectResponse> {
    try {
      const response = await this.api.put(`/projects/${id}/members/${userId}`, { role });
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async removeProjectMember(id: string, userId: string): Promise<ProjectResponse> {
    try {
      const response = await this.api.delete(`/projects/${id}/members/${userId}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // ===== ACTIVITIES =====
  async getProjectActivities(id: string, params: any = {}): Promise<ProjectResponse> {
    try {
      const response = await this.api.get(`/projects/${id}/activities`, { params });
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async recordProjectActivity(id: string, activity: any): Promise<ProjectResponse> {
    try {
      const response = await this.api.post(`/projects/${id}/activities`, activity);
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // ===== STATISTICS =====
  async getProjectStats(params: any = {}): Promise<ProjectResponse> {
    try {
      const response = await this.api.get('/projects/stats', { params });
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // ===== BULK OPERATIONS =====
  async bulkUpdateProjects(ids: string[], updates: any): Promise<ProjectResponse> {
    try {
      const response = await this.api.post('/projects/bulk-update', { ids, updates });
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async bulkDeleteProjects(ids: string[]): Promise<ProjectResponse> {
    try {
      const response = await this.api.post('/projects/bulk-delete', { ids });
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async bulkArchiveProjects(ids: string[]): Promise<ProjectResponse> {
    try {
      const response = await this.api.post('/projects/bulk-archive', { ids });
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // ===== UTILITY METHODS =====
  formatProjectStatus(status: string): string {
    const statusMap: { [key: string]: string } = {
      active: 'Ativo',
      inactive: 'Inativo',
      archived: 'Arquivado'
    };
    return statusMap[status] || status;
  }

  getStatusColor(status: string): string {
    const colorMap: { [key: string]: string } = {
      active: 'green',
      inactive: 'yellow',
      archived: 'gray'
    };
    return colorMap[status] || 'gray';
  }

  formatMemberRole(role: string): string {
    const roleMap: { [key: string]: string } = {
      owner: 'Proprietário',
      admin: 'Administrador',
      member: 'Membro',
      viewer: 'Visualizador'
    };
    return roleMap[role] || role;
  }

  getRoleColor(role: string): string {
    const colorMap: { [key: string]: string } = {
      owner: 'purple',
      admin: 'blue',
      member: 'green',
      viewer: 'gray'
    };
    return colorMap[role] || 'gray';
  }

  validateProjectData(data: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!data.name || data.name.trim().length === 0) {
      errors.push('Nome do projeto é obrigatório');
    }

    if (data.name && data.name.length > 100) {
      errors.push('Nome do projeto deve ter no máximo 100 caracteres');
    }

    if (data.description && data.description.length > 500) {
      errors.push('Descrição deve ter no máximo 500 caracteres');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  formatProjectName(project: any): string {
    return project.name || 'Projeto sem nome';
  }

  getProjectInitials(project: any): string {
    const name = this.formatProjectName(project);
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  calculateProjectAge(project: any): string {
    const created = new Date(project.created_at);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - created.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 dia';
    if (diffDays < 30) return `${diffDays} dias`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} meses`;
    return `${Math.floor(diffDays / 365)} anos`;
  }

  getProjectHealth(project: any): 'healthy' | 'warning' | 'critical' {
    const updated = new Date(project.updated_at);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - updated.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 7) return 'healthy';
    if (diffDays <= 30) return 'warning';
    return 'critical';
  }

  getHealthColor(health: string): string {
    const colorMap: { [key: string]: string } = {
      healthy: 'green',
      warning: 'yellow',
      critical: 'red'
    };
    return colorMap[health] || 'gray';
  }

  // ===== TEMPLATES - NEW ENDPOINTS =====
  async getTemplates(): Promise<ProjectTemplateResponse> {
    try {
      const response = await this.api.get('/projects/templates');
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async createTemplate(data: any): Promise<ProjectTemplateResponse> {
    try {
      const response = await this.api.post('/projects/templates', data);
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async getTemplate(id: string): Promise<ProjectTemplateResponse> {
    try {
      const response = await this.api.get(`/projects/templates/${id}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async updateTemplate(id: string, data: any): Promise<ProjectTemplateResponse> {
    try {
      const response = await this.api.put(`/projects/templates/${id}`, data);
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async deleteTemplate(id: string): Promise<ProjectTemplateResponse> {
    try {
      const response = await this.api.delete(`/projects/templates/${id}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // ===== TIMELINE - NEW ENDPOINTS =====
  async getTimeline(projectId: string): Promise<ProjectTimelineResponse> {
    try {
      const response = await this.api.get(`/projects/${projectId}/timeline`);
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // ===== MILESTONES - NEW ENDPOINTS =====
  async getMilestones(projectId: string): Promise<ProjectMilestoneResponse> {
    try {
      const response = await this.api.get(`/projects/${projectId}/milestones`);
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async createMilestone(projectId: string, data: any): Promise<ProjectMilestoneResponse> {
    try {
      const response = await this.api.post(`/projects/${projectId}/milestones`, data);
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async updateMilestone(projectId: string, milestoneId: string, data: any): Promise<ProjectMilestoneResponse> {
    try {
      const response = await this.api.put(`/projects/${projectId}/milestones/${milestoneId}`, data);
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async deleteMilestone(projectId: string, milestoneId: string): Promise<ProjectMilestoneResponse> {
    try {
      const response = await this.api.delete(`/projects/${projectId}/milestones/${milestoneId}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // ===== RESOURCES - NEW ENDPOINTS =====
  async getResources(projectId: string): Promise<ProjectResourceResponse> {
    try {
      const response = await this.api.get(`/projects/${projectId}/resources`);
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async createResource(projectId: string, data: any): Promise<ProjectResourceResponse> {
    try {
      const response = await this.api.post(`/projects/${projectId}/resources`, data);
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // ===== BUDGET - NEW ENDPOINTS =====
  async getBudget(projectId: string): Promise<ProjectBudgetResponse> {
    try {
      const response = await this.api.get(`/projects/${projectId}/budget`);
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async updateBudget(projectId: string, data: any): Promise<ProjectBudgetResponse> {
    try {
      const response = await this.api.post(`/projects/${projectId}/budget`, data);
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // ===== RISKS - NEW ENDPOINTS =====
  async getRisks(projectId: string): Promise<ProjectRiskResponse> {
    try {
      const response = await this.api.get(`/projects/${projectId}/risks`);
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async createRisk(projectId: string, data: any): Promise<ProjectRiskResponse> {
    try {
      const response = await this.api.post(`/projects/${projectId}/risks`, data);
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }
}


// ===== UTILITY FUNCTIONS =====
export const getCurrentProjectId = (): string | null => {
  return localStorage.getItem('current_project_id');
};

export const getAuthHeaders = (): Record<string, string> => {
  const token = localStorage.getItem('auth_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const projectsService = new ProjectsService();
export { projectsService };
export default projectsService;
