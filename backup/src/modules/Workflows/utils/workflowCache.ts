/**
 * Sistema de cache inteligente para workflows
 * Implementa cache em memória com TTL configurável e invalidação automática
 */

// Interfaces
interface CacheEntry<T = any> {
  data: T;
  timestamp: number;
  ttl: number;
  accessCount: number;
  lastAccessed: number;
  tags: string[];
}

interface CacheConfig {
  defaultTTL: number;
  maxSize: number;
  cleanupInterval: number;
  enableStats: boolean;
}

interface CacheStats {
  hits: number;
  misses: number;
  sets: number;
  deletes: number;
  size: number;
  hitRate: number;
}

// Configuração padrão
const DEFAULT_CONFIG: CacheConfig = {
  defaultTTL: 5 * 60 * 1000, // 5 minutos
  maxSize: 1000,
  cleanupInterval: 60 * 1000, // 1 minuto
  enableStats: true
};

/**
 * Classe principal do sistema de cache
 */
class WorkflowCache {
  private cache = new Map<string, CacheEntry>();
  private config: CacheConfig;
  private stats: CacheStats;
  private cleanupTimer: NodeJS.Timeout | null = null;

  constructor(config: Partial<CacheConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.stats = {
      hits: 0,
      misses: 0,
      sets: 0,
      deletes: 0,
      size: 0,
      hitRate: 0
    };

    this.startCleanup();
  }

  /**
   * Obtém um valor do cache
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      this.stats.misses++;
      this.updateHitRate();
      return null;
    }

    // Verificar se expirou
    if (this.isExpired(entry)) {
      this.cache.delete(key);
      this.stats.misses++;
      this.updateHitRate();
      return null;
    }

    // Atualizar estatísticas de acesso
    entry.accessCount++;
    entry.lastAccessed = Date.now();
    this.stats.hits++;
    this.updateHitRate();

    return entry.data;
  }

  /**
   * Define um valor no cache
   */
  set<T>(key: string, data: T, ttl?: number, tags: string[] = []): void {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.config.defaultTTL,
      accessCount: 0,
      lastAccessed: Date.now(),
      tags
    };

    this.cache.set(key, entry);
    this.stats.sets++;
    this.stats.size = this.cache.size;

    // Verificar limite de tamanho
    if (this.cache.size > this.config.maxSize) {
      this.evictLRU();
    }
  }

  /**
   * Remove um valor do cache
   */
  delete(key: string): boolean {
    const deleted = this.cache.delete(key);
    if (deleted) {
      this.stats.deletes++;
      this.stats.size = this.cache.size;
    }
    return deleted;
  }

  /**
   * Remove valores por tags
   */
  deleteByTags(tags: string[]): number {
    let deletedCount = 0;
    
    for (const [key, entry] of this.cache.entries()) {
      if (tags.some(tag => entry.tags.includes(tag))) {
        this.cache.delete(key);
        deletedCount++;
      }
    }

    this.stats.deletes += deletedCount;
    this.stats.size = this.cache.size;
    return deletedCount;
  }

  /**
   * Limpa todo o cache
   */
  clear(): void {
    this.cache.clear();
    this.stats.size = 0;
  }

  /**
   * Verifica se uma chave existe no cache
   */
  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;
    
    if (this.isExpired(entry)) {
      this.cache.delete(key);
      return false;
    }
    
    return true;
  }

  /**
   * Obtém múltiplas chaves
   */
  getMany<T>(keys: string[]): Record<string, T | null> {
    const result: Record<string, T | null> = {};
    
    for (const key of keys) {
      result[key] = this.get<T>(key);
    }
    
    return result;
  }

  /**
   * Define múltiplas chaves
   */
  setMany<T>(entries: Array<{ key: string; data: T; ttl?: number; tags?: string[] }>): void {
    for (const entry of entries) {
      this.set(entry.key, entry.data, entry.ttl, entry.tags);
    }
  }

  /**
   * Obtém estatísticas do cache
   */
  getStats(): CacheStats {
    return { ...this.stats };
  }

  /**
   * Obtém informações sobre o cache
   */
  getInfo(): {
    size: number;
    maxSize: number;
    keys: string[];
    oldestEntry: string | null;
    newestEntry: string | null;
  } {
    const keys = Array.from(this.cache.keys());
    let oldestEntry: string | null = null;
    let newestEntry: string | null = null;
    let oldestTime = Infinity;
    let newestTime = 0;

    for (const [key, entry] of this.cache.entries()) {
      if (entry.timestamp < oldestTime) {
        oldestTime = entry.timestamp;
        oldestEntry = key;
      }
      if (entry.timestamp > newestTime) {
        newestTime = entry.timestamp;
        newestEntry = key;
      }
    }

    return {
      size: this.cache.size,
      maxSize: this.config.maxSize,
      keys,
      oldestEntry,
      newestEntry
    };
  }

  /**
   * Verifica se uma entrada expirou
   */
  private isExpired(entry: CacheEntry): boolean {
    return Date.now() - entry.timestamp > entry.ttl;
  }

  /**
   * Remove a entrada menos recentemente usada
   */
  private evictLRU(): void {
    let lruKey: string | null = null;
    let lruTime = Infinity;

    for (const [key, entry] of this.cache.entries()) {
      if (entry.lastAccessed < lruTime) {
        lruTime = entry.lastAccessed;
        lruKey = key;
      }
    }

    if (lruKey) {
      this.cache.delete(lruKey);
      this.stats.size = this.cache.size;
    }
  }

  /**
   * Atualiza a taxa de acerto
   */
  private updateHitRate(): void {
    const total = this.stats.hits + this.stats.misses;
    this.stats.hitRate = total > 0 ? (this.stats.hits / total) * 100 : 0;
  }

  /**
   * Inicia o processo de limpeza automática
   */
  private startCleanup(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
    }

    this.cleanupTimer = setInterval(() => {
      this.cleanup();
    }, this.config.cleanupInterval);
  }

  /**
   * Remove entradas expiradas
   */
  private cleanup(): void {
    const now = Date.now();
    let cleanedCount = 0;

    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
        cleanedCount++;
      }
    }

    if (cleanedCount > 0) {
      this.stats.size = this.cache.size;
    }
  }

  /**
   * Destrói o cache e limpa recursos
   */
  destroy(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
      this.cleanupTimer = null;
    }
    this.clear();
  }
}

// Instâncias de cache especializadas
export const workflowCache = new WorkflowCache({
  defaultTTL: 5 * 60 * 1000, // 5 minutos
  maxSize: 500
});

export const executionCache = new WorkflowCache({
  defaultTTL: 2 * 60 * 1000, // 2 minutos
  maxSize: 300
});

export const metricsCache = new WorkflowCache({
  defaultTTL: 10 * 60 * 1000, // 10 minutos
  maxSize: 200
});

export const templateCache = new WorkflowCache({
  defaultTTL: 30 * 60 * 1000, // 30 minutos
  maxSize: 100
});

// Cache global para configurações
export const configCache = new WorkflowCache({
  defaultTTL: 60 * 60 * 1000, // 1 hora
  maxSize: 50
});

// Utilitários de cache
export const cacheUtils = {
  /**
   * Gera chave de cache baseada em parâmetros
   */
  generateKey(prefix: string, params: Record<string, any>): string {
    const sortedParams = Object.keys(params)
      .sort()
      .map(key => `${key}:${JSON.stringify(params[key])}`)
      .join('|');
    
    return `${prefix}:${sortedParams}`;
  },

  /**
   * Invalida cache por padrão
   */
  invalidateByPattern(cache: WorkflowCache, pattern: string): number {
    let deletedCount = 0;
    
    for (const key of cache.getInfo().keys) {
      if (key.includes(pattern)) {
        cache.delete(key);
        deletedCount++;
      }
    }
    
    return deletedCount;
  },

  /**
   * Obtém estatísticas de todos os caches
   */
  getAllStats(): Record<string, CacheStats> {
    return {
      workflow: workflowCache.getStats(),
      execution: executionCache.getStats(),
      metrics: metricsCache.getStats(),
      template: templateCache.getStats(),
      config: configCache.getStats()
    };
  },

  /**
   * Limpa todos os caches
   */
  clearAll(): void {
    workflowCache.clear();
    executionCache.clear();
    metricsCache.clear();
    templateCache.clear();
    configCache.clear();
  },

  /**
   * Destrói todos os caches
   */
  destroyAll(): void {
    workflowCache.destroy();
    executionCache.destroy();
    metricsCache.destroy();
    templateCache.destroy();
    configCache.destroy();
  }
};

export default WorkflowCache;
