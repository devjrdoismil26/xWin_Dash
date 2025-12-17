/**
 * Hook de Debounce - Otimização de Valores e Callbacks
 *
 * @description
 * Este módulo fornece hooks para aplicar debounce a valores e callbacks,
 * útil para otimizar chamadas de API, event handlers e atualizações de estado.
 *
 * Funcionalidades principais:
 * - Debounce de valores (useDebounce)
 * - Debounce de callbacks (useDebouncedCallback)
 * - Configuração de delay customizável
 * - Limpeza automática de timers
 *
 * @module hooks/global/useDebounce
 * @since 1.0.0
 *
 * @example
 * ```tsx
 * // Debounce de valor
 * const [searchTerm, setSearchTerm] = useState('');

 * const debouncedSearchTerm = useDebounce(searchTerm, 500);

 *
 * // Debounce de callback
 * const debouncedOnChange = useDebouncedCallback((value: string) => {
 * }, 500);

 * ```
 */

import React, { useEffect, useState } from "react";

/**
 * Delay padrão para debounce em milissegundos
 *
 * @constant {number}
 * @default 500
 */
const DEFAULT_DELAY = 500;

/**
 * Hook para debounce de valores
 *
 * @description
 * Retorna uma versão debounced de um valor. Útil para otimizar chamadas
 * de API em campos de busca, evitando requisições a cada tecla digitada.
 *
 * @template T - Tipo do valor a ser debounced
 * @param {T} value - Valor a ser debounced
 * @param {number} [delay=500] - Delay em milissegundos (padrão: 500ms)
 * @returns {T} Valor debounced
 *
 * @example
 * ```tsx
 * // Em um campo de busca
 * const [searchTerm, setSearchTerm] = useState('');

 * const debouncedSearchTerm = useDebounce(searchTerm, 500);

 *
 * useEffect(() => {
 *   if (debouncedSearchTerm) {
 *     // Fazer busca na API apenas após 500ms sem digitação
 *     searchAPI(debouncedSearchTerm);

 *   }
 * }, [debouncedSearchTerm]);

 * ```
 */
export const useDebounce = <T>(value: T, delay: number = DEFAULT_DELAY): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);

    }, delay);

    return () => {
      clearTimeout(timer);};

  }, [value, delay]);

  return debouncedValue;};

/**
 * Hook para debounce de callbacks
 *
 * @description
 * Retorna uma versão debounced de uma função callback. Útil para otimizar
 * event handlers que são chamados frequentemente, como em scroll, resize
 * ou input events.
 *
 * @template T - Tipo da função callback
 * @param {T} callback - Função a ser debounced
 * @param {number} [delay=500] - Delay em milissegundos (padrão: 500ms)
 * @param {React.DependencyList} [deps=[]] - Dependências do callback para recriar a função
 * @returns {T} Função debounced
 *
 * @example
 * ```tsx
 * // Em um handler de scroll
 * const debouncedHandleScroll = useDebouncedCallback((event: Event) => {
 * }, 200);

 *
 * window.addEventListener('scroll', debouncedHandleScroll);

 * ```
 */
export const useDebouncedCallback = <T extends (...args: string[]) => any>(
  callback: T,
  delay: number = DEFAULT_DELAY,
  deps: React.DependencyList = [],
): T => {
  const [debouncedCallback, setDebouncedCallback] = useState<T | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedCallback(() => callback);

    }, delay);

    return () => {
      clearTimeout(timer);};

  }, [callback, delay, ...deps]);

  return (debouncedCallback || callback) as T;};

export default useDebounce;
