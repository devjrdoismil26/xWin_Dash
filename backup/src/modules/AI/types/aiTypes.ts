/**
 * Tipos principais do módulo AI
 */

// Tipos de provedores
export type AIProvider = 'openai' | 'claude' | 'gemini' | 'anthropic' | 'cohere';

// Tipos de geração
export type AIGenerationType = 'text' | 'image' | 'video' | 'audio' | 'code';

// Tipos de status
export type AIStatus = 'active' | 'inactive' | 'error' | 'loading' | 'maintenance';

// Tipos de modelos
export type AIModel = {
  id: string;
  name: string;
  provider: AIProvider;
  type: AIGenerationType;
  capabilities: string[];
  maxTokens?: number;
  costPerToken?: number;
  isAvailable: boolean;
};

// Tipos de geração
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
    quality?: number;
  };
  created_at: string;
  updated_at: string;
};

// Tipos de chat
export type AIChatMessage = {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  metadata?: {
    tokens?: number;
    cost?: number;
    model?: string;
  };
};

export type AIChatSession = {
  id: string;
  title: string;
  messages: AIChatMessage[];
  provider: AIProvider;
  model: string;
  created_at: string;
  updated_at: string;
};

// Tipos de analytics
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
      cost: number;
    };
  };
};

// Tipos de configuração
export type AIConfig = {
  default_provider: AIProvider;
  default_model: string;
  max_tokens: number;
  temperature: number;
  auto_save: boolean;
  notifications: boolean;
  theme: 'light' | 'dark' | 'auto';
};

// Tipos de resposta da API
export type AIResponse<T = any> = {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  metadata?: {
    tokens?: number;
    cost?: number;
    duration?: number;
  };
};

// Tipos de filtros
export type AIFilters = {
  provider?: AIProvider;
  type?: AIGenerationType;
  date_range?: {
    start: string;
    end: string;
  };
  search?: string;
  status?: AIStatus;
};

// Tipos de paginação
export type AIPagination = {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
};
