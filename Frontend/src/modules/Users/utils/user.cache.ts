/**
 * Sistema de Cache para o módulo Users
 *
 * @description
 * Sistema de cache em memória para usuários com TTL, LRU eviction,
 * invalidação por tags, estatísticas e gerenciamento avançado.
 * Implementa cache eficiente com múltiplas estratégias de invalidação.
 *
 * @module modules/Users/utils/userCache
 * @since 1.0.0
 */

/**
 * Interfaces de cache
 *
 * @description
 * Interfaces TypeScript para itens de cache, configuração e estatísticas.
 */
interface CacheItem<T = any> {
  data: T;
  timestamp: number;
  ttl: number;
  tags: string[];
  accessCount: number;
  lastAccessed: number;
}

// Interface para configuração do cache
interface CacheConfig {
  maxSize: number;
  defaultTTL: number;
  cleanupInterval: number;
  enableLRU: boolean;
  enableTags: boolean;
  [key: string]: unknown; }

// Interface para estatísticas do cache
interface CacheStats {
  size: number;
  maxSize: number;
  hitRate: number;
  missRate: number;
  totalHits: number;
  totalMisses: number;
  totalSets: number;
  totalDeletes: number;
  memoryUsage: number;
  oldestItem: number;
  newestItem: number; }

/**
 * Classe genérica de cache com TTL, LRU e tags
 */
class UserCache<T = any> {
  private cache = new Map<string, CacheItem<T>>();

  private config: CacheConfig;
  private stats = {
    hits: 0,
    misses: 0,
    sets: 0,
    deletes: 0};

  private cleanupTimer?: NodeJS.Timeout;

  constructor(config: Partial<CacheConfig> = {}) {
    this.config = {
      maxSize: 1000,
      defaultTTL: 5 * 60 * 1000, // 5 minutos
      cleanupInterval: 60 * 1000, // 1 minuto
      enableLRU: true,
      enableTags: true,
      ...config};

    this.startCleanup();

  }

  /**
   * Obtém um item do cache
   */
  get(key: string): T | null {
    const item = this.cache.get(key);

    if (!item) {
      this.stats.misses++;
      return null;
    }

    // Verificar TTL
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);

      this.stats.misses++;
      return null;
    }

    // Atualizar estatísticas de acesso
    item.accessCount++;
    item.lastAccessed = Date.now();

    this.stats.hits++;

    return item.data;
  }

  /**
   * Define um item no cache
   */
  set(key: string, data: T, ttl?: number, tags: string[] = []): void {
    const now = Date.now();

    const itemTTL = ttl || this.config.defaultTTL;

    // Verificar limite de tamanho
    if (this.cache.size >= this.config.maxSize) {
      this.evictLRU();

    }

    const item: CacheItem<T> = {
      data,
      timestamp: now,
      ttl: itemTTL,
      tags: this.config.enableTags ? tags : [],
      accessCount: 1,
      lastAccessed: now};

    this.cache.set(key, item);

    this.stats.sets++;
  }

  /**
   * Remove um item do cache
   */
  delete(key: string): boolean {
    const deleted = this.cache.delete(key);

    if (deleted) {
      this.stats.deletes++;
    }
    return deleted;
  }

  /**
   * Remove todos os itens com uma tag específica
   */
  deleteByTag(tag: string): number {
    if (!this.config.enableTags) return 0;

    let deletedCount = 0;
    for (const [key, item] of this.cache.entries()) {
      if (item.tags.includes(tag)) {
        this.cache.delete(key);

        deletedCount++;
        this.stats.deletes++;
      } return deletedCount;
  }

  /**
   * Remove todos os itens com qualquer uma das tags fornecidas
   */
  deleteByTags(tags: string[]): number {
    if (!this.config.enableTags) return 0;

    let deletedCount = 0;
    for (const [key, item] of this.cache.entries()) {
      if (tags.some(tag => item.tags.includes(tag))) {
        this.cache.delete(key);

        deletedCount++;
        this.stats.deletes++;
      } return deletedCount;
  }

  /**
   * Limpa todo o cache
   */
  clear(): void {
    this.cache.clear();

    this.stats = { hits: 0, misses: 0, sets: 0, deletes: 0};

  }

  /**
   * Verifica se uma chave existe no cache
   */
  has(key: string): boolean {
    const item = this.cache.get(key);

    if (!item) return false;

    // Verificar TTL
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);

      return false;
    }

    return true;
  }

  /**
   * Obtém o tamanho atual do cache
   */
  size(): number {
    return this.cache.size;
  }

  /**
   * Obtém todas as chaves do cache
   */
  keys(): string[] {
    return Array.from(this.cache.keys());

  }

  /**
   * Obtém estatísticas do cache
   */
  getStats(): CacheStats {
    const total = this.stats.hits + this.stats.misses;
    const hitRate = total > 0 ? (this.stats.hits / total) * 100 : 0;
    const missRate = total > 0 ? (this.stats.misses / total) * 100 : 0;

    let oldestItem = 0;
    let newestItem = 0;
    let memoryUsage = 0;

    for (const item of this.cache.values()) {
      if (oldestItem === 0 || item.timestamp < oldestItem) {
        oldestItem = item.timestamp;
      }
      if (item.timestamp > newestItem) {
        newestItem = item.timestamp;
      }
      memoryUsage += JSON.stringify(item.data).length;
    }

    return {
      size: this.cache.size,
      maxSize: this.config.maxSize,
      hitRate,
      missRate,
      totalHits: this.stats.hits,
      totalMisses: this.stats.misses,
      totalSets: this.stats.sets,
      totalDeletes: this.stats.deletes,
      memoryUsage,
      oldestItem,
      newestItem};

  }

  /**
   * Evicta o item menos recentemente usado
   */
  private evictLRU(): void {
    if (!this.config.enableLRU || this.cache.size === 0) return;

    let oldestKey = '';
    let oldestTime = Date.now();

    for (const [key, item] of this.cache.entries()) {
      if (item.lastAccessed < oldestTime) {
        oldestTime = item.lastAccessed;
        oldestKey = key;
      } if (oldestKey) {
      this.cache.delete(oldestKey);

    } /**
   * Inicia o processo de limpeza automática
   */
  private startCleanup(): void {
    this.cleanupTimer = setInterval(() => {
      this.cleanup();

    }, this.config.cleanupInterval);

  }

  /**
   * Remove itens expirados
   */
  private cleanup(): void {
    const now = Date.now();

    const expiredKeys: string[] = [];

    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > item.ttl) {
        expiredKeys.push(key);

      } expiredKeys.forEach(key => {
      this.cache.delete(key);

      this.stats.deletes++;
    });

  }

  /**
   * Para o processo de limpeza
   */
  destroy(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);

    }
    this.clear();

  } // Instâncias especializadas do cache para diferentes tipos de dados
export const userCache = new UserCache({
  maxSize: 500,
  defaultTTL: 10 * 60 * 1000, // 10 minutos
  enableLRU: true,
  enableTags: true
});

export const roleCache = new UserCache({
  maxSize: 100,
  defaultTTL: 30 * 60 * 1000, // 30 minutos (roles mudam menos)
  enableLRU: true,
  enableTags: true
});

export const activityCache = new UserCache({
  maxSize: 200,
  defaultTTL: 5 * 60 * 1000, // 5 minutos
  enableLRU: true,
  enableTags: true
});

export const notificationCache = new UserCache({
  maxSize: 100,
  defaultTTL: 2 * 60 * 1000, // 2 minutos (notificações são mais dinâmicas)
  enableLRU: true,
  enableTags: true
});

export const statsCache = new UserCache({
  maxSize: 50,
  defaultTTL: 5 * 60 * 1000, // 5 minutos
  enableLRU: true,
  enableTags: true
});

// Funções utilitárias para gerenciamento de cache
export const cacheUtils = {
  /**
   * Gera chave de cache baseada em parâmetros
   */
  generateKey(prefix: string, params: Record<string, any> = {}): string {
    const sortedParams = Object.keys(params)
      .sort()
      .map(key => `${key}:${params[key]}`)
      .join('|');

    return sortedParams ? `${prefix}:${sortedParams}` : prefix;
  },

  /**
   * Limpa todos os caches relacionados a usuários
   */
  clearUserCaches(userId?: string): void {
    if (userId) {
      userCache.deleteByTag(`user:${userId}`);

      activityCache.deleteByTag(`user:${userId}`);

      notificationCache.deleteByTag(`user:${userId}`);

    } else {
      userCache.clear();

      activityCache.clear();

      notificationCache.clear();

    } ,

  /**
   * Limpa caches relacionados a roles
   */
  clearRoleCaches(roleId?: string): void {
    if (roleId) {
      roleCache.deleteByTag(`role:${roleId}`);

      userCache.deleteByTag(`role:${roleId}`);

    } else {
      roleCache.clear();

    } ,

  /**
   * Limpa todos os caches
   */
  clearAllCaches(): void {
    userCache.clear();

    roleCache.clear();

    activityCache.clear();

    notificationCache.clear();

    statsCache.clear();

  },

  /**
   * Obtém estatísticas de todos os caches
   */
  getAllCacheStats(): Record<string, CacheStats> {
    return {
      user: userCache.getStats(),
      role: roleCache.getStats(),
      activity: activityCache.getStats(),
      notification: notificationCache.getStats(),
      stats: statsCache.getStats()};

  },

  /**
   * Verifica se um item está em cache
   */
  isCached(cache: UserCache, key: string): boolean {
    return cache.has(key);

  },

  /**
   * Obtém item do cache ou executa função e cacheia resultado
   */
  async getOrSet<T>(
    cache: UserCache<T>,
    key: string,
    fetcher: () => Promise<T>,
    ttl?: number,
    tags: string[] = []
  ): Promise<T> {
    const cached = cache.get(key);

    if (cached !== null) {
      return cached;
    }

    const data = await fetcher();

    cache.set(key, data, ttl, tags);

    return data;
  } ;

// Exportar a classe base para uso customizado
export { UserCache };

export type { CacheItem, CacheConfig, CacheStats};
