/**
 * Tipos principais do módulo AI
 * @module modules/AI/types/aiTypes
 * @description
 * Definições de tipos TypeScript para o módulo AI, incluindo tipos de provedores,
 * tipos de geração, status, modelos, gerações, chat, analytics, configuração,
 * resposta da API, filtros e paginação.
 * @since 1.0.0
 */

/**
 * Tipo AIProvider - Provedores de IA
 * @typedef {string} AIProvider
 * @description
 * Tipo que representa os provedores de IA disponíveis no sistema.
 */
export type AIProvider = 'openai' | 'claude' | 'gemini' | 'anthropic' | 'cohere';

/**
 * Tipo AIGenerationType - Tipos de Geração
 * @typedef {string} AIGenerationType
 * @description
 * Tipo que representa os tipos de geração de IA suportados.
 */
export type AIGenerationType = 'text' | 'image' | 'video' | 'audio' | 'code';

/**
 * Tipo AIStatus - Status de Serviços
 * @typedef {string} AIStatus
 * @description
 * Tipo que representa os possíveis status de serviços de IA.
 */
export type AIStatus = 'active' | 'inactive' | 'error' | 'loading' | 'maintenance';

/**
 * Tipo AIModel - Modelo de IA
 * @typedef {object} AIModel
 * @description
 * Tipo que representa um modelo de IA com suas informações e capacidades.
 * @property {string} id - ID único do modelo
 * @property {string} name - Nome do modelo
 * @property {AIProvider} provider - Provedor do modelo
 * @property {AIGenerationType} type - Tipo de geração suportado
 * @property {string[]} capabilities - Capacidades do modelo
 * @property {number} [maxTokens] - Máximo de tokens (opcional)
 * @property {number} [costPerToken] - Custo por token (opcional)
 * @property {boolean} isAvailable - Se o modelo está disponível
 */
export type AIModel = {
  id: string;
  name: string;
  provider: AIProvider;
  type: AIGenerationType;
  capabilities: string[];
  maxTokens?: number;
  costPerToken?: number;
  isAvailable: boolean;};

/**
 * Tipo AIGeneration - Geração de IA
 * @typedef {object} AIGeneration
 * @description
 * Tipo que representa uma geração de IA com seus dados e metadados.
 * @property {string} id - ID único da geração
 * @property {AIGenerationType} type - Tipo de geração
 * @property {AIProvider} provider - Provedor usado
 * @property {string} model - Modelo usado
 * @property {string} prompt - Prompt de entrada
 * @property {string} result - Resultado da geração
 * @property {object} metadata - Metadados da geração
 * @property {number} [metadata.tokens] - Número de tokens (opcional)
 * @property {number} [metadata.cost] - Custo da geração (opcional)
 * @property {number} [metadata.duration] - Duração em ms (opcional)
 * @property {number} [metadata.quality] - Qualidade (0-1, opcional)
 * @property {string} created_at - Data de criação (ISO 8601)
 * @property {string} updated_at - Data de atualização (ISO 8601)
 */
export type AIGeneration = {
  id: string;
  type: AIGenerationType;
  provider: AIProvider;
  model: string;
  prompt: string;
  result: string;
  metadata: {
    tokens?: number;
    cost?: number;
    duration?: number;
    quality?: number;};

  created_at: string;
  updated_at: string;};

/**
 * Tipo AIChatMessage - Mensagem de Chat
 * @typedef {object} AIChatMessage
 * @description
 * Tipo que representa uma mensagem em uma sessão de chat com IA.
 * @property {string} id - ID único da mensagem
 * @property {'user' | 'assistant' | 'system'} role - Papel da mensagem
 * @property {string} content - Conteúdo da mensagem
 * @property {string} timestamp - Timestamp da mensagem (ISO 8601)
 * @property {object} [metadata] - Metadados da mensagem (opcional)
 * @property {number} [metadata.tokens] - Número de tokens (opcional)
 * @property {number} [metadata.cost] - Custo da mensagem (opcional)
 * @property {string} [metadata.model] - Modelo usado (opcional)
 */
export type AIChatMessage = {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  metadata?: {
    tokens?: number;
    cost?: number;
    model?: string;};
};

/**
 * Tipo AIChatSession - Sessão de Chat
 * @typedef {object} AIChatSession
 * @description
 * Tipo que representa uma sessão de chat com IA, contendo múltiplas mensagens.
 * @property {string} id - ID único da sessão
 * @property {string} title - Título da sessão
 * @property {AIChatMessage[]} messages - Lista de mensagens
 * @property {AIProvider} provider - Provedor usado
 * @property {string} model - Modelo usado
 * @property {string} created_at - Data de criação (ISO 8601)
 * @property {string} updated_at - Data de atualização (ISO 8601)
 */
export type AIChatSession = {
  id: string;
  title: string;
  messages: AIChatMessage[];
  provider: AIProvider;
  model: string;
  created_at: string;
  updated_at: string;};

/**
 * Tipo AIAnalytics - Analytics de IA
 * @typedef {object} AIAnalytics
 * @description
 * Tipo que representa analytics de IA para um período específico.
 * @property {string} id - ID único do analytics
 * @property {'day' | 'week' | 'month' | 'year'} period - Período analisado
 * @property {string} date - Data do analytics (ISO 8601)
 * @property {number} generations - Número de gerações
 * @property {number} tokens - Total de tokens
 * @property {number} cost - Custo total
 * @property {number} avg_quality - Qualidade média
 * @property {object} provider_usage - Uso por provedor
 * @property {object} provider_usage[key] - Uso do provedor identificado por chave
 * @property {number} provider_usage[key].generations - Gerações do provedor
 * @property {number} provider_usage[key].tokens - Tokens do provedor
 * @property {number} provider_usage[key].cost - Custo do provedor
 */
export type AIAnalytics = {
  id: string;
  period: 'day' | 'week' | 'month' | 'year';
  date: string;
  generations: number;
  tokens: number;
  cost: number;
  avg_quality: number;
  provider_usage: {
    [key in AIProvider]?: {
      generations: number;
      tokens: number;
      cost: number;};
};
};

/**
 * Tipo AIConfig - Configuração de IA
 * @typedef {object} AIConfig
 * @description
 * Tipo que representa configurações do módulo AI.
 * @property {AIProvider} default_provider - Provedor padrão
 * @property {string} default_model - Modelo padrão
 * @property {number} max_tokens - Máximo de tokens
 * @property {number} temperature - Temperatura padrão
 * @property {boolean} auto_save - Se deve salvar automaticamente
 * @property {boolean} notifications - Se deve enviar notificações
 * @property {'light' | 'dark' | 'auto'} theme - Tema da interface
 */
export type AIConfig = {
  default_provider: AIProvider;
  default_model: string;
  max_tokens: number;
  temperature: number;
  auto_save: boolean;
  notifications: boolean;
  theme: 'light' | 'dark' | 'auto';};

/**
 * Tipo AIResponse - Resposta da API de IA
 * @typedef {object} AIResponse
 * @template T - Tipo dos dados retornados
 * @description
 * Tipo que representa resposta padrão da API de IA.
 * @property {boolean} success - Se a operação foi bem-sucedida
 * @property {T} [data] - Dados retornados (opcional)
 * @property {string} [error] - Mensagem de erro (opcional)
 * @property {string} [message] - Mensagem de sucesso (opcional)
 * @property {object} [metadata] - Metadados da resposta (opcional)
 * @property {number} [metadata.tokens] - Número de tokens (opcional)
 * @property {number} [metadata.cost] - Custo da operação (opcional)
 * @property {number} [metadata.duration] - Duração em ms (opcional)
 */
export type AIResponse<T = Record<string, any>> = {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  metadata?: {
    tokens?: number;
    cost?: number;
    duration?: number;};
};

// Tipos de filtros
export type AIFilters = {
  provider?: AIProvider;
  type?: AIGenerationType;
  date_range?: {
    start: string;
    end: string;};

  search?: string;
  status?: AIStatus;};

/**
 * Tipo AIPagination - Paginação
 * @typedef {object} AIPagination
 * @description
 * Tipo que representa informações de paginação.
 * @property {number} page - Página atual
 * @property {number} per_page - Itens por página
 * @property {number} total - Total de itens
 * @property {number} total_pages - Total de páginas
 */
export type AIPagination = {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;};

/**
 * Tipo AIChatHistory - Histórico de chat
 */
export interface AIChatHistory {
  id: string;
  session_id: string;
  messages: AIChatMessage[];
  created_at: string;
  updated_at: string; }

/**
 * Tipo AIAnalysisHistory - Histórico de análises
 */
export interface AIAnalysisHistory {
  id: string;
  type: AIGenerationType;
  input: string;
  output: string;
  provider: AIProvider;
  model: string;
  created_at: string; }
