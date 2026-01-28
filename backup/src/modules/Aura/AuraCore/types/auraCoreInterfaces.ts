/**
 * Interfaces do módulo AuraCore
 */

import { 
  AuraStats, 
  AuraModule, 
  AuraQuickAction, 
  AuraNotification,
  AuraConfig,
  AuraResponse,
  AuraPagination,
  AuraFilters,
  AuraDashboardData
} from './auraCoreTypes';

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
  filters: AuraFilters;
}

// Interface para ações do store
export interface AuraCoreActions {
  // Estatísticas
  fetchStats: () => Promise<void>;
  updateStats: (stats: Partial<AuraStats>) => void;
  
  // Módulos
  fetchModules: () => Promise<void>;
  updateModule: (id: string, data: Partial<AuraModule>) => void;
  
  // Ações rápidas
  fetchQuickActions: () => Promise<void>;
  executeQuickAction: (id: string) => Promise<void>;
  
  // Notificações
  fetchNotifications: () => Promise<void>;
  markNotificationAsRead: (id: string) => void;
  clearNotifications: () => void;
  
  // Dashboard
  fetchDashboardData: () => Promise<void>;
  refreshDashboard: () => Promise<void>;
  
  // Configuração
  updateConfig: (config: Partial<AuraConfig>) => void;
  
  // Filtros
  applyFilters: (filters: AuraFilters) => void;
  clearFilters: () => void;
  
  // Controle de estado
  setCurrentView: (view: string) => void;
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
}

// Interface para componentes
export interface AuraCoreComponentProps {
  className?: string;
  loading?: boolean;
  error?: string | null;
  onAction?: (action: string, data?: any) => void;
}

// Interface para hooks
export interface AuraCoreHookReturn {
  loading: boolean;
  error: string | null;
  data?: any;
  actions: {
    [key: string]: (...args: any[]) => Promise<any> | void;
  };
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
}

// Interface para dados de dashboard
export interface AuraDashboardProps {
  stats?: AuraStats;
  modules?: AuraModule[];
  quickActions?: AuraQuickAction[];
  notifications?: AuraNotification[];
  loading?: boolean;
  error?: string | null;
  onRefresh?: () => void;
  onModuleClick?: (module: AuraModule) => void;
  onQuickActionClick?: (action: AuraQuickAction) => void;
}

// Interface para dados de header
export interface AuraHeaderProps {
  totalConnections?: number;
  totalFlows?: number;
  totalChats?: number;
  loading?: boolean;
  onRefresh?: () => void;
  onSettingsClick?: () => void;
}

// Interface para dados de estatísticas
export interface AuraStatsProps {
  stats?: AuraStats;
  loading?: boolean;
  error?: string | null;
  onRefresh?: () => void;
}

// Interface para dados de módulos
export interface AuraModulesProps {
  modules?: AuraModule[];
  loading?: boolean;
  error?: string | null;
  onModuleClick?: (module: AuraModule) => void;
}

// Interface para dados de ações rápidas
export interface AuraQuickActionsProps {
  actions?: AuraQuickAction[];
  loading?: boolean;
  error?: string | null;
  onActionClick?: (action: AuraQuickAction) => void;
}

// Interface para dados de notificações
export interface AuraNotificationsProps {
  notifications?: AuraNotification[];
  loading?: boolean;
  error?: string | null;
  onNotificationClick?: (notification: AuraNotification) => void;
  onMarkAsRead?: (id: string) => void;
  onClearAll?: () => void;
}

// Interface para dados de navegação
export interface AuraNavigationProps {
  currentView?: string;
  modules?: AuraModule[];
  onViewChange?: (view: string) => void;
  onModuleClick?: (module: AuraModule) => void;
}

// Interface para dados de filtros
export interface AuraFiltersProps {
  filters?: AuraFilters;
  onFiltersChange?: (filters: AuraFilters) => void;
  onClearFilters?: () => void;
}

// Interface para dados de configuração
export interface AuraConfigProps {
  config?: AuraConfig;
  onConfigChange?: (config: Partial<AuraConfig>) => void;
  onSave?: () => void;
  onReset?: () => void;
}

// Interface para dados de monitoramento
export interface AuraMonitoringProps {
  systemHealth?: 'healthy' | 'warning' | 'critical';
  activeConnections?: number;
  activeFlows?: number;
  activeChats?: number;
  errorCount?: number;
  loading?: boolean;
  onRefresh?: () => void;
}

// Interface para dados de performance
export interface AuraPerformanceProps {
  responseTime?: number;
  uptime?: number;
  errorRate?: number;
  throughput?: number;
  loading?: boolean;
  onRefresh?: () => void;
}

// Interface para dados de analytics
export interface AuraAnalyticsProps {
  totalMessages?: number;
  successfulMessages?: number;
  failedMessages?: number;
  averageResponseTime?: number;
  peakConcurrentUsers?: number;
  loading?: boolean;
  onRefresh?: () => void;
}

// Interface para dados de backup
export interface AuraBackupProps {
  backups?: any[];
  loading?: boolean;
  error?: string | null;
  onCreateBackup?: () => void;
  onRestoreBackup?: (id: string) => void;
  onDeleteBackup?: (id: string) => void;
}

// Interface para dados de logs
export interface AuraLogsProps {
  logs?: any[];
  loading?: boolean;
  error?: string | null;
  onRefresh?: () => void;
  onClearLogs?: () => void;
  onExportLogs?: () => void;
}

// Interface para dados de eventos
export interface AuraEventsProps {
  events?: any[];
  loading?: boolean;
  error?: string | null;
  onRefresh?: () => void;
  onProcessEvent?: (id: string) => void;
  onClearEvents?: () => void;
}

// Interface para dados de cache
export interface AuraCacheProps {
  cache?: any;
  loading?: boolean;
  error?: string | null;
  onRefresh?: () => void;
  onClearCache?: () => void;
  onInvalidateKey?: (key: string) => void;
}

// Interface para dados de sessão
export interface AuraSessionProps {
  sessions?: any[];
  loading?: boolean;
  error?: string | null;
  onRefresh?: () => void;
  onTerminateSession?: (id: string) => void;
  onClearSessions?: () => void;
}

// Interface para dados de usuário
export interface AuraUserProps {
  users?: any[];
  loading?: boolean;
  error?: string | null;
  onRefresh?: () => void;
  onCreateUser?: (user: any) => void;
  onUpdateUser?: (id: string, user: any) => void;
  onDeleteUser?: (id: string) => void;
}

// Interface para dados de permissão
export interface AuraPermissionProps {
  permissions?: any[];
  loading?: boolean;
  error?: string | null;
  onRefresh?: () => void;
  onCreatePermission?: (permission: any) => void;
  onUpdatePermission?: (id: string, permission: any) => void;
  onDeletePermission?: (id: string) => void;
}

// Interface para dados de role
export interface AuraRoleProps {
  roles?: any[];
  loading?: boolean;
  error?: string | null;
  onRefresh?: () => void;
  onCreateRole?: (role: any) => void;
  onUpdateRole?: (id: string, role: any) => void;
  onDeleteRole?: (id: string) => void;
}
