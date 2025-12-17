/**
 * @module modules/Aura/AuraCore/types/auraCoreInterfaces
 * @description
 * Interfaces TypeScript do módulo AuraCore.
 * 
 * Define todas as interfaces relacionadas a:
 * - Estado do store (AuraCoreState)
 * - Ações do store (AuraCoreActions)
 * - Props de componentes React
 * - Retornos de hooks
 * - Interface de serviços
 * - Props específicas (Dashboard, Header, Stats, Modules, etc.)
 * 
 * @since 1.0.0
 */

import { AuraStats, AuraModule, AuraQuickAction, AuraNotification, AuraConfig, AuraResponse, AuraPagination, AuraFilters, AuraDashboardData } from './auraCoreTypes';

// Interface para estado do store
export interface AuraCoreState {
  stats: AuraStats | null;
  modules: AuraModule[];
  quick_actions: AuraQuickAction[];
  notifications: AuraNotification[];
  dashboardData: AuraDashboardData | null;
  loading: boolean;
  error: string | null;
  currentView: string;
  config: AuraConfig;
  filters: AuraFilters; }

// Interface para ações do store
export interface AuraCoreActions {
  // Estatísticas
  fetchStats: () => Promise<void>;
  updateStats?: (e: any) => void;
  // Módulos
  fetchModules: () => Promise<void>;
  updateModule?: (e: any) => void;
  // Ações rápidas
  fetchQuickActions: () => Promise<void>;
  executeQuickAction: (id: string) => Promise<void>;
  // Notificações
  fetchNotifications: () => Promise<void>;
  markNotificationAsRead?: (e: any) => void;
  clearNotifications?: (e: any) => void;
  // Dashboard
  fetchDashboardData: () => Promise<void>;
  refreshDashboard: () => Promise<void>;
  // Configuração
  updateConfig?: (e: any) => void;
  // Filtros
  applyFilters?: (e: any) => void;
  clearFilters?: (e: any) => void;
  // Controle de estado
  setCurrentView?: (e: any) => void;
  setError?: (e: any) => void;
  setLoading?: (e: any) => void; }

// Interface para componentes
export interface AuraCoreComponentProps {
  className?: string;
  loading?: boolean;
  error?: string | null;
  onAction?: (e: any) => void;
  [key: string]: unknown; }

// Interface para hooks
export interface AuraCoreHookReturn {
  loading: boolean;
  error: string | null;
  data?: string;
  actions: {
    [key: string]: (...args: string[]) => Promise<any> | void; };

}

// Interface para serviços
export interface AuraCoreServiceInterface {
  // Estatísticas
  getStats: () => Promise<AuraResponse<AuraStats>>;
  updateStats: (stats: Partial<AuraStats>) => Promise<AuraResponse<AuraStats>>;
  // Módulos
  getModules: () => Promise<AuraResponse<AuraModule[]>>;
  updateModule: (id: string, data: Partial<AuraModule>) => Promise<AuraResponse<AuraModule>>;
  // Ações rápidas
  getQuickActions: () => Promise<AuraResponse<AuraQuickAction[]>>;
  executeQuickAction: (id: string) => Promise<AuraResponse<any>>;
  // Notificações
  getNotifications: () => Promise<AuraResponse<AuraNotification[]>>;
  markNotificationAsRead: (id: string) => Promise<AuraResponse<void>>;
  clearNotifications: () => Promise<AuraResponse<void>>;
  // Dashboard
  getDashboardData: () => Promise<AuraResponse<AuraDashboardData>>;
  refreshDashboard: () => Promise<AuraResponse<AuraDashboardData>>;
  // Configuração
  getConfig: () => Promise<AuraResponse<AuraConfig>>;
  updateConfig: (config: Partial<AuraConfig>) => Promise<AuraResponse<AuraConfig>>;
  // Cache
  clearCache: () => Promise<void>;
  getCacheStatus: () => Promise<AuraResponse<any>>;
  success?: boolean;
  message?: string;
  error?: string; }

// Interface para dados de dashboard
export interface AuraDashboardProps {
  stats?: AuraStats;
  modules?: AuraModule[];
  quickActions?: AuraQuickAction[];
  notifications?: AuraNotification[];
  loading?: boolean;
  error?: string | null;
  onRefresh??: (e: any) => void;
  onModuleClick?: (e: any) => void;
  onQuickActionClick?: (e: any) => void;
  [key: string]: unknown; }

// Interface para dados de header
export interface AuraHeaderProps {
  totalConnections?: number;
  totalFlows?: number;
  totalChats?: number;
  loading?: boolean;
  onRefresh??: (e: any) => void;
  onSettingsClick??: (e: any) => void;
  [key: string]: unknown; }

// Interface para dados de estatísticas
export interface AuraStatsProps {
  stats?: AuraStats;
  loading?: boolean;
  error?: string | null;
  onRefresh??: (e: any) => void;
  [key: string]: unknown; }

// Interface para dados de módulos
export interface AuraModulesProps {
  modules?: AuraModule[];
  loading?: boolean;
  error?: string | null;
  onModuleClick?: (e: any) => void;
  [key: string]: unknown; }

// Interface para dados de ações rápidas
export interface AuraQuickActionsProps {
  actions?: AuraQuickAction[];
  loading?: boolean;
  error?: string | null;
  onActionClick?: (e: any) => void;
  [key: string]: unknown; }

// Interface para dados de notificações
export interface AuraNotificationsProps {
  notifications?: AuraNotification[];
  loading?: boolean;
  error?: string | null;
  onNotificationClick?: (e: any) => void;
  onMarkAsRead?: (e: any) => void;
  onClearAll??: (e: any) => void;
  [key: string]: unknown; }

// Interface para dados de navegação
export interface AuraNavigationProps {
  currentView?: string;
  modules?: AuraModule[];
  onViewChange?: (e: any) => void;
  onModuleClick?: (e: any) => void;
  [key: string]: unknown; }

// Interface para dados de filtros
export interface AuraFiltersProps {
  filters?: AuraFilters;
  onFiltersChange?: (e: any) => void;
  onClearFilters??: (e: any) => void;
  [key: string]: unknown; }

// Interface para dados de configuração
export interface AuraConfigProps {
  config?: AuraConfig;
  onConfigChange?: (e: any) => void;
  onSave??: (e: any) => void;
  onReset??: (e: any) => void;
  [key: string]: unknown; }

// Interface para dados de monitoramento
export interface AuraMonitoringProps {
  systemHealth?: 'healthy' | 'warning' | 'critical';
  activeConnections?: number;
  activeFlows?: number;
  activeChats?: number;
  errorCount?: number;
  loading?: boolean;
  onRefresh??: (e: any) => void;
  [key: string]: unknown; }

// Interface para dados de performance
export interface AuraPerformanceProps {
  responseTime?: number;
  uptime?: number;
  errorRate?: number;
  throughput?: number;
  loading?: boolean;
  onRefresh??: (e: any) => void;
  [key: string]: unknown; }

// Interface para dados de analytics
export interface AuraAnalyticsProps {
  totalMessages?: number;
  successfulMessages?: number;
  failedMessages?: number;
  averageResponseTime?: number;
  peakConcurrentUsers?: number;
  loading?: boolean;
  onRefresh??: (e: any) => void;
  [key: string]: unknown;
  data?: string;
  success?: boolean;
  message?: string;
  error?: string; }

// Interface para dados de backup
export interface AuraBackupProps {
  backups?: Record<string, any>[];
  loading?: boolean;
  error?: string | null;
  onCreateBackup??: (e: any) => void;
  onRestoreBackup?: (e: any) => void;
  onDeleteBackup?: (e: any) => void;
  [key: string]: unknown; }

// Interface para dados de logs
export interface AuraLogsProps {
  logs?: Record<string, any>[];
  loading?: boolean;
  error?: string | null;
  onRefresh??: (e: any) => void;
  onClearLogs??: (e: any) => void;
  onExportLogs??: (e: any) => void;
  [key: string]: unknown; }

// Interface para dados de eventos
export interface AuraEventsProps {
  events?: string[];
  loading?: boolean;
  error?: string | null;
  onRefresh??: (e: any) => void;
  onProcessEvent?: (e: any) => void;
  onClearEvents??: (e: any) => void;
  [key: string]: unknown; }

// Interface para dados de cache
export interface AuraCacheProps {
  cache?: string;
  loading?: boolean;
  error?: string | null;
  onRefresh??: (e: any) => void;
  onClearCache??: (e: any) => void;
  onInvalidateKey?: (e: any) => void;
  [key: string]: unknown; }

// Interface para dados de sessão
export interface AuraSessionProps {
  sessions?: Record<string, any>[];
  loading?: boolean;
  error?: string | null;
  onRefresh??: (e: any) => void;
  onTerminateSession?: (e: any) => void;
  onClearSessions??: (e: any) => void;
  [key: string]: unknown; }

// Interface para dados de usuário
export interface AuraUserProps {
  users?: string[];
  loading?: boolean;
  error?: string | null;
  onRefresh??: (e: any) => void;
  onCreateUser?: (e: any) => void;
  onUpdateUser?: (e: any) => void;
  onDeleteUser?: (e: any) => void;
  [key: string]: unknown; }

// Interface para dados de permissão
export interface AuraPermissionProps {
  permissions?: string[];
  loading?: boolean;
  error?: string | null;
  onRefresh??: (e: any) => void;
  onCreatePermission?: (e: any) => void;
  onUpdatePermission?: (e: any) => void;
  onDeletePermission?: (e: any) => void;
  [key: string]: unknown; }

// Interface para dados de role
export interface AuraRoleProps {
  roles?: Record<string, any>[];
  loading?: boolean;
  error?: string | null;
  onRefresh??: (e: any) => void;
  onCreateRole?: (e: any) => void;
  onUpdateRole?: (e: any) => void;
  onDeleteRole?: (e: any) => void;
  [key: string]: unknown; }
