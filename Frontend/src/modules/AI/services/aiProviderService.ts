/**
import { getErrorMessage } from '@/utils/errorHelpers';
import {  } from '@/lib/utils';
// getErrorMessage removido - usar try/catch direto
 * Service de Provedores AI
 * @module modules/AI/services/aiProviderService
 * @description
 * Service responsável por gerenciar integração com diferentes provedores de IA,
 * incluindo obtenção de status de serviços, listagem de provedores, verificação
 * de status de provedores, configuração de API keys, testes de conexão,
 * obtenção de modelos disponíveis, informações de pricing, estatísticas de uso,
 * validação de configurações, logs e reinicialização de provedores.
 * @since 1.0.0
 */
import { apiClient } from '@/services';
import { AIProvider, AIProviders, AIServicesStatus, AIResponse } from '../types';
import { getProviderConfig } from '../types/aiProviders';

/**
 * Classe AIProviderService - Service de Provedores de IA
 * @class
 * @description
 * Service que gerencia todas as operações relacionadas a provedores de IA,
 * fornecendo funcionalidades completas de gerenciamento e integração.
 * 
 * @example
 * ```typescript
 * import { aiProviderService } from '@/modules/AI/services/aiProviderService';
 * 
 * // Obter status de serviços
 * const status = await aiProviderService.getServicesStatus();

 * 
 * // Obter provedores
 * const providers = await aiProviderService.getProviders();

 * 
 * // Configurar provedor
 * await aiProviderService.configureProvider('openai', 'sk-...');

 * ```
 */
class AIProviderService {
  private api = apiClient;

  /**
   * Obter status de todos os serviços
   * @description
   * Obtém status de todos os serviços de IA conectados.
   *
   * @returns {Promise<AIServicesStatus>} Status de todos os serviços
   * @throws {Error} Se houver erro ao obter status
   *
   * @example
   * ```typescript
   * const status = await aiProviderService.getServicesStatus();

   * ```
   */
  async getServicesStatus(): Promise<AIServicesStatus> {
    try {
      const response = await this.api.get('/ai/services/status') as { data: AIServicesStatus};

      return (response as any).data as any;
    } catch (error: unknown) {
      throw new Error(`Erro ao obter status dos serviços: ${getErrorMessage(error)}`);

    } /**
   * Obter informações de todos os provedores
   * @description
   * Retorna informações detalhadas de todos os provedores de IA disponíveis.
   *
   * @returns {Promise<AIProviders>} Informações de todos os provedores
   * @throws {Error} Se houver erro ao obter provedores
   *
   * @example
   * ```typescript
   * const providers = await aiProviderService.getProviders();

   *  // 'OpenAI'
   * ```
   */
  async getProviders(): Promise<AIProviders> {
    try {
      const response = await this.api.get('/ai/providers') as { data: AIProviders};

      return (response as any).data as any;
    } catch (error: unknown) {
      throw new Error(`Erro ao obter provedores: ${getErrorMessage(error)}`);

    } /**
   * Verificar status de um provedor específico
   * @description
   * Verifica o status de conexão de um provedor específico.
   *
   * @param {AIProvider} provider - Provedor a verificar
   * @returns {Promise<AIResponse>} Resposta com status do provedor
   * @throws {Error} Se houver erro ao verificar status
   *
   * @example
   * ```typescript
   * const status = await aiProviderService.checkProviderStatus('openai');

   *  // 'active'
   * ```
   */
  async checkProviderStatus(provider: AIProvider): Promise<AIResponse> {
    try {
      const response = await this.api.get(`/ai/providers/${provider}/status`) as { data: AIResponse};

      return (response as any).data as any;
    } catch (error: unknown) {
      throw new Error(`Erro ao verificar status do provedor ${provider}: ${getErrorMessage(error)}`);

    } /**
   * Configurar API key de um provedor
   * @description
   * Configura a API key de um provedor específico.
   *
   * @param {AIProvider} provider - Provedor a configurar
   * @param {string} apiKey - API key do provedor
   * @returns {Promise<AIResponse>} Resposta da configuração
   * @throws {Error} Se houver erro ao configurar
   *
   * @example
   * ```typescript
   * await aiProviderService.configureProvider('openai', 'sk-...');

   * ```
   */
  async configureProvider(provider: AIProvider, apiKey: string): Promise<AIResponse> {
    try {
      const response = await this.api.post(`/ai/providers/${provider}/configure`, {
        api_key: apiKey
      }) as { data: AIResponse};

      return (response as any).data as any;
    } catch (error: unknown) {
      throw new Error(`Erro ao configurar provedor ${provider}: ${getErrorMessage(error)}`);

    } /**
   * Testar conexão com um provedor
   * @description
   * Testa a conexão com um provedor específico.
   *
   * @param {AIProvider} provider - Provedor a testar
   * @returns {Promise<AIResponse>} Resposta do teste
   * @throws {Error} Se houver erro ao testar conexão
   *
   * @example
   * ```typescript
   * const result = await aiProviderService.testProviderConnection('openai');

   *  // true
   * ```
   */
  async testProviderConnection(provider: AIProvider): Promise<AIResponse> {
    try {
      const response = await this.api.post(`/ai/providers/${provider}/test`) as { data: AIResponse};

      return (response as any).data as any;
    } catch (error: unknown) {
      throw new Error(`Erro ao testar conexão com ${provider}: ${getErrorMessage(error)}`);

    } /**
   * Obter modelos disponíveis de um provedor
   * @description
   * Retorna lista de modelos disponíveis para um provedor específico.
   *
   * @param {AIProvider} provider - Provedor a consultar
   * @returns {Promise<AIResponse>} Resposta com lista de modelos
   * @throws {Error} Se houver erro ao obter modelos
   *
   * @example
   * ```typescript
   * const models = await aiProviderService.getProviderModels('openai');

   *  // ['gpt-4', 'gpt-3.5-turbo', ...]
   * ```
   */
  async getProviderModels(provider: AIProvider): Promise<AIResponse> {
    try {
      const response = await this.api.get(`/ai/providers/${provider}/models`) as { data: AIResponse};

      return (response as any).data as any;
    } catch (error: unknown) {
      throw new Error(`Erro ao obter modelos do provedor ${provider}: ${getErrorMessage(error)}`);

    } /**
   * Obter informações de pricing de um provedor
   * @description
   * Retorna informações de preços e modelo de pricing de um provedor.
   *
   * @param {AIProvider} provider - Provedor a consultar
   * @returns {Promise<AIResponse>} Resposta com informações de pricing
   * @throws {Error} Se houver erro ao obter pricing
   *
   * @example
   * ```typescript
   * const pricing = await aiProviderService.getProviderPricing('openai');

   *  // 0.0001
   * ```
   */
  async getProviderPricing(provider: AIProvider): Promise<AIResponse> {
    try {
      const response = await this.api.get(`/ai/providers/${provider}/pricing`) as { data: AIResponse};

      return (response as any).data as any;
    } catch (error: unknown) {
      throw new Error(`Erro ao obter pricing do provedor ${provider}: ${getErrorMessage(error)}`);

    } /**
   * Obter estatísticas de uso de um provedor
   * @description
   * Retorna estatísticas de uso de um provedor para um período específico.
   *
   * @param {AIProvider} provider - Provedor a consultar
   * @param {string} [period='week'] - Período (day, week, month, year, opcional, padrão: 'week')
   * @returns {Promise<AIResponse>} Resposta com estatísticas de uso
   * @throws {Error} Se houver erro ao obter uso
   *
   * @example
   * ```typescript
   * const usage = await aiProviderService.getProviderUsage('openai', 'month');

   *  // 1000000
   * ```
   */
  async getProviderUsage(provider: AIProvider, period: string = 'week'): Promise<AIResponse> {
    try {
      const response = await this.api.get(`/ai/providers/${provider}/usage`, {
        params: { period } ) as { data: AIResponse};

      return (response as any).data as any;
    } catch (error: unknown) {
      throw new Error(`Erro ao obter uso do provedor ${provider}: ${getErrorMessage(error)}`);

    } /**
   * Obter configuração local de um provedor
   * @description
   * Retorna configuração local (client-side) de um provedor.
   *
   * @param {AIProvider} provider - Provedor a consultar
   * @returns {object} Configuração local do provedor
   *
   * @example
   * ```typescript
   * const config = aiProviderService.getProviderConfig('openai');

   *  // 'OpenAI'
   * ```
   */
  getProviderConfig(provider: AIProvider) {
    return getProviderConfig(provider);

  }

  /**
   * Validar configuração de um provedor
   * @description
   * Valida a configuração de um provedor antes de salvar.
   *
   * @param {AIProvider} provider - Provedor a validar
   * @param {Record<string, any>} config - Configuração a validar
   * @returns {Promise<AIResponse>} Resposta da validação
   * @throws {Error} Se houver erro ao validar
   *
   * @example
   * ```typescript
   * const result = await aiProviderService.validateProviderConfig('openai', { api_key: 'sk-...' });

   *  // true
   * ```
   */
  async validateProviderConfig(provider: AIProvider, config: Record<string, any>): Promise<AIResponse> {
    try {
      const response = await this.api.post(`/ai/providers/${provider}/validate`, config) as { data: AIResponse};

      return (response as any).data as any;
    } catch (error: unknown) {
      throw new Error(`Erro ao validar configuração do provedor ${provider}: ${getErrorMessage(error)}`);

    } /**
   * Obter logs de um provedor
   * @description
   * Retorna logs de atividades de um provedor.
   *
   * @param {AIProvider} provider - Provedor a consultar
   * @param {number} [limit=100] - Limite de logs (opcional, padrão: 100)
   * @returns {Promise<AIResponse>} Resposta com logs
   * @throws {Error} Se houver erro ao obter logs
   *
   * @example
   * ```typescript
   * const logs = await aiProviderService.getProviderLogs('openai', 50);

   *  // 50
   * ```
   */
  async getProviderLogs(provider: AIProvider, limit: number = 100): Promise<AIResponse> {
    try {
      const response = await this.api.get(`/ai/providers/${provider}/logs`, {
        params: { limit } ) as { data: AIResponse};

      return (response as any).data as any;
    } catch (error: unknown) {
      throw new Error(`Erro ao obter logs do provedor ${provider}: ${getErrorMessage(error)}`);

    } /**
   * Reiniciar conexão com um provedor
   * @description
   * Reinicia a conexão com um provedor específico.
   *
   * @param {AIProvider} provider - Provedor a reiniciar
   * @returns {Promise<AIResponse>} Resposta do reinício
   * @throws {Error} Se houver erro ao reiniciar
   *
   * @example
   * ```typescript
   * await aiProviderService.restartProvider('openai');

   * ```
   */
  async restartProvider(provider: AIProvider): Promise<AIResponse> {
    try {
      const response = await this.api.post(`/ai/providers/${provider}/restart`) as { data: AIResponse};

      return (response as any).data as any;
    } catch (error: unknown) {
      throw new Error(`Erro ao reiniciar provedor ${provider}: ${getErrorMessage(error)}`);

    } }

export default new AIProviderService();
