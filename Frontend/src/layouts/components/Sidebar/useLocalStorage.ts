import React from 'react';
/**
 * Hook para gerenciar estado sincronizado com localStorage
 *
 * @description
 * Hook customizado que sincroniza o estado React com localStorage.
 * Persiste automaticamente mudan?as no estado e recupera valores salvos na inicializa??o.
 *
 * @module layouts/components/Sidebar/useLocalStorage
 * @since 1.0.0
 */

import { useState, useEffect } from 'react';

/**
 * Hook para gerenciar estado sincronizado com localStorage
 *
 * @template T Tipo do valor armazenado
 * @param {string} key - Chave no localStorage
 * @param {T} initialValue - Valor inicial caso n?o exista no localStorage
 * @returns {readonly [T, React.Dispatch<React.SetStateAction<T>>]} Tupla com valor e setter, similar ao useState
 *
 * @example
 * ```tsx
 * const [theme, setTheme] = useLocalStorage('theme', 'light');

 *
 * // O valor ? automaticamente salvo no localStorage quando muda
 * setTheme('dark');

 * ```
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);

      return item ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    } );

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));

    } catch (e) {
      // ignore storage errors (private mode, etc.)
  } , [key, value]);

  return [value, setValue] as const;
}
