// =========================================
// VIRTUALIZED LIST - SOCIAL BUFFER
// =========================================

import React, { useMemo, useCallback, useRef, useEffect, useState } from 'react';
import { useSocialBufferIntersection } from '@/hooks/useSocialBufferUI';

// =========================================
// INTERFACES
// =========================================

interface VirtualizedListProps<T> {
  items: T[];
  itemHeight?: number | ((index: number) => number);

  height?: number;
  width?: string | number;
  className?: string;
  renderItem: (props: { index: number; item: T; style?: React.CSSProperties }) => React.ReactNode;
  onLoadMore???: (e: any) => void;
  hasNextPage?: boolean;
  threshold?: number;
  loading?: boolean;
  error?: string | null;
}

interface VirtualizedGridProps<T> {
  items: T[];
  columns?: number;
  itemHeight?: number | ((index: number) => number);

  height?: number;
  width?: string | number;
  className?: string;
  renderItem: (props: { index: number; item: T; style?: React.CSSProperties }) => React.ReactNode;
  onLoadMore???: (e: any) => void;
  hasNextPage?: boolean;
  threshold?: number;
  loading?: boolean;
  error?: string | null;
}

interface InfiniteScrollProps {
  onLoadMore??: (e: any) => void;
  hasNextPage?: boolean;
  threshold?: number;
  loading?: boolean;
  error?: string | null;
  children: React.ReactNode; }

// =========================================
// COMPONENTES
// =========================================

const VirtualizedList = <T,>({
  items,
  itemHeight = 50,
  height = 400,
  width = '100%',
  className = '',
  renderItem,
  onLoadMore,
  hasNextPage = false,
  threshold = 0.8,
  loading = false,
  error
}: VirtualizedListProps<T>) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // ===== MEMOIZAÇÃO =====

  const itemCount = useMemo(() => {
    return items.length;
  }, [items.length]);

  const getItemSize = useCallback((index: number) => {
    return typeof itemHeight === 'function' ? itemHeight(index) : itemHeight;
  }, [itemHeight]);

  // ===== LOAD MORE =====

  const handleLoadMore = useCallback(async () => {
    if (!onLoadMore || isLoadingMore || !hasNextPage) return;
    
    setIsLoadingMore(true);

    try {
      await onLoadMore();

    } finally {
      setIsLoadingMore(false);

    } , [onLoadMore, isLoadingMore, hasNextPage]);

  // ===== SCROLL HANDLER =====

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    const scrollPercentage = (scrollTop + clientHeight) / scrollHeight;
    
    if (scrollPercentage >= threshold && hasNextPage && !isLoadingMore) {
      handleLoadMore();

    } , [threshold, hasNextPage, isLoadingMore, handleLoadMore]);

  // ===== RENDER =====

  if (error) {
    return (
        <>
      <div className={`virtualized-list-error ${className} `}>
      </div><div className=" ">$2</div><p className="text-red-500 mb-4">Erro ao carregar dados</p>
          <p className="text-sm text-gray-500">{error}</p>
        </div>);

  }

  return (
        <>
      <div 
      ref={ containerRef }
      className={`virtualized-list ${className} `}
      style={height, width, overflowY: 'auto' } onScroll={ handleScroll  }>
      </div><div className="{ (items || []).map((item: unknown, index: number) => (">$2</div>
          <div key={ index  }>
        </div>{renderItem({ index, item })}
          </div>
        ))}
        
        {loading && (
          <div className=" ">$2</div><div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500">
          )}
        </div>
        
        {isLoadingMore && (
          <div className=" ">$2</div><div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500">
          )}
        </div>
      </div>);};

const VirtualizedGrid = <T,>({
  items,
  columns = 3,
  itemHeight = 200,
  height = 400,
  width = '100%',
  className = '',
  renderItem,
  onLoadMore,
  hasNextPage = false,
  threshold = 0.8,
  loading = false,
  error
}: VirtualizedGridProps<T>) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // ===== MEMOIZAÇÃO =====

  const rowCount = useMemo(() => {
    return Math.ceil(items.length / columns);

  }, [items.length, columns]);

  const getRowHeight = useCallback((index: number) => {
    return typeof itemHeight === 'function' ? itemHeight(index) : itemHeight;
  }, [itemHeight]);

  // ===== LOAD MORE =====

  const handleLoadMore = useCallback(async () => {
    if (!onLoadMore || isLoadingMore || !hasNextPage) return;
    
    setIsLoadingMore(true);

    try {
      await onLoadMore();

    } finally {
      setIsLoadingMore(false);

    } , [onLoadMore, isLoadingMore, hasNextPage]);

  // ===== SCROLL HANDLER =====

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    const scrollPercentage = (scrollTop + clientHeight) / scrollHeight;
    
    if (scrollPercentage >= threshold && hasNextPage && !isLoadingMore) {
      handleLoadMore();

    } , [threshold, hasNextPage, isLoadingMore, handleLoadMore]);

  // ===== RENDER =====

  if (error) {
    return (
        <>
      <div className={`virtualized-grid-error ${className} `}>
      </div><div className=" ">$2</div><p className="text-red-500 mb-4">Erro ao carregar dados</p>
          <p className="text-sm text-gray-500">{error}</p>
        </div>);

  }

  return (
        <>
      <div 
      ref={ containerRef }
      className={`virtualized-grid ${className} `}
      style={height, width, overflowY: 'auto' } onScroll={ handleScroll  }>
      </div><div className="grid gap-4" style={gridTemplateColumns: `repeat(${columns} , 1fr)` } >
           
        </div>{(items || []).map((item: unknown, index: number) => (
          <div key={index} style={height: getRowHeight(index) } >
           
        </div>{renderItem({ index, item })}
          </div>
        ))}
        
        {loading && (
          <div className=" ">$2</div><div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500">
          )}
        </div>
        
        {isLoadingMore && (
          <div className=" ">$2</div><div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500">
          )}
        </div>
      </div>);};

const InfiniteScroll: React.FC<InfiniteScrollProps> = ({ onLoadMore,
  hasNextPage = false,
  threshold = 0.8,
  loading = false,
  error,
  children
   }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // ===== LOAD MORE =====

  const handleLoadMore = useCallback(async () => {
    if (isLoadingMore || !hasNextPage) return;
    
    setIsLoadingMore(true);

    try {
      await onLoadMore();

    } finally {
      setIsLoadingMore(false);

    } , [onLoadMore, isLoadingMore, hasNextPage]);

  // ===== SCROLL HANDLER =====

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    const scrollPercentage = (scrollTop + clientHeight) / scrollHeight;
    
    if (scrollPercentage >= threshold && hasNextPage && !isLoadingMore) {
      handleLoadMore();

    } , [threshold, hasNextPage, isLoadingMore, handleLoadMore]);

  // ===== RENDER =====

  if (error) {
    return (
              <div className=" ">$2</div><div className=" ">$2</div><p className="text-red-500 mb-4">Erro ao carregar dados</p>
          <p className="text-sm text-gray-500">{error}</p>
        </div>);

  }

  return (
        <>
      <div 
      ref={ containerRef }
      className="infinite-scroll"
      onScroll={ handleScroll  }>
      </div>{children}
      
      {loading && (
        <div className=" ">$2</div><div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500">
          )}
        </div>
      
      {isLoadingMore && (
        <div className=" ">$2</div><div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500">
          )}
        </div>
    </div>);};

// =========================================
// EXPORTS
// =========================================

export { VirtualizedList, VirtualizedGrid, InfiniteScroll };

export default VirtualizedList;