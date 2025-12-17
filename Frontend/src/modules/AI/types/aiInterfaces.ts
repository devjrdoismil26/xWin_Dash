/**
 * Interfaces do módulo AI
 * @module modules/AI/types/aiInterfaces
 * @description
 * Definições de interfaces principais do módulo AI, incluindo interfaces para
 * status de serviços, provedores, requisições de geração (texto, imagem, vídeo),
 * histórico, dashboard, componentes, hooks, serviços e store.
 * @since 1.0.0
 */

import { AIProvider, AIGenerationType, AIStatus, AIModel, AIGeneration, AIChatSession, AIAnalytics, AIConfig } from './aiTypes';

/**
 * Interface AIServicesStatus - Status dos Serviços de IA
 * @interface AIServicesStatus
 * @description
 * Mapeamento de serviços para seus status de conexão, incluindo nome,
 * status atual, última verificação, tempo de resposta e mensagens de erro.
 * @property {object} [key] - Status do serviço identificado por chave
 * @property {string} key.name - Nome do serviço
 * @property {AIStatus} key.status - Status atual do serviço
 * @property {string} key.last_check - Data/hora da última verificação (ISO 8601)
 * @property {number} [key.response_time] - Tempo de resposta em ms (opcional)
 * @property {string} [key.error_message] - Mensagem de erro (opcional)
 */
export interface AIServicesStatus {
  [key: string]: {
    name: string;
  status: AIStatus;
  last_check: string;
  response_time?: number;
  error_message?: string; };

}

/**
 * Interface AIProviders - Provedores de IA
 * @interface AIProviders
 * @description
 * Mapeamento de provedores de IA para suas informações, incluindo nome,
 * capacidades, modelos, pontos fortes, modelo de preço, status e configuração de API key.
 * @property {object} [key] - Provedor identificado por chave
 * @property {string} key.name - Nome do provedor
 * @property {AIGenerationType[]} key.capabilities - Tipos de geração suportados
 * @property {AIModel[]} key.models - Modelos disponíveis
 * @property {string[]} key.strengths - Pontos fortes do provedor
 * @property {string} key.pricing_model - Modelo de preço
 * @property {AIStatus} key.status - Status atual do provedor
 * @property {boolean} key.api_key_configured - Se API key está configurada
 */
export interface AIProviders {
  [key: string]: {
    name: string;
  capabilities: AIGenerationType[];
  models: AIModel[];
  strengths: string[];
  pricing_model: string;
  status: AIStatus;
  api_key_configured: boolean; };

}

/**
 * Interface GenerateTextRequest - Requisição de Geração de Texto
 * @interface GenerateTextRequest
 * @description
 * Interface para requisições de geração de texto com IA, incluindo prompt,
 * provedor, modelo, parâmetros de geração (temperature, max_tokens) e histórico.
 * @property {string} prompt - Prompt para geração de texto
 * @property {AIProvider} [provider] - Provedor de IA a usar (opcional)
 * @property {string} [model] - Modelo de IA a usar (opcional)
 * @property {number} [temperature] - Temperatura para geração (0-2, opcional)
 * @property {number} [max_tokens] - Máximo de tokens a gerar (opcional)
 * @property {string} [system_prompt] - Prompt do sistema (opcional)
 * @property {Array<{role: 'user' | 'assistant' | 'system'; content: string}>} [history] - Histórico de mensagens (opcional)
 */
export interface GenerateTextRequest {
  prompt: string;
  provider?: AIProvider;
  model?: string;
  temperature?: number;
  max_tokens?: number;
  system_prompt?: string;
  history?: Array<{
    role: 'user' | 'assistant' | 'system';
  content: string; }>;
}

/**
 * Interface GenerateImageRequest - Requisição de Geração de Imagem
 * @interface GenerateImageRequest
 * @description
 * Interface para requisições de geração de imagem com IA, incluindo prompt,
 * provedor, modelo, tamanho, qualidade e estilo.
 * @property {string} prompt - Prompt para geração de imagem
 * @property {AIProvider} [provider] - Provedor de IA a usar (opcional)
 * @property {string} [model] - Modelo de IA a usar (opcional)
 * @property {'256x256' | '512x512' | '1024x1024'} [size] - Tamanho da imagem (opcional)
 * @property {'standard' | 'hd'} [quality] - Qualidade da imagem (opcional)
 * @property {'vivid' | 'natural'} [style] - Estilo da imagem (opcional)
 */
/**
 * Interface GenerateImageRequest - Requisição de Geração de Imagem
 * @interface GenerateImageRequest
 * @description
 * Interface para requisições de geração de imagem com IA, incluindo prompt,
 * provedor opcional, modelo, tamanho, qualidade e estilo.
 * @property {string} prompt - Prompt de entrada
 * @property {AIProvider} [provider] - Provedor de IA (opcional)
 * @property {string} [model] - Modelo a usar (opcional)
 * @property {'256x256' | '512x512' | '1024x1024'} [size] - Tamanho da imagem (opcional)
 * @property {'standard' | 'hd'} [quality] - Qualidade da imagem (opcional)
 * @property {'vivid' | 'natural'} [style] - Estilo da imagem (opcional)
 */
export interface GenerateImageRequest {
  prompt: string;
  provider?: AIProvider;
  model?: string;
  size?: '256x256' | '512x512' | '1024x1024';
  quality?: 'standard' | 'hd';
  style?: 'vivid' | 'natural'; }

/**
 * Interface GenerateVideoRequest - Requisição de Geração de Vídeo
 * @interface GenerateVideoRequest
 * @description
 * Interface para requisições de geração de vídeo com IA, incluindo prompt,
 * provedor, modelo, duração e resolução.
 * @property {string} prompt - Prompt para geração de vídeo
 * @property {AIProvider} [provider] - Provedor de IA a usar (opcional)
 * @property {string} [model] - Modelo de IA a usar (opcional)
 * @property {number} [duration] - Duração do vídeo em segundos (opcional)
 * @property {'720p' | '1080p' | '4k'} [resolution] - Resolução do vídeo (opcional)
 */
/**
 * Interface GenerateVideoRequest - Requisição de Geração de Vídeo
 * @interface GenerateVideoRequest
 * @description
 * Interface para requisições de geração de vídeo com IA, incluindo prompt,
 * provedor opcional, modelo, duração e resolução.
 * @property {string} prompt - Prompt de entrada
 * @property {AIProvider} [provider] - Provedor de IA (opcional)
 * @property {string} [model] - Modelo a usar (opcional)
 * @property {number} [duration] - Duração em segundos (opcional)
 * @property {'720p' | '1080p' | '4k'} [resolution] - Resolução do vídeo (opcional)
 */
export interface GenerateVideoRequest {
  prompt: string;
  provider?: AIProvider;
  model?: string;
  duration?: number;
  resolution?: '720p' | '1080p' | '4k'; }

/**
 * Interface AIHistoryItem - Item do Histórico de IA
 * @interface AIHistoryItem
 * @description
 * Interface para itens do histórico de gerações de IA, incluindo informações
 * sobre a geração (tipo, prompt, resultado), provedor, modelo, data de criação
 * e metadados (tokens, custo, duração, qualidade).
 * @property {string} id - ID único do item
 * @property {AIGenerationType} type - Tipo de geração
 * @property {string} prompt - Prompt usado na geração
 * @property {string} result - Resultado da geração
 * @property {AIProvider} provider - Provedor usado
 * @property {string} model - Modelo usado
 * @property {string} created_at - Data de criação (ISO 8601)
 * @property {object} metadata - Metadados da geração
 * @property {number} [metadata.tokens] - Número de tokens usados (opcional)
 * @property {number} [metadata.cost] - Custo da geração (opcional)
 * @property {number} [metadata.duration] - Duração da geração em ms (opcional)
 * @property {number} [metadata.quality] - Qualidade da geração (0-1, opcional)
 */
export interface AIHistoryItem {
  id: string;
  type: AIGenerationType;
  prompt: string;
  result: string;
  provider: AIProvider;
  model: string;
  created_at: string;
  metadata: {
    tokens?: number;
  cost?: number;
  duration?: number;
  quality?: number; };

}

/**
 * Interface AIDashboardData - Dados do Dashboard de IA
 * @interface AIDashboardData
 * @description
 * Interface para dados completos do dashboard de IA, incluindo status de serviços,
 * gerações recentes, analytics, provedores e configurações.
 * @property {AIServicesStatus} services_status - Status dos serviços
 * @property {AIGeneration[]} recent_generations - Gerações recentes
 * @property {AIAnalytics} analytics - Analytics do módulo
 * @property {AIProviders} providers - Provedores disponíveis
 * @property {AIConfig} config - Configurações do módulo
 */
export interface AIDashboardData {
  services_status: AIServicesStatus;
  recent_generations: AIGeneration[];
  analytics: AIAnalytics;
  providers: AIProviders;
  config: AIConfig;
  [key: string]: unknown; }

/**
 * Interface AIComponentProps - Props de Componentes de IA
 * @interface AIComponentProps
 * @description
 * Interface base para props de componentes do módulo AI, incluindo classes CSS,
 * variante, estado de loading, erros e callbacks de ações.
 * @property {string} [className] - Classes CSS adicionais (opcional)
 * @property {'basic' | 'advanced' | 'revolutionary'} [variant] - Variante do componente (opcional)
 * @property {boolean} [loading] - Se está carregando (opcional)
 * @property {string | null} [error] - Mensagem de erro (opcional)
 * @property {function} [onAction] - Callback de ações (opcional)
 * @property {(action: string, data?: Record<string, any>) => void} [onAction] - Função chamada em ações
 */
export interface AIComponentProps {
  className?: string;
  variant?: 'basic' | 'advanced' | 'revolutionary';
  loading?: boolean;
  error?: string | null;
  onAction??: (e: any) => void;
  [key: string]: unknown; }

/**
 * Interface AIHookReturn - Retorno de Hooks de IA
 * @interface AIHookReturn
 * @description
 * Interface para retorno padrão de hooks do módulo AI, incluindo loading,
 * error, data e actions.
 * @property {boolean} loading - Se está carregando
 * @property {string | null} error - Mensagem de erro (se houver)
 * @property {Record<string, any>} [data] - Dados retornados (opcional)
 * @property {object} actions - Ações disponíveis
 * @property {(...args: string[]) => Promise<any> | void} actions[key] - Função de ação
 */
export interface AIHookReturn {
  loading: boolean;
  error: string | null;
  data?: Record<string, any>;
  actions: {
    [key: string]: (...args: string[]) => Promise<any> | void; };

}

/**
 * Interface AIServiceInterface - Interface de Service de IA
 * @interface AIServiceInterface
 * @description
 * Interface que define o contrato de serviços do módulo AI, incluindo métodos
 * para gerenciamento de serviços, provedores, geração de conteúdo, histórico,
 * analytics e operações CRUD de gerações.
 */
export interface AIServiceInterface {
  getServicesStatus(): Promise<AIServicesStatus>;
  getProviders(): Promise<AIProviders>;
  generateText(request: GenerateTextRequest): Promise<string>;
  generateImage(request: GenerateImageRequest): Promise<string>;
  generateVideo(request: GenerateVideoRequest): Promise<string>;
  getHistory(filters?: Record<string, any>): Promise<AIHistoryItem[]>;
  getAnalytics(period: string): Promise<AIAnalytics>;
  saveGeneration(generation: AIGeneration): Promise<void>;
  deleteGeneration(id: string): Promise<void>; }

// Interface para store
export interface AIState {
  servicesStatus: AIServicesStatus | null;
  servicesLoading: boolean;
  providers: AIProviders;
  providersLoading: boolean;
  textGenerations: AIGeneration[];
  imageGenerations: AIGeneration[];
  videoGenerations: AIGeneration[];
  chatHistory: AIChatSession[];
  analysisHistory: AIHistoryItem[];
  currentView: string;
  loading: boolean;
  error: string | null;
  config: AIConfig; }

/**
 * Interface AIActions - Ações do Store de IA
 * @interface AIActions
 * @description
 * Interface para ações do store do módulo AI, incluindo métodos para buscar
 * dados, gerar conteúdo, gerenciar histórico, analytics e configurações.
 */
/**
 * Interface AIActions - Ações do Store de IA
 * @interface AIActions
 * @description
 * Interface para ações do store Zustand do módulo AI, definindo métodos para
 * buscar dados, gerar conteúdo, gerenciar histórico e atualizar configurações.
 */
export interface AIActions {
  fetchServicesStatus: () => Promise<void>;
  fetchProviders: () => Promise<void>;
  generateText: (request: GenerateTextRequest) => Promise<string>;
  generateImage: (request: GenerateImageRequest) => Promise<string>;
  generateVideo: (request: GenerateVideoRequest) => Promise<string>;
  getHistory: (filters?: Record<string, any>) => Promise<void>;
  getAnalytics: (period: string) => Promise<AIAnalytics>;
  saveGeneration: (generation: AIGeneration) => Promise<void>;
  deleteGeneration: (id: string) => Promise<void>;
  setCurrentView?: (e: any) => void;
  setError?: (e: any) => void;
  setLoading?: (e: any) => void;
  updateConfig?: (e: any) => void; }
