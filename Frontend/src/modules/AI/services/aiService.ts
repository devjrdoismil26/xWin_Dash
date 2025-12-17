/**
 * Service principal do módulo AI - Orquestrador
 * @module modules/AI/services/aiService
 * @description
 * Service orquestrador que coordena todos os serviços especializados do módulo AI,
 * fornecendo operações de alto nível que combinam múltiplos serviços especializados
 * para gerenciamento completo de provedores, geração de conteúdo (texto, imagem, vídeo),
 * analytics, histórico, exportação de dados e métodos de compatibilidade (deprecated).
 * @since 1.0.0
 */
import aiProviderService from './aiProviderService';
import aiGenerationService from './aiGenerationService';
import aiAnalyticsService from './aiAnalyticsService';
import { AIProvider, AIServicesStatus, AIProviders, GenerateTextRequest, GenerateImageRequest, GenerateVideoRequest, AIGeneration, AIAnalytics, AIResponse } from '../types';

/**
 * Classe AIService - Service Principal do Módulo AI
 * @class
 * @description
 * Service orquestrador que coordena todos os serviços especializados do módulo AI,
 * fornecendo interface unificada para operações de alto nível.
 * 
 * @example
 * ```typescript
 * import { aiService } from '@/modules/AI/services/aiService';
 * 
 * // Gerar texto
 * const text = await aiService.generateText({
 *   prompt: 'Escreva um artigo sobre IA',
 *   provider: 'openai',
 *   model: 'gpt-4'
 * });

 * 
 * // Obter analytics
 * const analytics = await aiService.getAnalytics('week');

 * 
 * // Exportar dados
 * const blob = await aiService.exportData('generations', 'json');

 * ```
 */
class AIService {
  // Services especializados
  public providers = aiProviderService;
  public generation = aiGenerationService;
  public analytics = aiAnalyticsService;

  /**
   * Obter status de todos os serviços
   * @description
   * Obtém status de todos os serviços de IA conectados.
   *
   * @returns {Promise<AIServicesStatus>} Status de todos os serviços
   *
   * @example
   * ```typescript
   * const status = await aiService.getServicesStatus();

   * ```
   */
  async getServicesStatus(): Promise<AIServicesStatus> {
    return this.providers.getServicesStatus();

  }

  /**
   * Obter informações de todos os provedores
   * @description
   * Obtém informações completas de todos os provedores de IA disponíveis.
   *
   * @returns {Promise<AIProviders>} Informações de todos os provedores
   *
   * @example
   * ```typescript
   * const providers = await aiService.getProviders();

   * ```
   */
  async getProviders(): Promise<AIProviders> {
    return this.providers.getProviders();

  }

  /**
   * Gerar texto usando IA
   * @description
   * Gera texto usando IA com base na requisição fornecida.
   *
   * @param {GenerateTextRequest} request - Requisição de geração de texto
   * @returns {Promise<string>} Texto gerado
   *
   * @example
   * ```typescript
   * const text = await aiService.generateText({
   *   prompt: 'Escreva um artigo sobre IA',
   *   provider: 'openai',
   *   model: 'gpt-4'
   * });

   * ```
   */
  async generateText(request: GenerateTextRequest): Promise<string> {
    return this.generation.generateText(request);

  }

  /**
   * Gerar imagem usando IA
   * @description
   * Gera imagem usando IA com base na requisição fornecida.
   *
   * @param {GenerateImageRequest} request - Requisição de geração de imagem
   * @returns {Promise<string>} URL da imagem gerada
   *
   * @example
   * ```typescript
   * const imageUrl = await aiService.generateImage({
   *   prompt: 'Um gato fofo',
   *   size: '1024x1024'
   * });

   * ```
   */
  async generateImage(request: GenerateImageRequest): Promise<string> {
    return this.generation.generateImage(request);

  }

  /**
   * Gerar vídeo usando IA
   * @description
   * Gera vídeo usando IA com base na requisição fornecida.
   *
   * @param {GenerateVideoRequest} request - Requisição de geração de vídeo
   * @returns {Promise<string>} URL do vídeo gerado
   *
   * @example
   * ```typescript
   * const videoUrl = await aiService.generateVideo({
   *   prompt: 'Um vídeo de paisagem',
   *   duration: 10,
   *   resolution: '1080p'
   * });

   * ```
   */
  async generateVideo(request: GenerateVideoRequest): Promise<string> {
    return this.generation.generateVideo(request);

  }

  /**
   * Obter histórico de gerações
   */
  async getHistory(filters: Record<string, any> = {}): Promise<AIGeneration[]> {
    return this.generation.getGenerations(filters);

  }

  /**
   * Obter analytics por período
   */
  async getAnalytics(period: string = 'week'): Promise<AIAnalytics> {
    return this.analytics.getAnalytics(period as 'day' | 'week' | 'month' | 'year');

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
    return this.analytics.getInsights(period as 'day' | 'week' | 'month' | 'year');

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
  async exportData(type: 'generations' | 'analytics', format: 'json' | 'csv' = 'json', filters?: Record<string, any>): Promise<Blob> {
    if (type === 'generations') {
      return this.generation.exportGenerations(format, filters);

    } else {
      return this.analytics.exportAnalytics('week', format);

    } /**
   * Métodos de compatibilidade (deprecated)
   * @deprecated Use generateText, generateImage ou generateVideo
   */

  /**
   * Chat (deprecated)
   * @deprecated Use generateText com history
   * @description
   * Método de compatibilidade para chat. Use generateText com history.
   *
   * @param {string} message - Mensagem do chat
   * @param {Record<string, any>} [context={}] - Contexto adicional (opcional, padrão: {})
   * @returns {Promise<AIResponse>} Resposta do chat
   */
  async chat(message: string, context: Record<string, any> = {}): Promise<AIResponse> {
    return this.generation.generateText({
      prompt: message,
      ...context
    }).then(result => ({
      success: true,
      data: { result } )).catch(error => ({
      success: false,
      error: (error as any).message
    }));

  }

  /**
   * Analisar texto (deprecated)
   * @deprecated Use generateText com prompt de análise
   * @description
   * Método de compatibilidade para análise de texto.
   *
   * @param {string} text - Texto a analisar
   * @param {Record<string, any>} [options={}] - Opções adicionais (opcional, padrão: {})
   * @returns {Promise<AIResponse>} Resposta da análise
   */
  async analyzeText(text: string, options: Record<string, any> = {}): Promise<AIResponse> {
    return this.generation.generateText({
      prompt: `Analise o seguinte texto: ${text}`,
      ...options
    }).then(result => ({
      success: true,
      data: { result } )).catch(error => ({
      success: false,
      error: (error as any).message
    }));

  }

  /**
   * Traduzir texto (deprecated)
   * @deprecated Use generateText com prompt de tradução
   * @description
   * Método de compatibilidade para tradução de texto.
   *
   * @param {string} text - Texto a traduzir
   * @param {string} [targetLanguage='pt'] - Idioma de destino (opcional, padrão: 'pt')
   * @param {string} [sourceLanguage='auto'] - Idioma de origem (opcional, padrão: 'auto')
   * @returns {Promise<AIResponse>} Resposta da tradução
   */
  async translateText(text: string, targetLanguage = 'pt', sourceLanguage = 'auto'): Promise<AIResponse> {
    return this.generation.generateText({
      prompt: `Traduza o seguinte texto do ${sourceLanguage} para ${targetLanguage}: ${text}`
    }).then(result => ({
      success: true,
      data: { result } )).catch(error => ({
      success: false,
      error: (error as any).message
    }));

  }

  /**
   * Resumir texto (deprecated)
   * @deprecated Use generateText com prompt de resumo
   * @description
   * Método de compatibilidade para resumo de texto.
   *
   * @param {string} text - Texto a resumir
   * @param {number} [maxLength=200] - Comprimento máximo (opcional, padrão: 200)
   * @returns {Promise<AIResponse>} Resposta do resumo
   */
  async summarizeText(text: string, maxLength = 200): Promise<AIResponse> {
    return this.generation.generateText({
      prompt: `Resuma o seguinte texto em no máximo ${maxLength} caracteres: ${text}`
    }).then(result => ({
      success: true,
      data: { result } )).catch(error => ({
      success: false,
      error: (error as any).message
    }));

  }

  /**
   * Obter estatísticas (deprecated)
   * @deprecated Use getRealTimeMetrics
   * @description
   * Método de compatibilidade para obter estatísticas.
   *
   * @returns {Promise<AIResponse>} Resposta com estatísticas
   */
  async getStats(): Promise<AIResponse> {
    return this.analytics.getRealTimeMetrics();

  }

  /**
   * Testar conexões (deprecated)
   * @deprecated Use getServicesStatus
   * @description
   * Método de compatibilidade para testar conexões.
   *
   * @returns {Promise<AIResponse>} Resposta do teste
   */
  async testConnections(): Promise<AIResponse> {
    return this.providers.getServicesStatus().then(status => ({
      success: true,
      data: status
    })).catch(error => ({
      success: false,
      error: (error as any).message
    }));

  } /**
 * Helper para obter o ID do projeto ativo
 * @description
 * Obtém o ID do projeto atualmente ativo do localStorage.
 *
 * @returns {string | null} ID do projeto ativo ou null se não encontrado
 *
 * @example
 * ```typescript
 * const projectId = getCurrentProjectId();

 * ```
 */
const getCurrentProjectId = () => {
  const activeProject = localStorage.getItem('activeProject');

  if (activeProject) {
    try {
      const project = JSON.parse(activeProject);

      return project.id;
    } catch (error) {
      console.error('Erro ao parsear projeto ativo:', error);

    } return null;};

/**
 * Helper para obter headers de autenticação
 * @description
 * Obtém os headers de autenticação a partir do token armazenado no localStorage ou sessionStorage.
 *
 * @returns {object} Headers de autenticação com Bearer token ou objeto vazio
 *
 * @example
 * ```typescript
 * const headers = getAuthHeaders();

 * ```
 */
const getAuthHeaders = () => {
  const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');

  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Exportar helpers para uso externo
export { getCurrentProjectId, getAuthHeaders };

export default new AIService();
