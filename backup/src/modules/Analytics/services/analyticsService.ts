import { apiClient } from '@/services';
import {
  AnalyticsDashboard,
  AnalyticsReport,
  AnalyticsMetric,
  GoogleAnalyticsConfig,
  GoogleAnalyticsData,
  AnalyticsInsight,
  ReportSchedule,
  ReportShare,
  AnalyticsDashboardItem,
  AnalyticsSegment,
  AnalyticsFunnel,
  AnalyticsCohort,
  AnalyticsGoal,
  AnalyticsAlert,
  AnalyticsExport,
  AnalyticsIntegration,
  AnalyticsCustomEvent,
  AnalyticsRealTimeData,
  AnalyticsResponse,
  AnalyticsListResponse,
  AnalyticsStatsResponse,
  AnalyticsExportResponse,
  AnalyticsFilters,
  AnalyticsReportFilters,
  AnalyticsDashboardFilters
} from '../types/analyticsTypes';

// ===== INTERFACES TYPESCRIPT NATIVAS =====
export interface AnalyticsDashboard {
  total_visitors: number;
  total_sessions: number;
  bounce_rate: number;
  avg_session_duration: number;
  conversion_rate: number;
  top_pages: Array<{
    page: string;
    views: number;
    unique_views: number;
  }>;
  traffic_sources: Array<{
    source: string;
    visitors: number;
    percentage: number;
  }>;
  device_types: Array<{
    device: string;
    visitors: number;
    percentage: number;
  }>;
  recent_activity: Array<{
    timestamp: string;
    event: string;
    details: string;
  }>;
}

export interface AnalyticsReport {
  id: string;
  name: string;
  type: 'overview' | 'detailed' | 'custom';
  filters: any;
  data: any;
  created_at: string;
  updated_at: string;
}

export interface AnalyticsMetric {
  id: string;
  name: string;
  value: number;
  change: number;
  change_percentage: number;
  period: string;
  category: string;
  created_at: string;
}

export interface GoogleAnalyticsConfig {
  property_id: string;
  view_id: string;
  credentials: any;
  is_active: boolean;
}

export interface GoogleAnalyticsData {
  visitors: number;
  sessions: number;
  pageviews: number;
  bounce_rate: number;
  avg_session_duration: number;
  top_pages: Array<{
    page: string;
    views: number;
  }>;
  traffic_sources: Array<{
    source: string;
    sessions: number;
  }>;
}

export interface AnalyticsInsight {
  id: string;
  title: string;
  description: string;
  type: 'trend' | 'anomaly' | 'recommendation';
  priority: 'low' | 'medium' | 'high';
  data: any;
  created_at: string;
}

export interface AnalyticsData {
  id: string;
  [key: string]: any;
}

export interface AnalyticsResponse {
  success: boolean;
  data?: AnalyticsData | AnalyticsData[];
  message?: string;
  error?: string;
}

class AnalyticsService {
  private api = apiClient;

  // ===== DASHBOARD =====
  async getDashboard(): Promise<AnalyticsResponse> {
    try {
      const response = await this.api.get('/analytics/dashboard');
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

  // ===== RELATÓRIOS =====
  async getReports(filters: any = {}): Promise<AnalyticsResponse> {
    try {
      const response = await this.api.get('/analytics/reports', { params: filters });
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

  async createReport(reportData: any): Promise<AnalyticsResponse> {
    try {
      const response = await this.api.post('/analytics/reports', reportData);
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

  async updateReport(reportId: string, reportData: any): Promise<AnalyticsResponse> {
    try {
      const response = await this.api.put(`/analytics/reports/${reportId}`, reportData);
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

  async deleteReport(reportId: string): Promise<AnalyticsResponse> {
    try {
      const response = await this.api.delete(`/analytics/reports/${reportId}`);
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

  async exportReport(reportId: string, format = 'csv'): Promise<AnalyticsResponse> {
    try {
      const response = await this.api.get(`/analytics/reports/${reportId}/export`, {
        params: { format },
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

  // ===== MÉTRICAS =====
  async getMetrics(filters: any = {}): Promise<AnalyticsResponse> {
    try {
      const response = await this.api.get('/analytics/metrics', { params: filters });
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

  async getMetricDetails(metricId: string): Promise<AnalyticsResponse> {
    try {
      const response = await this.api.get(`/analytics/metrics/${metricId}`);
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

  // ===== GOOGLE ANALYTICS =====
  async connectGoogleAnalytics(config: GoogleAnalyticsConfig): Promise<AnalyticsResponse> {
    try {
      const response = await this.api.post('/analytics/google-analytics/connect', config);
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

  async disconnectGoogleAnalytics(): Promise<AnalyticsResponse> {
    try {
      const response = await this.api.delete('/analytics/google-analytics/disconnect');
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

  async getGoogleAnalyticsData(filters: any = {}): Promise<AnalyticsResponse> {
    try {
      const response = await this.api.get('/analytics/google-analytics/data', { params: filters });
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

  async getRealTimeMetrics(): Promise<AnalyticsResponse> {
    try {
      const response = await this.api.get('/analytics/google-analytics/realtime');
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

  // ===== REPORTS - NEW ENDPOINTS =====
  async scheduleReport(reportId: string, schedule: any): Promise<AnalyticsResponse> {
    try {
      const response = await this.api.post(`/analytics/reports/${reportId}/schedule`, schedule);
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

  async getReportSchedule(reportId: string): Promise<AnalyticsResponse> {
    try {
      const response = await this.api.get(`/analytics/reports/${reportId}/schedule`);
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

  async shareReport(reportId: string, permissions: any): Promise<AnalyticsResponse> {
    try {
      const response = await this.api.post(`/analytics/reports/${reportId}/share`, permissions);
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

  async getReportShare(reportId: string): Promise<AnalyticsResponse> {
    try {
      const response = await this.api.get(`/analytics/reports/${reportId}/share`);
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

  // ===== DASHBOARDS - NEW ENDPOINTS =====
  async getDashboards(filters: AnalyticsDashboardFilters = {}): Promise<AnalyticsListResponse> {
    try {
      const response = await this.api.get('/analytics/dashboards', { params: filters });
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

  async createDashboard(dashboardData: any): Promise<AnalyticsResponse> {
    try {
      const response = await this.api.post('/analytics/dashboards', dashboardData);
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

  async updateDashboard(dashboardId: string, dashboardData: any): Promise<AnalyticsResponse> {
    try {
      const response = await this.api.put(`/analytics/dashboards/${dashboardId}`, dashboardData);
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

  async deleteDashboard(dashboardId: string): Promise<AnalyticsResponse> {
    try {
      const response = await this.api.delete(`/analytics/dashboards/${dashboardId}`);
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

  // ===== SEGMENTS - NEW ENDPOINTS =====
  async getSegments(filters: AnalyticsFilters = {}): Promise<AnalyticsListResponse> {
    try {
      const response = await this.api.get('/analytics/segments', { params: filters });
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

  async createSegment(segmentData: any): Promise<AnalyticsResponse> {
    try {
      const response = await this.api.post('/analytics/segments', segmentData);
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

  // ===== FUNNELS - NEW ENDPOINTS =====
  async getFunnels(filters: AnalyticsFilters = {}): Promise<AnalyticsListResponse> {
    try {
      const response = await this.api.get('/analytics/funnels', { params: filters });
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

  async createFunnel(funnelData: any): Promise<AnalyticsResponse> {
    try {
      const response = await this.api.post('/analytics/funnels', funnelData);
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

  // ===== COHORTS - NEW ENDPOINTS =====
  async getCohorts(filters: AnalyticsFilters = {}): Promise<AnalyticsListResponse> {
    try {
      const response = await this.api.get('/analytics/cohorts', { params: filters });
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

  async createCohort(cohortData: any): Promise<AnalyticsResponse> {
    try {
      const response = await this.api.post('/analytics/cohorts', cohortData);
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

  // ===== INSIGHTS =====
  async generateInsights(filters: AnalyticsFilters = {}): Promise<AnalyticsResponse> {
    try {
      const response = await this.api.post('/analytics/insights/generate', filters);
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

  async getInsights(): Promise<AnalyticsResponse> {
    try {
      const response = await this.api.get('/analytics/insights');
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
  formatNumber(value: number): string {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }
    return value.toString();
  }

  formatPercentage(value: number): string {
    return `${value.toFixed(2)}%`;
  }

  formatDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  calculateChangePercentage(current: number, previous: number): number {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  }

  getChangeColor(change: number): string {
    if (change > 0) return 'green';
    if (change < 0) return 'red';
    return 'gray';
  }

  getChangeIcon(change: number): string {
    if (change > 0) return '↗️';
    if (change < 0) return '↘️';
    return '→';
  }

  formatDateRange(startDate: string, endDate: string): string {
    const start = new Date(startDate).toLocaleDateString('pt-BR');
    const end = new Date(endDate).toLocaleDateString('pt-BR');
    return `${start} - ${end}`;
  }

  getMetricCategory(category: string): string {
    const categoryMap: { [key: string]: string } = {
      traffic: 'Tráfego',
      engagement: 'Engajamento',
      conversion: 'Conversão',
      performance: 'Performance',
      user: 'Usuários',
      content: 'Conteúdo'
    };
    return categoryMap[category] || category;
  }

  getInsightType(type: string): string {
    const typeMap: { [key: string]: string } = {
      trend: 'Tendência',
      anomaly: 'Anomalia',
      recommendation: 'Recomendação'
    };
    return typeMap[type] || type;
  }

  getInsightPriority(priority: string): string {
    const priorityMap: { [key: string]: string } = {
      low: 'Baixa',
      medium: 'Média',
      high: 'Alta'
    };
    return priorityMap[priority] || priority;
  }

  getInsightPriorityColor(priority: string): string {
    const colorMap: { [key: string]: string } = {
      low: 'blue',
      medium: 'yellow',
      high: 'red'
    };
    return colorMap[priority] || 'gray';
  }

  validateReportData(reportData: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!reportData.name || reportData.name.trim().length === 0) {
      errors.push('Nome do relatório é obrigatório');
    }

    if (!reportData.type || !['overview', 'detailed', 'custom'].includes(reportData.type)) {
      errors.push('Tipo de relatório inválido');
    }

    if (!reportData.filters || typeof reportData.filters !== 'object') {
      errors.push('Filtros são obrigatórios');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  validateGoogleAnalyticsConfig(config: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!config.property_id || config.property_id.trim().length === 0) {
      errors.push('Property ID é obrigatório');
    }

    if (!config.view_id || config.view_id.trim().length === 0) {
      errors.push('View ID é obrigatório');
    }

    if (!config.credentials || typeof config.credentials !== 'object') {
      errors.push('Credenciais são obrigatórias');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
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

const analyticsService = new AnalyticsService();
export { analyticsService };
export default analyticsService;
