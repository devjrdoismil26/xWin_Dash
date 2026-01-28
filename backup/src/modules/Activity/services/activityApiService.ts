/**
 * Serviço de API para o módulo Activity
 * Responsável por todas as chamadas HTTP para a API
 */

import { 
  ActivityLog, 
  ActivityStats, 
  ActivityFilters, 
  ActivityResponse,
  UserActivityStats,
  SystemHealthStats,
  RealTimeLog
} from '../types';

class ActivityApiService {
  private baseUrl = '/api/activity-logs';

  /**
   * Busca logs de atividade
   */
  async getLogs(filters: ActivityFilters = {}): Promise<ActivityResponse> {
    try {
      const params = new URLSearchParams();
      
      if (filters.search) params.append('search', filters.search);
      if (filters.type && filters.type !== 'all') params.append('log_name', filters.type);
      if (filters.user && filters.user !== 'all') params.append('causer_type', filters.user);
      if (filters.date) {
        const dateRange = this.getDateRange(filters.date);
        if (dateRange.from) params.append('date_from', dateRange.from);
        if (dateRange.to) params.append('date_to', dateRange.to);
      }
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.per_page) params.append('per_page', filters.per_page.toString());

      const response = await fetch(`${this.baseUrl}?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return {
        success: true,
        data: result.data,
        pagination: result.meta
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Erro ao carregar logs de atividade'
      };
    }
  }

  /**
   * Busca log específico por ID
   */
  async getLogById(logId: string): Promise<ActivityResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/${logId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return {
        success: true,
        data: result.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Erro ao carregar log específico'
      };
    }
  }

  /**
   * Busca estatísticas de logs
   */
  async getLogStats(filters: ActivityFilters = {}): Promise<ActivityResponse> {
    try {
      const params = new URLSearchParams();
      
      if (filters.search) params.append('search', filters.search);
      if (filters.type && filters.type !== 'all') params.append('log_name', filters.type);
      if (filters.user && filters.user !== 'all') params.append('causer_type', filters.user);
      if (filters.date) {
        const dateRange = this.getDateRange(filters.date);
        if (dateRange.from) params.append('date_from', dateRange.from);
        if (dateRange.to) params.append('date_to', dateRange.to);
      }

      const response = await fetch(`${this.baseUrl}/stats?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return {
        success: true,
        data: result.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Erro ao carregar estatísticas'
      };
    }
  }

  /**
   * Busca estatísticas de atividade
   */
  async getActivityStats(filters: ActivityFilters = {}): Promise<ActivityResponse> {
    try {
      const params = new URLSearchParams();
      
      if (filters.search) params.append('search', filters.search);
      if (filters.type && filters.type !== 'all') params.append('log_name', filters.type);
      if (filters.user && filters.user !== 'all') params.append('causer_type', filters.user);
      if (filters.date) {
        const dateRange = this.getDateRange(filters.date);
        if (dateRange.from) params.append('date_from', dateRange.from);
        if (dateRange.to) params.append('date_to', dateRange.to);
      }

      const response = await fetch(`${this.baseUrl}/activity-stats?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return {
        success: true,
        data: result.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Erro ao carregar estatísticas de atividade'
      };
    }
  }

  /**
   * Busca estatísticas de usuário
   */
  async getUserActivityStats(userId: string, filters: ActivityFilters = {}): Promise<ActivityResponse> {
    try {
      const params = new URLSearchParams();
      
      if (filters.search) params.append('search', filters.search);
      if (filters.type && filters.type !== 'all') params.append('log_name', filters.type);
      if (filters.date) {
        const dateRange = this.getDateRange(filters.date);
        if (dateRange.from) params.append('date_from', dateRange.from);
        if (dateRange.to) params.append('date_to', dateRange.to);
      }

      const response = await fetch(`${this.baseUrl}/user/${userId}/stats?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return {
        success: true,
        data: result.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Erro ao carregar estatísticas do usuário'
      };
    }
  }

  /**
   * Busca estatísticas de saúde do sistema
   */
  async getSystemHealthStats(): Promise<ActivityResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/system-health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return {
        success: true,
        data: result.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Erro ao carregar estatísticas do sistema'
      };
    }
  }

  /**
   * Busca logs em tempo real
   */
  async getRealTimeLogs(): Promise<ActivityResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/realtime`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return {
        success: true,
        data: result.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Erro ao carregar logs em tempo real'
      };
    }
  }

  /**
   * Busca logs por tipo
   */
  async getLogsByType(type: string, filters: ActivityFilters = {}): Promise<ActivityResponse> {
    try {
      const params = new URLSearchParams();
      params.append('log_name', type);
      
      if (filters.search) params.append('search', filters.search);
      if (filters.user && filters.user !== 'all') params.append('causer_type', filters.user);
      if (filters.date) {
        const dateRange = this.getDateRange(filters.date);
        if (dateRange.from) params.append('date_from', dateRange.from);
        if (dateRange.to) params.append('date_to', dateRange.to);
      }
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.per_page) params.append('per_page', filters.per_page.toString());

      const response = await fetch(`${this.baseUrl}?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return {
        success: true,
        data: result.data,
        pagination: result.meta
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Erro ao carregar logs por tipo'
      };
    }
  }

  /**
   * Busca logs por usuário
   */
  async getLogsByUser(userId: string, filters: ActivityFilters = {}): Promise<ActivityResponse> {
    try {
      const params = new URLSearchParams();
      params.append('causer_id', userId);
      
      if (filters.search) params.append('search', filters.search);
      if (filters.type && filters.type !== 'all') params.append('log_name', filters.type);
      if (filters.date) {
        const dateRange = this.getDateRange(filters.date);
        if (dateRange.from) params.append('date_from', dateRange.from);
        if (dateRange.to) params.append('date_to', dateRange.to);
      }
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.per_page) params.append('per_page', filters.per_page.toString());

      const response = await fetch(`${this.baseUrl}?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return {
        success: true,
        data: result.data,
        pagination: result.meta
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Erro ao carregar logs do usuário'
      };
    }
  }

  /**
   * Busca logs por período
   */
  async getLogsByDateRange(startDate: string, endDate: string, filters: ActivityFilters = {}): Promise<ActivityResponse> {
    try {
      const params = new URLSearchParams();
      params.append('date_from', startDate);
      params.append('date_to', endDate);
      
      if (filters.search) params.append('search', filters.search);
      if (filters.type && filters.type !== 'all') params.append('log_name', filters.type);
      if (filters.user && filters.user !== 'all') params.append('causer_type', filters.user);
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.per_page) params.append('per_page', filters.per_page.toString());

      const response = await fetch(`${this.baseUrl}?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return {
        success: true,
        data: result.data,
        pagination: result.meta
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Erro ao carregar logs por período'
      };
    }
  }

  /**
   * Busca logs com query de texto
   */
  async searchLogs(query: string, filters: ActivityFilters = {}): Promise<ActivityResponse> {
    try {
      const params = new URLSearchParams();
      params.append('search', query);
      
      if (filters.type && filters.type !== 'all') params.append('log_name', filters.type);
      if (filters.user && filters.user !== 'all') params.append('causer_type', filters.user);
      if (filters.date) {
        const dateRange = this.getDateRange(filters.date);
        if (dateRange.from) params.append('date_from', dateRange.from);
        if (dateRange.to) params.append('date_to', dateRange.to);
      }
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.per_page) params.append('per_page', filters.per_page.toString());

      const response = await fetch(`${this.baseUrl}?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return {
        success: true,
        data: result.data,
        pagination: result.meta
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Erro ao buscar logs'
      };
    }
  }

  /**
   * Exporta logs
   */
  async exportLogs(filters: ActivityFilters = {}, format = 'csv'): Promise<ActivityResponse> {
    try {
      const params = new URLSearchParams();
      params.append('format', format);
      
      if (filters.search) params.append('search', filters.search);
      if (filters.type && filters.type !== 'all') params.append('log_name', filters.type);
      if (filters.user && filters.user !== 'all') params.append('causer_type', filters.user);
      if (filters.date) {
        const dateRange = this.getDateRange(filters.date);
        if (dateRange.from) params.append('date_from', dateRange.from);
        if (dateRange.to) params.append('date_to', dateRange.to);
      }

      const response = await fetch(`${this.baseUrl}/export?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Accept': format === 'csv' ? 'text/csv' : 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `activity-logs-${new Date().toISOString().split('T')[0]}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      return {
        success: true,
        data: { exported: true, format }
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Erro ao exportar logs'
      };
    }
  }

  /**
   * Limpa logs antigos
   */
  async clearOldLogs(daysToKeep = 30): Promise<ActivityResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/clear`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        credentials: 'include',
        body: JSON.stringify({ days_to_keep: daysToKeep }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return {
        success: true,
        data: result.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Erro ao limpar logs antigos'
      };
    }
  }

  /**
   * Exclui logs em lote
   */
  async bulkDeleteLogs(ids: string[]): Promise<ActivityResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/bulk-delete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        credentials: 'include',
        body: JSON.stringify({ ids }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return {
        success: true,
        data: result.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Erro ao excluir logs em lote'
      };
    }
  }

  /**
   * Busca filtros disponíveis
   */
  async getAvailableFilters(): Promise<ActivityResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/filters`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return {
        success: true,
        data: result.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Erro ao carregar filtros disponíveis'
      };
    }
  }

  /**
   * Conecta a atualizações em tempo real
   */
  subscribeToRealTimeUpdates(callback: (data: RealTimeLog) => void): EventSource {
    const eventSource = new EventSource(`${this.baseUrl}/stream`);
    
    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        callback(data);
      } catch (error) {
        console.error('Erro ao processar dados em tempo real:', error);
      }
    };

    eventSource.onerror = (error) => {
      console.error('Erro na conexão em tempo real:', error);
    };

    return eventSource;
  }

  // ===== HELPER METHODS =====
  
  /**
   * Converte filtro de data em range
   */
  private getDateRange(dateFilter: string = 'all'): { from?: string; to?: string } {
    const now = new Date();
    
    switch (dateFilter) {
      case 'today':
        return { from: now.toISOString().split('T')[0] };
      case 'yesterday': {
        const yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);
        return { from: yesterday.toISOString().split('T')[0] };
      }
      case 'week': {
        const weekAgo = new Date(now);
        weekAgo.setDate(weekAgo.getDate() - 7);
        return { from: weekAgo.toISOString().split('T')[0] };
      }
      case 'month': {
        const monthAgo = new Date(now);
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        return { from: monthAgo.toISOString().split('T')[0] };
      }
      default:
        return {};
    }
  }
}

export const activityApiService = new ActivityApiService();
export default activityApiService;
