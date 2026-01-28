import { apiClient } from '@/services';

interface AnalyticsData {
  id: string;
  name: string;
  value: number;
  timestamp: string;
}

interface AnalyticsResponse<T = AnalyticsData> {
  success: boolean;
  data?: T;
  error?: string;
}

class AnalyticsApiService {
  private api = apiClient;

  async getAnalyticsData(period: string = '7d'): Promise<AnalyticsResponse<AnalyticsData[]>> {
    try {
      const response = await this.api.get('/analytics/data', {
        params: { period }
      });
      return response.data;
    } catch (error) {
      return {
        success: false,
        error: 'Erro ao carregar dados de analytics'
      };
    }
  }

  async getMetrics(): Promise<AnalyticsResponse<Record<string, unknown>>> {
    try {
      const response = await this.api.get('/analytics/metrics');
      return response.data;
    } catch (error) {
      return {
        success: false,
        error: 'Erro ao carregar métricas'
      };
    }
  }

  async getReports(): Promise<AnalyticsResponse<Record<string, unknown>[]>> {
    try {
      const response = await this.api.get('/analytics/reports');
      return response.data;
    } catch (error) {
      return {
        success: false,
        error: 'Erro ao carregar relatórios'
      };
    }
  }
}

export default new AnalyticsApiService();