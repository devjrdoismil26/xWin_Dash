/**
 * Hook usePerformance - Otimiza??es de Performance
 *
 * @description
 * Conjunto de hooks para otimiza??o de performance, incluindo intersection
 * observer, memoiza??o pesada, monitoramento de performance, virtualiza??o
 * de listas, cache em mem?ria, atualiza??es em lote e lazy state. Fornece
 * ferramentas para melhorar a performance da aplica??o.
 *
 * Funcionalidades principais:
 * - useIntersection: Observa??o de interse??o para lazy loading
 * - useHeavyMemo: Memoiza??o condicional para c?lculos pesados
 * - usePerformanceMonitor: Monitoramento de tempo de execu??o
 * - useVirtualList: Virtualiza??o de listas longas
 * - useMemoryCache: Cache em mem?ria para dados
 * - useBatchUpdates: Atualiza??es em lote para reduzir re-renders
 * - useLazyState: Estado lazy que s? atualiza quando necess?rio
 *
 * @module hooks/usePerformance
 * @since 1.0.0
 *
 * @example
 * ```tsx
 * import { useIntersection, usePerformanceMonitor, useVirtualList } from '@/hooks/usePerformance';
 *
 * // Intersection Observer
 * const { targetRef, isIntersecting } = useIntersection();

 *
 * // Monitor de performance
 * const { start, end, duration } = usePerformanceMonitor();

 * ```
 */

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

/**
 * Hook useIntersection - Observa??o de Interse??o
 *
 * @description
 * Hook para observar quando um elemento entra ou sai da viewport usando
 * Intersection Observer API. ?til para lazy loading de imagens e componentes.
 *
 * @hook
 * @param {IntersectionObserverInit} [options={}] - Op??es do Intersection Observer
 * @returns {Object} Objeto com targetRef, isIntersecting e hasIntersected
 * @property {React.RefObject<Element>} targetRef - Refer?ncia para o elemento observado
 * @property {boolean} isIntersecting - Se o elemento est? atualmente na viewport
 * @property {boolean} hasIntersected - Se o elemento j? entrou na viewport alguma vez
 *
 * @example
 * ```tsx
 * const { targetRef, isIntersecting } = useIntersection({ threshold: 0.5 });

 *
 * <div ref={ targetRef  }>
          *   
        </div>{isIntersecting && <HeavyComponent />}
 * </div>
 * ```
 */
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

        } ,
      {
        threshold: 0.1,
        rootMargin: "50px",
        ...options,
      },);

    observer.observe(element);

    return () => {
      observer.unobserve(element);

      observer.disconnect();};

  }, [hasIntersected, options]);

  return { targetRef, isIntersecting, hasIntersected } as const;
}

/**
 * Hook useHeavyMemo - Memoiza??o Condicional Pesada
 *
 * @description
 * Hook para memoizar c?lculos pesados com op??o de pular a execu??o.
 * ?til para evitar c?lculos custosos quando n?o s?o necess?rios.
 *
 * @template T - Tipo do valor memoizado
 * @param {() => T} factory - Fun??o que retorna o valor a ser memoizado
 * @param {React.DependencyList} deps - Depend?ncias para rec?lculo
 * @param {boolean} [shouldSkip=false] - Se deve pular a execu??o (opcional, padr?o: false)
 * @returns {T | null} Valor memoizado ou null se shouldSkip for true
 *
 * @example
 * ```tsx
 * const heavyValue = useHeavyMemo(
 *   () => expensiveCalculation(data),
 *   [data],
 *   !shouldCalculate
 *);

 * ```
 */
export function useHeavyMemo<T>(
  factory: () => T,
  deps: React.DependencyList,
  shouldSkip: boolean = false,
): T | null {
  const memoizedValue = useMemo(() => {
    if (shouldSkip) return null;
    return factory();

  }, deps);

  return memoizedValue;
}

/**
 * Hook usePerformanceMonitor - Monitoramento de Performance
 *
 * @description
 * Hook para medir tempo de execu??o de opera??es. Fornece fun??es start e end
 * para marcar in?cio e fim de opera??es e calcular dura??o.
 *
 * @hook
 * @param {string} [name='operation'] - Nome da opera??o para logging (opcional, padr?o: 'operation')
 * @returns {Object} Objeto com fun??es start e end
 * @property {() => void} start - Inicia a medi??o de performance
 * @property {() => number} end - Finaliza a medi??o e retorna dura??o em ms
 *
 * @example
 * ```tsx
 * const { start, end } = usePerformanceMonitor('dataProcessing');

 *
 * start();

 * processData();

 * const duration = end(); // Retorna dura??o em milissegundos
 * ```
 */
export function usePerformanceMonitor(name: string = "operation") {
  const startTime = useRef<number>(0);

  const start = useCallback(() => {
    startTime.current = performance.now();

  }, []);

  const end = useCallback(() => {
    if (startTime.current > 0) {
      const duration = performance.now() - startTime.current;
      startTime.current = 0;
      return duration;
    }
    return 0;
  }, [name]);

  return { start, end } as const;
}

/**
 * Hook useVirtualList - Virtualiza??o de Listas
 *
 * @description
 * Hook para virtualizar listas longas, renderizando apenas os itens vis?veis
 * na viewport. Melhora performance significativamente em listas com muitos itens.
 *
 * @template T - Tipo dos itens da lista
 * @param {Object} config - Configura??o da lista virtualizada
 * @param {T[]} config.items - Array de itens a serem virtualizados
 * @param {number} config.itemHeight - Altura de cada item em pixels
 * @param {number} config.containerHeight - Altura do container vis?vel em pixels
 * @param {number} [config.overscan=5] - N?mero de itens extras a renderizar fora da viewport (opcional, padr?o: 5)
 * @returns {Object} Objeto com itens vis?veis e fun??es de controle
 * @property {Array<{item: T, index: number}>} visibleItems - Itens vis?veis atualmente
 * @property {number} totalHeight - Altura total da lista em pixels
 * @property {start: number, end: number} visibleRange - Range de ?ndices vis?veis
 * @property {(e: React.UIEvent<HTMLDivElement>) => void} handleScroll - Handler para eventos de scroll
 * @property {number} scrollTop - Posi??o atual do scroll
 *
 * @example
 * ```tsx
 * const { visibleItems, totalHeight, handleScroll } = useVirtualList({
 *   items: largeArray,
 *   itemHeight: 50,
 *   containerHeight: 400,
 *   overscan: 5
 * });

 *
 * <div onScroll={handleScroll} style={height: 400, overflow: 'auto' } >
          *   
        </div><div style={height: totalHeight, position: 'relative' } >
          *     
        </div>{visibleItems.map(({ item, index }) => (
 *       <div key={index} style={position: 'absolute', top: index * 50 } >
          *         
        </div>{item}
 *       </div>
 *     ))}
 *   </div>
 * </div>
 * ```
 */
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
        .map((item: unknown, index: unknown) => ({ item, index: visibleRange.start + index })),
    [items, visibleRange],);

  const totalHeight = items.length * itemHeight;

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);

  }, []);

  return {
    visibleItems,
    totalHeight,
    visibleRange,
    handleScroll,
    scrollTop,
  } as const;
}

/**
 * Hook useMemoryCache - Cache em Mem?ria
 *
 * @description
 * Hook para criar um cache em mem?ria com TTL (Time To Live). ?til para
 * armazenar dados temporariamente e evitar requisi??es repetidas.
 *
 * @template T - Tipo dos dados armazenados no cache
 * @returns {Object} Objeto com fun??es de gerenciamento do cache
 * @property {(key: string, maxAge?: number) => T | null} get - Obt?m valor do cache (retorna null se expirado)
 * @property {(key: string, data: T) => void} set - Armazena valor no cache
 * @property {() => void} clear - Limpa todo o cache
 * @property {(key: string) => void} remove - Remove um item espec?fico do cache
 *
 * @example
 * ```tsx
 * const cache = useMemoryCache<ApiResponse>();

 *
 * // Armazenar
 * cache.set('user-data', userData);

 *
 * // Obter (expira ap?s 5 minutos por padr?o)
 * const data = cache.get('user-data', 5 * 60 * 1000);

 *
 * // Limpar
 * cache.clear();

 * ```
 */
export function useMemoryCache<T>() {
  const cache = useRef(new Map<string, { data: T; timestamp: number }>());

  const get = useCallback(
    (key: string, maxAge: number = 5 * 60 * 1000): T | null => {
      const item = cache.current.get(key);

      if (!item) return null;
      const now = Date.now();

      if (now - item.timestamp > maxAge) {
        cache.current.delete(key);

        return null;
      }
      return item.data;
    },
    [],);

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

/**
 * Hook useBatchUpdates - Atualiza??es em Lote
 *
 * @description
 * Hook para agrupar atualiza??es e process?-las em lote, reduzindo re-renders.
 * ?til para opera??es que geram muitas atualiza??es de estado em sequ?ncia.
 *
 * @template T - Tipo das atualiza??es
 * @returns {Object} Objeto com fun??es de gerenciamento de atualiza??es
 * @property {T[]} updates - Array de atualiza??es pendentes
 * @property {(update: T) => void} addUpdate - Adiciona uma atualiza??o ao lote
 * @property {() => T[]} flushUpdates - Processa todas as atualiza??es pendentes e retorna o array
 *
 * @example
 * ```tsx
 * const { updates, addUpdate, flushUpdates } = useBatchUpdates<string>();

 *
 * // Adicionar atualiza??es
 * addUpdate('update-1');

 * addUpdate('update-2');

 *
 * // Processar em lote
 * const allUpdates = flushUpdates();

 * processBatch(allUpdates);

 * ```
 */
export function useBatchUpdates<T>() {
  const [updates, setUpdates] = useState<T[]>([]);

  const timeoutRef = useRef<number | null>(null);

  const addUpdate = useCallback((update: T) => {
    setUpdates((prev: unknown) => [...prev, update]);

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

      } ;

  }, []);

  return { updates, addUpdate, flushUpdates } as const;
}

/**
 * Hook useLazyState - Estado Lazy
 *
 * @description
 * Hook para criar estado que s? ? inicializado quando necess?rio. ?til para
 * evitar inicializa??es custosas de estado que pode n?o ser usado.
 *
 * @template T - Tipo do estado
 * @param {() => T} initializer - Fun??o que inicializa o estado
 * @param {boolean} [shouldInitialize=true] - Se deve inicializar o estado (opcional, padr?o: true)
 * @returns {[T | null, React.Dispatch<React.SetStateAction<T | null>>]} Tupla com estado e setter
 *
 * @example
 * ```tsx
 * const [state, setState] = useLazyState(
 *   () => expensiveInitialization(),
 *   shouldInitialize
 *);

 * ```
 */
export function useLazyState<T>(
  initializer: () => T,
  shouldInitialize: boolean = true,
): [T | null, React.Dispatch<React.SetStateAction<T | null>>] {
  const [state, setState] = useState<T | null>(null);

  const initialized = useRef(false);

  useEffect(() => {
    if (shouldInitialize && !initialized.current) {
      setState(initializer());

      initialized.current = true;
    } , [shouldInitialize, initializer]);

  return [state, setState];
}
