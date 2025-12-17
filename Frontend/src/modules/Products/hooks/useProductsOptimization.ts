import React from 'react';
// =========================================
// USE PRODUCTS OPTIMIZATION - HOOK DE OTIMIZAÇÕES
// =========================================
// Hook para gerenciar otimizações de performance
// Máximo: 200 linhas

import { useCallback, useEffect, useMemo, useRef } from 'react';
import { createOptimizedFetcher, createDebouncedFunction, createMemoizedFunction, preloadData, queuePreload, isDataPreloaded, getPerformanceMetrics, resetPerformanceMetrics, clearAllOptimizations, updateOptimizationConfig, getOptimizationConfig, updateCacheStrategy, getCacheStrategy } from '../services/productsOptimizationService';

interface UseProductsOptimizationReturn {
  // Métricas de performance
  metrics: {
    cacheHitRate: number;
  averageResponseTime: number;
  memoryUsage: number;
  networkRequests: number;
  lastOptimized: number; };

  // Funções de otimização
  createOptimizedFetcher: typeof createOptimizedFetcher;
  createDebouncedFunction: typeof createDebouncedFunction;
  createMemoizedFunction: typeof createMemoizedFunction;
  
  // Preloading
  preloadData: typeof preloadData;
  queuePreload: typeof queuePreload;
  isDataPreloaded: typeof isDataPreloaded;
  
  // Gerenciamento
  resetMetrics??: (e: any) => void;
  clearOptimizations??: (e: any) => void;
  updateConfig?: (e: any) => void;
  getConfig: () => Record<string, any>;
  updateStrategy?: (e: any) => void;
  getStrategy: (key: string) => Record<string, any>;
  
  // Hooks otimizados
  useOptimizedCallback: <T extends (...args: string[]) => any>(
    callback: T,
    deps: React.DependencyList,
    key?: string
  ) => T;
  
  useOptimizedMemo: <T>(
    factory: () => T,
    deps: React.DependencyList,
    key?: string
  ) => T;
  
  useDebouncedCallback: <T extends (...args: string[]) => any>(
    callback: T,
    deps: React.DependencyList,
    delay?: number,
    key?: string
  ) => T;
}

export const useProductsOptimization = (): UseProductsOptimizationReturn => {
  const metricsRef = useRef(getPerformanceMetrics());

  const [, forceUpdate] = useMemo(() => [0, () => {}], []);

  // =========================================
  // ATUALIZAÇÃO DE MÉTRICAS
  // =========================================

  const updateMetrics = useCallback(() => {
    metricsRef.current = getPerformanceMetrics();

    forceUpdate();

  }, [forceUpdate]);

  useEffect(() => {
    const interval = setInterval(updateMetrics, 5000); // Atualizar a cada 5 segundos
    return () => clearInterval(interval);

  }, [updateMetrics]);

  // =========================================
  // HOOKS OTIMIZADOS
  // =========================================

  const useOptimizedCallback = useCallback(<T extends (...args: string[]) => any>(
    callback: T,
    deps: React.DependencyList,
    key?: string
  ): T => {
    const memoKey = key || `callback_${deps.join('_')}`;
    return createMemoizedFunction(memoKey, callback, 5 * 60 * 1000);

  }, []);

  const useOptimizedMemo = useCallback(<T>(
    factory: () => T,
    deps: React.DependencyList,
    key?: string
  ): T => {
    const memoKey = key || `memo_${deps.join('_')}`;
    return createMemoizedFunction(memoKey, factory, 5 * 60 * 1000)();

  }, []);

  const useDebouncedCallback = useCallback(<T extends (...args: string[]) => any>(
    callback: T,
    deps: React.DependencyList,
    delay: number = 300,
    key?: string
  ): T => {
    const debounceKey = key || `debounce_${deps.join('_')}`;
    return createDebouncedFunction(debounceKey, callback, delay);

  }, []);

  // =========================================
  // FUNÇÕES DE GERENCIAMENTO
  // =========================================

  const resetMetrics = useCallback(() => {
    resetPerformanceMetrics();

    updateMetrics();

  }, [updateMetrics]);

  const clearOptimizations = useCallback(() => {
    clearAllOptimizations();

    updateMetrics();

  }, [updateMetrics]);

  const updateConfig = useCallback((config: unknown) => {
    updateOptimizationConfig(config);

  }, []);

  const getConfig = useCallback(() => {
    return getOptimizationConfig();

  }, []);

  const updateStrategy = useCallback((key: string, strategy: unknown) => {
    updateCacheStrategy(key, strategy);

  }, []);

  const getStrategy = useCallback((key: string) => {
    return getCacheStrategy(key);

  }, []);

  // =========================================
  // RETORNO
  // =========================================

  return {
    // Métricas de performance
    metrics: metricsRef.current,
    
    // Funções de otimização
    createOptimizedFetcher,
    createDebouncedFunction,
    createMemoizedFunction,
    
    // Preloading
    preloadData,
    queuePreload,
    isDataPreloaded,
    
    // Gerenciamento
    resetMetrics,
    clearOptimizations,
    updateConfig,
    getConfig,
    updateStrategy,
    getStrategy,
    
    // Hooks otimizados
    useOptimizedCallback,
    useOptimizedMemo,
    useDebouncedCallback};
};
