import React from 'react';
/**
 * Hook useLocalStorage - Persistência de Estado no LocalStorage
 *
 * @description
 * Hook que sincroniza estado React com localStorage, mantendo dados
 * persistentes entre sessões do navegador.
 *
 * @module shared/components/Sidebar/useLocalStorage
 * @since 1.0.0
 */

import { useState, useEffect } from 'react';

/**
 * Hook para gerenciar estado sincronizado com localStorage
 *
 * @template T - Tipo do valor armazenado
 * @param {string} key - Chave do localStorage
 * @param {T} initialValue - Valor inicial caso não exista no localStorage
 * @returns {[T, React.Dispatch<React.SetStateAction<T>>]} Tupla com valor e setter
 *
 * @example
 * ```tsx
 * const [isCollapsed, setIsCollapsed] = useLocalStorage('sidebar-collapsed', false);

 * ```
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => {
    try {
      if (typeof window === 'undefined') return initialValue;
      const item = window.localStorage.getItem(key);

      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    } );

  useEffect(() => {
    try {
      if (typeof window === 'undefined') return;
      window.localStorage.setItem(key, JSON.stringify(value));

    } catch (error) {
      console.error(`Error saving to localStorage key "${key}":`, error);

    } , [key, value]);

  return [value, setValue];
}
