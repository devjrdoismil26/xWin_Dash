// ========================================
// SERVIÇO DE PROJETOS
// ========================================

import { BaseService } from '../http/baseService';
import { 
  Project, 
  ProjectSettings, 
  CreateProjectData, 
  ApiResponse,
  PaginationParams 
} from '../http/types';

class ProjectsService extends BaseService {
  constructor() {
    super('/projects');
  }

  // ========================================
  // MÉTODOS CRUD
  // ========================================

  async getAll(params?: PaginationParams): Promise<ApiResponse<Project[]>> {
    const queryParams = this.buildPaginationParams(params || {});
    return this.get<Project[]>('', queryParams);
  }

  async getById(id: string): Promise<ApiResponse<Project>> {
    if (!id) {
      return {
        success: false,
        error: 'ID do projeto é obrigatório'
      };
    }

    return this.get<Project>(`/${id}`);
  }

  async create(data: CreateProjectData): Promise<ApiResponse<Project>> {
    this.validateRequired(data, ['name']);
    
    if (data.name.length < 3) {
      return {
        success: false,
        error: 'Nome do projeto deve ter pelo menos 3 caracteres'
      };
    }

    return this.post<Project>('', data);
  }

  async update(id: string, data: Partial<CreateProjectData>): Promise<ApiResponse<Project>> {
    if (!id) {
      return {
        success: false,
        error: 'ID do projeto é obrigatório'
      };
    }

    if (data.name && data.name.length < 3) {
      return {
        success: false,
        error: 'Nome do projeto deve ter pelo menos 3 caracteres'
      };
    }

    return this.put<Project>(`/${id}`, data);
  }

  async delete(id: string): Promise<ApiResponse<void>> {
    if (!id) {
      return {
        success: false,
        error: 'ID do projeto é obrigatório'
      };
    }

    return this.delete<void>(`/${id}`);
  }

  // ========================================
  // MÉTODOS DE CONFIGURAÇÃO
  // ========================================

  async getSettings(id: string): Promise<ApiResponse<ProjectSettings>> {
    if (!id) {
      return {
        success: false,
        error: 'ID do projeto é obrigatório'
      };
    }

    return this.get<ProjectSettings>(`/${id}/settings`);
  }

  async updateSettings(id: string, settings: Partial<ProjectSettings>): Promise<ApiResponse<ProjectSettings>> {
    if (!id) {
      return {
        success: false,
        error: 'ID do projeto é obrigatório'
      };
    }

    return this.put<ProjectSettings>(`/${id}/settings`, settings);
  }

  // ========================================
  // MÉTODOS DE STATUS
  // ========================================

  async activate(id: string): Promise<ApiResponse<Project>> {
    if (!id) {
      return {
        success: false,
        error: 'ID do projeto é obrigatório'
      };
    }

    return this.post<Project>(`/${id}/activate`);
  }

  async deactivate(id: string): Promise<ApiResponse<Project>> {
    if (!id) {
      return {
        success: false,
        error: 'ID do projeto é obrigatório'
      };
    }

    return this.post<Project>(`/${id}/deactivate`);
  }

  async archive(id: string): Promise<ApiResponse<Project>> {
    if (!id) {
      return {
        success: false,
        error: 'ID do projeto é obrigatório'
      };
    }

    return this.post<Project>(`/${id}/archive`);
  }

  async restore(id: string): Promise<ApiResponse<Project>> {
    if (!id) {
      return {
        success: false,
        error: 'ID do projeto é obrigatório'
      };
    }

    return this.post<Project>(`/${id}/restore`);
  }

  // ========================================
  // MÉTODOS DE MEMBROS
  // ========================================

  async getMembers(id: string): Promise<ApiResponse<any[]>> {
    if (!id) {
      return {
        success: false,
        error: 'ID do projeto é obrigatório'
      };
    }

    return this.get<any[]>(`/${id}/members`);
  }

  async addMember(id: string, userId: string, role: string = 'member'): Promise<ApiResponse<void>> {
    if (!id || !userId) {
      return {
        success: false,
        error: 'ID do projeto e ID do usuário são obrigatórios'
      };
    }

    return this.post<void>(`/${id}/members`, { user_id: userId, role });
  }

  async removeMember(id: string, userId: string): Promise<ApiResponse<void>> {
    if (!id || !userId) {
      return {
        success: false,
        error: 'ID do projeto e ID do usuário são obrigatórios'
      };
    }

    return this.delete<void>(`/${id}/members/${userId}`);
  }

  async updateMemberRole(id: string, userId: string, role: string): Promise<ApiResponse<void>> {
    if (!id || !userId || !role) {
      return {
        success: false,
        error: 'ID do projeto, ID do usuário e role são obrigatórios'
      };
    }

    return this.put<void>(`/${id}/members/${userId}`, { role });
  }

  // ========================================
  // MÉTODOS DE ESTATÍSTICAS
  // ========================================

  async getStats(id: string): Promise<ApiResponse<any>> {
    if (!id) {
      return {
        success: false,
        error: 'ID do projeto é obrigatório'
      };
    }

    return this.get<any>(`/${id}/stats`);
  }

  async getActivity(id: string, params?: PaginationParams): Promise<ApiResponse<any[]>> {
    if (!id) {
      return {
        success: false,
        error: 'ID do projeto é obrigatório'
      };
    }

    const queryParams = this.buildPaginationParams(params || {});
    return this.get<any[]>(`/${id}/activity`, queryParams);
  }

  // ========================================
  // MÉTODOS DE BUSCA
  // ========================================

  async search(query: string, filters?: {
    status?: string;
    created_by?: string;
    date_from?: string;
    date_to?: string;
  }): Promise<ApiResponse<Project[]>> {
    if (!query || query.length < 2) {
      return {
        success: false,
        error: 'Query de busca deve ter pelo menos 2 caracteres'
      };
    }

    const params = {
      q: query,
      ...this.buildFilters(filters || {})
    };

    return this.get<Project[]>('/search', params);
  }

  // ========================================
  // MÉTODOS DE UTILIDADE
  // ========================================

  getCurrentProjectId(): string | null {
    return localStorage.getItem('current_project_id');
  }

  setCurrentProjectId(id: string): void {
    localStorage.setItem('current_project_id', id);
  }

  clearCurrentProjectId(): void {
    localStorage.removeItem('current_project_id');
  }

  // ========================================
  // MÉTODOS DE EXPORT/IMPORT
  // ========================================

  async export(id: string, format: 'json' | 'csv' = 'json'): Promise<void> {
    if (!id) {
      throw new Error('ID do projeto é obrigatório');
    }

    const filename = `project_${id}_${new Date().toISOString().split('T')[0]}.${format}`;
    await this.download(`/${id}/export`, filename, { format });
  }

  async import(file: File): Promise<ApiResponse<Project>> {
    if (!file) {
      return {
        success: false,
        error: 'Arquivo é obrigatório'
      };
    }

    const formData = new FormData();
    formData.append('file', file);

    return this.upload<Project>('/import', formData);
  }

  // ========================================
  // MÉTODOS DE BACKUP
  // ========================================

  async createBackup(id: string): Promise<ApiResponse<any>> {
    if (!id) {
      return {
        success: false,
        error: 'ID do projeto é obrigatório'
      };
    }

    return this.post<any>(`/${id}/backup`);
  }

  async restoreBackup(id: string, backupId: string): Promise<ApiResponse<Project>> {
    if (!id || !backupId) {
      return {
        success: false,
        error: 'ID do projeto e ID do backup são obrigatórios'
      };
    }

    return this.post<Project>(`/${id}/restore`, { backup_id: backupId });
  }

  async getBackups(id: string): Promise<ApiResponse<any[]>> {
    if (!id) {
      return {
        success: false,
        error: 'ID do projeto é obrigatório'
      };
    }

    return this.get<any[]>(`/${id}/backups`);
  }
}

// ========================================
// INSTÂNCIA GLOBAL
// ========================================

const projectsService = new ProjectsService();

// ========================================
// EXPORTS
// ========================================

export { ProjectsService, projectsService };
export default projectsService;
