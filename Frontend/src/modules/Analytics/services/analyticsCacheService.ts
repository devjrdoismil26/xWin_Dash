/**
 * Service de Cache de Analytics
 * @module modules/Analytics/services/analyticsCacheService
 * @description
 * Service respons?vel por gerenciar cache de dados de analytics, incluindo
 * armazenamento tempor?rio com TTL (Time To Live) e invalida??o autom?tica.
 * @since 1.0.0
 */

/**
 * Interface CacheItem - Item do Cache
 * @interface CacheItem
 * @description
 * Interface que representa um item armazenado no cache.
 * @property {any} data - Dados armazenados
 * @property {number} timestamp - Timestamp de cria??o em milissegundos
 */
interface CacheItem {
  data: unknown;
  timestamp: number; }

/**
 * Classe AnalyticsCacheService - Service de Cache de Analytics
 * @class
 * @description
 * Service respons?vel por gerenciar cache de dados de analytics com TTL de 5 minutos.
 * Fornece m?todos para armazenar, recuperar, verificar e limpar dados do cache.
 *
 * @example
 * ```typescript
 * import analyticsCacheService from '@/modules/Analytics/services/analyticsCacheService';
 *
 * // Armazenar dados
 * analyticsCacheService.set('analytics:7d', data);

 *
 * // Recuperar dados
 * const cached = analyticsCacheService.get('analytics:7d');

 *
 * // Verificar se existe
 * if (analyticsCacheService.has('analytics:7d')) {
 *   // Usar dados do cache
 * }
 *
 * // Limpar cache
 * analyticsCacheService.clear();

 * ```
 */
class AnalyticsCacheService {
  private cache = new Map<string, CacheItem>();

  private readonly TTL = 5 * 60 * 1000; // 5 minutos

  /**
   * Armazenar dados no cache
   * @description
   * Armazena dados no cache com timestamp atual.
   *
   * @param {string} key - Chave do cache
   * @param {any} data - Dados a armazenar
   * @returns {void}
   *
   * @example
   * ```typescript
   * analyticsCacheService.set('analytics:7d', { leads: 100, conversions: 50 });

   * ```
   */
  set(key: string, data: unknown): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
  });

  }

  /**
   * Recuperar dados do cache
   * @description
   * Recupera dados do cache se ainda v?lidos (dentro do TTL).
   * Retorna null se o item n?o existe ou expirou.
   *
   * @param {string} key - Chave do cache
   * @returns {any | null} Dados armazenados ou null se n?o encontrado/expirado
   *
   * @example
   * ```typescript
   * const cached = analyticsCacheService.get('analytics:7d');

   * if (cached) {
   *   
   * }
   * ```
   */
  get(key: string): unknown | null {
    const item = this.cache.get(key);

    if (!item) return null;

    if (Date.now() - item.timestamp > this.TTL) {
      this.cache.delete(key);

      return null;
    }

    return item.data;
  }

  /**
   * Limpar todo o cache
   * @description
   * Remove todos os itens do cache.
   *
   * @returns {void}
   *
   * @example
   * ```typescript
   * analyticsCacheService.clear();

   * ```
   */
  clear(): void {
    this.cache.clear();

  }

  /**
   * Verificar se chave existe no cache
   * @description
   * Verifica se uma chave existe no cache e ainda ? v?lida (dentro do TTL).
   *
   * @param {string} key - Chave do cache
   * @returns {boolean} Se a chave existe e ? v?lida
   *
   * @example
   * ```typescript
   * if (analyticsCacheService.has('analytics:7d')) {
   *   // Usar dados do cache
   * }
   * ```
   */
  has(key: string): boolean {
    return this.cache.has(key) && this.get(key) !== null;
  } const instance = new AnalyticsCacheService();

export const analyticsCacheService = instance;
export default instance;
