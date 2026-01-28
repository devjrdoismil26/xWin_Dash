import { apiClient } from '@/services';
import {
  AuraConnection,
  AuraFlow,
  AuraChat,
  AuraMessage,
  AuraTemplate,
  AuraStats,
  AuraConnectionConfig,
  AuraPlatform,
  AuraConnectionStatus,
  AuraChatStatus,
  AuraMessageType,
  AuraMessageDirection,
  AuraMessageStatus,
  AuraFlowTrigger,
  AuraTriggerType,
  AuraTriggerCondition,
  AuraFlowNode,
  AuraNodeType,
  AuraFlowStatus,
  AuraTemplateType,
  AuraFlowExecution,
  AuraAnalyticsOverview,
  AuraConnectionAnalytics,
  AuraFlowAnalytics,
  AuraPerformanceMetrics,
  AuraEngagementMetrics,
  AuraConversionMetrics,
  AuraROIMetrics,
  AuraTrendData,
  AuraBenchmark,
  AuraReport,
  AuraDashboard,
  AuraAlert,
  AuraAnalyticsResponse,
  AuraTrendsResponse,
  AuraBenchmarksResponse,
  AuraReportsResponse,
  AuraDashboardsResponse,
  AuraAlertsResponse
} from '../types/auraTypes';

export interface AuraWebhook {
  id: string;
  name: string;
  url: string;
  events: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AuraData {
  id: string;
  [key: string]: any;
}

export interface AuraResponse {
  success: boolean;
  data?: AuraData | AuraData[];
  message?: string;
  error?: string;
}

export interface AuraAnalytics {
  total_messages: number;
  total_chats: number;
  total_flows: number;
  active_connections: number;
  response_time_avg: number;
  engagement_rate: number;
}

class AuraService {
  private api = apiClient;

  // ===== CONNECTIONS =====
  async getConnections(params: any = {}): Promise<AuraResponse> {
    try {
      const response = await this.api.get('/aura/connections', { params });
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

  async createConnection(data: any): Promise<AuraResponse> {
    try {
      const response = await this.api.post('/aura/connections', data);
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

  async getConnection(id: string): Promise<AuraResponse> {
    try {
      const response = await this.api.get(`/aura/connections/${id}`);
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

  async updateConnection(id: string, data: any): Promise<AuraResponse> {
    try {
      const response = await this.api.put(`/aura/connections/${id}`, data);
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

  async deleteConnection(id: string): Promise<AuraResponse> {
    try {
      const response = await this.api.delete(`/aura/connections/${id}`);
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

  async testConnection(id: string): Promise<AuraResponse> {
    try {
      const response = await this.api.post(`/aura/connections/${id}/test`);
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

  async connectWhatsApp(id: string): Promise<AuraResponse> {
    try {
      const response = await this.api.post(`/aura/connections/${id}/connect`);
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

  async disconnectWhatsApp(id: string): Promise<AuraResponse> {
    try {
      const response = await this.api.post(`/aura/connections/${id}/disconnect`);
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

  async getConnectionStatistics(id: string): Promise<AuraResponse> {
    try {
      const response = await this.api.get(`/aura/connections/${id}/statistics`);
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

  async getWebhookUrl(id: string): Promise<AuraResponse> {
    try {
      const response = await this.api.get(`/aura/connections/${id}/webhook-url`);
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

  // ===== FLOWS =====
  async getFlows(params: any = {}): Promise<AuraResponse> {
    try {
      const response = await this.api.get('/aura/flows', { params });
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

  async createFlow(data: any): Promise<AuraResponse> {
    try {
      const response = await this.api.post('/aura/flows', data);
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

  async getFlow(id: string): Promise<AuraResponse> {
    try {
      const response = await this.api.get(`/aura/flows/${id}`);
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

  async updateFlow(id: string, data: any): Promise<AuraResponse> {
    try {
      const response = await this.api.put(`/aura/flows/${id}`, data);
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

  async deleteFlow(id: string): Promise<AuraResponse> {
    try {
      const response = await this.api.delete(`/aura/flows/${id}`);
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

  async executeFlow(id: string, phoneNumber: string, variables: any = {}): Promise<AuraResponse> {
    try {
      const response = await this.api.post(`/aura/flows/${id}/execute`, {
        phone_number: phoneNumber,
        variables
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

  async pauseFlow(id: string): Promise<AuraResponse> {
    try {
      const response = await this.api.post(`/aura/flows/${id}/pause`);
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

  async resumeFlow(id: string): Promise<AuraResponse> {
    try {
      const response = await this.api.post(`/aura/flows/${id}/resume`);
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

  // ===== CHATS =====
  async getChats(params: any = {}): Promise<AuraResponse> {
    try {
      const response = await this.api.get('/aura/chats', { params });
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

  async createChat(data: any): Promise<AuraResponse> {
    try {
      const response = await this.api.post('/aura/chats', data);
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

  async getChat(id: string): Promise<AuraResponse> {
    try {
      const response = await this.api.get(`/aura/chats/${id}`);
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

  async updateChat(id: string, data: any): Promise<AuraResponse> {
    try {
      const response = await this.api.put(`/aura/chats/${id}`, data);
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

  async deleteChat(id: string): Promise<AuraResponse> {
    try {
      const response = await this.api.delete(`/aura/chats/${id}`);
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

  async sendMessage(chatId: string, message: any): Promise<AuraResponse> {
    try {
      const response = await this.api.post(`/aura/chats/${chatId}/send-message`, message);
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

  async getChatMessages(chatId: string, params: any = {}): Promise<AuraResponse> {
    try {
      const response = await this.api.get(`/aura/chats/${chatId}/messages`, { params });
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

  async markAsRead(chatId: string): Promise<AuraResponse> {
    try {
      const response = await this.api.post(`/aura/chats/${chatId}/mark-read`);
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

  async closeChat(chatId: string): Promise<AuraResponse> {
    try {
      const response = await this.api.post(`/aura/chats/${chatId}/close`);
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

  // ===== TEMPLATES =====
  async getTemplates(params: any = {}): Promise<AuraResponse> {
    try {
      const response = await this.api.get('/aura/templates', { params });
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

  async createTemplate(data: any): Promise<AuraResponse> {
    try {
      const response = await this.api.post('/aura/templates', data);
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

  async getTemplate(id: string): Promise<AuraResponse> {
    try {
      const response = await this.api.get(`/aura/templates/${id}`);
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

  async updateTemplate(id: string, data: any): Promise<AuraResponse> {
    try {
      const response = await this.api.put(`/aura/templates/${id}`, data);
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

  async deleteTemplate(id: string): Promise<AuraResponse> {
    try {
      const response = await this.api.delete(`/aura/templates/${id}`);
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
  async getAnalytics(params: any = {}): Promise<AuraResponse> {
    try {
      const response = await this.api.get('/aura/analytics', { params });
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



  // ===== WEBHOOKS =====
  async getWebhooks(params: any = {}): Promise<AuraResponse> {
    try {
      const response = await this.api.get('/aura/webhooks', { params });
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

  async createWebhook(data: any): Promise<AuraResponse> {
    try {
      const response = await this.api.post('/aura/webhooks', data);
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

  async updateWebhook(id: string, data: any): Promise<AuraResponse> {
    try {
      const response = await this.api.put(`/aura/webhooks/${id}`, data);
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

  async deleteWebhook(id: string): Promise<AuraResponse> {
    try {
      const response = await this.api.delete(`/aura/webhooks/${id}`);
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

  async testWebhook(id: string): Promise<AuraResponse> {
    try {
      const response = await this.api.post(`/aura/webhooks/${id}/test`);
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

  // ===== ANALYTICS METHODS =====
  async getAnalyticsOverview(params: any = {}): Promise<AuraAnalyticsResponse> {
    try {
      const response = await this.api.get('/aura/analytics/overview', { params });
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

  async getConnectionAnalytics(connectionId: string, params: any = {}): Promise<AuraAnalyticsResponse> {
    try {
      const response = await this.api.get(`/aura/analytics/connections/${connectionId}`, { params });
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

  async getFlowAnalytics(flowId: string, params: any = {}): Promise<AuraAnalyticsResponse> {
    try {
      const response = await this.api.get(`/aura/analytics/flows/${flowId}`, { params });
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

  async getPerformanceAnalytics(params: any = {}): Promise<AuraAnalyticsResponse> {
    try {
      const response = await this.api.get('/aura/analytics/performance', { params });
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

  async getEngagementAnalytics(params: any = {}): Promise<AuraAnalyticsResponse> {
    try {
      const response = await this.api.get('/aura/analytics/engagement', { params });
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

  async getConversionAnalytics(params: any = {}): Promise<AuraAnalyticsResponse> {
    try {
      const response = await this.api.get('/aura/analytics/conversion', { params });
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

  async getROIAnalytics(params: any = {}): Promise<AuraAnalyticsResponse> {
    try {
      const response = await this.api.get('/aura/analytics/roi', { params });
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

  async getTrendsAnalytics(params: any = {}): Promise<AuraTrendsResponse> {
    try {
      const response = await this.api.get('/aura/analytics/trends', { params });
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

  async getBenchmarksAnalytics(params: any = {}): Promise<AuraBenchmarksResponse> {
    try {
      const response = await this.api.get('/aura/analytics/benchmarks', { params });
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

  async exportAnalytics(params: any = {}): Promise<AuraResponse> {
    try {
      const response = await this.api.get('/aura/analytics/export', { params });
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

  // ===== REPORTS METHODS =====
  async getReports(params: any = {}): Promise<AuraReportsResponse> {
    try {
      const response = await this.api.get('/aura/analytics/reports', { params });
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

  async createReport(data: any): Promise<AuraReportsResponse> {
    try {
      const response = await this.api.post('/aura/analytics/reports', data);
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

  async getReport(id: string): Promise<AuraReportsResponse> {
    try {
      const response = await this.api.get(`/aura/analytics/reports/${id}`);
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

  async updateReport(id: string, data: any): Promise<AuraReportsResponse> {
    try {
      const response = await this.api.put(`/aura/analytics/reports/${id}`, data);
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

  async deleteReport(id: string): Promise<AuraResponse> {
    try {
      const response = await this.api.delete(`/aura/analytics/reports/${id}`);
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

  async generateReport(id: string): Promise<AuraResponse> {
    try {
      const response = await this.api.post(`/aura/analytics/reports/${id}/generate`);
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

  // ===== DASHBOARDS METHODS =====
  async getDashboards(params: any = {}): Promise<AuraDashboardsResponse> {
    try {
      const response = await this.api.get('/aura/analytics/dashboards', { params });
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

  async createDashboard(data: any): Promise<AuraDashboardsResponse> {
    try {
      const response = await this.api.post('/aura/analytics/dashboards', data);
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

  async getDashboard(id: string): Promise<AuraDashboardsResponse> {
    try {
      const response = await this.api.get(`/aura/analytics/dashboards/${id}`);
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

  async updateDashboard(id: string, data: any): Promise<AuraDashboardsResponse> {
    try {
      const response = await this.api.put(`/aura/analytics/dashboards/${id}`, data);
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

  async deleteDashboard(id: string): Promise<AuraResponse> {
    try {
      const response = await this.api.delete(`/aura/analytics/dashboards/${id}`);
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

  async setDefaultDashboard(id: string): Promise<AuraResponse> {
    try {
      const response = await this.api.post(`/aura/analytics/dashboards/${id}/set-default`);
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

  // ===== ALERTS METHODS =====
  async getAlerts(params: any = {}): Promise<AuraAlertsResponse> {
    try {
      const response = await this.api.get('/aura/analytics/alerts', { params });
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

  async createAlert(data: any): Promise<AuraAlertsResponse> {
    try {
      const response = await this.api.post('/aura/analytics/alerts', data);
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

  async getAlert(id: string): Promise<AuraAlertsResponse> {
    try {
      const response = await this.api.get(`/aura/analytics/alerts/${id}`);
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

  async updateAlert(id: string, data: any): Promise<AuraAlertsResponse> {
    try {
      const response = await this.api.put(`/aura/analytics/alerts/${id}`, data);
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

  async deleteAlert(id: string): Promise<AuraResponse> {
    try {
      const response = await this.api.delete(`/aura/analytics/alerts/${id}`);
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

  async toggleAlert(id: string): Promise<AuraResponse> {
    try {
      const response = await this.api.post(`/aura/analytics/alerts/${id}/toggle`);
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
  formatPhoneNumber(phoneNumber: string): string {
    const cleaned = phoneNumber.replace(/\D/g, '');
    
    if (cleaned.length === 11 && cleaned.startsWith('11')) {
      return `+55${cleaned}`;
    } else if (cleaned.length === 10) {
      return `+5511${cleaned}`;
    } else if (cleaned.length === 13 && cleaned.startsWith('55')) {
      return `+${cleaned}`;
    }
    
    return phoneNumber;
  }

  validatePhoneNumber(phoneNumber: string): boolean {
    const cleaned = phoneNumber.replace(/\D/g, '');
    return cleaned.length >= 10 && cleaned.length <= 15;
  }

  formatTimestamp(timestamp: string): string {
    return new Date(timestamp).toLocaleString('pt-BR');
  }

  calculateStats(data: any[]): { total: number; active: number; inactive: number } {
    if (!data || !Array.isArray(data)) return { total: 0, active: 0, inactive: 0 };
    
    const total = data.length;
    const active = data.filter(item => item.is_active || item.status === 'active').length;
    const inactive = total - active;
    
    return { total, active, inactive };
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

const auraService = new AuraService();
export { auraService };
export default auraService;
