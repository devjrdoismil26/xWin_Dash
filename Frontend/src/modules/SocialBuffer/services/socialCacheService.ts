/**
 * Serviço de Cache do SocialBuffer
 *
 * @description
 * Serviço completo de cache para o módulo SocialBuffer com suporte a TTL,
 * limite de tamanho, limpeza automática, persistência em localStorage e
 * estatísticas de uso (hits, misses, taxa de acerto).
 *
 * @module modules/SocialBuffer/services/socialCacheService
 * @since 1.0.0
 */

// =========================================
// TIPOS E INTERFACES
// =========================================

/**
 * Item de cache
 *
 * @interface CacheItem
 * @template T - Tipo dos dados armazenados
 * @property {T} data - Dados armazenados
 * @property {number} timestamp - Timestamp de criação
 * @property {number} ttl - Tempo de vida em milissegundos
 */
interface CacheItem<T = any> {
  data: T;
  timestamp: number;
  ttl: number;
}

interface CacheConfig {
  defaultTTL: number;
  maxSize: number;
  cleanupInterval: number;
  [key: string]: unknown; }

// =========================================
// CONFIGURAÇÕES DO CACHE
// =========================================

const CACHE_CONFIG: CacheConfig = {
  defaultTTL: 5 * 60 * 1000, // 5 minutos
  maxSize: 200, // Máximo 200 itens
  cleanupInterval: 10 * 60 * 1000 // Limpeza a cada 10 minutos};

// =========================================
// SERVIÇO DE CACHE
// =========================================

class SocialCacheService {
  private cache = new Map<string, CacheItem>();

  private cleanupTimer: NodeJS.Timeout | null = null;
  private hitCount = 0;
  private missCount = 0;

  constructor() {
    this.startCleanupTimer();

    this.loadFromLocalStorage();

  }

  // ===== MÉTODOS BÁSICOS =====

  /**
   * Armazenar item no cache
   */
  set<T>(key: string, data: T, ttl: number = CACHE_CONFIG.defaultTTL): void {
    // Verificar limite de tamanho
    if (this.cache.size >= CACHE_CONFIG.maxSize) {
      this.evictOldest();

    }

    const item: CacheItem<T> = {
      data,
      timestamp: Date.now(),
      ttl};

    this.cache.set(key, item);

    this.saveToLocalStorage(key, item);

  }

  /**
   * Recuperar item do cache
   */
  get<T>(key: string): T | null {
    const item = this.cache.get(key);

    if (!item) {
      this.missCount++;
      return null;
    }

    // Verificar se expirou
    if (this.isExpired(item)) {
      this.delete(key);

      this.missCount++;
      return null;
    }

    this.hitCount++;
    return item.data as T;
  }

  /**
   * Verificar se item existe no cache
   */
  has(key: string): boolean {
    const item = this.cache.get(key);

    const exists = item ? !this.isExpired(item) : false;
    
    if (exists) {
      this.hitCount++;
    } else {
      this.missCount++;
    }
    
    return exists;
  }

  /**
   * Deletar item do cache
   */
  delete(key: string): void {
    this.cache.delete(key);

    this.removeFromLocalStorage(key);

  }

  /**
   * Limpar todo o cache
   */
  clear(): void {
    this.cache.clear();

    this.clearLocalStorage();

  }

  // ===== MÉTODOS ESPECÍFICOS PARA SOCIAL BUFFER =====

  /**
   * Cache para contas sociais
   */
  setSocialAccounts(data: unknown, ttl?: number): void {
    this.set('social-accounts', data, ttl);

  }

  getSocialAccounts(): unknown | null {
    return this.get('social-accounts');

  }

  /**
   * Cache para posts
   */
  setSocialPosts(data: unknown, ttl?: number): void {
    this.set('social-posts', data, ttl);

  }

  getSocialPosts(): unknown | null {
    return this.get('social-posts');

  }

  /**
   * Cache para agendamentos
   */
  setSocialSchedules(data: unknown, ttl?: number): void {
    this.set('social-schedules', data, ttl);

  }

  getSocialSchedules(): unknown | null {
    return this.get('social-schedules');

  }

  /**
   * Cache para hashtags
   */
  setSocialHashtags(data: unknown, ttl?: number): void {
    this.set('social-hashtags', data, ttl);

  }

  getSocialHashtags(): unknown | null {
    return this.get('social-hashtags');

  }

  /**
   * Cache para links encurtados
   */
  setSocialLinks(data: unknown, ttl?: number): void {
    this.set('social-links', data, ttl);

  }

  getSocialLinks(): unknown | null {
    return this.get('social-links');

  }

  /**
   * Cache para mídia
   */
  setSocialMedia(data: unknown, ttl?: number): void {
    this.set('social-media', data, ttl);

  }

  getSocialMedia(): unknown | null {
    return this.get('social-media');

  }

  /**
   * Cache para analytics
   */
  setSocialAnalytics(data: unknown, ttl?: number): void {
    this.set('social-analytics', data, ttl);

  }

  getSocialAnalytics(): unknown | null {
    return this.get('social-analytics');

  }

  /**
   * Cache para engagement
   */
  setSocialEngagement(data: unknown, ttl?: number): void {
    this.set('social-engagement', data, ttl);

  }

  getSocialEngagement(): unknown | null {
    return this.get('social-engagement');

  }

  // ===== INVALIDAÇÃO DE CACHE =====

  /**
   * Invalidar cache por padrão
   */
  invalidateByPattern(pattern: string): void {
    const keys = Array.from(this.cache.keys());

    keys.forEach(key => {
      if (key.includes(pattern)) {
        this.delete(key);

      } );

  }

  /**
   * Invalidar cache de contas sociais
   */
  invalidateSocialAccounts(): void {
    this.invalidateByPattern('social-account');

  }

  /**
   * Invalidar cache de posts
   */
  invalidateSocialPosts(): void {
    this.invalidateByPattern('social-post');

  }

  /**
   * Invalidar cache de agendamentos
   */
  invalidateSocialSchedules(): void {
    this.invalidateByPattern('social-schedule');

  }

  /**
   * Invalidar cache de hashtags
   */
  invalidateSocialHashtags(): void {
    this.invalidateByPattern('social-hashtag');

  }

  /**
   * Invalidar cache de links
   */
  invalidateSocialLinks(): void {
    this.invalidateByPattern('social-link');

  }

  /**
   * Invalidar cache de mídia
   */
  invalidateSocialMedia(): void {
    this.invalidateByPattern('social-media');

  }

  /**
   * Invalidar cache de analytics
   */
  invalidateSocialAnalytics(): void {
    this.invalidateByPattern('social-analytics');

  }

  /**
   * Invalidar cache de engagement
   */
  invalidateSocialEngagement(): void {
    this.invalidateByPattern('social-engagement');

  }

  // ===== PERSISTÊNCIA LOCAL =====

  /**
   * Salvar no localStorage
   */
  private saveToLocalStorage(key: string, item: CacheItem): void {
    try {
      const storageKey = `social_cache_${key}`;
      localStorage.setItem(storageKey, JSON.stringify(item));

    } catch (error) {
    } /**
   * Carregar do localStorage
   */
  private loadFromLocalStorage(): void {
    try {
      const keys = Object.keys(localStorage);

      const cacheKeys = keys.filter(key => key.startsWith('social_cache_'));

      cacheKeys.forEach(storageKey => {
        const cacheKey = storageKey.replace('social_cache_', '');

        const itemData = localStorage.getItem(storageKey);

        if (itemData) {
          const item: CacheItem = JSON.parse(itemData);

          if (!this.isExpired(item)) {
            this.cache.set(cacheKey, item);

          } else {
            localStorage.removeItem(storageKey);

          } });

    } catch (error) {
    } /**
   * Remover do localStorage
   */
  private removeFromLocalStorage(key: string): void {
    try {
      const storageKey = `social_cache_${key}`;
      localStorage.removeItem(storageKey);

    } catch (error) {
    } /**
   * Limpar localStorage
   */
  private clearLocalStorage(): void {
    try {
      const keys = Object.keys(localStorage);

      const cacheKeys = keys.filter(key => key.startsWith('social_cache_'));

      cacheKeys.forEach(key => localStorage.removeItem(key));

    } catch (error) {
    } // ===== LIMPEZA AUTOMÁTICA =====

  /**
   * Verificar se item expirou
   */
  private isExpired(item: CacheItem): boolean {
    return Date.now() - item.timestamp > item.ttl;
  }

  /**
   * Remover item mais antigo
   */
  private evictOldest(): void {
    let oldestKey = '';
    let oldestTime = Date.now();

    this.cache.forEach((item: unknown, key: unknown) => {
      if (item.timestamp < oldestTime) {
        oldestTime = item.timestamp;
        oldestKey = key;
      } );

    if (oldestKey) {
      this.delete(oldestKey);

    } /**
   * Iniciar timer de limpeza
   */
  private startCleanupTimer(): void {
    this.cleanupTimer = setInterval(() => {
      this.cleanup();

    }, CACHE_CONFIG.cleanupInterval);

  }

  /**
   * Limpeza de itens expirados
   */
  private cleanup(): void {
    const keys = Array.from(this.cache.keys());

    keys.forEach(key => {
      const item = this.cache.get(key);

      if (item && this.isExpired(item)) {
        this.delete(key);

      } );

  }

  /**
   * Parar timer de limpeza
   */
  destroy(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);

      this.cleanupTimer = null;
    } // ===== ESTATÍSTICAS =====

  /**
   * Obter estatísticas do cache
   */
  getStats(): {
    size: number;
    maxSize: number;
    hitRate: number;
    hitCount: number;
    missCount: number;
    totalRequests: number;
    items: Array<{ key: string; age: number; ttl: number }>;
  } {
    const items = Array.from(this.cache.entries()).map(([key, item]) => ({
      key,
      age: Date.now() - item.timestamp,
      ttl: item.ttl
    }));

    const totalRequests = this.hitCount + this.missCount;
    const hitRate = totalRequests > 0 ? (this.hitCount / totalRequests) * 100 : 0;

    return {
      size: this.cache.size,
      maxSize: CACHE_CONFIG.maxSize,
      hitRate: Math.round(hitRate * 100) / 100, // Arredondar para 2 casas decimais
      hitCount: this.hitCount,
      missCount: this.missCount,
      totalRequests,
      items};

  }

  /**
   * Resetar estatísticas do cache
   */
  resetStats(): void {
    this.hitCount = 0;
    this.missCount = 0;
  }

  /**
   * Obter apenas o hit rate
   */
  getHitRate(): number {
    const totalRequests = this.hitCount + this.missCount;
    return totalRequests > 0 ? (this.hitCount / totalRequests) * 100 : 0;
  } // =========================================
// INSTÂNCIA SINGLETON
// =========================================

const socialCacheService = new SocialCacheService();

// =========================================
// FUNÇÕES UTILITÁRIAS
// =========================================

/**
 * Wrapper para cache com fallback
 */
export async function withCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl?: number
): Promise<T> {
  // Tentar obter do cache primeiro
  const cached = socialCacheService.get<T>(key);

  if (cached !== null) {
    return cached;
  }

  // Se não estiver no cache, buscar e armazenar
  const data = await fetcher();

  socialCacheService.set(key, data, ttl);

  return data;
}

/**
 * Invalidar cache por padrão
 */
export function invalidateSocialCache(pattern: string): void {
  socialCacheService.invalidateByPattern(pattern);

}

/**
 * Limpar todo o cache social
 */
export function clearSocialCache(): void {
  socialCacheService.clear();

}

// =========================================
// EXPORTS
// =========================================

export { socialCacheService };

export default socialCacheService;
