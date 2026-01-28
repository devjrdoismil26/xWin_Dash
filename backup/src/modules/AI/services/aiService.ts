/**
 * Service principal do módulo AI - Orquestrador
 * Coordena todos os serviços especializados
 */
import aiProviderService from './aiProviderService';
import aiGenerationService from './aiGenerationService';
import aiAnalyticsService from './aiAnalyticsService';
import { 
  AIProvider, 
  AIServicesStatus, 
  AIProviders, 
  GenerateTextRequest, 
  GenerateImageRequest, 
  GenerateVideoRequest,
  AIGeneration,
  AIAnalytics,
  AIResponse 
} from '../types';

class AIService {
  // Services especializados
  public providers = aiProviderService;
  public generation = aiGenerationService;
  public analytics = aiAnalyticsService;

  /**
   * Obter status de todos os serviços
   */
  async getServicesStatus(): Promise<AIServicesStatus> {
    return this.providers.getServicesStatus();
  }

  /**
   * Obter informações de todos os provedores
   */
  async getProviders(): Promise<AIProviders> {
    return this.providers.getProviders();
  }

  /**
   * Gerar texto usando IA
   */
  async generateText(request: GenerateTextRequest): Promise<string> {
    return this.generation.generateText(request);
  }

  /**
   * Gerar imagem usando IA
   */
  async generateImage(request: GenerateImageRequest): Promise<string> {
    return this.generation.generateImage(request);
  }

  /**
   * Gerar vídeo usando IA
   */
  async generateVideo(request: GenerateVideoRequest): Promise<string> {
    return this.generation.generateVideo(request);
  }

  /**
   * Obter histórico de gerações
   */
  async getHistory(filters: any = {}): Promise<AIGeneration[]> {
    return this.generation.getGenerations(filters);
  }

  /**
   * Obter analytics por período
   */
  async getAnalytics(period: string = 'week'): Promise<AIAnalytics> {
    return this.analytics.getAnalytics(period as any);
  }

  /**
   * Salvar geração no histórico
   */
  async saveGeneration(generation: AIGeneration): Promise<AIResponse> {
    return this.generation.saveGeneration(generation);
  }

  /**
   * Excluir geração
   */
  async deleteGeneration(id: string): Promise<AIResponse> {
    return this.generation.deleteGeneration(id);
  }

  /**
   * Verificar status de um provedor específico
   */
  async checkProviderStatus(provider: AIProvider): Promise<AIResponse> {
    return this.providers.checkProviderStatus(provider);
  }

  /**
   * Testar conexão com um provedor
   */
  async testProviderConnection(provider: AIProvider): Promise<AIResponse> {
    return this.providers.testProviderConnection(provider);
  }

  /**
   * Obter métricas em tempo real
   */
  async getRealTimeMetrics(): Promise<AIResponse> {
    return this.analytics.getRealTimeMetrics();
  }

  /**
   * Obter insights
   */
  async getInsights(period: string = 'week'): Promise<AIResponse> {
    return this.analytics.getInsights(period as any);
  }

  /**
   * Obter estatísticas de gerações
   */
  async getGenerationStats(period: string = 'week'): Promise<AIResponse> {
    return this.generation.getGenerationStats(period);
  }

  /**
   * Exportar dados
   */
  async exportData(type: 'generations' | 'analytics', format: 'json' | 'csv' = 'json', filters?: any): Promise<Blob> {
    if (type === 'generations') {
      return this.generation.exportGenerations(format, filters);
    } else {
      return this.analytics.exportAnalytics('week', format);
    }
  }

  // Métodos de compatibilidade (deprecated)
  async chat(message: string, context: any = {}): Promise<AIResponse> {
    return this.generation.generateText({
      prompt: message,
      ...context
    }).then(result => ({
      success: true,
      data: { result }
    })).catch(error => ({
      success: false,
      error: error.message
    }));
  }

  async analyzeText(text: string, options: any = {}): Promise<AIResponse> {
    return this.generation.generateText({
      prompt: `Analise o seguinte texto: ${text}`,
      ...options
    }).then(result => ({
      success: true,
      data: { result }
    })).catch(error => ({
      success: false,
      error: error.message
    }));
  }

  async translateText(text: string, targetLanguage = 'pt', sourceLanguage = 'auto'): Promise<AIResponse> {
    return this.generation.generateText({
      prompt: `Traduza o seguinte texto do ${sourceLanguage} para ${targetLanguage}: ${text}`
    }).then(result => ({
      success: true,
      data: { result }
    })).catch(error => ({
      success: false,
      error: error.message
    }));
  }

  async summarizeText(text: string, maxLength = 200): Promise<AIResponse> {
    return this.generation.generateText({
      prompt: `Resuma o seguinte texto em no máximo ${maxLength} caracteres: ${text}`
    }).then(result => ({
      success: true,
      data: { result }
    })).catch(error => ({
      success: false,
      error: error.message
    }));
  }

  async getStats(): Promise<AIResponse> {
    return this.analytics.getRealTimeMetrics();
  }

  async testConnections(): Promise<AIResponse> {
    return this.providers.getServicesStatus().then(status => ({
      success: true,
      data: status
    })).catch(error => ({
      success: false,
      error: error.message
    }));
  }
}

// Helper para obter o ID do projeto ativo
const getCurrentProjectId = () => {
  const activeProject = localStorage.getItem('activeProject');
  if (activeProject) {
    try {
      const project = JSON.parse(activeProject);
      return project.id;
    } catch (error) {
      console.error('Erro ao parsear projeto ativo:', error);
    }
  }
  return null;
};

// Helper para obter headers de autenticação
const getAuthHeaders = () => {
  const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Exportar helpers para uso externo
export { getCurrentProjectId, getAuthHeaders };

export default new AIService();
