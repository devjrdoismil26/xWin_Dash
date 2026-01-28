import { apiClient } from '@/services';
import {
  SocialSchedule,
  SocialPlatform,
  SocialScheduleFrequency,
  SocialPost
} from '../types/socialTypes';

// Cache para agendamentos
const schedulesCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 3 * 60 * 1000; // 3 minutos

// Interface para parâmetros de busca
export interface SchedulesSearchParams {
  account_id?: number;
  platform?: SocialPlatform;
  frequency?: SocialScheduleFrequency;
  date_from?: string;
  date_to?: string;
  page?: number;
  limit?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

// Interface para resposta paginada
export interface SchedulesPaginatedResponse {
  data: SocialSchedule[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

// Interface para criação de agendamento
export interface CreateScheduleData {
  name: string;
  account_id: number;
  platform: SocialPlatform;
  frequency: SocialScheduleFrequency;
  content_template: string;
  scheduled_times: string[];
  is_active: boolean;
  hashtags?: string[];
  media_template?: string;
}

// Interface para atualização de agendamento
export interface UpdateScheduleData {
  name?: string;
  frequency?: SocialScheduleFrequency;
  content_template?: string;
  scheduled_times?: string[];
  is_active?: boolean;
  hashtags?: string[];
  media_template?: string;
}

// Interface para estatísticas de agendamentos
export interface SchedulesStats {
  total_schedules: number;
  active_schedules: number;
  inactive_schedules: number;
  schedules_by_frequency: Record<SocialScheduleFrequency, number>;
  schedules_by_platform: Record<SocialPlatform, number>;
  total_scheduled_posts: number;
  next_scheduled_post?: string;
}

// Interface para otimização de horários
export interface OptimalTimeSuggestion {
  platform: SocialPlatform;
  account_id: number;
  optimal_times: string[];
  engagement_score: number;
  audience_activity: number;
  competition_level: number;
  suggested_frequency: SocialScheduleFrequency;
}

// Interface para calendário de posts
export interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  platform: SocialPlatform;
  account_name: string;
  status: 'scheduled' | 'published' | 'failed';
  content_preview: string;
  engagement?: number;
}

/**
 * Service para gerenciamento de agendamentos sociais
 * Responsável por criação, edição e otimização de agendamentos
 */
class SchedulesService {
  private baseUrl = '/api/social-buffer/schedules';

  /**
   * Busca agendamentos com filtros
   */
  async getSchedules(params: SchedulesSearchParams = {}): Promise<SchedulesPaginatedResponse> {
    try {
      const cacheKey = `schedules_${JSON.stringify(params)}`;
      const cached = schedulesCache.get(cacheKey);
      
      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.data;
      }

      const response = await apiClient.get(this.baseUrl, { params });
      
      const result = {
        data: response.data.data || response.data,
        total: response.data.total || response.data.length,
        page: params.page || 1,
        limit: params.limit || 10,
        total_pages: Math.ceil((response.data.total || response.data.length) / (params.limit || 10))
      };

      // Cache do resultado
      schedulesCache.set(cacheKey, { data: result, timestamp: Date.now() });
      
      return result;
    } catch (error) {
      console.error('Erro ao buscar agendamentos:', error);
      throw new Error('Falha ao carregar agendamentos');
    }
  }

  /**
   * Busca um agendamento específico por ID
   */
  async getScheduleById(id: number): Promise<SocialSchedule> {
    try {
      const cacheKey = `schedule_${id}`;
      const cached = schedulesCache.get(cacheKey);
      
      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.data;
      }

      const response = await apiClient.get(`${this.baseUrl}/${id}`);
      
      // Cache do resultado
      schedulesCache.set(cacheKey, { data: response.data, timestamp: Date.now() });
      
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar agendamento ${id}:`, error);
      throw new Error('Falha ao carregar agendamento');
    }
  }

  /**
   * Cria um novo agendamento
   */
  async createSchedule(data: CreateScheduleData): Promise<SocialSchedule> {
    try {
      // Validação básica
      this.validateScheduleData(data);

      const response = await apiClient.post(this.baseUrl, data);
      
      // Limpar cache relacionado
      this.clearSchedulesCache();
      
      return response.data;
    } catch (error) {
      console.error('Erro ao criar agendamento:', error);
      throw new Error('Falha ao criar agendamento');
    }
  }

  /**
   * Atualiza um agendamento existente
   */
  async updateSchedule(id: number, data: UpdateScheduleData): Promise<SocialSchedule> {
    try {
      // Validação básica
      if (data.name !== undefined) {
        this.validateScheduleName(data.name);
      }

      const response = await apiClient.put(`${this.baseUrl}/${id}`, data);
      
      // Limpar cache relacionado
      this.clearSchedulesCache();
      schedulesCache.delete(`schedule_${id}`);
      
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar agendamento ${id}:`, error);
      throw new Error('Falha ao atualizar agendamento');
    }
  }

  /**
   * Remove um agendamento
   */
  async deleteSchedule(id: number): Promise<void> {
    try {
      await apiClient.delete(`${this.baseUrl}/${id}`);
      
      // Limpar cache relacionado
      this.clearSchedulesCache();
      schedulesCache.delete(`schedule_${id}`);
    } catch (error) {
      console.error(`Erro ao remover agendamento ${id}:`, error);
      throw new Error('Falha ao remover agendamento');
    }
  }

  /**
   * Ativa um agendamento
   */
  async activateSchedule(id: number): Promise<SocialSchedule> {
    try {
      const response = await apiClient.post(`${this.baseUrl}/${id}/activate`);
      
      // Limpar cache relacionado
      this.clearSchedulesCache();
      schedulesCache.delete(`schedule_${id}`);
      
      return response.data;
    } catch (error) {
      console.error(`Erro ao ativar agendamento ${id}:`, error);
      throw new Error('Falha ao ativar agendamento');
    }
  }

  /**
   * Desativa um agendamento
   */
  async deactivateSchedule(id: number): Promise<SocialSchedule> {
    try {
      const response = await apiClient.post(`${this.baseUrl}/${id}/deactivate`);
      
      // Limpar cache relacionado
      this.clearSchedulesCache();
      schedulesCache.delete(`schedule_${id}`);
      
      return response.data;
    } catch (error) {
      console.error(`Erro ao desativar agendamento ${id}:`, error);
      throw new Error('Falha ao desativar agendamento');
    }
  }

  /**
   * Executa um agendamento manualmente
   */
  async executeSchedule(id: number): Promise<SocialPost[]> {
    try {
      const response = await apiClient.post(`${this.baseUrl}/${id}/execute`);
      
      // Limpar cache relacionado
      this.clearSchedulesCache();
      
      return response.data.posts || [];
    } catch (error) {
      console.error(`Erro ao executar agendamento ${id}:`, error);
      throw new Error('Falha ao executar agendamento');
    }
  }

  /**
   * Duplica um agendamento
   */
  async duplicateSchedule(id: number, modifications?: Partial<CreateScheduleData>): Promise<SocialSchedule> {
    try {
      const originalSchedule = await this.getScheduleById(id);
      
      const duplicateData: CreateScheduleData = {
        name: modifications?.name || `${originalSchedule.name} (Cópia)`,
        account_id: modifications?.account_id || originalSchedule.account_id,
        platform: modifications?.platform || originalSchedule.platform,
        frequency: modifications?.frequency || originalSchedule.frequency,
        content_template: modifications?.content_template || originalSchedule.content_template,
        scheduled_times: modifications?.scheduled_times || originalSchedule.scheduled_times,
        is_active: false, // Duplicatas começam inativas
        hashtags: modifications?.hashtags || originalSchedule.hashtags,
        media_template: modifications?.media_template || originalSchedule.media_template
      };

      return await this.createSchedule(duplicateData);
    } catch (error) {
      console.error(`Erro ao duplicar agendamento ${id}:`, error);
      throw new Error('Falha ao duplicar agendamento');
    }
  }

  /**
   * Obtém estatísticas dos agendamentos
   */
  async getSchedulesStats(accountId?: number): Promise<SchedulesStats> {
    try {
      const cacheKey = `schedules_stats_${accountId || 'all'}`;
      const cached = schedulesCache.get(cacheKey);
      
      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.data;
      }

      const url = accountId ? `${this.baseUrl}/stats/${accountId}` : `${this.baseUrl}/stats`;
      const response = await apiClient.get(url);
      
      // Cache do resultado
      schedulesCache.set(cacheKey, { data: response.data, timestamp: Date.now() });
      
      return response.data;
    } catch (error) {
      console.error('Erro ao obter estatísticas dos agendamentos:', error);
      throw new Error('Falha ao obter estatísticas dos agendamentos');
    }
  }

  /**
   * Obtém sugestões de horários otimizados
   */
  async getOptimalTimeSuggestions(accountId: number, platform: SocialPlatform): Promise<OptimalTimeSuggestion> {
    try {
      const response = await apiClient.get(`${this.baseUrl}/optimal-times`, {
        params: { account_id: accountId, platform }
      });
      
      return response.data;
    } catch (error) {
      console.error('Erro ao obter sugestões de horários otimizados:', error);
      throw new Error('Falha ao obter sugestões de horários otimizados');
    }
  }

  /**
   * Obtém calendário de posts
   */
  async getCalendarEvents(accountId?: number, dateFrom?: string, dateTo?: string): Promise<CalendarEvent[]> {
    try {
      const params: any = {};
      if (accountId) params.account_id = accountId;
      if (dateFrom) params.date_from = dateFrom;
      if (dateTo) params.date_to = dateTo;

      const response = await apiClient.get(`${this.baseUrl}/calendar`, { params });
      
      return response.data.events || [];
    } catch (error) {
      console.error('Erro ao obter eventos do calendário:', error);
      throw new Error('Falha ao obter eventos do calendário');
    }
  }

  /**
   * Obtém próximos posts agendados
   */
  async getUpcomingPosts(limit: number = 10): Promise<SocialPost[]> {
    try {
      const response = await apiClient.get(`${this.baseUrl}/upcoming`, {
        params: { limit }
      });
      
      return response.data.posts || [];
    } catch (error) {
      console.error('Erro ao obter próximos posts:', error);
      throw new Error('Falha ao obter próximos posts');
    }
  }

  /**
   * Obtém posts agendados para uma data específica
   */
  async getScheduledPostsForDate(date: string, accountId?: number): Promise<SocialPost[]> {
    try {
      const params: any = { date };
      if (accountId) params.account_id = accountId;

      const response = await apiClient.get(`${this.baseUrl}/scheduled-for-date`, { params });
      
      return response.data.posts || [];
    } catch (error) {
      console.error('Erro ao obter posts agendados para a data:', error);
      throw new Error('Falha ao obter posts agendados para a data');
    }
  }

  /**
   * Pausa todos os agendamentos de uma conta
   */
  async pauseAllSchedules(accountId: number): Promise<{ paused_count: number }> {
    try {
      const response = await apiClient.post(`${this.baseUrl}/pause-all`, {
        account_id: accountId
      });
      
      // Limpar cache relacionado
      this.clearSchedulesCache();
      
      return response.data;
    } catch (error) {
      console.error('Erro ao pausar todos os agendamentos:', error);
      throw new Error('Falha ao pausar todos os agendamentos');
    }
  }

  /**
   * Resume todos os agendamentos de uma conta
   */
  async resumeAllSchedules(accountId: number): Promise<{ resumed_count: number }> {
    try {
      const response = await apiClient.post(`${this.baseUrl}/resume-all`, {
        account_id: accountId
      });
      
      // Limpar cache relacionado
      this.clearSchedulesCache();
      
      return response.data;
    } catch (error) {
      console.error('Erro ao resumir todos os agendamentos:', error);
      throw new Error('Falha ao resumir todos os agendamentos');
    }
  }

  /**
   * Valida dados básicos do agendamento
   */
  private validateScheduleData(data: CreateScheduleData): void {
    if (!data.name || data.name.trim().length === 0) {
      throw new Error('Nome do agendamento é obrigatório');
    }

    if (data.name.length > 100) {
      throw new Error('Nome do agendamento deve ter no máximo 100 caracteres');
    }

    if (!data.account_id) {
      throw new Error('ID da conta é obrigatório');
    }

    if (!data.platform) {
      throw new Error('Plataforma é obrigatória');
    }

    if (!data.frequency) {
      throw new Error('Frequência é obrigatória');
    }

    if (!data.content_template || data.content_template.trim().length === 0) {
      throw new Error('Template de conteúdo é obrigatório');
    }

    if (!data.scheduled_times || data.scheduled_times.length === 0) {
      throw new Error('Horários agendados são obrigatórios');
    }
  }

  /**
   * Valida nome do agendamento
   */
  private validateScheduleName(name: string): void {
    if (!name || name.trim().length === 0) {
      throw new Error('Nome do agendamento é obrigatório');
    }

    if (name.length > 100) {
      throw new Error('Nome do agendamento deve ter no máximo 100 caracteres');
    }
  }

  /**
   * Limpa cache de agendamentos
   */
  private clearSchedulesCache(): void {
    schedulesCache.clear();
  }

  /**
   * Limpa cache específico
   */
  clearCache(pattern?: string): void {
    if (pattern) {
      for (const key of schedulesCache.keys()) {
        if (key.includes(pattern)) {
          schedulesCache.delete(key);
        }
      }
    } else {
      schedulesCache.clear();
    }
  }

  /**
   * Obtém estatísticas do cache
   */
  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: schedulesCache.size,
      keys: Array.from(schedulesCache.keys())
    };
  }
}

// Instância singleton
export const schedulesService = new SchedulesService();
export default schedulesService;
