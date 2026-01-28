/**
 * Service de Analytics do módulo ADStool
 * Responsável por analytics e relatórios de anúncios
 */

import { apiClient } from '@/services';
import { AdsAnalytics, AdsPerformance, AdsResponse } from '../types';

class AdsAnalyticsService {
  private api = apiClient;

  /**
   * Busca analytics gerais
   */
  async getAnalytics(filters?: any): Promise<AdsResponse> {
    try {
      const response = await this.api.get('/adstool/analytics', { params: filters });
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

  /**
   * Busca performance de campanhas
   */
  async getCampaignPerformance(campaignId: string, period?: string): Promise<AdsResponse> {
    try {
      const params = period ? { period } : {};
      const response = await this.api.get(`/adstool/analytics/campaigns/${campaignId}/performance`, { params });
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

  /**
   * Busca performance de contas
   */
  async getAccountPerformance(accountId: string, period?: string): Promise<AdsResponse> {
    try {
      const params = period ? { period } : {};
      const response = await this.api.get(`/adstool/analytics/accounts/${accountId}/performance`, { params });
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

  /**
   * Busca performance de criativos
   */
  async getCreativePerformance(creativeId: string, period?: string): Promise<AdsResponse> {
    try {
      const params = period ? { period } : {};
      const response = await this.api.get(`/adstool/analytics/creatives/${creativeId}/performance`, { params });
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

  /**
   * Busca métricas em tempo real
   */
  async getRealTimeMetrics(filters?: any): Promise<AdsResponse> {
    try {
      const response = await this.api.get('/adstool/analytics/realtime', { params: filters });
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

  /**
   * Busca relatório personalizado
   */
  async getCustomReport(reportConfig: any): Promise<AdsResponse> {
    try {
      const response = await this.api.post('/adstool/analytics/reports/custom', reportConfig);
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

  /**
   * Busca relatório de ROI
   */
  async getROIReport(filters?: any): Promise<AdsResponse> {
    try {
      const response = await this.api.get('/adstool/analytics/reports/roi', { params: filters });
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

  /**
   * Busca relatório de conversões
   */
  async getConversionReport(filters?: any): Promise<AdsResponse> {
    try {
      const response = await this.api.get('/adstool/analytics/reports/conversions', { params: filters });
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

  /**
   * Busca relatório de demografia
   */
  async getDemographicsReport(filters?: any): Promise<AdsResponse> {
    try {
      const response = await this.api.get('/adstool/analytics/reports/demographics', { params: filters });
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

  /**
   * Busca relatório de dispositivos
   */
  async getDeviceReport(filters?: any): Promise<AdsResponse> {
    try {
      const response = await this.api.get('/adstool/analytics/reports/devices', { params: filters });
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

  /**
   * Busca relatório de localização
   */
  async getLocationReport(filters?: any): Promise<AdsResponse> {
    try {
      const response = await this.api.get('/adstool/analytics/reports/locations', { params: filters });
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

  /**
   * Busca relatório de horários
   */
  async getTimeReport(filters?: any): Promise<AdsResponse> {
    try {
      const response = await this.api.get('/adstool/analytics/reports/times', { params: filters });
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

  /**
   * Busca relatório de palavras-chave
   */
  async getKeywordsReport(filters?: any): Promise<AdsResponse> {
    try {
      const response = await this.api.get('/adstool/analytics/reports/keywords', { params: filters });
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

  /**
   * Busca relatório de competidores
   */
  async getCompetitorReport(filters?: any): Promise<AdsResponse> {
    try {
      const response = await this.api.get('/adstool/analytics/reports/competitors', { params: filters });
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

  /**
   * Busca insights de otimização
   */
  async getOptimizationInsights(filters?: any): Promise<AdsResponse> {
    try {
      const response = await this.api.get('/adstool/analytics/insights/optimization', { params: filters });
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

  /**
   * Busca insights de tendências
   */
  async getTrendInsights(filters?: any): Promise<AdsResponse> {
    try {
      const response = await this.api.get('/adstool/analytics/insights/trends', { params: filters });
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

  /**
   * Busca insights de audiência
   */
  async getAudienceInsights(filters?: any): Promise<AdsResponse> {
    try {
      const response = await this.api.get('/adstool/analytics/insights/audience', { params: filters });
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

  /**
   * Exporta relatório
   */
  async exportReport(reportType: string, format: string, filters?: any): Promise<AdsResponse> {
    try {
      const response = await this.api.post('/adstool/analytics/export', {
        report_type: reportType,
        format,
        filters
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

  /**
   * Agenda relatório
   */
  async scheduleReport(reportConfig: any): Promise<AdsResponse> {
    try {
      const response = await this.api.post('/adstool/analytics/schedule', reportConfig);
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

  /**
   * Busca relatórios agendados
   */
  async getScheduledReports(): Promise<AdsResponse> {
    try {
      const response = await this.api.get('/adstool/analytics/schedule');
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

  /**
   * Remove relatório agendado
   */
  async deleteScheduledReport(reportId: string): Promise<AdsResponse> {
    try {
      await this.api.delete(`/adstool/analytics/schedule/${reportId}`);
      return {
        success: true,
        message: 'Relatório agendado removido com sucesso'
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Busca alertas de performance
   */
  async getPerformanceAlerts(): Promise<AdsResponse> {
    try {
      const response = await this.api.get('/adstool/analytics/alerts');
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

  /**
   * Cria alerta de performance
   */
  async createPerformanceAlert(alertConfig: any): Promise<AdsResponse> {
    try {
      const response = await this.api.post('/adstool/analytics/alerts', alertConfig);
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

  /**
   * Atualiza alerta de performance
   */
  async updatePerformanceAlert(alertId: string, alertConfig: any): Promise<AdsResponse> {
    try {
      const response = await this.api.put(`/adstool/analytics/alerts/${alertId}`, alertConfig);
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

  /**
   * Remove alerta de performance
   */
  async deletePerformanceAlert(alertId: string): Promise<AdsResponse> {
    try {
      await this.api.delete(`/adstool/analytics/alerts/${alertId}`);
      return {
        success: true,
        message: 'Alerta removido com sucesso'
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }
}

export const adsAnalyticsService = new AdsAnalyticsService();
export default adsAnalyticsService;
