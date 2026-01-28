/**
 * Service para o módulo EmailMarketingCore
 * Gerencia métricas, dashboard e funcionalidades básicas
 */

import { apiClient } from '@/services';
import { 
  EmailMarketingMetrics, 
  EmailMarketingStats, 
  EmailMarketingDashboard,
  EmailMarketingResponse,
  EmailMarketingMetricsResponse,
  EmailMarketingDashboardResponse 
} from '../types';

export class EmailMarketingCoreService {
  private api = apiClient;

  // ===== MÉTRICAS =====
  async getMetrics(): Promise<EmailMarketingMetricsResponse> {
    try {
      const response = await this.api.get('/email-marketing/metrics');
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

  async getStats(): Promise<EmailMarketingResponse> {
    try {
      const response = await this.api.get('/email-marketing/stats');
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

  async getDashboard(): Promise<EmailMarketingDashboardResponse> {
    try {
      const response = await this.api.get('/email-marketing/dashboard');
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

  // ===== CONFIGURAÇÕES =====
  async getSettings(): Promise<EmailMarketingResponse> {
    try {
      const response = await this.api.get('/email-marketing/settings');
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

  async updateSettings(settings: any): Promise<EmailMarketingResponse> {
    try {
      const response = await this.api.put('/email-marketing/settings', settings);
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

  // ===== ATIVIDADES =====
  async getRecentActivities(limit: number = 10): Promise<EmailMarketingResponse> {
    try {
      const response = await this.api.get('/email-marketing/activities', {
        params: { limit }
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

  // ===== EXPORTAÇÃO =====
  async exportData(format: 'json' | 'csv' | 'xlsx' = 'json'): Promise<EmailMarketingResponse> {
    try {
      const response = await this.api.post('/email-marketing/export', {
        format
      }, {
        responseType: 'blob'
      });
      
      // Criar download do arquivo
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `email-marketing-export-${new Date().toISOString().split('T')[0]}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      return {
        success: true,
        data: { message: 'Export completed successfully' }
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // ===== NOTIFICAÇÕES =====
  async getNotifications(): Promise<EmailMarketingResponse> {
    try {
      const response = await this.api.get('/email-marketing/notifications');
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

  async markNotificationAsRead(id: string): Promise<EmailMarketingResponse> {
    try {
      const response = await this.api.put(`/email-marketing/notifications/${id}/read`);
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

  // ===== HEALTH CHECK =====
  async healthCheck(): Promise<EmailMarketingResponse> {
    try {
      const response = await this.api.get('/email-marketing/health');
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

  // ===== CACHE =====
  async clearCache(): Promise<EmailMarketingResponse> {
    try {
      const response = await this.api.post('/email-marketing/cache/clear');
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

  // ===== UTILITÁRIOS =====
  async refreshMetrics(): Promise<EmailMarketingMetricsResponse> {
    try {
      const response = await this.api.post('/email-marketing/metrics/refresh');
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

  async getSystemStatus(): Promise<EmailMarketingResponse> {
    try {
      const response = await this.api.get('/email-marketing/system/status');
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
}

// Instância singleton
export const emailMarketingCoreService = new EmailMarketingCoreService();
export default emailMarketingCoreService;
