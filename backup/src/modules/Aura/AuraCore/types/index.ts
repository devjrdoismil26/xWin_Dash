/**
 * Exportações centralizadas dos tipos do módulo AuraCore
 */

// Tipos principais
export * from './auraCoreTypes';
export * from './auraCoreInterfaces';

// Re-exportações para conveniência
export type {
  AuraStatus,
  AuraModuleType,
  AuraQuickActionType,
  AuraStatType,
  AuraNotificationType,
  AuraMetric,
  AuraStats,
  AuraQuickAction,
  AuraModule,
  AuraConfig,
  AuraNotification,
  AuraResponse,
  AuraPagination,
  AuraFilters,
  AuraDashboardData
} from './auraCoreTypes';

export type {
  AuraCoreState,
  AuraCoreActions,
  AuraCoreComponentProps,
  AuraCoreHookReturn,
  AuraCoreServiceInterface,
  AuraDashboardProps,
  AuraHeaderProps,
  AuraStatsProps,
  AuraModulesProps,
  AuraQuickActionsProps,
  AuraNotificationsProps,
  AuraNavigationProps,
  AuraFiltersProps,
  AuraConfigProps,
  AuraMonitoringProps,
  AuraPerformanceProps,
  AuraAnalyticsProps
} from './auraCoreInterfaces';
