/**
 * Configurações e informações dos provedores AI
 */

// import { AIProvider, AIGenerationType, AIModel } from './aiTypes';

// Configurações dos provedores
export const AI_PROVIDERS_CONFIG = {
  [AIProvider.OPENAI]: {
    name: 'OpenAI',
    capabilities: [AIGenerationType.TEXT, AIGenerationType.IMAGE, AIGenerationType.CODE],
    models: [
      {
        id: 'gpt-4',
        name: 'GPT-4',
        provider: AIProvider.OPENAI,
        type: AIGenerationType.TEXT,
        capabilities: ['text-generation', 'conversation', 'analysis'],
        maxTokens: 8192,
        costPerToken: 0.00003,
        isAvailable: true
      },
      {
        id: 'gpt-3.5-turbo',
        name: 'GPT-3.5 Turbo',
        provider: AIProvider.OPENAI,
        type: AIGenerationType.TEXT,
        capabilities: ['text-generation', 'conversation'],
        maxTokens: 4096,
        costPerToken: 0.000002,
        isAvailable: true
      },
      {
        id: 'dall-e-3',
        name: 'DALL-E 3',
        provider: AIProvider.OPENAI,
        type: AIGenerationType.IMAGE,
        capabilities: ['image-generation'],
        costPerToken: 0.04,
        isAvailable: true
      }
    ],
    strengths: ['Text generation', 'Code generation', 'Image generation'],
    pricing_model: 'per-token',
    api_endpoint: 'https://api.openai.com/v1',
    documentation: 'https://platform.openai.com/docs'
  },
  
  [AIProvider.CLAUDE]: {
    name: 'Claude (Anthropic)',
    capabilities: [AIGenerationType.TEXT, AIGenerationType.CODE],
    models: [
      {
        id: 'claude-3-opus',
        name: 'Claude 3 Opus',
        provider: AIProvider.CLAUDE,
        type: AIGenerationType.TEXT,
        capabilities: ['text-generation', 'conversation', 'analysis', 'reasoning'],
        maxTokens: 200000,
        costPerToken: 0.000015,
        isAvailable: true
      },
      {
        id: 'claude-3-sonnet',
        name: 'Claude 3 Sonnet',
        provider: AIProvider.CLAUDE,
        type: AIGenerationType.TEXT,
        capabilities: ['text-generation', 'conversation', 'analysis'],
        maxTokens: 200000,
        costPerToken: 0.000003,
        isAvailable: true
      },
      {
        id: 'claude-3-haiku',
        name: 'Claude 3 Haiku',
        provider: AIProvider.CLAUDE,
        type: AIGenerationType.TEXT,
        capabilities: ['text-generation', 'conversation'],
        maxTokens: 200000,
        costPerToken: 0.00000025,
        isAvailable: true
      }
    ],
    strengths: ['Long context', 'Reasoning', 'Analysis', 'Code generation'],
    pricing_model: 'per-token',
    api_endpoint: 'https://api.anthropic.com/v1',
    documentation: 'https://docs.anthropic.com'
  },
  
  [AIProvider.GEMINI]: {
    name: 'Google Gemini',
    capabilities: [AIGenerationType.TEXT, AIGenerationType.IMAGE, AIGenerationType.CODE],
    models: [
      {
        id: 'gemini-pro',
        name: 'Gemini Pro',
        provider: AIProvider.GEMINI,
        type: AIGenerationType.TEXT,
        capabilities: ['text-generation', 'conversation', 'analysis'],
        maxTokens: 30720,
        costPerToken: 0.0000005,
        isAvailable: true
      },
      {
        id: 'gemini-pro-vision',
        name: 'Gemini Pro Vision',
        provider: AIProvider.GEMINI,
        type: AIGenerationType.TEXT,
        capabilities: ['text-generation', 'image-analysis', 'multimodal'],
        maxTokens: 30720,
        costPerToken: 0.0000005,
        isAvailable: true
      }
    ],
    strengths: ['Multimodal', 'Fast response', 'Cost-effective', 'Google integration'],
    pricing_model: 'per-token',
    api_endpoint: 'https://generativelanguage.googleapis.com/v1',
    documentation: 'https://ai.google.dev/docs'
  }
};

// Função para obter configuração de um provedor
export const getProviderConfig = (provider: AIProvider) => {
  return AI_PROVIDERS_CONFIG[provider] || null;
};

// Função para obter modelos de um provedor
export const getProviderModels = (provider: AIProvider) => {
  const config = getProviderConfig(provider);
  return config?.models || [];
};

// Função para verificar se um provedor suporta um tipo de geração
export const providerSupportsType = (provider: AIProvider, type: AIGenerationType): boolean => {
  const config = getProviderConfig(provider);
  return config?.capabilities.includes(type) || false;
};

// Função para obter o melhor modelo para um tipo de geração
export const getBestModel = (provider: AIProvider, type: AIGenerationType): AIModel | null => {
  const models = getProviderModels(provider);
  const filteredModels = models.filter(model => model.type === type && model.isAvailable);
  
  if (filteredModels.length === 0) return null;
  
  // Retorna o modelo com maior maxTokens (geralmente o mais avançado)
  return filteredModels.reduce((best, current) => 
    (current.maxTokens || 0) > (best.maxTokens || 0) ? current : best
  );
};
