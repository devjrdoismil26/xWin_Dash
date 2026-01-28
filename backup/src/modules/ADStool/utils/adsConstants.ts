/**
 * Constantes do ADStool
 */

/**
 * Plataformas de anúncios suportadas
 */
export const AD_PLATFORMS = {
  GOOGLE_ADS: 'google_ads',
  FACEBOOK_ADS: 'facebook_ads',
  LINKEDIN_ADS: 'linkedin_ads',
  TWITTER_ADS: 'twitter_ads',
  TIKTOK_ADS: 'tiktok_ads'
} as const;

/**
 * Status de campanhas
 */
export const CAMPAIGN_STATUS = {
  ACTIVE: 'active',
  PAUSED: 'paused',
  DELETED: 'deleted',
  PENDING: 'pending',
  DRAFT: 'draft'
} as const;

/**
 * Status de contas
 */
export const ACCOUNT_STATUS = {
  ACTIVE: 'active',
  PAUSED: 'paused',
  SUSPENDED: 'suspended',
  PENDING: 'pending',
  DISCONNECTED: 'disconnected'
} as const;

/**
 * Objetivos de campanha
 */
export const CAMPAIGN_OBJECTIVES = {
  AWARENESS: 'awareness',
  TRAFFIC: 'traffic',
  ENGAGEMENT: 'engagement',
  LEADS: 'leads',
  APP_PROMOTION: 'app_promotion',
  SALES: 'sales',
  CONVERSIONS: 'conversions'
} as const;

/**
 * Tipos de criativos
 */
export const CREATIVE_TYPES = {
  IMAGE: 'image',
  VIDEO: 'video',
  CAROUSEL: 'carousel',
  COLLECTION: 'collection',
  STORY: 'story',
  TEXT: 'text',
  HTML5: 'html5'
} as const;

/**
 * Status de criativos
 */
export const CREATIVE_STATUS = {
  ACTIVE: 'active',
  PAUSED: 'paused',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  PENDING: 'pending',
  DRAFT: 'draft'
} as const;

/**
 * Tipos de targeting
 */
export const TARGETING_TYPES = {
  DEMOGRAPHIC: 'demographic',
  INTEREST: 'interest',
  BEHAVIOR: 'behavior',
  GEOGRAPHIC: 'geographic',
  DEVICE: 'device',
  TIME: 'time',
  CUSTOM: 'custom'
} as const;

/**
 * Métricas principais
 */
export const METRICS = {
  IMPRESSIONS: 'impressions',
  CLICKS: 'clicks',
  CONVERSIONS: 'conversions',
  SPEND: 'spend',
  CTR: 'ctr',
  CPC: 'cpc',
  CPA: 'cpa',
  ROAS: 'roas',
  ROI: 'roi'
} as const;

/**
 * Períodos de tempo
 */
export const TIME_PERIODS = {
  TODAY: 'today',
  YESTERDAY: 'yesterday',
  LAST_7_DAYS: 'last_7_days',
  LAST_30_DAYS: 'last_30_days',
  LAST_90_DAYS: 'last_90_days',
  THIS_MONTH: 'this_month',
  LAST_MONTH: 'last_month',
  THIS_YEAR: 'this_year',
  LAST_YEAR: 'last_year',
  CUSTOM: 'custom'
} as const;

/**
 * Tipos de relatórios
 */
export const REPORT_TYPES = {
  CAMPAIGN_PERFORMANCE: 'campaign_performance',
  ACCOUNT_PERFORMANCE: 'account_performance',
  CREATIVE_PERFORMANCE: 'creative_performance',
  KEYWORD_PERFORMANCE: 'keyword_performance',
  AUDIENCE_PERFORMANCE: 'audience_performance',
  CONVERSION_PERFORMANCE: 'conversion_performance',
  COST_PERFORMANCE: 'cost_performance'
} as const;

/**
 * Formatos de exportação
 */
export const EXPORT_FORMATS = {
  CSV: 'csv',
  XLSX: 'xlsx',
  PDF: 'pdf',
  JSON: 'json'
} as const;

/**
 * Limites de orçamento
 */
export const BUDGET_LIMITS = {
  MIN_DAILY_BUDGET: 1,
  MAX_DAILY_BUDGET: 1000000,
  MIN_TOTAL_BUDGET: 1,
  MAX_TOTAL_BUDGET: 10000000
} as const;

/**
 * Limites de caracteres
 */
export const CHARACTER_LIMITS = {
  CAMPAIGN_NAME: 100,
  AD_HEADLINE: 30,
  AD_DESCRIPTION: 90,
  AD_DISPLAY_URL: 35,
  KEYWORD: 80,
  AD_GROUP_NAME: 100
} as const;

/**
 * Configurações de API
 */
export const API_CONFIG = {
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
  RATE_LIMIT: 100,
  BATCH_SIZE: 100
} as const;

/**
 * URLs de endpoints
 */
export const API_ENDPOINTS = {
  ACCOUNTS: '/api/adstool/accounts',
  CAMPAIGNS: '/api/adstool/campaigns',
  CREATIVES: '/api/adstool/creatives',
  ANALYTICS: '/api/adstool/analytics',
  TEMPLATES: '/api/adstool/templates',
  REPORTS: '/api/adstool/reports',
  INTEGRATIONS: '/api/adstool/integrations'
} as const;

/**
 * Configurações de cache
 */
export const CACHE_CONFIG = {
  TTL: 300000, // 5 minutos
  MAX_SIZE: 100,
  STRATEGY: 'memory'
} as const;

/**
 * Configurações de notificações
 */
export const NOTIFICATION_CONFIG = {
  SUCCESS_DURATION: 3000,
  ERROR_DURATION: 5000,
  WARNING_DURATION: 4000,
  INFO_DURATION: 3000
} as const;

/**
 * Configurações de paginação
 */
export const PAGINATION_CONFIG = {
  DEFAULT_PAGE_SIZE: 20,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
  MAX_PAGE_SIZE: 100
} as const;

/**
 * Configurações de upload
 */
export const UPLOAD_CONFIG = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  ALLOWED_VIDEO_TYPES: ['video/mp4', 'video/avi', 'video/mov', 'video/wmv'],
  ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
} as const;

/**
 * Configurações de validação
 */
export const VALIDATION_CONFIG = {
  MIN_PASSWORD_LENGTH: 8,
  MAX_PASSWORD_LENGTH: 128,
  MIN_USERNAME_LENGTH: 3,
  MAX_USERNAME_LENGTH: 50,
  MIN_NAME_LENGTH: 2,
  MAX_NAME_LENGTH: 100
} as const;

/**
 * Configurações de tema
 */
export const THEME_CONFIG = {
  PRIMARY_COLOR: '#3B82F6',
  SECONDARY_COLOR: '#64748B',
  SUCCESS_COLOR: '#10B981',
  WARNING_COLOR: '#F59E0B',
  ERROR_COLOR: '#EF4444',
  INFO_COLOR: '#3B82F6'
} as const;

/**
 * Configurações de animação
 */
export const ANIMATION_CONFIG = {
  DURATION: 300,
  EASING: 'ease-in-out',
  DELAY: 100
} as const;

/**
 * Configurações de responsividade
 */
export const RESPONSIVE_CONFIG = {
  BREAKPOINTS: {
    xs: 0,
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536
  },
  CONTAINER_MAX_WIDTHS: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px'
  }
} as const;
