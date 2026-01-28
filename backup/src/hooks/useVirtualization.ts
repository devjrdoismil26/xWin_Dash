import React, { useCallback, useMemo, useRef, useState } from 'react';

export interface UseVirtualizationOptions<T> {
  items: T[];
  itemHeight: number;
  containerHeight: number;
  overscan?: number;
}

export interface UseVirtualizationResult<T> {
  parentRef: React.RefObject<HTMLDivElement>;
  visibleItems: Array<{ item: T; index: number }>;
  visibleRange: { start: number; end: number };
  totalHeight: number;
  scrollTop: number;
  handleScroll: (e: React.UIEvent<HTMLDivElement>) => void;
  scrollToIndex: (index: number, align?: 'start' | 'center' | 'end', behavior?: 'auto' | 'smooth') => void;
}

export function useVirtualization<T>({
  items,
  itemHeight,
  containerHeight,
  overscan = 5,
}: UseVirtualizationOptions<T>): UseVirtualizationResult<T> {
  const parentRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);

  const visibleRange = useMemo(() => {
    const start = Math.floor(scrollTop / itemHeight);
    const end = Math.min(start + Math.ceil(containerHeight / itemHeight), items.length);
    return { start: Math.max(0, start - overscan), end: Math.min(items.length, end + overscan) };
  }, [scrollTop, itemHeight, containerHeight, items.length, overscan]);

  const visibleItems = useMemo(
    () => items.slice(visibleRange.start, visibleRange.end).map((item, i) => ({ item, index: visibleRange.start + i })),
    [items, visibleRange],
  );

  const totalHeight = items.length * itemHeight;

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  const scrollToIndex = useCallback(
    (index: number, align: 'start' | 'center' | 'end' = 'start', behavior: 'auto' | 'smooth' = 'auto') => {
      const parent = parentRef.current;
      if (!parent) return;
      const targetOffset = index * itemHeight;
      let top = targetOffset;
      if (align === 'center') {
        top = targetOffset - parent.clientHeight / 2 + itemHeight / 2;
      } else if (align === 'end') {
        top = targetOffset - parent.clientHeight + itemHeight;
      }
      parent.scrollTo({ top: Math.max(0, top), behavior });
    },
    [itemHeight],
  );

  return { parentRef, visibleItems, visibleRange, totalHeight, scrollTop, handleScroll, scrollToIndex };
}

export default useVirtualization;
