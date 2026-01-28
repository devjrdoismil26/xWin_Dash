import { apiClient } from '@/services';
import {
  DashboardMetrics,
  DashboardStats,
  RecentActivity,
  TopLead,
  RecentProject,
  DashboardData,
  DashboardResponse,
  DashboardFilters,
  WidgetConfig,
  WidgetData,
  DashboardLayout,
  WidgetResponse,
  LayoutResponse,
  WidgetDataResponse,
  DashboardLayoutItem,
  DashboardShare,
  DashboardSubscription,
  DashboardAlert,
  UniverseDashboardData
} from '../types/dashboardTypes';

class DashboardService {
  private api = apiClient;

  // ===== DASHBOARD METRICS =====
  async getMetrics(filters?: DashboardFilters): Promise<DashboardResponse> {
    try {
      const response = await this.api.get('/dashboard/metrics', { params: filters });
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

  async getOverview(filters?: DashboardFilters): Promise<DashboardResponse> {
    try {
      const response = await this.api.get('/dashboard/overview', { params: filters });
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

  async getActivities(filters?: DashboardFilters): Promise<DashboardResponse> {
    try {
      const response = await this.api.get('/dashboard/activities', { params: filters });
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

  async getStats(filters?: DashboardFilters): Promise<DashboardResponse> {
    try {
      const response = await this.api.get('/dashboard/stats', { params: filters });
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

  // ===== WIDGETS =====

  async updateWidgetConfig(widgetId: string, config: Partial<WidgetConfig>): Promise<WidgetResponse> {
    try {
      const response = await this.api.put(`/dashboard/widgets/${widgetId}`, config);
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

  // ===== WIDGETS - NEW ENDPOINTS =====
  async getWidgetData(widgetId: string, filters?: DashboardFilters): Promise<WidgetResponse> {
    try {
      const response = await this.api.get(`/dashboard/widgets/${widgetId}/data`, { params: filters });
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

  async refreshWidget(widgetId: string): Promise<WidgetResponse> {
    try {
      const response = await this.api.post(`/dashboard/widgets/${widgetId}/refresh`);
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

  // ===== LAYOUTS - NEW ENDPOINTS =====
  async getLayouts(): Promise<LayoutResponse> {
    try {
      const response = await this.api.get('/dashboard/layouts');
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

  async getLayout(): Promise<LayoutResponse> {
    try {
      const response = await this.api.get('/dashboard/layout');
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

  async getLayoutById(layoutId: string): Promise<LayoutResponse> {
    try {
      const response = await this.api.get(`/dashboard/layouts/${layoutId}`);
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

  async createLayout(layout: DashboardLayout): Promise<LayoutResponse> {
    try {
      const response = await this.api.post('/dashboard/layouts', layout);
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

  async updateLayoutById(layoutId: string, layout: Partial<DashboardLayout>): Promise<LayoutResponse> {
    try {
      const response = await this.api.put(`/dashboard/layouts/${layoutId}`, layout);
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

  async deleteLayoutById(layoutId: string): Promise<LayoutResponse> {
    try {
      const response = await this.api.delete(`/dashboard/layouts/${layoutId}`);
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

  async setDefaultLayout(layoutId: string): Promise<LayoutResponse> {
    try {
      const response = await this.api.post(`/dashboard/layouts/${layoutId}/set-default`);
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

  async saveLayout(layout: DashboardLayout): Promise<LayoutResponse> {
    try {
      const response = await this.api.post('/dashboard/layout', layout);
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

  async updateLayout(layoutId: string, layout: Partial<DashboardLayout>): Promise<LayoutResponse> {
    try {
      const response = await this.api.put(`/dashboard/layout/${layoutId}`, layout);
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

  async deleteLayout(layoutId: string): Promise<LayoutResponse> {
    try {
      const response = await this.api.delete(`/dashboard/layout/${layoutId}`);
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

  // ===== ANALYTICS =====
  async getAnalytics(filters?: DashboardFilters): Promise<DashboardResponse> {
    try {
      const response = await this.api.get('/dashboard/analytics', { params: filters });
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

  async getPerformanceMetrics(filters?: DashboardFilters): Promise<DashboardResponse> {
    try {
      const response = await this.api.get('/dashboard/performance', { params: filters });
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

  // ===== SHARING =====
  async shareDashboard(dashboardId: string, permissions: { view: boolean; edit: boolean; export: boolean }, expiresAt?: string): Promise<DashboardResponse> {
    try {
      const response = await this.api.post(`/dashboard/share/${dashboardId}`, {
        permissions,
        expires_at: expiresAt
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

  async getSharedDashboard(token: string): Promise<DashboardResponse> {
    try {
      const response = await this.api.get(`/dashboard/shared/${token}`);
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

  // ===== SUBSCRIPTIONS =====
  async subscribeToDashboard(notificationTypes: string[], frequency: 'realtime' | 'hourly' | 'daily' | 'weekly'): Promise<DashboardResponse> {
    try {
      const response = await this.api.post('/dashboard/subscribe', {
        notification_types: notificationTypes,
        frequency
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

  async unsubscribeFromDashboard(): Promise<DashboardResponse> {
    try {
      const response = await this.api.post('/dashboard/unsubscribe');
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

  // ===== ALERTS =====
  async getAlerts(): Promise<DashboardResponse> {
    try {
      const response = await this.api.get('/dashboard/alerts');
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

  async markAlertAsRead(alertId: string): Promise<DashboardResponse> {
    try {
      const response = await this.api.post(`/dashboard/alerts/${alertId}/read`);
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

  async markAllAlertsAsRead(): Promise<DashboardResponse> {
    try {
      const response = await this.api.post('/dashboard/alerts/read-all');
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

  // ===== UNIVERSE =====
  async getUniverseData(): Promise<DashboardResponse> {
    try {
      const response = await this.api.get('/dashboard/universe');
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

  // ===== EXPORT/IMPORT =====
  async exportDashboardData(format: 'json' | 'csv' | 'xlsx', filters?: DashboardFilters): Promise<DashboardResponse> {
    try {
      const response = await this.api.get('/dashboard/export', { 
        params: { format, ...filters },
        responseType: 'blob'
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

  async importDashboardData(file: File): Promise<DashboardResponse> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await this.api.post('/dashboard/import', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
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

  // ===== UTILITY METHODS =====
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
    if (trend === 'up') return '↗';
    if (trend === 'down') return '↘';
    return '→';
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

const dashboardService = new DashboardService();
export { dashboardService };
export default dashboardService;
