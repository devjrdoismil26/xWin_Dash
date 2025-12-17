import React from 'react';
/**
import { getErrorMessage } from '@/utils/errorHelpers';
import {  } from '@/lib/utils';
// getErrorMessage removido - usar try/catch direto
 * Otimizações de Performance para MediaLibrary
 *
 * @description
 * Hooks e utilitários para otimização de performance no módulo MediaLibrary.
 * Inclui debounce, virtual scrolling, lazy loading, busca otimizada, ordenação,
 * filtros, cache e monitoramento de performance.
 *
 * @module modules/MediaLibrary/utils/performanceOptimizations
 * @since 1.0.0
 */

import { useMemo, useCallback, useRef, useEffect, useState } from 'react';
import { MediaItem, Folder } from '../types/basicTypes';

/**
 * Hook para debounce de valores
 *
 * @description
 * Hook para aplicar debounce a valores, retornando o valor atualizado
 * após um período de inatividade.
 *
 * @template T - Tipo do valor
 * @param {T} value - Valor a aplicar debounce
 * @param {number} delay - Delay em milissegundos
 * @returns {T} Valor com debounce aplicado
 */
export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);

    }, delay);

    return () => {
      clearTimeout(handler);};

  }, [value, delay]);

  return debouncedValue;};

// =========================================
// VIRTUAL SCROLLING UTILITY
// =========================================

export interface VirtualScrollOptions {
  itemHeight: number;
  containerHeight: number;
  overscan?: number;
  [key: string]: unknown; }

export const useVirtualScroll = (items: string[],
  options: VirtualScrollOptions
) => {
  const { itemHeight, containerHeight, overscan = 5 } = options;
  
  const [scrollTop, setScrollTop] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);

  const visibleItems = useMemo(() => {
    const startIndex = Math.floor(scrollTop / itemHeight);

    const endIndex = Math.min(
      startIndex + Math.ceil(containerHeight / itemHeight) + overscan,
      items.length);

    return items.slice(startIndex, endIndex).map((item: unknown, index: unknown) => ({
      ...item,
      index: startIndex + index,
      top: (startIndex + index) * itemHeight
    }));

  }, [items, scrollTop, itemHeight, containerHeight, overscan]);

  const totalHeight = items.length * itemHeight;

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);

  }, []);

  return {
    visibleItems,
    totalHeight,
    containerRef,
    handleScroll};
};

// =========================================
// LAZY LOADING UTILITY
// =========================================

export const useLazyLoading = <T>(
  items: T[],
  batchSize: number = 20
) => {
  const [loadedItems, setLoadedItems] = useState<T[]>([]);

  const [isLoading, setIsLoading] = useState(false);

  const loadMore = useCallback(() => {
    if (isLoading || loadedItems.length >= items.length) return;

    setIsLoading(true);

    // Simular carregamento assíncrono
    setTimeout(() => {
      const nextBatch = items.slice(
        loadedItems.length,
        loadedItems.length + batchSize);

      setLoadedItems(prev => [...prev, ...nextBatch]);

      setIsLoading(false);

    }, 100);

  }, [items, loadedItems.length, batchSize, isLoading]);

  useEffect(() => {
    if (loadedItems.length === 0) {
      loadMore();

    } , [loadMore, loadedItems.length]);

  return {
    loadedItems,
    isLoading,
    loadMore,
    hasMore: loadedItems.length < items.length};
};

// =========================================
// SEARCH OPTIMIZATION
// =========================================

export const useOptimizedSearch = (items: MediaItem[],
  searchTerm: string,
  debounceDelay: number = 300
) => {
  const debouncedSearchTerm = useDebounce(searchTerm, debounceDelay);

  const searchResults = useMemo(() => {
    if (!debouncedSearchTerm.trim()) return items;

    const term = debouncedSearchTerm.toLowerCase();

    return items.filter(item => 
      item.name.toLowerCase().includes(term) ||
      item.type.toLowerCase().includes(term));

  }, [items, debouncedSearchTerm]);

  return searchResults;};

// =========================================
// SORT OPTIMIZATION
// =========================================

export const useOptimizedSort = <T>(
  items: T[],
  sortBy: keyof T,
  sortOrder: 'asc' | 'desc'
) => {
  const sortedItems = useMemo(() => {
    return [...items].sort((a: unknown, b: unknown) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

  }, [items, sortBy, sortOrder]);

  return sortedItems;};

// =========================================
// FILTER OPTIMIZATION
// =========================================

export interface FilterOptions {
  type?: string;
  folderId?: string;
  dateRange?: {
    start: Date;
  end: Date;
  [key: string]: unknown; };

  sizeRange?: {
    min: number;
    max: number;};

}

export const useOptimizedFilter = (items: MediaItem[],
  filters: FilterOptions
) => {
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      if (filters.type && item.type !== filters.type) return false;
      if (filters.folderId && item.folderId !== filters.folderId) return false;
      
      if (filters.dateRange) {
        const itemDate = new Date(item.modifiedAt);

        if (itemDate < filters.dateRange.start || itemDate > filters.dateRange.end) {
          return false;
        } if (filters.sizeRange) {
        if (item.size < filters.sizeRange.min || item.size > filters.sizeRange.max) {
          return false;
        } return true;
    });

  }, [items, filters]);

  return filteredItems;};

// =========================================
// CACHE OPTIMIZATION
// =========================================

export const useOptimizedCache = <T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number = 5 * 60 * 1000 // 5 minutos
) => {
  const [data, setData] = useState<T | null>(null);

  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const cacheRef = useRef<Map<string, { data: T; timestamp: number }>>(new Map());

  const fetchData = useCallback(async () => {
    const cached = cacheRef.current.get(key);

    if (cached && Date.now() - cached.timestamp < ttl) {
      setData(cached.data);

      return cached.data;
    }

    setIsLoading(true);

    setError(null);

    try {
      const result = await fetcher();

      cacheRef.current.set(key, { data: result, timestamp: Date.now() });

      setData(result);

      return result;
    } catch (err: unknown) {
      setError(getErrorMessage(err));

      throw err;
    } finally {
      setIsLoading(false);

    } , [key, fetcher, ttl]);

  const clearCache = useCallback(() => {
    cacheRef.current.delete(key);

    setData(null);

  }, [key]);

  return {
    data,
    isLoading,
    error,
    fetchData,
    clearCache};
};

// =========================================
// PERFORMANCE MONITORING
// =========================================

export const usePerformanceMonitor = (componentName: string) => {
  const renderCount = useRef(0);

  const startTime = useRef(performance.now());

  useEffect(() => {
    renderCount.current += 1;
    const endTime = performance.now();

    const renderTime = endTime - startTime.current;

    if (process.env.NODE_ENV === 'development') {
    }

    startTime.current = performance.now();

  });

  return {
    renderCount: renderCount.current};
};

// =========================================
// MEMORY OPTIMIZATION
// =========================================

export const useMemoryOptimization = () => {
  const cleanupRef = useRef<(() => void)[]>([]);

  const addCleanup = useCallback((cleanup??: (e: any) => void) => {
    cleanupRef.current.push(cleanup);

  }, []);

  useEffect(() => {
    return () => {
      cleanupRef.current.forEach(cleanup => cleanup());

      cleanupRef.current = [];};

  }, []);

  return { addCleanup};
};
