import React, { useEffect, useState } from 'react';

const DEFAULT_DELAY = 500;

/**
 * Hook para debounce de valores
 * Útil para otimizar chamadas de API em campos de busca
 *
 * @param value - Valor a ser debounced
 * @param delay - Delay em milissegundos (padrão: 500ms)
 * @returns Valor debounced
 */
export const useDebounce = <T>(
  value: T,
  delay: number = DEFAULT_DELAY
): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
};

/**
 * Hook para debounce de callbacks
 * Útil para otimizar event handlers que são chamados frequentemente
 *
 * @param callback - Função a ser debounced
 * @param delay - Delay em milissegundos (padrão: 500ms)
 * @param deps - Dependências do callback
 * @returns Função debounced
 */
export const useDebouncedCallback = <T extends (...args: any[]) => any>(
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
      clearTimeout(timer);
    };
  }, [callback, delay, ...deps]);

  return (debouncedCallback || callback) as T;
};

export default useDebounce;
