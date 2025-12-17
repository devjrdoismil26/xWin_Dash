/**
 * Hook useVirtualization - Virtualiza??o de Listas
 *
 * @description
 * Hook para virtualiza??o de listas longas, renderizando apenas os itens
 * vis?veis na viewport e itens extras para scroll suave. Melhora significativamente
 * a performance ao lidar com grandes quantidades de dados.
 *
 * Funcionalidades principais:
 * - Renderiza??o apenas de itens vis?veis
 * - Overscan configur?vel para scroll suave
 * - Scroll para ?ndice espec?fico
 * - Alinhamento customiz?vel (start, center, end)
 * - Comportamento de scroll (auto, smooth)
 * - Altura total calculada automaticamente
 *
 * @module hooks/useVirtualization
 * @since 1.0.0
 *
 * @example
 * ```tsx
 * import { useVirtualization } from '@/hooks/useVirtualization';
 *
 * const { parentRef, visibleItems, totalHeight } = useVirtualization({
 *   items: largeArray,
 *   itemHeight: 50,
 *   containerHeight: 500,
 *   overscan: 5
 * });

 *
 * <div ref={parentRef} style={height: 500, overflow: 'auto' } >
          *   
        </div><div style={height: totalHeight } >
          *     
        </div>{visibleItems.map(({ item, index }) => (
 *       <Item key={index} data={item} style={height: 50 } / />
 *     ))}
 *   </div>
 * </div>
 * ```
 */

import React, { useCallback, useMemo, useRef, useState } from "react";

/**
 * Op??es do hook useVirtualization
 *
 * @description
 * Propriedades que podem ser passadas para o hook useVirtualization.
 *
 * @interface UseVirtualizationOptions
 * @template T - Tipo dos itens da lista
 * @property {T[]} items - Array de itens para virtualizar
 * @property {number} itemHeight - Altura de cada item em pixels
 * @property {number} containerHeight - Altura do container em pixels
 * @property {number} [overscan=5] - N?mero de itens extras a renderizar al?m dos vis?veis
 */
export interface UseVirtualizationOptions<T> {
  items: T[];
  itemHeight: number;
  containerHeight: number;
  overscan?: number;
}

/**
 * Resultado do hook useVirtualization
 *
 * @description
 * Retorno do hook useVirtualization com todas as propriedades necess?rias
 * para implementar virtualiza??o de lista.
 *
 * @interface UseVirtualizationResult
 * @template T - Tipo dos itens da lista
 * @property {React.RefObject<HTMLDivElement | null>} parentRef - Refer?ncia para o container pai
 * @property {Array<{ item: T; index: number }>} visibleItems - Array de itens vis?veis com seus ?ndices
 * @property { start: number; end: number } visibleRange - Range de ?ndices vis?veis
 * @property {number} totalHeight - Altura total da lista virtual
 * @property {number} scrollTop - Posi??o atual do scroll
 * @property {(e: React.UIEvent<HTMLDivElement>) => void} handleScroll - Handler de evento de scroll
 * @property {(index: number, align?: 'start' | 'center' | 'end', behavior?: 'auto' | 'smooth') => void} scrollToIndex - Fun??o para scrollar para ?ndice espec?fico
 */
export interface UseVirtualizationResult<T> {
  parentRef: React.RefObject<HTMLDivElement | null>;
  visibleItems: Array<{ item: T; index: number }>;
  visibleRange: { start: number; end: number};

  totalHeight: number;
  scrollTop: number;
  handleScroll?: (e: any) => void;
  scrollToIndex?: (e: any) => void;
}

/**
 * Hook useVirtualization
 *
 * @description
 * Hook que implementa virtualiza??o de lista, renderizando apenas os itens
 * vis?veis na viewport para melhorar performance com grandes listas.
 *
 * @hook
 * @template T - Tipo dos itens da lista
 * @param {UseVirtualizationOptions<T>} options - Op??es do hook
 * @param {T[]} options.items - Array de itens
 * @param {number} options.itemHeight - Altura de cada item
 * @param {number} options.containerHeight - Altura do container
 * @param {number} [options.overscan=5] - Itens extras a renderizar
 * @returns {UseVirtualizationResult<T>} Resultado do hook com propriedades para virtualiza??o
 *
 * @example
 * ```tsx
 * const { parentRef, visibleItems, totalHeight } = useVirtualization({
 *   items: data,
 *   itemHeight: 50,
 *   containerHeight: 500
 * });

 * ```
 */
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

    const end = Math.min(
      start + Math.ceil(containerHeight / itemHeight),
      items.length,);

    return {
      start: Math.max(0, start - overscan),
      end: Math.min(items.length, end + overscan),};

  }, [scrollTop, itemHeight, containerHeight, items.length, overscan]);

  const visibleItems = useMemo(
    () =>
      items
        .slice(visibleRange.start, visibleRange.end)
        .map((item: unknown, i: unknown) => ({ item, index: visibleRange.start + i })),
    [items, visibleRange],);

  const totalHeight = items.length * itemHeight;

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);

  }, []);

  const scrollToIndex = useCallback(
    (
      index: number,
      align: "start" | "center" | "end" = "start",
      behavior: "auto" | "smooth" = "auto",
    ) => {
      const parent = parentRef.current;
      if (!parent) return;
      const targetOffset = index * itemHeight;
      let top = targetOffset;
      if (align === "center") {
        top = targetOffset - parent.clientHeight / 2 + itemHeight / 2;
      } else if (align === "end") {
        top = targetOffset - parent.clientHeight + itemHeight;
      }
      parent.scrollTo({ top: Math.max(0, top), behavior });

    },
    [itemHeight],);

  return {
    parentRef,
    visibleItems,
    visibleRange,
    totalHeight,
    scrollTop,
    handleScroll,
    scrollToIndex,};

}

export default useVirtualization;
