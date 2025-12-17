/**
 * Serviço de Projetos - Gerenciamento de Projetos
 *
 * @description
 * Serviço responsável por todas as operações relacionadas a projetos,
 * incluindo CRUD, configurações, status, membros, estatísticas, busca,
 * exportação, importação e backup. Estende BaseService para aproveitar
 * métodos HTTP padronizados.
 *
 * Funcionalidades principais:
 * - CRUD completo de projetos (criar, ler, atualizar, deletar)
 * - Gerenciamento de configurações de projeto
 * - Controle de status (ativar, desativar, arquivar, restaurar)
 * - Gerenciamento de membros (adicionar, remover, atualizar roles)
 * - Estatísticas e atividades do projeto
 * - Busca avançada com filtros
 * - Exportação e importação de projetos
 * - Sistema de backup e restauração
 * - Gerenciamento de projeto atual no localStorage
 *
 * @module services/global/projectsService
 * @since 1.0.0
 *
 * @example
 * ```ts
 * import projectsService from '@/services/global/projectsService';
 *
 * // Obter todos os projetos
 * const response = await projectsService.getAll({ page: 1, per_page: 10 });

 *
 * // Criar um novo projeto
 * const newProject = await projectsService.create({
 *   name: 'Meu Projeto',
 *   description: 'Descrição do projeto'
 * });

 *
 * // Definir projeto atual
 * projectsService.setCurrentProjectId('project-123');

 * ```
 */

import { BaseService } from '../http/baseService';
import { Project, ProjectSettings, CreateProjectData, ApiResponse, PaginationParams, ProjectMember, ProjectStats, ProjectBackup } from '../http/types';

/**
 * Classe ProjectsService - Serviço de Projetos
 *
 * @description
 * Classe que estende BaseService e fornece métodos específicos para
 * gerenciamento completo de projetos.
 *
 * @class ProjectsService
 * @extends BaseService
 * @since 1.0.0
 */
class ProjectsService extends BaseService {
  /**
   * Constrói uma nova instância do ProjectsService
   *
   * @description
   * Inicializa o serviço com a URL base '/projects' para todas as operações
   * relacionadas a projetos.
   *
   * @example
   * ```ts
   * const projectsService = new ProjectsService();

   * // Configurado para usar '/projects' como baseURL
   * ```
   */
  constructor() {
    super('/projects');

  }

  // ========================================
  // MÉTODOS CRUD
  // ========================================

  /**
   * Obtém todos os projetos
   *
   * @description
   * Busca uma lista paginada de todos os projetos do backend.
   * Suporta paginação e filtros através de parâmetros opcionais.
   *
   * @param {PaginationParams} [params] - Parâmetros de paginação e filtros
   * @returns {Promise<ApiResponse<Project[]>>} Promise com lista de projetos
   *
   * @example
   * ```ts
   * // Obter primeira página (padrão)
   * const response = await projectsService.getAll();

   *
   * // Obter página específica com filtros
   * const response = await projectsService.getAll({
   *   page: 2,
   *   per_page: 20,
   *   search: 'meu projeto'
   * });

   * ```
   */
  async getAll(params?: PaginationParams): Promise<ApiResponse<Project[]>> {
    const queryParams = this.buildPaginationParams(params || {});

    return this.get<Project[]>('', queryParams);

  }

  /**
   * Obtém um projeto específico por ID
   *
   * @description
   * Busca os dados completos de um projeto específico pelo ID.
   * Valida se o ID foi fornecido antes da requisição.
   *
   * @param {string} id - ID do projeto a ser buscado
   * @returns {Promise<ApiResponse<Project>>} Promise com dados do projeto
   *
   * @example
   * ```ts
   * const response = await projectsService.getById('project-123');

   * if (response.success && (response as any).data) {
   * }
   * ```
   */
  async getById(id: string): Promise<ApiResponse<Project>> {
    if (!id) {
      return {
        success: false,
        error: 'ID do projeto é obrigatório'};

    }

    return this.get<Project>(`/${id}`);

  }

  /**
   * Cria um novo projeto
   *
   * @description
   * Cria um novo projeto com os dados fornecidos.
   * Valida se o nome está presente e tem pelo menos 3 caracteres.
   *
   * @param {CreateProjectData} data - Dados do novo projeto
   * @returns {Promise<ApiResponse<Project>>} Promise com projeto criado
   *
   * @example
   * ```ts
   * const response = await projectsService.create({
   *   name: 'Meu Novo Projeto',
   *   description: 'Descrição do projeto',
   *   settings: {
   *     timezone: 'America/Sao_Paulo',
   *     currency: 'BRL'
   *   }
   * });

   * ```
   */
  async create(data: CreateProjectData): Promise<ApiResponse<Project>> {
    this.validateRequired(data, ['name']);

    if (data.name.length < 3) {
      return {
        success: false,
        error: 'Nome do projeto deve ter pelo menos 3 caracteres'};

    }

    return this.post<Project>('', data);

  }

  /**
   * Atualiza um projeto existente
   *
   * @description
   * Atualiza parcialmente os dados de um projeto existente.
   * Valida se o ID foi fornecido e se o nome tem pelo menos 3 caracteres (se fornecido).
   *
   * @param {string} id - ID do projeto a ser atualizado
   * @param {Partial<CreateProjectData>} data - Dados parciais do projeto a serem atualizados
   * @returns {Promise<ApiResponse<Project>>} Promise com projeto atualizado
   *
   * @example
   * ```ts
   * const response = await projectsService.update('project-123', {
   *   name: 'Nome Atualizado',
   *   description: 'Nova descrição'
   * });

   * ```
   */
  async update(id: string, data: Partial<CreateProjectData>): Promise<ApiResponse<Project>> {
    if (!id) {
      return {
        success: false,
        error: 'ID do projeto é obrigatório'};

    }

    if (data.name && (data as any).name.length < 3) {
      return {
        success: false,
        error: 'Nome do projeto deve ter pelo menos 3 caracteres'};

    }

    return this.put<Project>(`/${id}`, data);

  }

  /**
   * Deleta um projeto
   *
   * @description
   * Remove um projeto específico pelo ID.
   * Valida se o ID foi fornecido antes da requisição.
   *
   * @param {string} id - ID do projeto a ser deletado
   * @returns {Promise<ApiResponse<void>>} Promise com resposta da deleção
   *
   * @example
   * ```ts
   * const response = await projectsService.delete('project-123');

   * ```
   */
  async delete(id: string): Promise<ApiResponse<void>> {
    if (!id) {
      return {
        success: false,
        error: 'ID do projeto é obrigatório'};

    }

    return this.delete<void>(`/${id}`);

  }

  // ========================================
  // MÉTODOS DE CONFIGURAÇÃO
  // ========================================

  /**
   * Obtém as configurações de um projeto
   *
   * @description
   * Busca as configurações completas de um projeto específico pelo ID.
   * Valida se o ID foi fornecido antes da requisição.
   *
   * @param {string} id - ID do projeto
   * @returns {Promise<ApiResponse<ProjectSettings>>} Promise com configurações do projeto
   *
   * @example
   * ```ts
   * const response = await projectsService.getSettings('project-123');

   * if (response.success && (response as any).data) {
   * }
   * ```
   */
  async getSettings(id: string): Promise<ApiResponse<ProjectSettings>> {
    if (!id) {
      return {
        success: false,
        error: 'ID do projeto é obrigatório'};

    }

    return this.get<ProjectSettings>(`/${id}/settings`);

  }

  /**
   * Atualiza as configurações de um projeto
   *
   * @description
   * Atualiza parcialmente as configurações de um projeto específico.
   * Valida se o ID foi fornecido antes da requisição.
   *
   * @param {string} id - ID do projeto
   * @param {Partial<ProjectSettings>} settings - Configurações parciais a serem atualizadas
   * @returns {Promise<ApiResponse<ProjectSettings>>} Promise com configurações atualizadas
   *
   * @example
   * ```ts
   * const response = await projectsService.updateSettings('project-123', {
   *   timezone: 'America/Sao_Paulo',
   *   currency: 'USD',
   *   date_format: 'Y-m-d'
   * });

   * ```
   */
  async updateSettings(id: string, settings: Partial<ProjectSettings>): Promise<ApiResponse<ProjectSettings>> {
    if (!id) {
      return {
        success: false,
        error: 'ID do projeto é obrigatório'};

    }

    return this.put<ProjectSettings>(`/${id}/settings`, settings);

  }

  // ========================================
  // MÉTODOS DE STATUS
  // ========================================

  /**
   * Ativa um projeto
   *
   * @description
   * Ativa um projeto específico, mudando seu status para 'active'.
   * Valida se o ID foi fornecido antes da requisição.
   *
   * @param {string} id - ID do projeto a ser ativado
   * @returns {Promise<ApiResponse<Project>>} Promise com projeto ativado
   *
   * @example
   * ```ts
   * const response = await projectsService.activate('project-123');

   * ```
   */
  async activate(id: string): Promise<ApiResponse<Project>> {
    if (!id) {
      return {
        success: false,
        error: 'ID do projeto é obrigatório'};

    }

    return this.post<Project>(`/${id}/activate`);

  }

  /**
   * Desativa um projeto
   *
   * @description
   * Desativa um projeto específico, mudando seu status para 'inactive'.
   * Valida se o ID foi fornecido antes da requisição.
   *
   * @param {string} id - ID do projeto a ser desativado
   * @returns {Promise<ApiResponse<Project>>} Promise com projeto desativado
   *
   * @example
   * ```ts
   * const response = await projectsService.deactivate('project-123');

   * ```
   */
  async deactivate(id: string): Promise<ApiResponse<Project>> {
    if (!id) {
      return {
        success: false,
        error: 'ID do projeto é obrigatório'};

    }

    return this.post<Project>(`/${id}/deactivate`);

  }

  async archive(id: string): Promise<ApiResponse<Project>> {
    if (!id) {
      return {
        success: false,
        error: 'ID do projeto é obrigatório'};

    }

    return this.post<Project>(`/${id}/archive`);

  }

  /**
   * Restaura um projeto arquivado
   *
   * @description
   * Restaura um projeto arquivado, mudando seu status de volta para 'active' ou 'inactive'.
   * Valida se o ID foi fornecido antes da requisição.
   *
   * @param {string} id - ID do projeto a ser restaurado
   * @returns {Promise<ApiResponse<Project>>} Promise com projeto restaurado
   *
   * @example
   * ```ts
   * const response = await projectsService.restore('project-123');

   * ```
   */
  async restore(id: string): Promise<ApiResponse<Project>> {
    if (!id) {
      return {
        success: false,
        error: 'ID do projeto é obrigatório'};

    }

    return this.post<Project>(`/${id}/restore`);

  }

  // ========================================
  // MÉTODOS DE MEMBROS
  // ========================================

  /**
   * Obtém os membros de um projeto
   *
   * @description
   * Busca a lista de todos os membros de um projeto específico.
   * Valida se o ID foi fornecido antes da requisição.
   *
   * @param {string} id - ID do projeto
   * @returns {Promise<ApiResponse<unknown[]>>} Promise com lista de membros
   *
   * @example
   * ```ts
   * const response = await projectsService.getMembers('project-123');

   * if (response.success && (response as any).data) {
   *   (response as any).data.forEach(member => {
   *   });

   * }
   * ```
   */
  async getMembers(id: string): Promise<ApiResponse<unknown[]>> {
    if (!id) {
      return {
        success: false,
        error: 'ID do projeto é obrigatório'};

    }

    return this.get<ProjectMember[]>(`/${id}/members`);

  }

  async addMember(id: string, userId: string, role: string = 'member'): Promise<ApiResponse<void>> {
    if (!id || !userId) {
      return {
        success: false,
        error: 'ID do projeto e ID do usuário são obrigatórios'};

    }

    return this.post<void>(`/${id}/members`, { user_id: userId, role });

  }

  async removeMember(id: string, userId: string): Promise<ApiResponse<void>> {
    if (!id || !userId) {
      return {
        success: false,
        error: 'ID do projeto e ID do usuário são obrigatórios'};

    }

    return this.delete<void>(`/${id}/members/${userId}`);

  }

  /**
   * Atualiza o role de um membro do projeto
   *
   * @description
   * Atualiza o role de um membro específico do projeto.
   * Valida se ID do projeto, ID do usuário e role foram fornecidos.
   *
   * @param {string} id - ID do projeto
   * @param {string} userId - ID do usuário
   * @param {string} role - Novo role do membro
   * @returns {Promise<ApiResponse<void>>} Promise com resposta da atualização
   *
   * @example
   * ```ts
   * await projectsService.updateMemberRole('project-123', 'user-456', 'admin');

   * ```
   */
  async updateMemberRole(id: string, userId: string, role: string): Promise<ApiResponse<void>> {
    if (!id || !userId || !role) {
      return {
        success: false,
        error: 'ID do projeto, ID do usuário e role são obrigatórios'};

    }

    return this.put<void>(`/${id}/members/${userId}`, { role });

  }

  // ========================================
  // MÉTODOS DE ESTATÍSTICAS
  // ========================================

  async getStats(id: string): Promise<ApiResponse<ProjectStats>> {
    if (!id) {
      return {
        success: false,
        error: 'ID do projeto é obrigatório'};

    }

    return this.get<any>(`/${id}/stats`);

  }

  /**
   * Obtém atividades de um projeto
   *
   * @description
   * Busca uma lista paginada de atividades de um projeto específico.
   * Valida se o ID foi fornecido antes da requisição.
   *
   * @param {string} id - ID do projeto
   * @param {PaginationParams} [params] - Parâmetros de paginação
   * @returns {Promise<ApiResponse<unknown[]>>} Promise com lista de atividades
   *
   * @example
   * ```ts
   * // Obter primeira página de atividades
   * const response = await projectsService.getActivity('project-123');

   *
   * // Obter página específica
   * const response = await projectsService.getActivity('project-123', {
   *   page: 2,
   *   per_page: 20
   * });

   * ```
   */
  async getActivity(id: string, params?: PaginationParams): Promise<ApiResponse<unknown[]>> {
    if (!id) {
      return {
        success: false,
        error: 'ID do projeto é obrigatório'};

    }

    const queryParams = this.buildPaginationParams(params || {});

    return this.get<unknown[]>(`/${id}/activity`, queryParams);

  }

  // ========================================
  // MÉTODOS DE BUSCA
  // ========================================

  /**
   * Busca projetos com filtros
   *
   * @description
   * Realiza uma busca de projetos usando uma query de texto e filtros opcionais.
   * Valida se a query tem pelo menos 2 caracteres.
   *
   * @param {string} query - Query de busca (mínimo 2 caracteres)
   * @param {Object} [filters] - Filtros opcionais para refinar a busca
   * @param {string} [filters.status] - Status do projeto (active, inactive, archived)
   * @param {string} [filters.created_by] - ID do criador do projeto
   * @param {string} [filters.date_from] - Data inicial (formato ISO)
   * @param {string} [filters.date_to] - Data final (formato ISO)
   * @returns {Promise<ApiResponse<Project[]>>} Promise com lista de projetos encontrados
   *
   * @example
   * ```ts
   * // Busca simples
   * const response = await projectsService.search('meu projeto');

   *
   * // Busca com filtros
   * const response = await projectsService.search('projeto', {
   *   status: 'active',
   *   date_from: '2024-01-01',
   *   date_to: '2024-12-31'
   * });

   * ```
   */
  async search(query: string, filters?: {
    status?: string;
    created_by?: string;
    date_from?: string;
    date_to?: string;
  }): Promise<ApiResponse<Project[]>> {
    if (!query || query.length < 2) {
      return {
        success: false,
        error: 'Query de busca deve ter pelo menos 2 caracteres'};

    }

    const params = {
      q: query,
      ...this.buildFilters(filters || {})};

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

  /**
   * Remove o ID do projeto atual do localStorage
   *
   * @description
   * Remove o ID do projeto atual do localStorage, limpando a seleção.
   *
   * @returns {void}
   *
   * @example
   * ```ts
   * projectsService.clearCurrentProjectId();

   * ```
   */
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
        error: 'Arquivo é obrigatório'};

    }

    const formData = new FormData();

    formData.append('file', file);

    return this.upload<Project>('/import', formData);

  }

  // ========================================
  // MÉTODOS DE BACKUP
  // ========================================

  /**
   * Cria um backup de um projeto
   *
   * @description
   * Cria um backup completo do projeto especificado.
   * Valida se o ID foi fornecido antes da requisição.
   *
   * @param {string} id - ID do projeto
   * @returns {Promise<ApiResponse<any>>} Promise com informações do backup criado
   *
   * @example
   * ```ts
   * const response = await projectsService.createBackup('project-123');

   * if (response.success) {
   * }
   * ```
   */
  async createBackup(id: string): Promise<ApiResponse<any>> {
    if (!id) {
      return {
        success: false,
        error: 'ID do projeto é obrigatório'};

    }

    return this.post<ProjectBackup>(`/${id}/backup`);

  }

  async restoreBackup(id: string, backupId: string): Promise<ApiResponse<Project>> {
    if (!id || !backupId) {
      return {
        success: false,
        error: 'ID do projeto e ID do backup são obrigatórios'};

    }

    return this.post<Project>(`/${id}/restore`, { backup_id: backupId });

  }

  async getBackups(id: string): Promise<ApiResponse<ProjectBackup[]>> {
    if (!id) {
      return {
        success: false,
        error: 'ID do projeto é obrigatório'};

    }

    return this.get<unknown[]>(`/${id}/backups`);

  } // ========================================
// INSTÂNCIA GLOBAL
// ========================================

/**
 * Instância global do ProjectsService
 *
 * @description
 * Instância única e compartilhada do ProjectsService configurada com a URL base '/projects'.
 * Esta é a instância recomendada para uso na maioria dos casos, evitando a criação
 * de múltiplas instâncias desnecessárias.
 *
 * @constant {ProjectsService}
 * @global
 *
 * @example
 * ```ts
 * import projectsService from '@/services/global/projectsService';
 *
 * // Usar a instância global
 * await projectsService.getAll();

 * ```
 */
const projectsService = new ProjectsService();

// ========================================
// EXPORTS
// ========================================

export { ProjectsService, projectsService };

export default projectsService;
