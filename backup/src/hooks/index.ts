// ========================================
// HOOKS INDEX - EXPORTS CENTRALIZADOS
// ========================================

// Hooks Globais Essenciais
export { useApp, useAppForm, useAppAPI, usePermissions } from './useApp';
export { useFormValidation, useFormWithSchema, moduleSchemas, commonSchemas } from './useFormValidation';
export { useLoadingStates, useFormLoadingStates, useDataLoadingStates } from './useLoadingStates';
export { useAdvancedNotifications, useAsyncOperation, notificationPresets } from './useAdvancedNotifications';
export { usePerformance, useIntersection, useHeavyMemo, usePerformanceMonitor, useVirtualList, useMemoryCache, useBatchUpdates, useLazyState } from './usePerformance';
export { useVirtualization } from './useVirtualization';

// Hooks de Autenticação
export { default as useAuth } from './api/useAuth';

// Hooks Globais
export { useBreadcrumbs } from './global/useBreadcrumbs';
export { useDebounce } from './global/useDebounce';
export { useForm } from './global/useForm';

// Hooks de Tradução
export { useTranslation, useT } from './useTranslation';

// Hooks de Calendário
export { useCalendar } from './useCalendar';

// Hooks de Rotas
export { useSidebarRoutes } from './useSidebarRoutes';

// Hooks de Tema
export { default as useThemeClasses } from './useThemeClasses';

// ========================================
// TIPOS E INTERFACES
// ========================================

export type { 
  ValidationRule, 
  FormField, 
  ValidationError, 
  UseFormValidationReturn 
} from './useFormValidation';

export type { 
  LoadingState, 
  UseLoadingStatesReturn 
} from './useLoadingStates';

export type { 
  Notification, 
  NotificationAction, 
  UseNotificationsReturn 
} from './useAdvancedNotifications';

export type { 
  UseVirtualizationOptions, 
  UseVirtualizationResult 
} from './useVirtualization';

export type {
  BreadcrumbItem,
  BreadcrumbConfig,
  UseBreadcrumbsReturn
} from './global/breadcrumbConfig';

export type {
  UseBreadcrumbsReturn as UseBreadcrumbsReturnType
} from './global/useBreadcrumbs';

// ========================================
// NOTA IMPORTANTE
// ========================================
// 
// Hooks dos módulos específicos devem ser importados diretamente dos módulos:
// 
// import { useAI } from '@/modules/AI/hooks/useAI';
// import { useWorkflows } from '@/modules/Workflows/hooks/useWorkflows';
// import { useLeads } from '@/modules/Leads/hooks/useLeads';
// import { useProducts } from '@/modules/Products/hooks/useProducts';
// import { useMedia } from '@/modules/MediaLibrary/hooks/useMedia';
// import { useProjects } from '@/modules/Projects/hooks/useProjects';
// import { useUniverse } from '@/modules/Projects/Universe/hooks/useUniverse';
// 
// Isso mantém a separação clara entre hooks globais e hooks específicos dos módulos.
