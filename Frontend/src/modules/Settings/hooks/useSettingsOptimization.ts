import React from 'react';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { settingsOptimizationService, createOptimizedFetcher, createDebouncedFunction, createMemoizedFunction, preloadData, queuePreload, isDataPreloaded, getPerformanceMetrics, resetPerformanceMetrics, clearAllOptimizations, updateOptimizationConfig, getOptimizationConfig, type OptimizationConfig, type PerformanceMetrics } from '../services/settingsOptimizationService';

// =========================================
// INTERFACES
// =========================================

export interface UseSettingsOptimizationState {
  config: OptimizationConfig;
  metrics: PerformanceMetrics;
  isOptimizing: boolean;
  optimizationStats: {
    debounce: { activeTimers: number
  [key: string]: unknown; };

    preload: { preloadedItems: number; queueLength: number};

    memoization: { cacheSize: number; hitRate: number};

    performance: PerformanceMetrics;};

}

export interface UseSettingsOptimizationActions {
  // Configuration
  updateConfig?: (e: any) => void;
  resetConfig??: (e: any) => void;
  // Performance Monitoring
  startTiming?: (e: any) => void;
  endTiming: (key: string) => number;
  updateMetrics?: (e: any) => void;
  resetMetrics??: (e: any) => void;
  // Optimization Functions
  createOptimizedFetcher: <T>(
    key: string,
    fetcher: () => Promise<T>,
    options?: {
      cache?: boolean;
  preload?: boolean;
  debounce?: boolean;
  ttl?: number;
  [key: string]: unknown; }
  ) => () => Promise<T>;
  
  createDebouncedFunction: <T extends (...args: string[]) => any>(
    key: string,
    func: T,
    delay?: number
  ) => T;
  
  createMemoizedFunction: <T extends (...args: string[]) => any>(
    key: string,
    func: T,
    ttl?: number
  ) => T;
  
  // Preloading
  preloadData: (key: string, loader: () => Promise<any>, priority?: number) => Promise<void>;
  queuePreload: (key: string, loader: () => Promise<any>, priority?: number) => void;
  isDataPreloaded: (key: string) => boolean;
  
  // Cleanup
  clearAllOptimizations??: (e: any) => void;
  clearMemoization?: (e: any) => void;
  cancelDebounce?: (e: any) => void;
  
  // React-specific optimized hooks
  useOptimizedCallback: <T extends (...args: string[]) => any>(
    key: string,
    callback: T,
    deps: React.DependencyList,
    options?: { ttl?: number }
  ) => T;
  
  useOptimizedMemo: <T>(
    key: string,
    factory: () => T,
    deps: React.DependencyList,
    options?: { ttl?: number }
  ) => T;
  
  useDebouncedCallback: <T extends (...args: string[]) => any>(
    key: string,
    callback: T,
    deps: React.DependencyList,
    delay?: number
  ) => T;
}

export interface UseSettingsOptimizationReturn extends UseSettingsOptimizationState, UseSettingsOptimizationActions {}

// =========================================
// HOOK PRINCIPAL
// =========================================

export const useSettingsOptimization = (): UseSettingsOptimizationReturn => {
  // ===== ESTADO =====
  const [state, setState] = useState<UseSettingsOptimizationState>({
    config: getOptimizationConfig(),
    metrics: getPerformanceMetrics(),
    isOptimizing: false,
    optimizationStats: settingsOptimizationService.getOptimizationStats()
  });

  // ===== CONFIGURAÇÃO =====

  /**
   * Atualizar configuração
   */
  const updateConfig = useCallback((config: Partial<OptimizationConfig>) => {
    updateOptimizationConfig(config);

    setState(prev => ({
      ...prev,
      config: getOptimizationConfig()
  }));

  }, []);

  /**
   * Resetar configuração
   */
  const resetConfig = useCallback(() => {
    updateOptimizationConfig({
      debounceDelay: 300,
      cacheTTL: 5 * 60 * 1000,
      preloadThreshold: 0.8,
      compressionEnabled: true,
      lazyLoadingEnabled: true
    });

    setState(prev => ({
      ...prev,
      config: getOptimizationConfig()
  }));

  }, []);

  // ===== MONITORAMENTO DE PERFORMANCE =====

  /**
   * Iniciar timing
   */
  const startTiming = useCallback((key: string) => {
    settingsOptimizationService.startTiming(key);

  }, []);

  /**
   * Finalizar timing
   */
  const endTiming = useCallback((key: string): number => {
    const duration = settingsOptimizationService.endTiming(key);

    setState(prev => ({
      ...prev,
      metrics: getPerformanceMetrics()
  }));

    return duration;
  }, []);

  /**
   * Atualizar métricas
   */
  const updateMetrics = useCallback((updates: Partial<PerformanceMetrics>) => {
    settingsOptimizationService.updatePerformanceMetrics(updates);

    setState(prev => ({
      ...prev,
      metrics: getPerformanceMetrics()
  }));

  }, []);

  /**
   * Resetar métricas
   */
  const resetMetrics = useCallback(() => {
    resetPerformanceMetrics();

    setState(prev => ({
      ...prev,
      metrics: getPerformanceMetrics()
  }));

  }, []);

  // ===== FUNÇÕES DE OTIMIZAÇÃO =====

  /**
   * Criar fetcher otimizado
   */
  const createOptimizedFetcherWrapper = useCallback(<T>(
    key: string,
    fetcher: () => Promise<T>,
    options?: {
      cache?: boolean;
      preload?: boolean;
      debounce?: boolean;
      ttl?: number;
    }
  ): (() => Promise<T>) => {
    return createOptimizedFetcher(key, fetcher, options);

  }, []);

  /**
   * Criar função com debounce
   */
  const createDebouncedFunctionWrapper = useCallback(<T extends (...args: string[]) => any>(
    key: string,
    func: T,
    delay?: number
  ): T => {
    return createDebouncedFunction(key, func, delay);

  }, []);

  /**
   * Criar função memoizada
   */
  const createMemoizedFunctionWrapper = useCallback(<T extends (...args: string[]) => any>(
    key: string,
    func: T,
    ttl?: number
  ): T => {
    return createMemoizedFunction(key, func, ttl);

  }, []);

  // ===== PRELOADING =====

  /**
   * Preload de dados
   */
  const preloadDataWrapper = useCallback(async (key: string, loader: () => Promise<any>, priority?: number): Promise<void> => {
    setState(prev => ({ ...prev, isOptimizing: true }));

    try {
      await preloadData(key, loader, priority);

    } finally {
      setState(prev => ({ ...prev, isOptimizing: false }));

    } , []);

  /**
   * Queue preload
   */
  const queuePreloadWrapper = useCallback((key: string, loader: () => Promise<any>, priority?: number): void => {
    queuePreload(key, loader, priority);

  }, []);

  /**
   * Verificar se dados estão preloaded
   */
  const isDataPreloadedWrapper = useCallback((key: string): boolean => {
    return isDataPreloaded(key);

  }, []);

  // ===== LIMPEZA =====

  /**
   * Limpar todas as otimizações
   */
  const clearAllOptimizationsWrapper = useCallback(() => {
    clearAllOptimizations();

    setState(prev => ({
      ...prev,
      metrics: getPerformanceMetrics(),
      optimizationStats: settingsOptimizationService.getOptimizationStats()
  }));

  }, []);

  /**
   * Limpar memoização
   */
  const clearMemoization = useCallback((key?: string) => {
    settingsOptimizationService.clearMemoization(key);

    setState(prev => ({
      ...prev,
      optimizationStats: settingsOptimizationService.getOptimizationStats()
  }));

  }, []);

  /**
   * Cancelar debounce
   */
  const cancelDebounce = useCallback((key: string) => {
    settingsOptimizationService.cancelDebounce(key);

    setState(prev => ({
      ...prev,
      optimizationStats: settingsOptimizationService.getOptimizationStats()
  }));

  }, []);

  // ===== HOOKS REACT ESPECÍFICOS =====

  /**
   * Hook de callback otimizado
   */
  const useOptimizedCallback = useCallback(<T extends (...args: string[]) => any>(
    key: string,
    callback: T,
    deps: React.DependencyList,
    options?: { ttl?: number }
  ): T => {
    return useMemo(() => {
      return createMemoizedFunction(key, callback, options?.ttl);

    }, [key, ...deps, options?.ttl]);

  }, []);

  /**
   * Hook de memo otimizado
   */
  const useOptimizedMemo = useCallback(<T>(
    key: string,
    factory: () => T,
    deps: React.DependencyList,
    options?: { ttl?: number }
  ): T => {
    return useMemo(() => {
      return createMemoizedFunction(key, factory, options?.ttl)();

    }, [key, ...deps, options?.ttl]);

  }, []);

  /**
   * Hook de callback com debounce
   */
  const useDebouncedCallback = useCallback(<T extends (...args: string[]) => any>(
    key: string,
    callback: T,
    deps: React.DependencyList,
    delay?: number
  ): T => {
    return useMemo(() => {
      return createDebouncedFunction(key, callback, delay);

    }, [key, ...deps, delay]);

  }, []);

  // ===== EFEITOS =====

  // Atualizar estatísticas periodicamente
  useEffect(() => {
    const interval = setInterval(() => {
      setState(prev => ({
        ...prev,
        optimizationStats: settingsOptimizationService.getOptimizationStats()
  }));

    }, 5000); // A cada 5 segundos

    return () => clearInterval(interval);

  }, []);

  // ===== RETORNO =====

  return {
    // Estado
    ...state,
    
    // Configuração
    updateConfig,
    resetConfig,
    
    // Monitoramento de performance
    startTiming,
    endTiming,
    updateMetrics,
    resetMetrics,
    
    // Funções de otimização
    createOptimizedFetcher: createOptimizedFetcherWrapper,
    createDebouncedFunction: createDebouncedFunctionWrapper,
    createMemoizedFunction: createMemoizedFunctionWrapper,
    
    // Preloading
    preloadData: preloadDataWrapper,
    queuePreload: queuePreloadWrapper,
    isDataPreloaded: isDataPreloadedWrapper,
    
    // Limpeza
    clearAllOptimizations: clearAllOptimizationsWrapper,
    clearMemoization,
    cancelDebounce,
    
    // Hooks React específicos
    useOptimizedCallback,
    useOptimizedMemo,
    useDebouncedCallback};
};

// =========================================
// EXPORTS
// =========================================

export default useSettingsOptimization;
