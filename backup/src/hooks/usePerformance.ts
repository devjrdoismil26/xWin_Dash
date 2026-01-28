import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

export function useIntersection(options: IntersectionObserverInit = {}) {
  const targetRef = useRef<Element | null>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);

  useEffect(() => {
    const element = targetRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
        if (entry.isIntersecting && !hasIntersected) {
          setHasIntersected(true);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
        ...options,
      },
    );

    observer.observe(element);
    return () => {
      observer.unobserve(element);
      observer.disconnect();
    };
  }, [hasIntersected, options]);

  return { targetRef, isIntersecting, hasIntersected } as const;
}

export function useHeavyMemo<T>(factory: () => T, deps: React.DependencyList, shouldSkip: boolean = false): T | null {
  const memoizedValue = useMemo(() => {
    if (shouldSkip) return null;
    return factory();
  }, deps);
  return memoizedValue;
}

export function usePerformanceMonitor(name: string = 'operation') {
  const startTime = useRef<number>(0);

  const start = useCallback(() => {
    startTime.current = performance.now();
  }, []);

  const end = useCallback(() => {
    if (startTime.current > 0) {
      const duration = performance.now() - startTime.current;
      // console.log(`[Performance] ${name}: ${duration.toFixed(2)} ms`);
      startTime.current = 0;
      return duration;
    }
    return 0;
  }, [name]);

  return { start, end } as const;
}

export function useVirtualList<T>({
  items,
  itemHeight,
  containerHeight,
  overscan = 5,
}: {
  items: T[];
  itemHeight: number;
  containerHeight: number;
  overscan?: number;
}) {
  const [scrollTop, setScrollTop] = useState(0);

  const visibleRange = useMemo(() => {
    const start = Math.floor(scrollTop / itemHeight);
    const end = Math.min(start + Math.ceil(containerHeight / itemHeight), items.length);
    return { start: Math.max(0, start - overscan), end: Math.min(items.length, end + overscan) };
  }, [scrollTop, itemHeight, containerHeight, items.length, overscan]);

  const visibleItems = useMemo(
    () => items.slice(visibleRange.start, visibleRange.end).map((item, index) => ({ item, index: visibleRange.start + index })),
    [items, visibleRange],
  );

  const totalHeight = items.length * itemHeight;

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  return { visibleItems, totalHeight, visibleRange, handleScroll, scrollTop } as const;
}

export function useMemoryCache<T>() {
  const cache = useRef(new Map<string, { data: T; timestamp: number }>());

  const get = useCallback((key: string, maxAge: number = 5 * 60 * 1000): T | null => {
    const item = cache.current.get(key);
    if (!item) return null;
    const now = Date.now();
    if (now - item.timestamp > maxAge) {
      cache.current.delete(key);
      return null;
    }
    return item.data;
  }, []);

  const set = useCallback((key: string, data: T) => {
    cache.current.set(key, { data, timestamp: Date.now() });
  }, []);

  const clear = useCallback(() => {
    cache.current.clear();
  }, []);

  const remove = useCallback((key: string) => {
    cache.current.delete(key);
  }, []);

  return { get, set, clear, remove } as const;
}

export function useBatchUpdates<T>() {
  const [updates, setUpdates] = useState<T[]>([]);
  const timeoutRef = useRef<number | null>(null);

  const addUpdate = useCallback((update: T) => {
    setUpdates((prev) => [...prev, update]);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = window.setTimeout(() => {
      setUpdates([]);
    }, 16);
  }, []);

  const flushUpdates = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    const current = updates;
    setUpdates([]);
    return current;
  }, [updates]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return { updates, addUpdate, flushUpdates } as const;
}

export function useLazyState<T>(initializer: () => T, shouldInitialize: boolean = true): [T | null, React.Dispatch<React.SetStateAction<T | null>>] {
  const [state, setState] = useState<T | null>(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (shouldInitialize && !initialized.current) {
      setState(initializer());
      initialized.current = true;
    }
  }, [shouldInitialize, initializer]);

  return [state, setState];
}
