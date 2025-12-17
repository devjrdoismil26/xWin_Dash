/**
 * Hooks Globais - Entry Point
 *
 * @description
 * Este módulo serve como ponto de entrada centralizado para todos os hooks
 * globais da aplicação. Re-exporta hooks de autenticação, formulários, validação,
 * loading states, notificações, performance, tradução, calendário, rotas e tema
 * para facilitar imports em outras partes da aplicação.
 *
 * Funcionalidades principais:
 * - Re-exportação centralizada de hooks globais essenciais
 * - Re-exportação de hooks de autenticação
 * - Re-exportação de hooks globais (breadcrumbs, debounce, form)
 * - Re-exportação de hooks de tradução, calendário e rotas
 * - Re-exportação de tipos e interfaces relacionadas
 *
 * **Nota:** Hooks de módulos específicos devem ser importados diretamente dos módulos.
 *
 * @module hooks
 * @since 1.0.0
 *
 * @example
 * ```tsx
 * // Import centralizado de hooks
 * import { useApp, useForm, useDebounce } from '@/hooks';
 *
 * // Import de tipos
 * import { ValidationRule, LoadingState } from '@/hooks';
 *
 * // Usar hooks
 * const { theme, setTheme } = useApp();

 * ```
 */

// ========================================
// HOOKS INDEX - EXPORTS CENTRALIZADOS
// ========================================

/**
 * Re-exportações de hooks globais essenciais
 *
 * @description
 * Exporta hooks essenciais para gerenciamento de aplicação, formulários,
 * validação, loading states, notificações avançadas e performance.
 */
// Hooks Globais Essenciais
export { useApp } from "./useApp";

// Hooks de Permissões
export { usePermissions, default as usePermissionsDefault } from "./usePermissions";
export { useFormValidation, useFormWithSchema, moduleSchemas, commonSchemas,  } from "./useFormValidation";
export { useLoadingStates, useFormLoadingStates, useDataLoadingStates,  } from "./useLoadingStates";
export { useAdvancedNotifications, useAsyncOperation, notificationPresets,  } from "./useAdvancedNotifications";
export { useIntersection, useHeavyMemo, usePerformanceMonitor, useVirtualList, useMemoryCache, useBatchUpdates, useLazyState,  } from "./usePerformance";
export { useVirtualization } from "./useVirtualization";

/**
 * Re-exportações de hooks de autenticação
 *
 * @description
 * Exporta hooks relacionados a autenticação e autorização.
 */
// Hooks de Autenticação
export { default as useAuth } from "./api/useAuth";

/**
 * Re-exportações de hooks globais
 *
 * @description
 * Exporta hooks globais para breadcrumbs, debounce e formulários.
 */
// Hooks Globais
export { useBreadcrumbs } from "./global/useBreadcrumbs";
export { useDebounce } from "./global/useDebounce";
export { useForm } from "./global/useForm";

/**
 * Re-exportações de hooks de tradução
 *
 * @description
 * Exporta hooks para internacionalização e tradução.
 */
// Hooks de Tradução
export { useTranslation, useT } from "./useTranslation";

/**
 * Re-exportações de hooks de calendário
 *
 * @description
 * Exporta hooks para gerenciamento de calendário e eventos.
 */
// Hooks de Calendário
export { useCalendarState, useCalendarAPI } from "./useCalendar";

/**
 * Re-exportações de hooks de rotas
 *
 * @description
 * Exporta hooks para gerenciamento de rotas da sidebar.
 */
// Hooks de Rotas
export { useSidebarRoutes } from "./useSidebarRoutes";

/**
 * Re-exportações de hooks de tema
 *
 * @description
 * Exporta hooks para gerenciamento de classes de tema.
 */
// Hooks de Tema
export { default as useThemeClasses } from "./useThemeClasses";

// ========================================
// TIPOS E INTERFACES
// ========================================

/**
 * Re-exportações de tipos e interfaces
 *
 * @description
 * Exporta todos os tipos TypeScript relacionados aos hooks globais
 * para facilitar o uso em outras partes da aplicação.
 */
export type {
  ValidationRule,
  FormField,
  ValidationError,
  UseFormValidationReturn,
} from "./useFormValidation";

export type { LoadingState, UseLoadingStatesReturn } from "./useLoadingStates";

export type {
  Notification,
  NotificationAction,
  UseNotificationsReturn,
} from "./useAdvancedNotifications";

export type {
  UseVirtualizationOptions,
  UseVirtualizationResult,
} from "./useVirtualization";

export type {
  BreadcrumbItem,
  BreadcrumbConfig,
} from "./global/breadcrumbConfig";
export type { UseBreadcrumbsReturn } from "./global/useBreadcrumbs";

export type { UseBreadcrumbsReturn as UseBreadcrumbsReturnType } from "./global/useBreadcrumbs";

// ========================================
// NOTA IMPORTANTE
// ========================================

/**
 * Nota sobre hooks de módulos específicos
 *
 * @description
 * Hooks dos módulos específicos devem ser importados diretamente dos módulos
 * para manter a separação clara entre hooks globais e hooks específicos dos módulos.
 *
 * @example
 * ```tsx
 * // Importar hooks de módulos específicos diretamente
 * import { useAI } from '@/modules/AI/hooks/useAI';
 * import { useWorkflows } from '@/modules/Workflows/hooks/useWorkflows';
 * import { useLeads } from '@/modules/Leads/hooks/useLeads';
 * import { useProducts } from '@/modules/Products/hooks/useProducts';
 * import { useMedia } from '@/modules/MediaLibrary/hooks/useMedia';
 * import { useProjects } from '@/modules/Projects/hooks/useProjects';
 * import { useUniverse } from '@/modules/Universe/hooks/useUniverse';
 * ```
 */
