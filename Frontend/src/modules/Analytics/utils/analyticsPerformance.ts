import React from 'react';
/**
 * Utilitários de Performance para Analytics
 *
 * @description
 * Funções e hooks para otimização de performance em analytics incluindo
 * debounce, throttle, lazy loading, virtualização, memoização de dados pesados,
 * cache de requisições, otimização de scroll/resize e compressão de dados.
 *
 * @module modules/Analytics/utils/analyticsPerformance
 * @since 1.0.0
 */

import { useCallback, useMemo, useRef, useEffect } from 'react';

/**
 * Hook useDebounce - Hook para Debounce de Funções
 * @function
 * @description
 * Hook para aplicar debounce a funções, atrasando a execução até que
 * um período de inatividade seja atingido.
 *
 * @template T - Tipo da função
 * @param {T} callback - Função a aplicar debounce
 * @param {number} delay - Delay em milissegundos
 * @returns {T} Função com debounce aplicado
 *
 * @example
 * ```typescript
 * const debouncedSearch = useDebounce((query: string) => {
 *   searchAnalytics(query);

 * }, 300);

 * ```
 */
export const useDebounce = <T extends (...args: string[]) => any>(
  callback: T,
  delay: number
): T => {
  const timeoutRef = useRef<NodeJS.Timeout>();

  const debouncedCallback = useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);

      }

      timeoutRef.current = setTimeout(() => {
        callback(...args);

      }, delay);

    },
    [callback, delay]
  ) as T;

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);

      } ;

  }, []);

  return debouncedCallback;};

/**
 * Hook para throttle de funções
 */
export const useThrottle = <T extends (...args: string[]) => any>(
  callback: T,
  delay: number
): T => {
  const lastCallRef = useRef<number>(0);

  const timeoutRef = useRef<NodeJS.Timeout>();

  const throttledCallback = useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();

      const timeSinceLastCall = now - lastCallRef.current;

      if (timeSinceLastCall >= delay) {
        lastCallRef.current = now;
        callback(...args);

      } else {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);

        }

        timeoutRef.current = setTimeout(() => {
          lastCallRef.current = Date.now();

          callback(...args);

        }, delay - timeSinceLastCall);

      } ,
    [callback, delay]
  ) as T;

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);

      } ;

  }, []);

  return throttledCallback;};

/**
 * Hook useLazyComponent - Hook para Lazy Loading de Componentes
 * @function
 * @description
 * Hook para carregar componentes de forma lazy, melhorando o tempo inicial de carregamento.
 *
 * @template T - Tipo do componente
 * @param {() => Promise<{ default: T }>} importFn - Função de importação do componente
 * @param {React.ComponentType} [fallback] - Componente de fallback durante o carregamento (opcional)
 * @returns {T | null} Componente carregado ou null
 *
 * @example
 * ```typescript
 * const LazyChart = useLazyComponent(() => import('./AnalyticsChart'));

 * ```
 */
export const useLazyComponent = <T extends React.ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  fallback?: React.ComponentType
) => {
  const [Component, setComponent] = React.useState<T | null>(null);

  const [loading, setLoading] = React.useState(false);

  const [error, setError] = React.useState<Error | null>(null);

  const loadComponent = useCallback(async () => {
    if (Component || loading) return;

    setLoading(true);

    setError(null);

    try {
      const module = await importFn();

      setComponent(() => module.default);

    } catch (err) {
      setError(err as Error);

    } finally {
      setLoading(false);

    } , [Component, loading, importFn]);

  useEffect(() => {
    loadComponent();

  }, [loadComponent]);

  if (loading) {
    return fallback ? React.createElement(fallback) : null;
  }

  if (error) {
    console.error('Erro ao carregar componente:', error);

    return null;
  }

  return Component;};

/**
 * Hook para virtualização de listas grandes
 */
export const useVirtualization = (items: string[],
  itemHeight: number,
  containerHeight: number,
  overscan: number = 5
) => {
  const [scrollTop, setScrollTop] = React.useState(0);

  const visibleRange = useMemo(() => {
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);

    const endIndex = Math.min(
      items.length - 1,
      Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan);

    return { startIndex, endIndex};

  }, [scrollTop, itemHeight, containerHeight, items.length, overscan]);

  const visibleItems = useMemo(() => {
    return items.slice(visibleRange.startIndex, visibleRange.endIndex + 1);

  }, [items, visibleRange]);

  const totalHeight = items.length * itemHeight;
  const offsetY = visibleRange.startIndex * itemHeight;

  return {
    visibleItems,
    totalHeight,
    offsetY,
    visibleRange,
    setScrollTop};
};

/**
 * Hook para memoização de cálculos pesados
 */
export const useMemoizedCalculation = <T>(
  calculation: () => T,
  dependencies: React.DependencyList,
  options?: { maxAge?: number }
) => {
  const [result, setResult] = React.useState<T>(calculation);

  const [lastCalculation, setLastCalculation] = React.useState(Date.now());

  const memoizedResult = useMemo(() => {
    const now = Date.now();

    const maxAge = options?.maxAge || 60000; // 1 minuto por padrão

    if (now - lastCalculation > maxAge) {
      const newResult = calculation();

      setResult(newResult);

      setLastCalculation(now);

      return newResult;
    }

    return result;
  }, dependencies);

  return memoizedResult;};

/**
 * Hook para otimização de re-renders
 */
export const useOptimizedCallback = <T extends (...args: string[]) => any>(
  callback: T,
  dependencies: React.DependencyList
): T => {
  const callbackRef = useRef(callback);

  const dependenciesRef = useRef(dependencies);

  // Atualizar callback apenas se dependências mudaram
  if (
    dependencies.length !== dependenciesRef.current.length ||
    dependencies.some((dep: unknown, index: unknown) => dep !== dependenciesRef.current[index])
  ) {
    callbackRef.current = callback;
    dependenciesRef.current = dependencies;
  }

  return useCallback(
    ((...args: Parameters<T>) => {
      return callbackRef.current(...args);

    }) as T,
    []);};

/**
 * Hook para gerenciamento de estado de loading otimizado
 */
export const useOptimizedLoading = () => {
  const [loadingStates, setLoadingStates] = React.useState<Record<string, boolean>>({});

  const setLoading = useCallback((key: string, loading: boolean) => {
    setLoadingStates(prev => ({
      ...prev,
      [key]: loading
    }));

  }, []);

  const isLoading = useCallback((key: string) => {
    return loadingStates[key] || false;
  }, [loadingStates]);

  const isAnyLoading = useMemo(() => {
    return Object.values(loadingStates).some(loading => loading);

  }, [loadingStates]);

  const clearLoading = useCallback(() => {
    setLoadingStates({});

  }, []);

  return {
    setLoading,
    isLoading,
    isAnyLoading,
    clearLoading,
    loadingStates};
};

/**
 * Hook para cache de requisições
 */
export const useRequestCache = <T>(
  key: string,
  fetcher: () => Promise<T>,
  options?: {
    ttl?: number;
    staleWhileRevalidate?: boolean;
  }
) => {
  const [data, setData] = React.useState<T | null>(null);

  const [loading, setLoading] = React.useState(false);

  const [error, setError] = React.useState<Error | null>(null);

  const cacheRef = useRef<Map<string, { data: T; timestamp: number }>>(new Map());

  const fetchData = useCallback(async () => {
    const cached = cacheRef.current.get(key);

    const ttl = options?.ttl || 300000; // 5 minutos por padrão

    if (cached && Date.now() - cached.timestamp < ttl) {
      setData(cached.data);

      if (options?.staleWhileRevalidate) {
        // Retornar dados cached e buscar novos em background
        fetcher()
          .then(newData => {
            cacheRef.current.set(key, { data: newData, timestamp: Date.now() });

            setData(newData);

          })
          .catch(err => setError(err instanceof Error ? err.message : 'Error'));

      }
      return;
    }

    setLoading(true);

    setError(null);

    try {
      const result = await fetcher();

      cacheRef.current.set(key, { data: result, timestamp: Date.now() });

      setData(result);

    } catch (err) {
      setError(err as Error);

    } finally {
      setLoading(false);

    } , [key, fetcher, options]);

  const invalidateCache = useCallback(() => {
    cacheRef.current.delete(key);

  }, [key]);

  useEffect(() => {
    fetchData();

  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
    invalidateCache};
};

/**
 * Hook para otimização de scroll
 */
export const useOptimizedScroll = (
  callback?: (e: any) => void,
  options?: {
    throttle?: number;
    passive?: boolean;
  }
) => {
  const throttledCallback = useThrottle(callback, options?.throttle || 16);

  useEffect(() => {
    const handleScroll = (event: Event) => {
      const target = event.target as HTMLElement;
      throttledCallback(target.scrollTop);};

    const element = document.documentElement;
    element.addEventListener('scroll', handleScroll, { passive: options?.passive !== false });

    return () => {
      element.removeEventListener('scroll', handleScroll);};

  }, [throttledCallback, options]);};

/**
 * Hook para otimização de resize
 */
export const useOptimizedResize = (
  callback?: (e: any) => void,
  options?: {
    throttle?: number;
    passive?: boolean;
  }
) => {
  const throttledCallback = useThrottle(callback, options?.throttle || 100);

  useEffect(() => {
    const handleResize = () => {
      throttledCallback(window.innerWidth, window.innerHeight);};

    window.addEventListener('resize', handleResize, { passive: options?.passive !== false });

    return () => {
      window.removeEventListener('resize', handleResize);};

  }, [throttledCallback, options]);};

/**
 * Função para compressão de dados
 */
export const compressData = (data: unknown): string => {
  try {
    const jsonString = JSON.stringify(data);

    return btoa(jsonString);

  } catch (error) {
    return JSON.stringify(data);

  } ;

/**
 * Função para descompressão de dados
 */
export const decompressData = <T>(compressedData: string): T | null => {
  try {
    const jsonString = atob(compressedData);

    return JSON.parse(jsonString);

  } catch (error) {
    return null;
  } ;

/**
 * Função para batch de operações
 */
export const batchOperations = <T>(
  operations: (() => Promise<T>)[],
  batchSize: number = 5
): Promise<T[]> => {
  const batches: (() => Promise<T>)[][] = [];
  
  for (let i = 0; i < operations.length; i += batchSize) {
    batches.push(operations.slice(i, i + batchSize));

  }

  return Promise.all(
    batches.map(batch =>
      Promise.all(batch.map(operation => operation()))
    )
  ).then(results => results.flat());};

/**
 * Função para retry com backoff exponencial
 */
export const retryWithBackoff = async <T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> => {
  let lastError: Error;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation();

    } catch (error) {
      lastError = error as Error;
      
      if (attempt === maxRetries) {
        throw lastError;
      }

      const delay = baseDelay * Math.pow(2, attempt);

      await new Promise(resolve => setTimeout(resolve, delay));

    } throw lastError!;};

export default {
  useDebounce,
  useThrottle,
  useLazyComponent,
  useVirtualization,
  useMemoizedCalculation,
  useOptimizedCallback,
  useOptimizedLoading,
  useRequestCache,
  useOptimizedScroll,
  useOptimizedResize,
  compressData,
  decompressData,
  batchOperations,
  retryWithBackoff};
