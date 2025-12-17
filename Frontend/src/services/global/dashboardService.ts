/**
 * Serviço de Dashboard - Gerenciamento de Dashboard e Estatísticas
 *
 * @description
 * Serviço responsável por todas as operações relacionadas ao dashboard,
 * incluindo estatísticas, métricas, gráficos, widgets, alertas, notificações
 * e relatórios. Estende BaseService para aproveitar métodos HTTP padronizados.
 *
 * Funcionalidades principais:
 * - Estatísticas gerais e por categoria (leads, receita, atividades, performance)
 * - Métricas e gráficos com filtros por período
 * - Atividades recentes
 * - Gerenciamento de widgets (adicionar, atualizar, remover, reordenar)
 * - Gerenciamento de alertas e notificações
 * - Relatórios rápidos e geração de relatórios em diferentes formatos
 * - Configuração do dashboard
 * - Cache e exportação de dados
 *
 * @module services/global/dashboardService
 * @since 1.0.0
 *
 * @example
 * ```ts
 * import dashboardService from '@/services/global/dashboardService';
 *
 * // Obter estatísticas
 * const stats = await dashboardService.getStats();

 *
 * // Obter métricas com período
 * const metrics = await dashboardService.getMetrics('30d');

 *
 * // Obter atividades recentes
 * const activities = await dashboardService.getRecentActivities(10);

 * ```
 */

import { BaseService } from '../http/baseService';
import { DashboardStats, DashboardMetrics, RecentActivity, ApiResponse, DashboardWidget, WidgetConfig, DashboardAlert, DashboardNotification, DashboardConfig } from '../http/types';

/**
 * Classe DashboardService - Serviço de Dashboard
 *
 * @description
 * Classe que estende BaseService e fornece métodos específicos para
 * gerenciamento de dashboard, estatísticas, métricas, widgets e relatórios.
 *
 * @class DashboardService
 * @extends BaseService
 * @since 1.0.0
 */
class DashboardService extends BaseService {
  /**
   * Constrói uma nova instância do DashboardService
   *
   * @description
   * Inicializa o serviço com a URL base '/dashboard' para todas as operações
   * relacionadas ao dashboard.
   *
   * @example
   * ```ts
   * const dashboardService = new DashboardService();

   * // Configurado para usar '/dashboard' como baseURL
   * ```
   */
  constructor() {
    super('/dashboard');

  }

  // ========================================
  // MÉTODOS DE ESTATÍSTICAS
  // ========================================

  /**
   * Obtém as estatísticas gerais do dashboard
   *
   * @description
   * Busca as estatísticas gerais do dashboard do backend, incluindo
   * estatísticas de leads, receita, atividades e performance.
   *
   * @returns {Promise<ApiResponse<DashboardStats>>} Promise com estatísticas do dashboard
   *
   * @example
   * ```ts
   * const response = await dashboardService.getStats();

   * if (response.success && (response as any).data) {
   * }
   * ```
   */
  async getStats(): Promise<ApiResponse<DashboardStats>> {
    return this.get<DashboardStats>('/stats');

  }

  /**
   * Obtém as métricas do dashboard para um período específico
   *
   * @description
   * Busca as métricas do dashboard (dados de séries temporais para gráficos)
   * para um período específico. Valida se o período é válido antes da requisição.
   *
   * @param {string} [period='30d'] - Período das métricas ('7d', '30d', '90d' ou '1y')
   * @returns {Promise<ApiResponse<DashboardMetrics>>} Promise com métricas do dashboard
   *
   * @example
   * ```ts
   * // Métricas dos últimos 30 dias (padrão)
   * const response = await dashboardService.getMetrics();

   *
   * // Métricas dos últimos 7 dias
   * const response7d = await dashboardService.getMetrics('7d');

   * ```
   */
  async getMetrics(period: string = '30d'): Promise<ApiResponse<DashboardMetrics>> {
    const validPeriods = ['7d', '30d', '90d', '1y'];
    
    if (!validPeriods.includes(period)) {
      return {
        success: false,
        error: 'Período inválido. Use: 7d, 30d, 90d ou 1y'};

    }

    return this.get<DashboardMetrics>('/metrics', { period });

  }

  /**
   * Obtém atividades recentes do dashboard
   *
   * @description
   * Busca as atividades recentes do dashboard com limite configurável.
   * Valida se o limite está dentro do intervalo permitido (1-100).
   *
   * @param {number} [limit=10] - Número máximo de atividades a retornar (1-100)
   * @returns {Promise<ApiResponse<RecentActivity[]>>} Promise com lista de atividades recentes
   *
   * @example
   * ```ts
   * // Últimas 10 atividades (padrão)
   * const response = await dashboardService.getRecentActivities();

   *
   * // Últimas 20 atividades
   * const response20 = await dashboardService.getRecentActivities(20);

   * ```
   */
  async getRecentActivities(limit: number = 10): Promise<ApiResponse<RecentActivity[]>> {
    if (limit < 1 || limit > 100) {
      return {
        success: false,
        error: 'Limit deve estar entre 1 e 100'};

    }

    return this.get<RecentActivity[]>('/recent-activities', { limit });

  }

  // ========================================
  // MÉTODOS DE MÉTRICAS ESPECÍFICAS
  // ========================================

  /**
   * Obtém estatísticas específicas de leads
   *
   * @description
   * Busca estatísticas detalhadas de leads para um período específico.
   *
   * @param {string} [period='30d'] - Período das estatísticas ('7d', '30d', '90d' ou '1y')
   * @returns {Promise<ApiResponse<any>>} Promise com estatísticas de leads
   *
   * @example
   * ```ts
   * const response = await dashboardService.getLeadsStats('30d');

   * ```
   */
  async getLeadsStats(period: string = '30d'): Promise<ApiResponse<any>> {
    return this.get<any>('/stats/leads', { period });

  }

  /**
   * Obtém estatísticas específicas de receita
   *
   * @description
   * Busca estatísticas detalhadas de receita para um período específico.
   *
   * @param {string} [period='30d'] - Período das estatísticas ('7d', '30d', '90d' ou '1y')
   * @returns {Promise<ApiResponse<any>>} Promise com estatísticas de receita
   *
   * @example
   * ```ts
   * const response = await dashboardService.getRevenueStats('30d');

   * ```
   */
  async getRevenueStats(period: string = '30d'): Promise<ApiResponse<any>> {
    return this.get<any>('/stats/revenue', { period });

  }

  /**
   * Obtém estatísticas específicas de atividades
   *
   * @description
   * Busca estatísticas detalhadas de atividades para um período específico.
   *
   * @param {string} [period='30d'] - Período das estatísticas ('7d', '30d', '90d' ou '1y')
   * @returns {Promise<ApiResponse<any>>} Promise com estatísticas de atividades
   *
   * @example
   * ```ts
   * const response = await dashboardService.getActivityStats('30d');

   * ```
   */
  async getActivityStats(period: string = '30d'): Promise<ApiResponse<any>> {
    return this.get<any>('/stats/activities', { period });

  }

  /**
   * Obtém estatísticas específicas de performance
   *
   * @description
   * Busca estatísticas detalhadas de performance para um período específico.
   *
   * @param {string} [period='30d'] - Período das estatísticas ('7d', '30d', '90d' ou '1y')
   * @returns {Promise<ApiResponse<any>>} Promise com estatísticas de performance
   *
   * @example
   * ```ts
   * const response = await dashboardService.getPerformanceStats('30d');

   * ```
   */
  async getPerformanceStats(period: string = '30d'): Promise<ApiResponse<any>> {
    return this.get<any>('/stats/performance', { period });

  }

  // ========================================
  // MÉTODOS DE GRÁFICOS
  // ========================================

  /**
   * Obtém dados de gráfico de leads
   *
   * @description
   * Busca dados formatados para exibição em gráfico de leads para um período específico.
   *
   * @param {string} [period='30d'] - Período do gráfico ('7d', '30d', '90d' ou '1y')
   * @returns {Promise<ApiResponse<any>>} Promise com dados do gráfico de leads
   *
   * @example
   * ```ts
   * const response = await dashboardService.getLeadsChart('30d');

   * ```
   */
  async getLeadsChart(period: string = '30d'): Promise<ApiResponse<any>> {
    return this.get<any>('/charts/leads', { period });

  }

  /**
   * Obtém dados de gráfico de receita
   *
   * @description
   * Busca dados formatados para exibição em gráfico de receita para um período específico.
   *
   * @param {string} [period='30d'] - Período do gráfico ('7d', '30d', '90d' ou '1y')
   * @returns {Promise<ApiResponse<any>>} Promise com dados do gráfico de receita
   *
   * @example
   * ```ts
   * const response = await dashboardService.getRevenueChart('30d');

   * ```
   */
  async getRevenueChart(period: string = '30d'): Promise<ApiResponse<any>> {
    return this.get<any>('/charts/revenue', { period });

  }

  /**
   * Obtém dados de gráfico de atividades
   *
   * @description
   * Busca dados formatados para exibição em gráfico de atividades para um período específico.
   *
   * @param {string} [period='30d'] - Período do gráfico ('7d', '30d', '90d' ou '1y')
   * @returns {Promise<ApiResponse<any>>} Promise com dados do gráfico de atividades
   *
   * @example
   * ```ts
   * const response = await dashboardService.getActivityChart('30d');

   * ```
   */
  async getActivityChart(period: string = '30d'): Promise<ApiResponse<any>> {
    return this.get<any>('/charts/activities', { period });

  }

  /**
   * Obtém dados de gráfico de conversão
   *
   * @description
   * Busca dados formatados para exibição em gráfico de conversão para um período específico.
   *
   * @param {string} [period='30d'] - Período do gráfico ('7d', '30d', '90d' ou '1y')
   * @returns {Promise<ApiResponse<any>>} Promise com dados do gráfico de conversão
   *
   * @example
   * ```ts
   * const response = await dashboardService.getConversionChart('30d');

   * ```
   */
  async getConversionChart(period: string = '30d'): Promise<ApiResponse<any>> {
    return this.get<any>('/charts/conversion', { period });

  }

  // ========================================
  // MÉTODOS DE WIDGETS
  // ========================================

  /**
   * Obtém todos os widgets do dashboard
   *
   * @description
   * Busca a lista de todos os widgets configurados no dashboard.
   *
   * @returns {Promise<ApiResponse<unknown[]>>} Promise com lista de widgets
   *
   * @example
   * ```ts
   * const response = await dashboardService.getWidgets();

   * if (response.success && (response as any).data) {
   *   (response as any).data.forEach(widget => {
   *   });

   * }
   * ```
   */
  async getWidgets(): Promise<ApiResponse<unknown[]>> {
    return this.get<unknown[]>('/widgets');

  }

  /**
   * Atualiza a configuração de um widget
   *
   * @description
   * Atualiza a configuração de um widget específico do dashboard.
   * Valida se o ID do widget foi fornecido.
   *
   * @param {string} id - ID do widget a ser atualizado
   * @param {Record<string, any>} config - Nova configuração do widget
   * @returns {Promise<ApiResponse<any>>} Promise com widget atualizado
   *
   * @example
   * ```ts
   * const response = await dashboardService.updateWidget('widget-123', {
   *   title: 'Novo Título',
   *   position: { x: 0, y: 0 }
   * });

   * ```
   */
  async updateWidget(id: string, config: Record<string, any>): Promise<ApiResponse<any>> {
    if (!id) {
      return {
        success: false,
        error: 'ID do widget é obrigatório'};

    }

    return this.put<DashboardWidget>(`/widgets/${id}`, config);

  }

  async addWidget(type: string, config: WidgetConfig): Promise<ApiResponse<DashboardWidget>> {
    if (!type) {
      return {
        success: false,
        error: 'Tipo do widget é obrigatório'};

    }

    return this.post<any>('/widgets', { type, config });

  }

  /**
   * Remove um widget do dashboard
   *
   * @description
   * Remove um widget específico do dashboard pelo ID.
   * Valida se o ID do widget foi fornecido.
   *
   * @param {string} id - ID do widget a ser removido
   * @returns {Promise<ApiResponse<void>>} Promise com resposta da remoção
   *
   * @example
   * ```ts
   * const response = await dashboardService.removeWidget('widget-123');

   * ```
   */
  async removeWidget(id: string): Promise<ApiResponse<void>> {
    if (!id) {
      return {
        success: false,
        error: 'ID do widget é obrigatório'};

    }

    return this.delete<void>(`/widgets/${id}`);

  }

  /**
   * Reordena os widgets do dashboard
   *
   * @description
   * Atualiza a ordem dos widgets no dashboard com base em uma lista de IDs.
   * Valida se a lista de IDs é válida e não está vazia.
   *
   * @param {string[]} widgetIds - Array com IDs dos widgets na nova ordem
   * @returns {Promise<ApiResponse<void>>} Promise com resposta da reordenação
   *
   * @example
   * ```ts
   * const response = await dashboardService.reorderWidgets([
   *   'widget-1',
   *   'widget-2',
   *   'widget-3'
   * ]);

   * ```
   */
  async reorderWidgets(widgetIds: string[]): Promise<ApiResponse<void>> {
    if (!Array.isArray(widgetIds) || widgetIds.length === 0) {
      return {
        success: false,
        error: 'Lista de IDs de widgets é obrigatória'};

    }

    return this.put<void>('/widgets/reorder', { widget_ids: widgetIds });

  }

  // ========================================
  // MÉTODOS DE ALERTAS
  // ========================================

  async getAlerts(): Promise<ApiResponse<DashboardAlert[]>> {
    return this.get<DashboardAlert[]>('/alerts');

  }

  async markAlertAsRead(id: string): Promise<ApiResponse<void>> {
    if (!id) {
      return {
        success: false,
        error: 'ID do alerta é obrigatório'};

    }

    return this.post<void>(`/alerts/${id}/read`);

  }

  /**
   * Marca todos os alertas como lidos
   *
   * @description
   * Marca todos os alertas do dashboard como lidos de uma vez.
   *
   * @returns {Promise<ApiResponse<void>>} Promise com resposta da marcação
   *
   * @example
   * ```ts
   * const response = await dashboardService.markAllAlertsAsRead();

   * ```
   */
  async markAllAlertsAsRead(): Promise<ApiResponse<void>> {
    return this.post<void>('/alerts/read-all');

  }

  /**
   * Remove um alerta do dashboard
   *
   * @description
   * Remove um alerta específico do dashboard pelo ID.
   * Valida se o ID do alerta foi fornecido.
   *
   * @param {string} id - ID do alerta a ser removido
   * @returns {Promise<ApiResponse<void>>} Promise com resposta da remoção
   *
   * @example
   * ```ts
   * const response = await dashboardService.deleteAlert('alert-123');

   * ```
   */
  async deleteAlert(id: string): Promise<ApiResponse<void>> {
    if (!id) {
      return {
        success: false,
        error: 'ID do alerta é obrigatório'};

    }

    return this.delete<void>(`/alerts/${id}`);

  }

  // ========================================
  // MÉTODOS DE NOTIFICAÇÕES
  // ========================================

  async getNotifications(limit: number = 20): Promise<ApiResponse<DashboardNotification[]>> {
    if (limit < 1 || limit > 100) {
      return {
        success: false,
        error: 'Limit deve estar entre 1 e 100'};

    }

    return this.get<DashboardNotification[]>('/notifications', { limit });

  }

  /**
   * Marca uma notificação como lida
   *
   * @description
   * Marca uma notificação específica como lida pelo ID.
   * Valida se o ID da notificação foi fornecido.
   *
   * @param {string} id - ID da notificação a ser marcada como lida
   * @returns {Promise<ApiResponse<void>>} Promise com resposta da marcação
   *
   * @example
   * ```ts
   * const response = await dashboardService.markNotificationAsRead('notif-123');

   * ```
   */
  async markNotificationAsRead(id: string): Promise<ApiResponse<void>> {
    if (!id) {
      return {
        success: false,
        error: 'ID da notificação é obrigatório'};

    }

    return this.post<void>(`/notifications/${id}/read`);

  }

  async markAllNotificationsAsRead(): Promise<ApiResponse<void>> {
    return this.post<void>('/notifications/read-all');

  }

  // ========================================
  // MÉTODOS DE RELATÓRIOS
  // ========================================

  /**
   * Obtém um relatório rápido do dashboard
   *
   * @description
   * Gera e retorna um relatório rápido de um tipo específico para um período.
   * Valida se o tipo de relatório é válido antes da requisição.
   *
   * @param {string} type - Tipo de relatório ('leads', 'revenue', 'activities' ou 'performance')
   * @param {string} [period='30d'] - Período do relatório ('7d', '30d', '90d' ou '1y')
   * @returns {Promise<ApiResponse<any>>} Promise com dados do relatório
   *
   * @example
   * ```ts
   * const response = await dashboardService.getQuickReport('leads', '30d');

   * ```
   */
  async getQuickReport(type: string, period: string = '30d'): Promise<ApiResponse<any>> {
    const validTypes = ['leads', 'revenue', 'activities', 'performance'];
    
    if (!validTypes.includes(type)) {
      return {
        success: false,
        error: 'Tipo de relatório inválido'};

    }

    return this.get<any>(`/reports/${type}`, { period });

  }

  /**
   * Gera e faz download de um relatório completo
   *
   * @description
   * Gera um relatório completo com configurações específicas e faz o download
   * do arquivo no formato solicitado (PDF, Excel ou CSV). Valida se tipo,
   * período e formato foram fornecidos.
   *
   * @param {Object} config - Configuração do relatório
   * @param {string} config.type - Tipo de relatório
   * @param {string} config.period - Período do relatório
   * @param {'pdf' | 'excel' | 'csv'} config.format - Formato do arquivo
   * @param {Record<string, any>} [config.filters] - Filtros adicionais opcionais
   * @returns {Promise<void>} Promise que resolve quando o download é iniciado
   * @throws {Error} Erro se tipo, período ou formato não forem fornecidos
   *
   * @example
   * ```ts
   * await dashboardService.generateReport({
   *   type: 'leads',
   *   period: '30d',
   *   format: 'pdf',
   *   filters: { status: 'active' }
   * });

   * ```
   */
  async generateReport(config: {
    type: string;
    period: string;
    format: 'pdf' | 'excel' | 'csv';
    filters?: Record<string, any>;
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

  async getDashboardConfig(): Promise<ApiResponse<DashboardConfig>> {
    return this.get<DashboardConfig>('/config');

  }

  async updateDashboardConfig(config: Partial<DashboardConfig>): Promise<ApiResponse<DashboardConfig>> {
    return this.put<DashboardConfig>('/config', config);

  }

  async resetDashboardConfig(): Promise<ApiResponse<DashboardConfig>> {
    return this.post<DashboardConfig>('/config/reset');

  }

  // ========================================
  // MÉTODOS DE CACHE
  // ========================================

  /**
   * Limpa o cache do dashboard
   *
   * @description
   * Limpa todo o cache de dados do dashboard no servidor.
   *
   * @returns {Promise<ApiResponse<void>>} Promise com resposta da limpeza
   *
   * @example
   * ```ts
   * const response = await dashboardService.clearCache();

   * ```
   */
  async clearCache(): Promise<ApiResponse<void>> {
    return this.post<void>('/cache/clear');

  }

  /**
   * Atualiza os dados do dashboard
   *
   * @description
   * Força a atualização de todos os dados do dashboard no servidor.
   *
   * @returns {Promise<ApiResponse<void>>} Promise com resposta da atualização
   *
   * @example
   * ```ts
   * const response = await dashboardService.refreshData();

   * ```
   */
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

  /**
   * Exporta um widget específico
   *
   * @description
   * Faz o download de uma exportação de um widget específico no formato especificado.
   * Valida se o ID do widget foi fornecido.
   *
   * @param {string} id - ID do widget a ser exportado
   * @param {'json' | 'pdf' | 'png'} [format='json'] - Formato da exportação ('json', 'pdf' ou 'png')
   * @returns {Promise<void>} Promise que resolve quando o download é iniciado
   * @throws {Error} Erro se o ID do widget não for fornecido
   *
   * @example
   * ```ts
   * // Exportar widget como JSON (padrão)
   * await dashboardService.exportWidget('widget-123');

   *
   * // Exportar widget como imagem PNG
   * await dashboardService.exportWidget('widget-123', 'png');

   * ```
   */
  async exportWidget(id: string, format: 'json' | 'pdf' | 'png' = 'json'): Promise<void> {
    if (!id) {
      throw new Error('ID do widget é obrigatório');

    }

    const filename = `widget_${id}_${new Date().toISOString().split('T')[0]}.${format}`;
    await this.download(`/widgets/${id}/export`, filename, { format });

  } // ========================================
// INSTÂNCIA GLOBAL
// ========================================

/**
 * Instância global do DashboardService
 *
 * @description
 * Instância única e compartilhada do DashboardService configurada com a URL base '/dashboard'.
 * Esta é a instância recomendada para uso na maioria dos casos, evitando a criação
 * de múltiplas instâncias desnecessárias.
 *
 * @constant {DashboardService}
 * @global
 *
 * @example
 * ```ts
 * import dashboardService from '@/services/global/dashboardService';
 *
 * // Usar a instância global
 * await dashboardService.getStats();

 * ```
 */
const dashboardService = new DashboardService();

// ========================================
// EXPORTS
// ========================================

export { DashboardService, dashboardService };

export default dashboardService;
