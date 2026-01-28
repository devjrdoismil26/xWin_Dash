/**
 * Service de Provedores AI
 * Gerencia integração com diferentes provedores de IA
 */
import { apiClient } from '@/services';
import { AIProvider, AIProviders, AIServicesStatus, AIResponse } from '../types';
import { getProviderConfig } from '../types/aiProviders';

class AIProviderService {
  private api = apiClient;

  /**
   * Obter status de todos os serviços
   */
  async getServicesStatus(): Promise<AIServicesStatus> {
    try {
      const response = await this.api.get('/ai/services/status');
      return response.data;
    } catch (error: any) {
      throw new Error(`Erro ao obter status dos serviços: ${error.message}`);
    }
  }

  /**
   * Obter informações de todos os provedores
   */
  async getProviders(): Promise<AIProviders> {
    try {
      const response = await this.api.get('/ai/providers');
      return response.data;
    } catch (error: any) {
      throw new Error(`Erro ao obter provedores: ${error.message}`);
    }
  }

  /**
   * Verificar status de um provedor específico
   */
  async checkProviderStatus(provider: AIProvider): Promise<AIResponse> {
    try {
      const response = await this.api.get(`/ai/providers/${provider}/status`);
      return response.data;
    } catch (error: any) {
      throw new Error(`Erro ao verificar status do provedor ${provider}: ${error.message}`);
    }
  }

  /**
   * Configurar API key de um provedor
   */
  async configureProvider(provider: AIProvider, apiKey: string): Promise<AIResponse> {
    try {
      const response = await this.api.post(`/ai/providers/${provider}/configure`, {
        api_key: apiKey
      });
      return response.data;
    } catch (error: any) {
      throw new Error(`Erro ao configurar provedor ${provider}: ${error.message}`);
    }
  }

  /**
   * Testar conexão com um provedor
   */
  async testProviderConnection(provider: AIProvider): Promise<AIResponse> {
    try {
      const response = await this.api.post(`/ai/providers/${provider}/test`);
      return response.data;
    } catch (error: any) {
      throw new Error(`Erro ao testar conexão com ${provider}: ${error.message}`);
    }
  }

  /**
   * Obter modelos disponíveis de um provedor
   */
  async getProviderModels(provider: AIProvider): Promise<AIResponse> {
    try {
      const response = await this.api.get(`/ai/providers/${provider}/models`);
      return response.data;
    } catch (error: any) {
      throw new Error(`Erro ao obter modelos do provedor ${provider}: ${error.message}`);
    }
  }

  /**
   * Obter informações de pricing de um provedor
   */
  async getProviderPricing(provider: AIProvider): Promise<AIResponse> {
    try {
      const response = await this.api.get(`/ai/providers/${provider}/pricing`);
      return response.data;
    } catch (error: any) {
      throw new Error(`Erro ao obter pricing do provedor ${provider}: ${error.message}`);
    }
  }

  /**
   * Obter estatísticas de uso de um provedor
   */
  async getProviderUsage(provider: AIProvider, period: string = 'week'): Promise<AIResponse> {
    try {
      const response = await this.api.get(`/ai/providers/${provider}/usage`, {
        params: { period }
      });
      return response.data;
    } catch (error: any) {
      throw new Error(`Erro ao obter uso do provedor ${provider}: ${error.message}`);
    }
  }

  /**
   * Obter configuração local de um provedor
   */
  getProviderConfig(provider: AIProvider) {
    return getProviderConfig(provider);
  }

  /**
   * Validar configuração de um provedor
   */
  async validateProviderConfig(provider: AIProvider, config: any): Promise<AIResponse> {
    try {
      const response = await this.api.post(`/ai/providers/${provider}/validate`, config);
      return response.data;
    } catch (error: any) {
      throw new Error(`Erro ao validar configuração do provedor ${provider}: ${error.message}`);
    }
  }

  /**
   * Obter logs de um provedor
   */
  async getProviderLogs(provider: AIProvider, limit: number = 100): Promise<AIResponse> {
    try {
      const response = await this.api.get(`/ai/providers/${provider}/logs`, {
        params: { limit }
      });
      return response.data;
    } catch (error: any) {
      throw new Error(`Erro ao obter logs do provedor ${provider}: ${error.message}`);
    }
  }

  /**
   * Reiniciar conexão com um provedor
   */
  async restartProvider(provider: AIProvider): Promise<AIResponse> {
    try {
      const response = await this.api.post(`/ai/providers/${provider}/restart`);
      return response.data;
    } catch (error: any) {
      throw new Error(`Erro ao reiniciar provedor ${provider}: ${error.message}`);
    }
  }
}

export default new AIProviderService();
