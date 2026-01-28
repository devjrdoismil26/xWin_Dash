/**
 * Exportações otimizadas do módulo Activity
 * Entry point principal com lazy loading
 */
import React from 'react';

/**
 * Exportação otimizada do módulo Activity
 * Implementa lazy loading inteligente para componentes pesados
 */

// ===== IMPORTS DIRETOS (Core - sempre carregados) =====
// Componentes principais

// Hooks principais
export { useActivity } from './hooks/useActivity';
export { useActivityStore } from './hooks/useActivityStore';

// Services principais
export { default as activityService } from './services/activityService';

// Types principais
// export { ActivityLog, ActivityStats, ActivityFilters, ActivityResponse, ActivityPagination } from './types/activityTypes';

// ===== PÁGINAS (Import direto) =====
export { default as ActivityIndexPage } from './pages/ActivityIndexPage';
export { default as ActivityDetailPage } from './pages/ActivityDetailPage';
export { default as ActivityCreatePage } from './pages/ActivityCreatePage';

// Componentes complexos (lazy loading)
export const ActivityDashboard = () => import('./components/ActivityDashboard');
export const ActivityIntegrationTest = () => import('./components/ActivityIntegrationTest');

// Hooks especializados (lazy loading)
export const useActivityLogs = () => import('./hooks/useActivityLogs');
// export const useActivityCache = () => import('./hooks/useActivityCache');
// export const useActivityValidation = () => import('./hooks/useActivityValidation');

// Services especializados (lazy loading)
export const activityApiService = () => import('./services/activityApiService');
export const activityCacheService = () => import('./services/activityCacheService');
export const activityValidationService = () => import('./services/activityValidationService');

// Utils (lazy loading)
export const activityHelpers = () => import('./utils/activityHelpers');
export const activityFormatters = () => import('./utils/activityFormatters');
export const activityValidators = () => import('./utils/activityValidators');

// ===== EXPORTS CONDICIONAIS =====
// Exporta apenas se estiver em ambiente de desenvolvimento
// export const activityTests = process.env.NODE_ENV === 'development' 
//   ? () => import('./tests/activity.test')
//   : undefined;

// export const activityMocks = process.env.NODE_ENV === 'development'
//   ? () => import('./tests/__mocks__/activityMocks')
//   : undefined;

// ===== EXPORTS DINÂMICOS =====
// Função para carregar componentes sob demanda
export const loadActivityComponent = async (componentName) => {
  const componentMap = {
    'ActivityIndexPage': () => import('./pages/ActivityIndexPage'),
    'ActivityDetailPage': () => import('./pages/ActivityDetailPage'),
    'ActivityCreatePage': () => import('./pages/ActivityCreatePage'),
    'ActivityDashboard': () => import('./components/ActivityDashboard'),
    'ActivityIntegrationTest': () => import('./components/ActivityIntegrationTest'),
    'ActivityList': () => import('./components/ActivityList'),
    // 'ActivityForm': () => import('./components/ActivityForm'),
    // 'ActivityCard': () => import('./components/ActivityCard'),
    'ActivityFilters': () => import('./components/ActivityFilters'),
    'ActivityActions': () => import('./components/ActivityActions'),
    'ActivityStats': () => import('./components/ActivityStats'),
    'ActivityBreadcrumbs': () => import('./components/ActivityBreadcrumbs')
  };

  if (componentMap[componentName]) {
    return await componentMap[componentName]();
  }
  
  throw new Error(`Componente ${componentName} não encontrado`);
};

// Função para carregar hooks sob demanda
export const loadActivityHook = async (hookName) => {
  const hookMap = {
    'useActivityLogs': () => import('./hooks/useActivityLogs'),
    // 'useActivityCache': () => import('./hooks/useActivityCache'),
    // 'useActivityValidation': () => import('./hooks/useActivityValidation')
  };

  if (hookMap[hookName]) {
    return await hookMap[hookName]();
  }
  
  throw new Error(`Hook ${hookName} não encontrado`);
};

// Função para carregar services sob demanda
export const loadActivityService = async (serviceName) => {
  const serviceMap = {
    'activityApiService': () => import('./services/activityApiService'),
    'activityCacheService': () => import('./services/activityCacheService'),
    'activityValidationService': () => import('./services/activityValidationService')
  };

  if (serviceMap[serviceName]) {
    return await serviceMap[serviceName]();
  }
  
  throw new Error(`Service ${serviceName} não encontrado`);
};

// ===== MÉTRICAS DE PERFORMANCE =====
// Função para obter informações de carregamento
export const getActivityModuleInfo = () => {
  return {
    name: 'Activity',
    version: '1.0.0',
    lazyComponents: [
      'ActivityIndexPage',
      'ActivityDetailPage', 
      'ActivityCreatePage',
      'ActivityDashboard',
      'ActivityIntegrationTest'
    ],
    lazyHooks: [
      'useActivityLogs',
      // 'useActivityCache',
      // 'useActivityValidation'
    ],
    lazyServices: [
      'activityApiService',
      'activityCacheService',
      'activityValidationService'
    ],
    coreExports: [
      'Activity',
      'useActivity',
      'useActivityStore',
      'activityService'
    ]
  };
};

// ===== CONFIGURAÇÕES DE CACHE =====
// Configurações para otimização de cache
export const ACTIVITY_CACHE_CONFIG = {
  // Cache de componentes
  componentCache: {
    maxSize: 10,
    ttl: 5 * 60 * 1000 // 5 minutos
  },
  
  // Cache de hooks
  hookCache: {
    maxSize: 5,
    ttl: 10 * 60 * 1000 // 10 minutos
  },
  
  // Cache de services
  serviceCache: {
    maxSize: 3,
    ttl: 15 * 60 * 1000 // 15 minutos
  }
};

// ===== EXPORTS PADRÃO =====
// Export padrão do módulo
export default {
  Activity,
  useActivity,
  useActivityStore,
  activityService,
  loadActivityComponent,
  loadActivityHook,
  loadActivityService,
  getActivityModuleInfo,
  ACTIVITY_CACHE_CONFIG
};
