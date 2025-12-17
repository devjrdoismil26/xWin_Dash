/**
 * Servi?o de Dashboard - dashboardService
 *
 * @description
 * Servi?o centralizado para todas as opera??es relacionadas ao dashboard,
 * incluindo m?tricas, widgets, layouts, compartilhamento, assinaturas e alertas.
 * Fornece m?todos para buscar, atualizar e gerenciar dados do dashboard.
 *
 * Funcionalidades principais:
 * - Busca de m?tricas e estat?sticas
 * - Gerenciamento de widgets e layouts
 * - Compartilhamento de dashboards
 * - Assinaturas e notifica??es
 * - Alertas e notifica??es
 * - Exporta??o e importa??o de dados
 * - Integra??o com Universe
 * - Formata??o de dados (moeda, n?meros, datas)
 *
 * @module modules/Dashboard/services/dashboardService
 * @since 1.0.0
 *
 * @example
 * ```ts
 * import { dashboardService } from '@/modules/Dashboard/services/dashboardService';
 *
 * // Buscar m?tricas
 * const metrics = await dashboardService.getMetrics({ date_range: '30days' });

 *
 * // Atualizar widget
 * await dashboardService.updateWidgetConfig('widget-1', { visible: true });

 * ```
 */

import { apiClient } from '@/services';
import { getErrorMessage } from '@/utils/errorHelpers';
import { DashboardMetrics, DashboardStats, RecentActivity, TopLead, RecentProject, DashboardData, DashboardResponse, DashboardFilters, WidgetConfig, WidgetData, DashboardLayout, WidgetResponse, LayoutResponse, WidgetDataResponse, DashboardLayoutItem, DashboardShare, DashboardSubscription, DashboardAlert, UniverseDashboardData } from '../types/dashboardTypes';

/**
 * Classe DashboardService
 *
 * @description
 * Servi?o para gerenciar todas as opera??es do dashboard.
 *
 * @class DashboardService
 */
class DashboardService {
  private api = apiClient;

  // ===== DASHBOARD METRICS =====
  
  /**
   * Busca m?tricas do dashboard
   *
   * @description
   * Obt?m as m?tricas principais do dashboard com base nos filtros fornecidos.
   *
   * @param {DashboardFilters} [filters] - Filtros opcionais (per?odo, projeto, etc.)
   * @returns {Promise<DashboardResponse>} Resposta com m?tricas do dashboard
   *
   * @example
   * ```ts
   * const response = await dashboardService.getMetrics({
   *   date_range: '30days',
   *   project_id: '123'
   * });

   * ```
   */
  async getMetrics(filters?: DashboardFilters): Promise<DashboardResponse> {
    try {
      const response = await this.api.get('/dashboard/api/metrics', { params: filters }) as { data?: string};

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? getErrorMessage(error) : 'Erro desconhecido ao buscar m?tricas';
      return {
        success: false,
        error: errorMessage};

    } async getOverview(filters?: DashboardFilters): Promise<DashboardResponse> {
    try {
      const response = await this.api.get('/dashboard/api/overview', { params: filters }) as { data?: string};

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? getErrorMessage(error) : 'Erro desconhecido';
      return {
        success: false,
        error: errorMessage};

    } async getActivities(filters?: DashboardFilters): Promise<DashboardResponse> {
    try {
      const response = await this.api.get('/dashboard/api/activities', { params: filters }) as { data?: string};

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? getErrorMessage(error) : 'Erro desconhecido';
      return {
        success: false,
        error: errorMessage};

    } async getStats(filters?: DashboardFilters): Promise<DashboardResponse> {
    try {
      const response = await this.api.get('/dashboard/api/stats', { params: filters }) as { data?: string};

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? getErrorMessage(error) : 'Erro desconhecido';
      return {
        success: false,
        error: errorMessage};

    } // ===== WIDGETS =====

  async updateWidgetConfig(widgetId: string, config: Partial<WidgetConfig>): Promise<WidgetResponse> {
    try {
      const response = await this.api.put(`/dashboard/widgets/${widgetId}`, config) as { data?: string};

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? getErrorMessage(error) : 'Erro desconhecido';
      return {
        success: false,
        error: errorMessage};

    } // ===== WIDGETS - NEW ENDPOINTS =====
  async getWidgetData(widgetId: string, filters?: DashboardFilters): Promise<WidgetResponse> {
    try {
      const response = await this.api.get(`/dashboard/widgets/${widgetId}/data`, { params: filters }) as { data?: string};

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? getErrorMessage(error) : 'Erro desconhecido';
      return {
        success: false,
        error: errorMessage};

    } async refreshWidget(widgetId: string): Promise<WidgetResponse> {
    try {
      const response = await this.api.post(`/dashboard/widgets/${widgetId}/refresh`) as { data?: string};

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? getErrorMessage(error) : 'Erro desconhecido';
      return {
        success: false,
        error: errorMessage};

    } // ===== LAYOUTS - NEW ENDPOINTS =====
  async getLayouts(): Promise<LayoutResponse> {
    try {
      const response = await this.api.get('/dashboard/api/layouts') as { data?: string};

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? getErrorMessage(error) : 'Erro desconhecido';
      return {
        success: false,
        error: errorMessage};

    } async getLayout(): Promise<LayoutResponse> {
    try {
      const response = await this.api.get('/dashboard/api/layout') as { data?: string};

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? getErrorMessage(error) : 'Erro desconhecido';
      return {
        success: false,
        error: errorMessage};

    } async getLayoutById(layoutId: string): Promise<LayoutResponse> {
    try {
      const response = await this.api.get(`/dashboard/layouts/${layoutId}`) as { data?: string};

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? getErrorMessage(error) : 'Erro desconhecido';
      return {
        success: false,
        error: errorMessage};

    } async createLayout(layout: DashboardLayout): Promise<LayoutResponse> {
    try {
      const response = await this.api.post('/dashboard/api/layouts', layout) as { data?: string};

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? getErrorMessage(error) : 'Erro desconhecido';
      return {
        success: false,
        error: errorMessage};

    } async updateLayoutById(layoutId: string, layout: Partial<DashboardLayout>): Promise<LayoutResponse> {
    try {
      const response = await this.api.put(`/dashboard/layouts/${layoutId}`, layout) as { data?: string};

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error);

      return {
        success: false,
        error: errorMessage};

    } async deleteLayoutById(layoutId: string): Promise<LayoutResponse> {
    try {
      const response = await this.api.delete(`/dashboard/layouts/${layoutId}`) as { data?: string};

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error);

      return {
        success: false,
        error: errorMessage};

    } async setDefaultLayout(layoutId: string): Promise<LayoutResponse> {
    try {
      const response = await this.api.post(`/dashboard/layouts/${layoutId}/set-default`) as { data?: string};

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error);

      return {
        success: false,
        error: errorMessage};

    } async saveLayout(layout: DashboardLayout): Promise<LayoutResponse> {
    try {
      const response = await this.api.post('/dashboard/api/layout', layout) as { data?: string};

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error);

      return {
        success: false,
        error: errorMessage};

    } async updateLayout(layoutId: string, layout: Partial<DashboardLayout>): Promise<LayoutResponse> {
    try {
      const response = await this.api.put(`/dashboard/layout/${layoutId}`, layout) as { data?: string};

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error);

      return {
        success: false,
        error: errorMessage};

    } async deleteLayout(layoutId: string): Promise<LayoutResponse> {
    try {
      const response = await this.api.delete(`/dashboard/layout/${layoutId}`) as { data?: string};

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error);

      return {
        success: false,
        error: errorMessage};

    } // ===== ANALYTICS =====
  async getAnalytics(filters?: DashboardFilters): Promise<DashboardResponse> {
    try {
      const response = await this.api.get('/dashboard/api/analytics', { params: filters }) as { data?: string};

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error);

      return {
        success: false,
        error: errorMessage};

    } async getPerformanceMetrics(filters?: DashboardFilters): Promise<DashboardResponse> {
    try {
      const response = await this.api.get('/dashboard/api/performance', { params: filters }) as { data?: string};

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error);

      return {
        success: false,
        error: errorMessage};

    } // ===== SHARING =====
  async shareDashboard(dashboardId: string, permissions: { view: boolean; edit: boolean; export: boolean }, expiresAt?: string): Promise<DashboardResponse> {
    try {
      const response = await this.api.post(`/dashboard/share/${dashboardId}`, {
        permissions,
        expires_at: expiresAt
      }) as { data?: string};

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error);

      return {
        success: false,
        error: errorMessage};

    } async getSharedDashboard(token: string): Promise<DashboardResponse> {
    try {
      const response = await this.api.get(`/dashboard/shared/${token}`) as { data?: string};

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error);

      return {
        success: false,
        error: errorMessage};

    } // ===== SUBSCRIPTIONS =====
  async subscribeToDashboard(notificationTypes: string[], frequency: 'realtime' | 'hourly' | 'daily' | 'weekly'): Promise<DashboardResponse> {
    try {
      const response = await this.api.post('/dashboard/api/subscribe', {
        notification_types: notificationTypes,
        frequency
      }) as { data?: string};

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error);

      return {
        success: false,
        error: errorMessage};

    } async unsubscribeFromDashboard(): Promise<DashboardResponse> {
    try {
      const response = await this.api.post('/dashboard/api/unsubscribe') as { data?: string};

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error);

      return {
        success: false,
        error: errorMessage};

    } // ===== ALERTS =====
  async getAlerts(): Promise<DashboardResponse> {
    try {
      const response = await this.api.get('/dashboard/api/alerts') as { data?: string};

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error);

      return {
        success: false,
        error: errorMessage};

    } async markAlertAsRead(alertId: string): Promise<DashboardResponse> {
    try {
      const response = await this.api.post(`/dashboard/alerts/${alertId}/read`) as { data?: string};

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error);

      return {
        success: false,
        error: errorMessage};

    } async markAllAlertsAsRead(): Promise<DashboardResponse> {
    try {
      const response = await this.api.post('/dashboard/api/alerts/read-all') as { data?: string};

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error);

      return {
        success: false,
        error: errorMessage};

    } // ===== UNIVERSE =====
  async getUniverseData(): Promise<DashboardResponse> {
    try {
      const response = await this.api.get('/dashboard/api/universe') as { data?: string};

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error);

      return {
        success: false,
        error: errorMessage};

    } // ===== EXPORT/IMPORT =====
  async exportDashboardData(format: 'json' | 'csv' | 'xlsx', filters?: DashboardFilters): Promise<DashboardResponse> {
    try {
      const response = await this.api.get('/dashboard/api/export', { 
        params: { format, ...filters },
        responseType: 'blob'
      }) as { data: Blob};

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error);

      return {
        success: false,
        error: errorMessage};

    } async importDashboardData(file: File): Promise<DashboardResponse> {
    try {
      const formData = new FormData();

      formData.append('file', file);

      const response = await this.api.post('/dashboard/api/import', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        } ) as { data?: string};

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error);

      return {
        success: false,
        error: errorMessage};

    } // ===== UTILITY METHODS =====
  formatCurrency(value: number, currency: string = 'BRL'): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: currency
    }).format(value);

  }

  formatNumber(value: number): string {
    return new Intl.NumberFormat('pt-BR').format(value);

  }

  formatPercentage(value: number, decimals: number = 2): string {
    return `${value.toFixed(decimals)}%`;
  }

  formatDate(date: string | Date): string {
    return new Date(date).toLocaleDateString('pt-BR');

  }

  formatDateTime(date: string | Date): string {
    return new Date(date).toLocaleString('pt-BR');

  }

  calculateGrowthRate(current: number, previous: number): number {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100 * 10) / 10;
  }

  calculateConversionRate(converted: number, total: number): number {
    if (total === 0) return 0;
    return Math.round((converted / total) * 100 * 10) / 10;
  }

  getMetricTrend(current: number, previous: number): 'up' | 'down' | 'stable' {
    if (current > previous) return 'up';
    if (current < previous) return 'down';
    return 'stable';
  }

  getMetricColor(trend: 'up' | 'down' | 'stable', isPositive: boolean = true): string {
    if (trend === 'up') return isPositive ? 'text-green-600' : 'text-red-600';
    if (trend === 'down') return isPositive ? 'text-red-600' : 'text-green-600';
    return 'text-gray-600';
  }

  getMetricIcon(trend: 'up' | 'down' | 'stable'): string {
    if (trend === 'up') return '?';
    if (trend === 'down') return '?';
    return '?';
  } // ===== UTILITY FUNCTIONS =====
export const getCurrentProjectId = (): string | null => {
  return localStorage.getItem('current_project_id');};

export const getAuthHeaders = (): Record<string, string> => {
  const token = localStorage.getItem('auth_token');

  return token ? { Authorization: `Bearer ${token}` } : {};
};

const dashboardService = new DashboardService();

export { dashboardService };

export default dashboardService;
