/**
 * Constantes do módulo Activity
 * Centraliza todas as constantes e configurações
 */

// Configurações de paginação
export const PAGINATION_CONFIG: unknown = {
  DEFAULT_PAGE: 1,
  DEFAULT_PER_PAGE: 15,
  MIN_PER_PAGE: 1,
  MAX_PER_PAGE: 100,
  PAGE_SIZE_OPTIONS: [10, 15, 25, 50, 100]
} as const;

// Configurações de cache
export const CACHE_CONFIG: unknown = {
  DEFAULT_TTL: 5 * 60 * 1000, // 5 minutos
  SHORT_TTL: 1 * 60 * 1000,   // 1 minuto
  MEDIUM_TTL: 15 * 60 * 1000, // 15 minutos
  LONG_TTL: 60 * 60 * 1000,   // 1 hora
  MAX_CACHE_SIZE: 1000
} as const;

// Configurações de tempo real
export const REALTIME_CONFIG: unknown = {
  DEFAULT_INTERVAL: 30000,     // 30 segundos
  FAST_INTERVAL: 10000,        // 10 segundos
  SLOW_INTERVAL: 60000,        // 1 minuto
  MAX_RETRIES: 3,
  TIMEOUT: 10000,              // 10 segundos
  RECONNECT_DELAY: 5000        // 5 segundos
} as const;

// Configurações de exportação
export const EXPORT_CONFIG: unknown = {
  SUPPORTED_FORMATS: ['csv', 'json', 'pdf'] as const,
  MAX_RECORDS_PER_EXPORT: 10000,
  DEFAULT_FILENAME_PREFIX: 'activity-logs',
  CSV_DELIMITER: ',',
  JSON_INDENT: 2
} as const;

// Configurações de limpeza
export const CLEANUP_CONFIG: unknown = {
  DEFAULT_DAYS_TO_KEEP: 30,
  MIN_DAYS_TO_KEEP: 1,
  MAX_DAYS_TO_KEEP: 365,
  BATCH_SIZE: 1000
} as const;

// Configurações de busca
export const SEARCH_CONFIG: unknown = {
  MIN_QUERY_LENGTH: 2,
  MAX_QUERY_LENGTH: 100,
  DEBOUNCE_DELAY: 300,         // 300ms
  MAX_SEARCH_RESULTS: 1000
} as const;

// Configurações de validação
export const VALIDATION_CONFIG: unknown = {
  MAX_DESCRIPTION_LENGTH: 500,
  MAX_PROPERTIES_SIZE: 10000,  // 10KB
  MAX_LOG_NAME_LENGTH: 100
} as const;

// Configurações de UI
export const UI_CONFIG: unknown = {
  ANIMATION_DURATION: 300,
  TOAST_DURATION: 5000,
  LOADING_TIMEOUT: 30000,
  REFRESH_INTERVAL: 60000,     // 1 minuto
  DEBOUNCE_DELAY: 500
} as const;

// Configurações de API
export const API_CONFIG: unknown = {
  TIMEOUT: 30000,              // 30 segundos
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000,           // 1 segundo
  RATE_LIMIT: 100,             // 100 requests por minuto
  BATCH_SIZE: 50
} as const;

// Configurações de segurança
export const SECURITY_CONFIG: unknown = {
  MAX_LOGIN_ATTEMPTS: 5,
  LOCKOUT_DURATION: 15 * 60 * 1000, // 15 minutos
  SESSION_TIMEOUT: 30 * 60 * 1000,  // 30 minutos
  PASSWORD_MIN_LENGTH: 8
} as const;

// Configurações de monitoramento
export const MONITORING_CONFIG: unknown ={ HEALTH_CHECK_INTERVAL: 60000,    // 1 minuto
  METRICS_COLLECTION_INTERVAL: 300000, // 5 minutos
  ALERT_THRESHOLDS: {
    ERROR_RATE: 0.05,              // 5%
    RESPONSE_TIME: 5000,           // 5 segundos
    MEMORY_USAGE: 0.8,             // 80%
    CPU_USAGE: 0.8                 // 80%
   } as const;

// Configurações de desenvolvimento
export const DEV_CONFIG: unknown = {
  ENABLE_DEBUG_LOGS: process.env.NODE_ENV === 'development',
  ENABLE_PERFORMANCE_MONITORING: process.env.NODE_ENV === 'development',
  MOCK_API_DELAY: 1000,            // 1 segundo
  ENABLE_MOCK_DATA: process.env.NODE_ENV === 'development'
} as const;

// Mensagens de erro
export const ERROR_MESSAGES: unknown = {
  NETWORK_ERROR: 'Erro de conexão. Verifique sua internet.',
  TIMEOUT_ERROR: 'Tempo limite excedido. Tente novamente.',
  VALIDATION_ERROR: 'Dados inválidos fornecidos.',
  PERMISSION_ERROR: 'Você não tem permissão para esta ação.',
  NOT_FOUND_ERROR: 'Recurso não encontrado.',
  SERVER_ERROR: 'Erro interno do servidor.',
  UNAUTHORIZED_ERROR: 'Não autorizado. Faça login novamente.',
  RATE_LIMIT_ERROR: 'Muitas tentativas. Tente novamente em alguns minutos.',
  EXPORT_ERROR: 'Erro ao exportar dados.',
  IMPORT_ERROR: 'Erro ao importar dados.',
  CACHE_ERROR: 'Erro no cache de dados.',
  REALTIME_ERROR: 'Erro na conexão em tempo real.'
} as const;

// Mensagens de sucesso
export const SUCCESS_MESSAGES: unknown = {
  DATA_LOADED: 'Dados carregados com sucesso.',
  DATA_SAVED: 'Dados salvos com sucesso.',
  DATA_DELETED: 'Dados excluídos com sucesso.',
  EXPORT_SUCCESS: 'Dados exportados com sucesso.',
  IMPORT_SUCCESS: 'Dados importados com sucesso.',
  CACHE_CLEARED: 'Cache limpo com sucesso.',
  SETTINGS_SAVED: 'Configurações salvas com sucesso.',
  CONNECTION_ESTABLISHED: 'Conexão estabelecida com sucesso.'
} as const;

// Configurações de tema
export const THEME_CONFIG: unknown = {
  COLORS: {
    PRIMARY: '#3B82F6',
    SECONDARY: '#6B7280',
    SUCCESS: '#10B981',
    WARNING: '#F59E0B',
    ERROR: '#EF4444',
    INFO: '#3B82F6'
  },
  BREAKPOINTS: {
    XS: '480px',
    SM: '640px',
    MD: '768px',
    LG: '1024px',
    XL: '1280px',
    '2XL': '1536px'
  } as const;

// Configurações de acessibilidade
export const ACCESSIBILITY_CONFIG: unknown = {
  ARIA_LABELS: {
    LOADING: 'Carregando dados...',
    ERROR: 'Erro ao carregar dados',
    SUCCESS: 'Operação realizada com sucesso',
    SEARCH: 'Buscar atividades',
    FILTER: 'Filtrar resultados',
    EXPORT: 'Exportar dados',
    REFRESH: 'Atualizar dados'
  },
  KEYBOARD_SHORTCUTS: {
    SEARCH: 'Ctrl+K',
    REFRESH: 'F5',
    EXPORT: 'Ctrl+E',
    FILTER: 'Ctrl+F'
  } as const;

export { ACTIVITY_BADGE_VARIANTS };
