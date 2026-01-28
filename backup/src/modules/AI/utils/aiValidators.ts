/**
 * Validadores para o módulo AI
 */

import { AIProvider, AIGenerationType, GenerateTextRequest, GenerateImageRequest, GenerateVideoRequest } from '../types';

/**
 * Validar provedor AI
 */
export const validateProvider = (provider: string): provider is AIProvider => {
  const validProviders: AIProvider[] = ['openai', 'claude', 'gemini', 'anthropic', 'cohere'];
  return validProviders.includes(provider as AIProvider);
};

/**
 * Validar tipo de geração
 */
export const validateGenerationType = (type: string): type is AIGenerationType => {
  const validTypes: AIGenerationType[] = ['text', 'image', 'video', 'audio', 'code'];
  return validTypes.includes(type as AIGenerationType);
};

/**
 * Validar prompt
 */
export const validatePrompt = (prompt: string, minLength: number = 1, maxLength: number = 10000): boolean => {
  if (!prompt || typeof prompt !== 'string') return false;
  if (prompt.trim().length < minLength) return false;
  if (prompt.length > maxLength) return false;
  return true;
};

/**
 * Validar requisição de geração de texto
 */
export const validateTextGenerationRequest = (request: GenerateTextRequest): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!validatePrompt(request.prompt)) {
    errors.push('Prompt inválido ou muito longo');
  }
  
  if (request.provider && !validateProvider(request.provider)) {
    errors.push('Provedor inválido');
  }
  
  if (request.temperature !== undefined && (request.temperature < 0 || request.temperature > 2)) {
    errors.push('Temperature deve estar entre 0 e 2');
  }
  
  if (request.max_tokens !== undefined && (request.max_tokens < 1 || request.max_tokens > 100000)) {
    errors.push('Max tokens deve estar entre 1 e 100000');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
};

/**
 * Validar requisição de geração de imagem
 */
export const validateImageGenerationRequest = (request: GenerateImageRequest): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!validatePrompt(request.prompt)) {
    errors.push('Prompt inválido ou muito longo');
  }
  
  if (request.provider && !validateProvider(request.provider)) {
    errors.push('Provedor inválido');
  }
  
  if (request.size && !['256x256', '512x512', '1024x1024'].includes(request.size)) {
    errors.push('Tamanho de imagem inválido');
  }
  
  if (request.quality && !['standard', 'hd'].includes(request.quality)) {
    errors.push('Qualidade de imagem inválida');
  }
  
  if (request.style && !['vivid', 'natural'].includes(request.style)) {
    errors.push('Estilo de imagem inválido');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
};

/**
 * Validar requisição de geração de vídeo
 */
export const validateVideoGenerationRequest = (request: GenerateVideoRequest): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!validatePrompt(request.prompt)) {
    errors.push('Prompt inválido ou muito longo');
  }
  
  if (request.provider && !validateProvider(request.provider)) {
    errors.push('Provedor inválido');
  }
  
  if (request.duration && (request.duration < 1 || request.duration > 60)) {
    errors.push('Duração deve estar entre 1 e 60 segundos');
  }
  
  if (request.resolution && !['720p', '1080p', '4k'].includes(request.resolution)) {
    errors.push('Resolução de vídeo inválida');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
};

/**
 * Validar API key
 */
export const validateApiKey = (apiKey: string, provider: AIProvider): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!apiKey || typeof apiKey !== 'string') {
    errors.push('API key é obrigatória');
    return { valid: false, errors };
  }
  
  if (apiKey.trim().length < 10) {
    errors.push('API key muito curta');
  }
  
  // Validações específicas por provedor
  switch (provider) {
    case 'openai':
      if (!apiKey.startsWith('sk-')) {
        errors.push('API key do OpenAI deve começar com "sk-"');
      }
      break;
    case 'claude':
    case 'anthropic':
      if (!apiKey.startsWith('sk-ant-')) {
        errors.push('API key do Anthropic deve começar com "sk-ant-"');
      }
      break;
    case 'gemini':
      if (!apiKey.includes('AIza')) {
        errors.push('API key do Gemini deve conter "AIza"');
      }
      break;
    case 'cohere':
      if (!apiKey.startsWith('co-')) {
        errors.push('API key do Cohere deve começar com "co-"');
      }
      break;
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
};

/**
 * Validar configuração de modelo
 */
export const validateModelConfig = (config: any): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!config.model || typeof config.model !== 'string') {
    errors.push('Modelo é obrigatório');
  }
  
  if (config.temperature !== undefined && (config.temperature < 0 || config.temperature > 2)) {
    errors.push('Temperature deve estar entre 0 e 2');
  }
  
  if (config.max_tokens !== undefined && (config.max_tokens < 1 || config.max_tokens > 100000)) {
    errors.push('Max tokens deve estar entre 1 e 100000');
  }
  
  if (config.top_p !== undefined && (config.top_p < 0 || config.top_p > 1)) {
    errors.push('Top P deve estar entre 0 e 1');
  }
  
  if (config.frequency_penalty !== undefined && (config.frequency_penalty < -2 || config.frequency_penalty > 2)) {
    errors.push('Frequency penalty deve estar entre -2 e 2');
  }
  
  if (config.presence_penalty !== undefined && (config.presence_penalty < -2 || config.presence_penalty > 2)) {
    errors.push('Presence penalty deve estar entre -2 e 2');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
};

/**
 * Validar filtros de histórico
 */
export const validateHistoryFilters = (filters: any): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (filters.provider && !validateProvider(filters.provider)) {
    errors.push('Provedor inválido');
  }
  
  if (filters.type && !validateGenerationType(filters.type)) {
    errors.push('Tipo de geração inválido');
  }
  
  if (filters.date_range) {
    const { start, end } = filters.date_range;
    
    if (!start || !end) {
      errors.push('Data de início e fim são obrigatórias');
    } else {
      const startDate = new Date(start);
      const endDate = new Date(end);
      
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        errors.push('Datas inválidas');
      } else if (startDate > endDate) {
        errors.push('Data de início deve ser anterior à data de fim');
      }
    }
  }
  
  if (filters.search && typeof filters.search !== 'string') {
    errors.push('Termo de busca deve ser uma string');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
};

/**
 * Validar período de analytics
 */
export const validateAnalyticsPeriod = (period: string): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  const validPeriods = ['day', 'week', 'month', 'year'];
  
  if (!validPeriods.includes(period)) {
    errors.push(`Período deve ser um dos seguintes: ${validPeriods.join(', ')}`);
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
};

/**
 * Validar configuração de exportação
 */
export const validateExportConfig = (config: any): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!config.format || !['json', 'csv', 'xlsx'].includes(config.format)) {
    errors.push('Formato deve ser json, csv ou xlsx');
  }
  
  if (config.filters && !validateHistoryFilters(config.filters).valid) {
    errors.push('Filtros inválidos');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
};

/**
 * Validar URL de webhook
 */
export const validateWebhookUrl = (url: string): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!url || typeof url !== 'string') {
    errors.push('URL é obrigatória');
    return { valid: false, errors };
  }
  
  try {
    const urlObj = new URL(url);
    
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      errors.push('URL deve usar protocolo HTTP ou HTTPS');
    }
  } catch {
    errors.push('URL inválida');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
};

/**
 * Validar configuração de notificações
 */
export const validateNotificationConfig = (config: any): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (config.email && !validateEmail(config.email)) {
    errors.push('Email inválido');
  }
  
  if (config.webhook && !validateWebhookUrl(config.webhook).valid) {
    errors.push('Webhook URL inválida');
  }
  
  if (config.thresholds) {
    const { cost, tokens, quality } = config.thresholds;
    
    if (cost !== undefined && (cost < 0 || cost > 1000)) {
      errors.push('Threshold de custo deve estar entre 0 e 1000');
    }
    
    if (tokens !== undefined && (tokens < 0 || tokens > 1000000)) {
      errors.push('Threshold de tokens deve estar entre 0 e 1000000');
    }
    
    if (quality !== undefined && (quality < 0 || quality > 1)) {
      errors.push('Threshold de qualidade deve estar entre 0 e 1');
    }
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
};

/**
 * Validar email
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validar configuração geral
 */
export const validateGeneralConfig = (config: any): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (config.default_provider && !validateProvider(config.default_provider)) {
    errors.push('Provedor padrão inválido');
  }
  
  if (config.max_tokens && (config.max_tokens < 1 || config.max_tokens > 100000)) {
    errors.push('Max tokens deve estar entre 1 e 100000');
  }
  
  if (config.temperature && (config.temperature < 0 || config.temperature > 2)) {
    errors.push('Temperature deve estar entre 0 e 2');
  }
  
  if (config.auto_save !== undefined && typeof config.auto_save !== 'boolean') {
    errors.push('Auto save deve ser um boolean');
  }
  
  if (config.notifications !== undefined && typeof config.notifications !== 'boolean') {
    errors.push('Notifications deve ser um boolean');
  }
  
  if (config.theme && !['light', 'dark', 'auto'].includes(config.theme)) {
    errors.push('Tema deve ser light, dark ou auto');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
};
