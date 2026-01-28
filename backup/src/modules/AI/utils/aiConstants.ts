/**
 * Constantes para o módulo AI
 */

import { AIProvider, AIGenerationType } from '../types';

/**
 * Configurações padrão
 */
export const DEFAULT_CONFIG = {
  MAX_TOKENS: 4096,
  TEMPERATURE: 0.7,
  TOP_P: 1.0,
  FREQUENCY_PENALTY: 0.0,
  PRESENCE_PENALTY: 0.0,
  MAX_PROMPT_LENGTH: 10000,
  MIN_PROMPT_LENGTH: 1,
  MAX_IMAGE_SIZE: '1024x1024',
  MAX_VIDEO_DURATION: 60,
  MAX_AUDIO_DURATION: 300,
  CACHE_DURATION: 24 * 60 * 60 * 1000, // 24 horas
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
  TIMEOUT: 30000
};

/**
 * Limites de API
 */
export const API_LIMITS = {
  OPENAI: {
    MAX_TOKENS: 8192,
    MAX_REQUESTS_PER_MINUTE: 60,
    MAX_REQUESTS_PER_DAY: 10000
  },
  CLAUDE: {
    MAX_TOKENS: 200000,
    MAX_REQUESTS_PER_MINUTE: 30,
    MAX_REQUESTS_PER_DAY: 5000
  },
  GEMINI: {
    MAX_TOKENS: 30720,
    MAX_REQUESTS_PER_MINUTE: 100,
    MAX_REQUESTS_PER_DAY: 15000
  },
  COHERE: {
    MAX_TOKENS: 4096,
    MAX_REQUESTS_PER_MINUTE: 50,
    MAX_REQUESTS_PER_DAY: 8000
  }
};

/**
 * Custos por token (aproximados)
 */
export const TOKEN_COSTS = {
  OPENAI: {
    'gpt-4': 0.00003,
    'gpt-3.5-turbo': 0.000002,
    'dall-e-3': 0.04
  },
  CLAUDE: {
    'claude-3-opus': 0.000015,
    'claude-3-sonnet': 0.000003,
    'claude-3-haiku': 0.00000025
  },
  GEMINI: {
    'gemini-pro': 0.0000005,
    'gemini-pro-vision': 0.0000005
  },
  COHERE: {
    'command': 0.0000015,
    'command-light': 0.0000003
  }
};

/**
 * Modelos disponíveis por provedor
 */
export const AVAILABLE_MODELS = {
  OPENAI: [
    'gpt-4',
    'gpt-4-turbo',
    'gpt-3.5-turbo',
    'dall-e-3',
    'dall-e-2'
  ],
  CLAUDE: [
    'claude-3-opus',
    'claude-3-sonnet',
    'claude-3-haiku'
  ],
  GEMINI: [
    'gemini-pro',
    'gemini-pro-vision'
  ],
  COHERE: [
    'command',
    'command-light'
  ]
};

/**
 * Tipos de geração suportados por provedor
 */
export const PROVIDER_CAPABILITIES = {
  OPENAI: ['text', 'image', 'code'],
  CLAUDE: ['text', 'code'],
  GEMINI: ['text', 'image', 'code'],
  COHERE: ['text', 'code']
};

/**
 * Tamanhos de imagem suportados
 */
export const IMAGE_SIZES = [
  '256x256',
  '512x512',
  '1024x1024'
];

/**
 * Qualidades de imagem
 */
export const IMAGE_QUALITIES = [
  'standard',
  'hd'
];

/**
 * Estilos de imagem
 */
export const IMAGE_STYLES = [
  'vivid',
  'natural'
];

/**
 * Resoluções de vídeo
 */
export const VIDEO_RESOLUTIONS = [
  '720p',
  '1080p',
  '4k'
];

/**
 * Durações de vídeo (em segundos)
 */
export const VIDEO_DURATIONS = [
  5, 10, 15, 30, 60
];

/**
 * Períodos de analytics
 */
export const ANALYTICS_PERIODS = [
  'day',
  'week',
  'month',
  'year'
];

/**
 * Formatos de exportação
 */
export const EXPORT_FORMATS = [
  'json',
  'csv',
  'xlsx'
];

/**
 * Tipos de notificação
 */
export const NOTIFICATION_TYPES = [
  'success',
  'error',
  'warning',
  'info'
];

/**
 * Status de geração
 */
export const GENERATION_STATUS = [
  'pending',
  'processing',
  'completed',
  'failed',
  'cancelled'
];

/**
 * Status de provedor
 */
export const PROVIDER_STATUS = [
  'active',
  'inactive',
  'error',
  'maintenance'
];

/**
 * Temas disponíveis
 */
export const THEMES = [
  'light',
  'dark',
  'auto'
];

/**
 * Idiomas suportados
 */
export const SUPPORTED_LANGUAGES = [
  'pt',
  'en',
  'es',
  'fr',
  'de',
  'it',
  'ja',
  'ko',
  'zh'
];

/**
 * Mensagens de erro padrão
 */
export const ERROR_MESSAGES = {
  INVALID_PROVIDER: 'Provedor inválido',
  INVALID_MODEL: 'Modelo inválido',
  INVALID_PROMPT: 'Prompt inválido',
  API_KEY_MISSING: 'API key não configurada',
  API_KEY_INVALID: 'API key inválida',
  RATE_LIMIT_EXCEEDED: 'Limite de requisições excedido',
  QUOTA_EXCEEDED: 'Cota excedida',
  NETWORK_ERROR: 'Erro de rede',
  TIMEOUT_ERROR: 'Timeout na requisição',
  UNKNOWN_ERROR: 'Erro desconhecido',
  GENERATION_FAILED: 'Falha na geração',
  INVALID_PARAMETERS: 'Parâmetros inválidos',
  FILE_TOO_LARGE: 'Arquivo muito grande',
  UNSUPPORTED_FORMAT: 'Formato não suportado',
  INSUFFICIENT_CREDITS: 'Créditos insuficientes'
};

/**
 * Mensagens de sucesso
 */
export const SUCCESS_MESSAGES = {
  GENERATION_COMPLETED: 'Geração concluída com sucesso',
  GENERATION_SAVED: 'Geração salva com sucesso',
  GENERATION_DELETED: 'Geração excluída com sucesso',
  CONFIG_SAVED: 'Configuração salva com sucesso',
  API_KEY_VALIDATED: 'API key validada com sucesso',
  EXPORT_COMPLETED: 'Exportação concluída com sucesso',
  IMPORT_COMPLETED: 'Importação concluída com sucesso',
  BACKUP_CREATED: 'Backup criado com sucesso',
  RESTORE_COMPLETED: 'Restauração concluída com sucesso'
};

/**
 * URLs de documentação
 */
export const DOCUMENTATION_URLS = {
  OPENAI: 'https://platform.openai.com/docs',
  CLAUDE: 'https://docs.anthropic.com',
  GEMINI: 'https://ai.google.dev/docs',
  COHERE: 'https://docs.cohere.com',
  GENERAL: 'https://docs.xwin.com.br/ai'
};

/**
 * URLs de status dos serviços
 */
export const STATUS_URLS = {
  OPENAI: 'https://status.openai.com',
  CLAUDE: 'https://status.anthropic.com',
  GEMINI: 'https://status.cloud.google.com',
  COHERE: 'https://status.cohere.com'
};

/**
 * Configurações de cache
 */
export const CACHE_CONFIG = {
  PROVIDERS: 'ai_providers',
  MODELS: 'ai_models',
  GENERATIONS: 'ai_generations',
  ANALYTICS: 'ai_analytics',
  CONFIG: 'ai_config',
  TTL: 24 * 60 * 60 * 1000 // 24 horas
};

/**
 * Configurações de retry
 */
export const RETRY_CONFIG = {
  MAX_ATTEMPTS: 3,
  INITIAL_DELAY: 1000,
  MAX_DELAY: 10000,
  BACKOFF_FACTOR: 2
};

/**
 * Configurações de timeout
 */
export const TIMEOUT_CONFIG = {
  DEFAULT: 30000,
  TEXT_GENERATION: 60000,
  IMAGE_GENERATION: 120000,
  VIDEO_GENERATION: 300000,
  ANALYTICS: 15000
};

/**
 * Configurações de validação
 */
export const VALIDATION_CONFIG = {
  MIN_PROMPT_LENGTH: 1,
  MAX_PROMPT_LENGTH: 10000,
  MIN_TEMPERATURE: 0,
  MAX_TEMPERATURE: 2,
  MIN_MAX_TOKENS: 1,
  MAX_MAX_TOKENS: 100000,
  MIN_TOP_P: 0,
  MAX_TOP_P: 1,
  MIN_PENALTY: -2,
  MAX_PENALTY: 2
};
