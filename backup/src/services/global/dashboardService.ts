// ========================================
// SERVIÇO DE DASHBOARD
// ========================================

import { BaseService } from '../http/baseService';
import { 
  DashboardStats, 
  DashboardMetrics, 
  RecentActivity,
  ApiResponse 
} from '../http/types';

class DashboardService extends BaseService {
  constructor() {
    super('/dashboard');
  }

  // ========================================
  // MÉTODOS DE ESTATÍSTICAS
  // ========================================

  async getStats(): Promise<ApiResponse<DashboardStats>> {
    return this.get<DashboardStats>('/stats');
  }

  async getMetrics(period: string = '30d'): Promise<ApiResponse<DashboardMetrics>> {
    const validPeriods = ['7d', '30d', '90d', '1y'];
    
    if (!validPeriods.includes(period)) {
      return {
        success: false,
        error: 'Período inválido. Use: 7d, 30d, 90d ou 1y'
      };
    }

    return this.get<DashboardMetrics>('/metrics', { period });
  }

  async getRecentActivities(limit: number = 10): Promise<ApiResponse<RecentActivity[]>> {
    if (limit < 1 || limit > 100) {
      return {
        success: false,
        error: 'Limit deve estar entre 1 e 100'
      };
    }

    return this.get<RecentActivity[]>('/recent-activities', { limit });
  }

  // ========================================
  // MÉTODOS DE MÉTRICAS ESPECÍFICAS
  // ========================================

  async getLeadsStats(period: string = '30d'): Promise<ApiResponse<any>> {
    return this.get<any>('/stats/leads', { period });
  }

  async getRevenueStats(period: string = '30d'): Promise<ApiResponse<any>> {
    return this.get<any>('/stats/revenue', { period });
  }

  async getActivityStats(period: string = '30d'): Promise<ApiResponse<any>> {
    return this.get<any>('/stats/activities', { period });
  }

  async getPerformanceStats(period: string = '30d'): Promise<ApiResponse<any>> {
    return this.get<any>('/stats/performance', { period });
  }

  // ========================================
  // MÉTODOS DE GRÁFICOS
  // ========================================

  async getLeadsChart(period: string = '30d'): Promise<ApiResponse<any>> {
    return this.get<any>('/charts/leads', { period });
  }

  async getRevenueChart(period: string = '30d'): Promise<ApiResponse<any>> {
    return this.get<any>('/charts/revenue', { period });
  }

  async getActivityChart(period: string = '30d'): Promise<ApiResponse<any>> {
    return this.get<any>('/charts/activities', { period });
  }

  async getConversionChart(period: string = '30d'): Promise<ApiResponse<any>> {
    return this.get<any>('/charts/conversion', { period });
  }

  // ========================================
  // MÉTODOS DE WIDGETS
  // ========================================

  async getWidgets(): Promise<ApiResponse<any[]>> {
    return this.get<any[]>('/widgets');
  }

  async updateWidget(id: string, config: any): Promise<ApiResponse<any>> {
    if (!id) {
      return {
        success: false,
        error: 'ID do widget é obrigatório'
      };
    }

    return this.put<any>(`/widgets/${id}`, config);
  }

  async addWidget(type: string, config: any): Promise<ApiResponse<any>> {
    if (!type) {
      return {
        success: false,
        error: 'Tipo do widget é obrigatório'
      };
    }

    return this.post<any>('/widgets', { type, config });
  }

  async removeWidget(id: string): Promise<ApiResponse<void>> {
    if (!id) {
      return {
        success: false,
        error: 'ID do widget é obrigatório'
      };
    }

    return this.delete<void>(`/widgets/${id}`);
  }

  async reorderWidgets(widgetIds: string[]): Promise<ApiResponse<void>> {
    if (!Array.isArray(widgetIds) || widgetIds.length === 0) {
      return {
        success: false,
        error: 'Lista de IDs de widgets é obrigatória'
      };
    }

    return this.put<void>('/widgets/reorder', { widget_ids: widgetIds });
  }

  // ========================================
  // MÉTODOS DE ALERTAS
  // ========================================

  async getAlerts(): Promise<ApiResponse<any[]>> {
    return this.get<any[]>('/alerts');
  }

  async markAlertAsRead(id: string): Promise<ApiResponse<void>> {
    if (!id) {
      return {
        success: false,
        error: 'ID do alerta é obrigatório'
      };
    }

    return this.post<void>(`/alerts/${id}/read`);
  }

  async markAllAlertsAsRead(): Promise<ApiResponse<void>> {
    return this.post<void>('/alerts/read-all');
  }

  async deleteAlert(id: string): Promise<ApiResponse<void>> {
    if (!id) {
      return {
        success: false,
        error: 'ID do alerta é obrigatório'
      };
    }

    return this.delete<void>(`/alerts/${id}`);
  }

  // ========================================
  // MÉTODOS DE NOTIFICAÇÕES
  // ========================================

  async getNotifications(limit: number = 20): Promise<ApiResponse<any[]>> {
    if (limit < 1 || limit > 100) {
      return {
        success: false,
        error: 'Limit deve estar entre 1 e 100'
      };
    }

    return this.get<any[]>('/notifications', { limit });
  }

  async markNotificationAsRead(id: string): Promise<ApiResponse<void>> {
    if (!id) {
      return {
        success: false,
        error: 'ID da notificação é obrigatório'
      };
    }

    return this.post<void>(`/notifications/${id}/read`);
  }

  async markAllNotificationsAsRead(): Promise<ApiResponse<void>> {
    return this.post<void>('/notifications/read-all');
  }

  // ========================================
  // MÉTODOS DE RELATÓRIOS
  // ========================================

  async getQuickReport(type: string, period: string = '30d'): Promise<ApiResponse<any>> {
    const validTypes = ['leads', 'revenue', 'activities', 'performance'];
    
    if (!validTypes.includes(type)) {
      return {
        success: false,
        error: 'Tipo de relatório inválido'
      };
    }

    return this.get<any>(`/reports/${type}`, { period });
  }

  async generateReport(config: {
    type: string;
    period: string;
    format: 'pdf' | 'excel' | 'csv';
    filters?: any;
  }): Promise<void> {
    if (!config.type || !config.period || !config.format) {
      throw new Error('Tipo, período e formato são obrigatórios');
    }

    const filename = `dashboard_report_${config.type}_${config.period}_${new Date().toISOString().split('T')[0]}.${config.format}`;
    await this.download('/reports/generate', filename, config);
  }

  // ========================================
  // MÉTODOS DE CONFIGURAÇÃO
  // ========================================

  async getDashboardConfig(): Promise<ApiResponse<any>> {
    return this.get<any>('/config');
  }

  async updateDashboardConfig(config: any): Promise<ApiResponse<any>> {
    return this.put<any>('/config', config);
  }

  async resetDashboardConfig(): Promise<ApiResponse<any>> {
    return this.post<any>('/config/reset');
  }

  // ========================================
  // MÉTODOS DE CACHE
  // ========================================

  async clearCache(): Promise<ApiResponse<void>> {
    return this.post<void>('/cache/clear');
  }

  async refreshData(): Promise<ApiResponse<void>> {
    return this.post<void>('/refresh');
  }

  // ========================================
  // MÉTODOS DE EXPORT
  // ========================================

  async exportDashboard(format: 'json' | 'pdf' = 'json'): Promise<void> {
    const filename = `dashboard_export_${new Date().toISOString().split('T')[0]}.${format}`;
    await this.download('/export', filename, { format });
  }

  async exportWidget(id: string, format: 'json' | 'pdf' | 'png' = 'json'): Promise<void> {
    if (!id) {
      throw new Error('ID do widget é obrigatório');
    }

    const filename = `widget_${id}_${new Date().toISOString().split('T')[0]}.${format}`;
    await this.download(`/widgets/${id}/export`, filename, { format });
  }
}

// ========================================
// INSTÂNCIA GLOBAL
// ========================================

const dashboardService = new DashboardService();

// ========================================
// EXPORTS
// ========================================

export { DashboardService, dashboardService };
export default dashboardService;
