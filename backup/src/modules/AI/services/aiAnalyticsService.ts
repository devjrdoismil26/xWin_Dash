/**
 * Service de Analytics AI
 * Gerencia métricas, relatórios e insights de IA
 */
import { apiClient } from '@/services';
import { AIAnalytics, AIPeriod, AIResponse } from '../types';

class AIAnalyticsService {
  private api = apiClient;

  /**
   * Obter analytics por período
   */
  async getAnalytics(period: AIPeriod): Promise<AIAnalytics> {
    try {
      const response = await this.api.get('/ai/analytics', {
        params: { period }
      });
      return response.data;
    } catch (error: any) {
      throw new Error(`Erro ao obter analytics: ${error.message}`);
    }
  }

  /**
   * Obter métricas em tempo real
   */
  async getRealTimeMetrics(): Promise<AIResponse> {
    try {
      const response = await this.api.get('/ai/analytics/realtime');
      return response.data;
    } catch (error: any) {
      throw new Error(`Erro ao obter métricas em tempo real: ${error.message}`);
    }
  }

  /**
   * Obter tendências
   */
  async getTrends(period: AIPeriod): Promise<AIResponse> {
    try {
      const response = await this.api.get('/ai/analytics/trends', {
        params: { period }
      });
      return response.data;
    } catch (error: any) {
      throw new Error(`Erro ao obter tendências: ${error.message}`);
    }
  }

  /**
   * Obter insights
   */
  async getInsights(period: AIPeriod): Promise<AIResponse> {
    try {
      const response = await this.api.get('/ai/analytics/insights', {
        params: { period }
      });
      return response.data;
    } catch (error: any) {
      throw new Error(`Erro ao obter insights: ${error.message}`);
    }
  }

  /**
   * Obter relatório detalhado
   */
  async getDetailedReport(period: AIPeriod, format: 'json' | 'pdf' = 'json'): Promise<AIResponse> {
    try {
      const response = await this.api.get('/ai/analytics/report', {
        params: { period, format }
      });
      return response.data;
    } catch (error: any) {
      throw new Error(`Erro ao obter relatório: ${error.message}`);
    }
  }

  /**
   * Obter estatísticas de uso por provedor
   */
  async getProviderUsageStats(period: AIPeriod): Promise<AIResponse> {
    try {
      const response = await this.api.get('/ai/analytics/provider-usage', {
        params: { period }
      });
      return response.data;
    } catch (error: any) {
      throw new Error(`Erro ao obter estatísticas de provedores: ${error.message}`);
    }
  }

  /**
   * Obter estatísticas de custos
   */
  async getCostAnalytics(period: AIPeriod): Promise<AIResponse> {
    try {
      const response = await this.api.get('/ai/analytics/costs', {
        params: { period }
      });
      return response.data;
    } catch (error: any) {
      throw new Error(`Erro ao obter analytics de custos: ${error.message}`);
    }
  }

  /**
   * Obter estatísticas de qualidade
   */
  async getQualityAnalytics(period: AIPeriod): Promise<AIResponse> {
    try {
      const response = await this.api.get('/ai/analytics/quality', {
        params: { period }
      });
      return response.data;
    } catch (error: any) {
      throw new Error(`Erro ao obter analytics de qualidade: ${error.message}`);
    }
  }

  /**
   * Obter estatísticas de performance
   */
  async getPerformanceAnalytics(period: AIPeriod): Promise<AIResponse> {
    try {
      const response = await this.api.get('/ai/analytics/performance', {
        params: { period }
      });
      return response.data;
    } catch (error: any) {
      throw new Error(`Erro ao obter analytics de performance: ${error.message}`);
    }
  }

  /**
   * Obter comparação entre períodos
   */
  async getPeriodComparison(currentPeriod: AIPeriod, previousPeriod: AIPeriod): Promise<AIResponse> {
    try {
      const response = await this.api.get('/ai/analytics/comparison', {
        params: { current_period: currentPeriod, previous_period: previousPeriod }
      });
      return response.data;
    } catch (error: any) {
      throw new Error(`Erro ao obter comparação de períodos: ${error.message}`);
    }
  }

  /**
   * Obter previsões
   */
  async getForecasts(period: AIPeriod, forecastDays: number = 30): Promise<AIResponse> {
    try {
      const response = await this.api.get('/ai/analytics/forecasts', {
        params: { period, forecast_days: forecastDays }
      });
      return response.data;
    } catch (error: any) {
      throw new Error(`Erro ao obter previsões: ${error.message}`);
    }
  }

  /**
   * Obter alertas
   */
  async getAlerts(): Promise<AIResponse> {
    try {
      const response = await this.api.get('/ai/analytics/alerts');
      return response.data;
    } catch (error: any) {
      throw new Error(`Erro ao obter alertas: ${error.message}`);
    }
  }

  /**
   * Configurar alertas
   */
  async configureAlerts(alertConfig: any): Promise<AIResponse> {
    try {
      const response = await this.api.post('/ai/analytics/alerts/configure', alertConfig);
      return response.data;
    } catch (error: any) {
      throw new Error(`Erro ao configurar alertas: ${error.message}`);
    }
  }

  /**
   * Exportar analytics
   */
  async exportAnalytics(period: AIPeriod, format: 'json' | 'csv' | 'xlsx' = 'json'): Promise<Blob> {
    try {
      const response = await this.api.get('/ai/analytics/export', {
        params: { period, format },
        responseType: 'blob'
      });
      return response.data;
    } catch (error: any) {
      throw new Error(`Erro ao exportar analytics: ${error.message}`);
    }
  }

  /**
   * Obter dashboard data
   */
  async getDashboardData(): Promise<AIResponse> {
    try {
      const response = await this.api.get('/ai/analytics/dashboard');
      return response.data;
    } catch (error: any) {
      throw new Error(`Erro ao obter dados do dashboard: ${error.message}`);
    }
  }

  /**
   * Obter métricas customizadas
   */
  async getCustomMetrics(metrics: string[], period: AIPeriod): Promise<AIResponse> {
    try {
      const response = await this.api.post('/ai/analytics/custom-metrics', {
        metrics,
        period
      });
      return response.data;
    } catch (error: any) {
      throw new Error(`Erro ao obter métricas customizadas: ${error.message}`);
    }
  }

  /**
   * Criar relatório personalizado
   */
  async createCustomReport(reportConfig: any): Promise<AIResponse> {
    try {
      const response = await this.api.post('/ai/analytics/custom-report', reportConfig);
      return response.data;
    } catch (error: any) {
      throw new Error(`Erro ao criar relatório personalizado: ${error.message}`);
    }
  }
}

export default new AIAnalyticsService();
