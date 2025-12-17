/**
 * Enums e constantes do módulo Activity
 * Centraliza todos os valores constantes e enums
 */

export type ActivityLogType = 
  | 'login' 
  | 'logout' 
  | 'create' 
  | 'update' 
  | 'delete' 
  | 'email' 
  | 'security' 
  | 'settings' 
  | 'api' 
  | 'error' 
  | 'activity';

export type ActivityLogLevel = 'info' | 'warning' | 'error' | 'debug';

export type ActivityColor = 
  | 'blue' 
  | 'green' 
  | 'red' 
  | 'yellow' 
  | 'purple' 
  | 'orange' 
  | 'gray' 
  | 'indigo';

export type ActivityStatus = 'active' | 'inactive' | 'draft' | 'archived';

export type ActivityFilterType = 'all' | 'login' | 'create' | 'update' | 'delete' | 'email' | 'security' | 'api' | 'error';

export type ActivityFilterUser = 'all' | 'admin' | 'user' | 'system';

export type ActivityFilterDate = 'all' | 'today' | 'yesterday' | 'week' | 'month';

// Constantes
export const ACTIVITY_TYPES: unknown = {
  login: 'Login/Logout',
  create: 'Criações',
  update: 'Atualizações',
  delete: 'Exclusões',
  email: 'Emails',
  security: 'Segurança',
  settings: 'Configurações',
  api: 'API',
  error: 'Erros',
  activity: 'Atividades'
} as const;

export const ACTIVITY_COLORS: unknown = {
  login: 'blue',
  logout: 'gray',
  create: 'green',
  update: 'blue',
  delete: 'red',
  email: 'purple',
  security: 'yellow',
  settings: 'indigo',
  api: 'orange',
  error: 'red',
  activity: 'gray'
} as const;

export const ACTIVITY_ICONS: unknown = {
  login: 'User',
  logout: 'User',
  'user.created': 'UserPlus',
  'user.updated': 'UserEdit',
  'user.deleted': 'UserMinus',
  'email.sent': 'Mail',
  'security.alert': 'Shield',
  'settings.updated': 'Settings',
  'api.request': 'Globe',
  'error.occurred': 'AlertTriangle',
} as const;

export const ACTIVITY_BADGE_VARIANTS: unknown = {
  login: 'success',
  logout: 'secondary',
  'user.created': 'success',
  'user.updated': 'warning',
  'user.deleted': 'destructive',
  'email.sent': 'info',
  'security.alert': 'warning',
  'settings.updated': 'secondary',
  'api.request': 'info',
  'error.occurred': 'destructive',
} as const;

export const DATE_RANGE_OPTIONS: unknown = [
  { value: 'all', label: 'Todo o Período' },
  { value: 'today', label: 'Hoje' },
  { value: 'yesterday', label: 'Ontem' },
  { value: 'week', label: 'Esta Semana' },
  { value: 'month', label: 'Este Mês' }
] as const;

export const USER_FILTER_OPTIONS: unknown = [
  { value: 'all', label: 'Todos os Usuários' },
  { value: 'admin', label: 'Administradores' },
  { value: 'user', label: 'Usuários' },
  { value: 'system', label: 'Sistema' }
] as const;

export const TYPE_FILTER_OPTIONS: unknown = [
  { value: 'all', label: 'Todos os Tipos' },
  { value: 'login', label: 'Login/Logout' },
  { value: 'create', label: 'Criações' },
  { value: 'update', label: 'Atualizações' },
  { value: 'delete', label: 'Exclusões' },
  { value: 'email', label: 'Emails' },
  { value: 'security', label: 'Segurança' },
  { value: 'api', label: 'API' },
  { value: 'error', label: 'Erros' }
] as const;

export const EXPORT_FORMATS: unknown = ['csv', 'json', 'pdf'] as const;

export const PAGINATION_LIMITS: unknown = {
  MIN_PER_PAGE: 1,
  MAX_PER_PAGE: 100,
  DEFAULT_PER_PAGE: 15
} as const;

export const CACHE_DURATION: unknown = {
  SHORT: 5 * 60 * 1000, // 5 minutes
  MEDIUM: 15 * 60 * 1000, // 15 minutes
  LONG: 60 * 60 * 1000, // 1 hour
} as const;

export const REAL_TIME_INTERVALS: unknown = {
  FAST: 10000, // 10 seconds
  NORMAL: 30000, // 30 seconds
  SLOW: 60000, // 1 minute
} as const;
