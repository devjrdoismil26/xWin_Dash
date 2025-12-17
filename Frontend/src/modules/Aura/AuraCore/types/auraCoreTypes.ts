/**
 * @module modules/Aura/AuraCore/types/auraCoreTypes
 * @description
 * Tipos TypeScript principais do módulo AuraCore.
 * 
 * Define todos os tipos, interfaces e enums relacionados a:
 * - Status e tipos de módulos
 * - Estatísticas e métricas
 * - Ações rápidas e notificações
 * - Configurações e dados de dashboard
 * - Performance, uso e sistema
 * - Integração e analytics
 * - Monitoramento, backup e logs
 * - Sessões, usuários e permissões
 * 
 * @example
 * ```typescript
 * import { AuraStats, AuraModule, AuraResponse, AuraConfig } from './auraCoreTypes';
 * 
 * const stats: AuraStats = {
 *   id: 'stats-123',
 *   total_connections: 10,
 *   active_flows: 5,
 *   messages_sent: 1000,
 *   response_time: 150,
 *   uptime: 99.5,
 *   // ...
 *};

 * ```
 * 
 * @since 1.0.0
 */

// Tipos de status
export type AuraStatus = 'active' | 'inactive' | 'error' | 'loading' | 'pending';

// Tipos de módulos
export type AuraModuleType = 'connections' | 'flows' | 'chats' | 'stats';

// Tipos de ações rápidas
export type AuraQuickActionType = 'create_connection' | 'create_flow' | 'send_message' | 'view_stats';

// Tipos de estatísticas
export type AuraStatType = 'total_connections' | 'active_flows' | 'messages_sent' | 'response_time';

// Tipos de notificações
export type AuraNotificationType = 'success' | 'error' | 'warning' | 'info';

// Tipos de métricas
export type AuraMetric = {
  id: string;
  name: string;
  type: AuraStatType;
  value: number;
  previous_value?: number;
  change_percentage?: number;
  trend: 'up' | 'down' | 'stable';
  unit: string;
  description?: string;
  timestamp: string;};

// Tipos de estatísticas do Aura
export type AuraStats = {
  id: string;
  total_connections: number;
  active_flows: number;
  messages_sent: number;
  response_time: number;
  uptime: number;
  last_updated: string;
  metrics: AuraMetric[];};

// Tipos de ações rápidas
export type AuraQuickAction = {
  id: string;
  type: AuraQuickActionType;
  title: string;
  description: string;
  icon: string;
  color: string;
  action??: (e: any) => void;
  enabled: boolean;};

// Tipos de módulos do dashboard
export type AuraModule = {
  id: string;
  type: AuraModuleType;
  title: string;
  description: string;
  icon: string;
  color: string;
  status: AuraStatus;
  count: number;
  last_activity?: string;
  route: string;};

// Tipos de configuração
export type AuraConfig = {
  real_time_enabled: boolean;
  auto_refresh: boolean;
  refresh_interval: number;
  notifications_enabled: boolean;
  theme: 'light' | 'dark' | 'auto';
  language: string;};

// Tipos de notificação
export type AuraNotification = {
  id: string;
  type: AuraNotificationType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  action?: {
    label: string;
    handler??: (e: any) => void;};
};

// Tipos de resposta da API
export type AuraResponse<T = any> = {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  metadata?: {
    total?: number;
    page?: number;
    per_page?: number;
    last_updated?: string;};
};

// Tipos de paginação
export type AuraPagination = {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;};

// Tipos de filtros
export type AuraFilters = {
  status?: AuraStatus;
  module_type?: AuraModuleType;
  date_range?: string;
  search?: string;};

// Tipos de dados de dashboard
export type AuraDashboardData = {
  id: string;
  stats: AuraStats;
  modules: AuraModule[];
  quick_actions: AuraQuickAction[];
  notifications: AuraNotification[];
  last_updated: string;};

// Tipos de dados de performance
export type AuraPerformanceData = {
  response_time: number;
  uptime: number;
  error_rate: number;
  throughput: number;
  last_updated: string;};

// Tipos de dados de uso
export type AuraUsageData = {
  total_requests: number;
  successful_requests: number;
  failed_requests: number;
  average_response_time: number;
  peak_usage: number;
  last_updated: string;};

// Tipos de dados de sistema
export type AuraSystemData = {
  version: string;
  build: string;
  environment: string;
  uptime: number;
  memory_usage: number;
  cpu_usage: number;
  last_updated: string;};

// Tipos de dados de integração
export type AuraIntegrationData = {
  whatsapp_connected: boolean;
  flows_active: boolean;
  chats_active: boolean;
  last_sync: string;
  sync_status: AuraStatus;};

// Tipos de dados de analytics
export type AuraAnalyticsData = {
  total_messages: number;
  successful_messages: number;
  failed_messages: number;
  average_response_time: number;
  peak_concurrent_users: number;
  last_updated: string;};

// Tipos de dados de monitoramento
export type AuraMonitoringData = {
  system_health: 'healthy' | 'warning' | 'critical';
  active_connections: number;
  active_flows: number;
  active_chats: number;
  error_count: number;
  last_updated: string;};

// Tipos de dados de backup
export type AuraBackupData = {
  id: string;
  name: string;
  type: 'full' | 'incremental';
  size: number;
  created_at: string;
  status: AuraStatus;
  location: string;};

// Tipos de dados de log
export type AuraLogData = {
  id: string;
  level: 'debug' | 'info' | 'warn' | 'error';
  message: string;
  timestamp: string;
  source: string;
  metadata?: Record<string, any>;};

// Tipos de dados de evento
export type AuraEventData = {
  id: string;
  type: string;
  source: string;
  data: Record<string, any>;
  timestamp: string;
  processed: boolean;};

// Tipos de dados de cache
export type AuraCacheData = {
  key: string;
  value: unknown;
  ttl: number;
  created_at: string;
  expires_at: string;
  hits: number;
  misses: number;};

// Tipos de dados de sessão
export type AuraSessionData = {
  id: string;
  user_id: string;
  created_at: string;
  last_activity: string;
  expires_at: string;
  active: boolean;
  metadata?: Record<string, any>;};

// Tipos de dados de usuário
export type AuraUserData = {
  id: string;
  name: string;
  email: string;
  role: string;
  permissions: string[];
  last_login: string;
  active: boolean;
  metadata?: Record<string, any>;};

// Tipos de dados de permissão
export type AuraPermissionData = {
  id: string;
  name: string;
  description: string;
  resource: string;
  action: string;
  conditions?: Record<string, any>;};

// Tipos de dados de role
export type AuraRoleData = {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  users: string[];
  created_at: string;
  updated_at: string;};
