/**
 * Enums do módulo AI
 */

// Enum para provedores
export enum AIProvider {
  OPENAI = 'openai',
  CLAUDE = 'claude',
  GEMINI = 'gemini',
  ANTHROPIC = 'anthropic',
  COHERE = 'cohere'
}

// Enum para tipos de geração
export enum AIGenerationType {
  TEXT = 'text',
  IMAGE = 'image',
  VIDEO = 'video',
  AUDIO = 'audio',
  CODE = 'code'
}

// Enum para status
export enum AIStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  ERROR = 'error',
  LOADING = 'loading',
  MAINTENANCE = 'maintenance'
}

// Enum para qualidade
export enum AIQuality {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  PREMIUM = 'premium'
}

// Enum para temas
export enum AITheme {
  LIGHT = 'light',
  DARK = 'dark',
  AUTO = 'auto'
}

// Enum para períodos de analytics
export enum AIPeriod {
  DAY = 'day',
  WEEK = 'week',
  MONTH = 'month',
  YEAR = 'year'
}

// Enum para tamanhos de imagem
export enum AIImageSize {
  SMALL = '256x256',
  MEDIUM = '512x512',
  LARGE = '1024x1024'
}

// Enum para qualidade de imagem
export enum AIImageQuality {
  STANDARD = 'standard',
  HD = 'hd'
}

// Enum para estilos de imagem
export enum AIImageStyle {
  VIVID = 'vivid',
  NATURAL = 'natural'
}

// Enum para resolução de vídeo
export enum AIVideoResolution {
  HD_720P = '720p',
  FULL_HD_1080P = '1080p',
  UHD_4K = '4k'
}

// Enum para roles de chat
export enum AIChatRole {
  USER = 'user',
  ASSISTANT = 'assistant',
  SYSTEM = 'system'
}

// Enum para tipos de notificação
export enum AINotificationType {
  SUCCESS = 'success',
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info'
}

// Enum para tipos de ação
export enum AIActionType {
  GENERATE = 'generate',
  SAVE = 'save',
  DELETE = 'delete',
  EXPORT = 'export',
  SHARE = 'share',
  ANALYZE = 'analyze'
}
