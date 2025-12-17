/**
 * Utilitários de Cache para Produtos
 *
 * @description
 * Utilitários de cache para produtos usando localStorage.
 * Inclui cache para produtos, variações e imagens.
 *
 * @module modules/Products/utils/productCache
 * @since 1.0.0
 */

/**
 * Cache de produtos
 *
 * @description
 * Cache simples para produtos usando localStorage.
 */
export const productCache = {
  get: (key: string) => {
    return localStorage.getItem(key);

  },
  set: (key: string, value: unknown) => {
    localStorage.setItem(key, JSON.stringify(value));

  },
  remove: (key: string) => {
    localStorage.removeItem(key);

  } ;

export const variationsCache = {
  get: (key: string) => {
    return localStorage.getItem(key);

  },
  set: (key: string, value: unknown) => {
    localStorage.setItem(key, JSON.stringify(value));

  } ;

export const imagesCache = {
  get: (key: string) => {
    return localStorage.getItem(key);

  },
  set: (key: string, value: unknown) => {
    localStorage.setItem(key, JSON.stringify(value));

  } ;

export const cacheUtils = {
  clear: () => {
    localStorage.clear();

  },
  size: () => {
    return localStorage.length;
  } ;
