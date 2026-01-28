// =========================================
// CONSTANTES - CONFIGURAÇÕES
// =========================================

// =========================================
// CATEGORIAS DE CONFIGURAÇÕES
// =========================================

export const SETTINGS_CATEGORIES = {
  GENERAL: 'general',
  AUTH: 'auth',
  USERS: 'users',
  DATABASE: 'database',
  EMAIL: 'email',
  INTEGRATIONS: 'integrations',
  AI: 'ai',
  API: 'api'
} as const;

export const SETTINGS_CATEGORY_LABELS = {
  [SETTINGS_CATEGORIES.GENERAL]: 'Geral',
  [SETTINGS_CATEGORIES.AUTH]: 'Autenticação',
  [SETTINGS_CATEGORIES.USERS]: 'Usuários',
  [SETTINGS_CATEGORIES.DATABASE]: 'Banco de Dados',
  [SETTINGS_CATEGORIES.EMAIL]: 'Email',
  [SETTINGS_CATEGORIES.INTEGRATIONS]: 'Integrações',
  [SETTINGS_CATEGORIES.AI]: 'IA',
  [SETTINGS_CATEGORIES.API]: 'API'
} as const;

export const SETTINGS_CATEGORY_ICONS = {
  [SETTINGS_CATEGORIES.GENERAL]: '⚙️',
  [SETTINGS_CATEGORIES.AUTH]: '🔒',
  [SETTINGS_CATEGORIES.USERS]: '👥',
  [SETTINGS_CATEGORIES.DATABASE]: '🗄️',
  [SETTINGS_CATEGORIES.EMAIL]: '📧',
  [SETTINGS_CATEGORIES.INTEGRATIONS]: '🔗',
  [SETTINGS_CATEGORIES.AI]: '🤖',
  [SETTINGS_CATEGORIES.API]: '🔑'
} as const;

export const SETTINGS_CATEGORY_COLORS = {
  [SETTINGS_CATEGORIES.GENERAL]: 'blue',
  [SETTINGS_CATEGORIES.AUTH]: 'red',
  [SETTINGS_CATEGORIES.USERS]: 'green',
  [SETTINGS_CATEGORIES.DATABASE]: 'purple',
  [SETTINGS_CATEGORIES.EMAIL]: 'orange',
  [SETTINGS_CATEGORIES.INTEGRATIONS]: 'yellow',
  [SETTINGS_CATEGORIES.AI]: 'indigo',
  [SETTINGS_CATEGORIES.API]: 'gray'
} as const;

// =========================================
// TIPOS DE CONFIGURAÇÕES
// =========================================

export const SETTINGS_TYPES = {
  STRING: 'string',
  NUMBER: 'number',
  BOOLEAN: 'boolean',
  JSON: 'json',
  ARRAY: 'array'
} as const;

export const SETTINGS_TYPE_LABELS = {
  [SETTINGS_TYPES.STRING]: 'Texto',
  [SETTINGS_TYPES.NUMBER]: 'Número',
  [SETTINGS_TYPES.BOOLEAN]: 'Sim/Não',
  [SETTINGS_TYPES.JSON]: 'JSON',
  [SETTINGS_TYPES.ARRAY]: 'Lista'
} as const;

export const SETTINGS_TYPE_COLORS = {
  [SETTINGS_TYPES.STRING]: 'blue',
  [SETTINGS_TYPES.NUMBER]: 'green',
  [SETTINGS_TYPES.BOOLEAN]: 'purple',
  [SETTINGS_TYPES.JSON]: 'orange',
  [SETTINGS_TYPES.ARRAY]: 'pink'
} as const;

// =========================================
// CONFIGURAÇÕES PADRÃO
// =========================================

export const DEFAULT_GENERAL_SETTINGS = {
  app_name: 'xWin Dash',
  app_version: '1.0.0',
  app_description: 'Plataforma de gestão empresarial',
  timezone: 'America/Sao_Paulo',
  language: 'pt-BR',
  currency: 'BRL',
  date_format: 'DD/MM/YYYY',
  time_format: '24h',
  theme: 'light',
  maintenance_mode: false,
  debug_mode: false,
  log_level: 'info',
  max_upload_size: 10485760, // 10MB
  allowed_file_types: ['jpg', 'jpeg', 'png', 'gif', 'pdf', 'doc', 'docx', 'xls', 'xlsx'],
  session_timeout: 3600, // 1 hora
  auto_logout: true
} as const;

export const DEFAULT_AUTH_SETTINGS = {
  password_min_length: 8,
  password_require_uppercase: true,
  password_require_lowercase: true,
  password_require_numbers: true,
  password_require_symbols: false,
  password_expiry_days: 90,
  password_history_count: 5,
  session_timeout: 3600, // 1 hora
  max_login_attempts: 5,
  lockout_duration: 900, // 15 minutos
  two_factor_enabled: false,
  two_factor_method: 'email',
  two_factor_backup_codes_count: 10,
  oauth_providers: [],
  jwt_secret_key: '',
  jwt_expiry_time: 3600, // 1 hora
  refresh_token_expiry_time: 604800, // 7 dias
  remember_me_enabled: true,
  remember_me_duration: 2592000, // 30 dias
  auto_logout_enabled: true,
  auto_logout_warning_time: 300, // 5 minutos
  ip_whitelist: [],
  ip_blacklist: [],
  rate_limiting_enabled: true,
  rate_limiting_requests: 100,
  rate_limiting_window: 900 // 15 minutos
} as const;

// =========================================
// IDIOMAS SUPORTADOS
// =========================================

export const SUPPORTED_LANGUAGES = {
  'pt-BR': 'Português (Brasil)',
  'en-US': 'English (US)',
  'es-ES': 'Español',
  'fr-FR': 'Français',
  'de-DE': 'Deutsch',
  'it-IT': 'Italiano',
  'ja-JP': '日本語',
  'ko-KR': '한국어',
  'zh-CN': '中文 (简体)',
  'zh-TW': '中文 (繁體)'
} as const;

// =========================================
// TIMEZONES SUPORTADOS
// =========================================

export const SUPPORTED_TIMEZONES = {
  'America/Sao_Paulo': 'São Paulo (GMT-3)',
  'America/New_York': 'New York (GMT-5)',
  'America/Los_Angeles': 'Los Angeles (GMT-8)',
  'Europe/London': 'London (GMT+0)',
  'Europe/Paris': 'Paris (GMT+1)',
  'Europe/Berlin': 'Berlin (GMT+1)',
  'Europe/Rome': 'Rome (GMT+1)',
  'Europe/Madrid': 'Madrid (GMT+1)',
  'Asia/Tokyo': 'Tokyo (GMT+9)',
  'Asia/Shanghai': 'Shanghai (GMT+8)',
  'Asia/Seoul': 'Seoul (GMT+9)',
  'Asia/Singapore': 'Singapore (GMT+8)',
  'Australia/Sydney': 'Sydney (GMT+10)',
  'Pacific/Auckland': 'Auckland (GMT+12)'
} as const;

// =========================================
// MOEDAS SUPORTADAS
// =========================================

export const SUPPORTED_CURRENCIES = {
  'BRL': 'Real Brasileiro (R$)',
  'USD': 'Dólar Americano ($)',
  'EUR': 'Euro (€)',
  'GBP': 'Libra Esterlina (£)',
  'JPY': 'Iene Japonês (¥)',
  'CNY': 'Yuan Chinês (¥)',
  'KRW': 'Won Sul-Coreano (₩)',
  'AUD': 'Dólar Australiano (A$)',
  'CAD': 'Dólar Canadense (C$)',
  'CHF': 'Franco Suíço (CHF)'
} as const;

// =========================================
// FORMATOS DE DATA
// =========================================

export const DATE_FORMATS = {
  'DD/MM/YYYY': 'DD/MM/YYYY',
  'MM/DD/YYYY': 'MM/DD/YYYY',
  'YYYY-MM-DD': 'YYYY-MM-DD',
  'DD-MM-YYYY': 'DD-MM-YYYY',
  'MM-DD-YYYY': 'MM-DD-YYYY'
} as const;

// =========================================
// FORMATOS DE HORA
// =========================================

export const TIME_FORMATS = {
  '12h': '12 horas (AM/PM)',
  '24h': '24 horas'
} as const;

// =========================================
// TEMAS SUPORTADOS
// =========================================

export const SUPPORTED_THEMES = {
  'light': 'Claro',
  'dark': 'Escuro',
  'auto': 'Automático'
} as const;

// =========================================
// NÍVEIS DE LOG
// =========================================

export const LOG_LEVELS = {
  'error': 'Erro',
  'warn': 'Aviso',
  'info': 'Informação',
  'debug': 'Debug'
} as const;

// =========================================
// MÉTODOS DE 2FA
// =========================================

export const TWO_FACTOR_METHODS = {
  'email': 'Email',
  'sms': 'SMS',
  'app': 'Aplicativo',
  'backup_codes': 'Códigos de Backup'
} as const;

// =========================================
// PROVEDORES OAUTH
// =========================================

export const OAUTH_PROVIDERS = {
  'google': 'Google',
  'facebook': 'Facebook',
  'twitter': 'Twitter',
  'github': 'GitHub',
  'linkedin': 'LinkedIn',
  'microsoft': 'Microsoft',
  'apple': 'Apple',
  'discord': 'Discord'
} as const;

// =========================================
// TIPOS DE ARQUIVO PERMITIDOS
// =========================================

export const ALLOWED_FILE_TYPES = {
  images: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'],
  documents: ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'],
  archives: ['zip', 'rar', '7z', 'tar', 'gz'],
  videos: ['mp4', 'avi', 'mov', 'wmv', 'flv'],
  audio: ['mp3', 'wav', 'flac', 'aac', 'ogg']
} as const;

// =========================================
// LIMITES DE VALIDAÇÃO
// =========================================

export const VALIDATION_LIMITS = {
  password: {
    min_length: 6,
    max_length: 128,
    min_uppercase: 0,
    min_lowercase: 0,
    min_numbers: 0,
    min_symbols: 0
  },
  session: {
    min_timeout: 300, // 5 minutos
    max_timeout: 86400, // 24 horas
    min_attempts: 1,
    max_attempts: 10,
    min_lockout: 60, // 1 minuto
    max_lockout: 3600 // 1 hora
  },
  upload: {
    min_size: 1024, // 1KB
    max_size: 104857600, // 100MB
    max_files: 10
  },
  rate_limiting: {
    min_requests: 1,
    max_requests: 10000,
    min_window: 60, // 1 minuto
    max_window: 86400 // 24 horas
  }
} as const;

// =========================================
// CONFIGURAÇÕES DE CACHE
// =========================================

export const CACHE_CONFIG = {
  default_ttl: 300000, // 5 minutos
  max_size: 100,
  cleanup_interval: 600000, // 10 minutos
  compression_threshold: 1024 // 1KB
} as const;

// =========================================
// CONFIGURAÇÕES DE PERFORMANCE
// =========================================

export const PERFORMANCE_CONFIG = {
  debounce_delay: 300,
  preload_threshold: 0.8,
  lazy_loading_threshold: 100,
  memoization_ttl: 300000, // 5 minutos
  max_concurrent_requests: 5
} as const;

// =========================================
// MENSAGENS DE ERRO
// =========================================

export const ERROR_MESSAGES = {
  REQUIRED_FIELD: 'Este campo é obrigatório',
  INVALID_EMAIL: 'Email inválido',
  INVALID_URL: 'URL inválida',
  INVALID_TIMEZONE: 'Timezone inválido',
  INVALID_JSON: 'JSON inválido',
  MIN_LENGTH: 'Mínimo de {min} caracteres',
  MAX_LENGTH: 'Máximo de {max} caracteres',
  MIN_VALUE: 'Valor mínimo: {min}',
  MAX_VALUE: 'Valor máximo: {max}',
  INVALID_PATTERN: 'Formato inválido',
  NETWORK_ERROR: 'Erro de conexão',
  UNAUTHORIZED: 'Não autorizado',
  FORBIDDEN: 'Acesso negado',
  NOT_FOUND: 'Não encontrado',
  SERVER_ERROR: 'Erro interno do servidor',
  VALIDATION_ERROR: 'Erro de validação',
  SAVE_ERROR: 'Erro ao salvar configuração',
  LOAD_ERROR: 'Erro ao carregar configurações',
  DELETE_ERROR: 'Erro ao excluir configuração',
  TEST_ERROR: 'Erro ao testar configuração'
} as const;

// =========================================
// MENSAGENS DE SUCESSO
// =========================================

export const SUCCESS_MESSAGES = {
  SAVED: 'Configuração salva com sucesso',
  UPDATED: 'Configuração atualizada com sucesso',
  DELETED: 'Configuração excluída com sucesso',
  RESET: 'Configurações resetadas com sucesso',
  TESTED: 'Configuração testada com sucesso',
  EXPORTED: 'Configurações exportadas com sucesso',
  IMPORTED: 'Configurações importadas com sucesso',
  BACKUP_CREATED: 'Backup criado com sucesso',
  BACKUP_RESTORED: 'Backup restaurado com sucesso'
} as const;

// =========================================
// CONFIGURAÇÕES DE UI
// =========================================

export const UI_CONFIG = {
  animation_duration: 300,
  toast_duration: 5000,
  modal_backdrop: true,
  confirm_dialog: true,
  auto_save: false,
  auto_save_delay: 1000,
  show_advanced_by_default: false,
  compact_mode: false,
  sidebar_collapsed: false
} as const;

// =========================================
// EXPORTS
// =========================================

export default {
  SETTINGS_CATEGORIES,
  SETTINGS_CATEGORY_LABELS,
  SETTINGS_CATEGORY_ICONS,
  SETTINGS_CATEGORY_COLORS,
  SETTINGS_TYPES,
  SETTINGS_TYPE_LABELS,
  SETTINGS_TYPE_COLORS,
  DEFAULT_GENERAL_SETTINGS,
  DEFAULT_AUTH_SETTINGS,
  SUPPORTED_LANGUAGES,
  SUPPORTED_TIMEZONES,
  SUPPORTED_CURRENCIES,
  DATE_FORMATS,
  TIME_FORMATS,
  SUPPORTED_THEMES,
  LOG_LEVELS,
  TWO_FACTOR_METHODS,
  OAUTH_PROVIDERS,
  ALLOWED_FILE_TYPES,
  VALIDATION_LIMITS,
  CACHE_CONFIG,
  PERFORMANCE_CONFIG,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  UI_CONFIG
};
