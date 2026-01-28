/**
 * Serviço de Cache para o módulo Activity
 * Gerencia cache local com TTL e invalidação automática
 */

import { ActivityLog, ActivityStats, ActivityFilters } from '../types';
import { CACHE_DURATION } from '../types/activityEnums';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

interface CacheInfo {
  logsCount: number;
  statsCount: number;
  totalSize: number;
  lastCleanup: number;
}

class ActivityCacheService {
  private cache = new Map<string, CacheEntry<any>>();
  private readonly defaultTTL = CACHE_DURATION.MEDIUM; // 15 minutes

  /**
   * Obtém logs do cache
   */
  getCachedLogs(filters: ActivityFilters): ActivityLog[] | null {
    const key = this.generateLogsKey(filters);
    const entry = this.cache.get(key);
    
    if (!entry) return null;
    
    if (this.isExpired(entry)) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.data;
  }

  /**
   * Cacheia logs
   */
  cacheLogs(filters: ActivityFilters, logs: ActivityLog[]): void {
    const key = this.generateLogsKey(filters);
    this.cache.set(key, {
      data: logs,
      timestamp: Date.now(),
      ttl: this.defaultTTL
    });
  }

  /**
   * Obtém log específico do cache
   */
  getCachedLog(logId: string): ActivityLog | null {
    const key = `log_${logId}`;
    const entry = this.cache.get(key);
    
    if (!entry) return null;
    
    if (this.isExpired(entry)) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.data;
  }

  /**
   * Cacheia log específico
   */
  cacheLog(logId: string, log: ActivityLog): void {
    const key = `log_${logId}`;
    this.cache.set(key, {
      data: log,
      timestamp: Date.now(),
      ttl: this.defaultTTL
    });
  }

  /**
   * Obtém estatísticas do cache
   */
  getCachedStats(filters: ActivityFilters): ActivityStats | null {
    const key = this.generateStatsKey(filters);
    const entry = this.cache.get(key);
    
    if (!entry) return null;
    
    if (this.isExpired(entry)) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.data;
  }

  /**
   * Cacheia estatísticas
   */
  cacheStats(filters: ActivityFilters, stats: ActivityStats): void {
    const key = this.generateStatsKey(filters);
    this.cache.set(key, {
      data: stats,
      timestamp: Date.now(),
      ttl: CACHE_DURATION.SHORT // 5 minutes for stats
    });
  }

  /**
   * Invalida cache de logs
   */
  invalidateLogsCache(): void {
    const keysToDelete: string[] = [];
    
    for (const key of this.cache.keys()) {
      if (key.startsWith('logs_') || key.startsWith('log_')) {
        keysToDelete.push(key);
      }
    }
    
    keysToDelete.forEach(key => this.cache.delete(key));
  }

  /**
   * Invalida cache de estatísticas
   */
  invalidateStatsCache(): void {
    const keysToDelete: string[] = [];
    
    for (const key of this.cache.keys()) {
      if (key.startsWith('stats_')) {
        keysToDelete.push(key);
      }
    }
    
    keysToDelete.forEach(key => this.cache.delete(key));
  }

  /**
   * Limpa todo o cache
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Limpa entradas expiradas
   */
  cleanup(): void {
    const now = Date.now();
    const keysToDelete: string[] = [];
    
    for (const [key, entry] of this.cache.entries()) {
      if (this.isExpired(entry)) {
        keysToDelete.push(key);
      }
    }
    
    keysToDelete.forEach(key => this.cache.delete(key));
  }

  /**
   * Obtém informações do cache
   */
  getCacheInfo(): CacheInfo {
    this.cleanup(); // Clean expired entries first
    
    let logsCount = 0;
    let statsCount = 0;
    let totalSize = 0;
    
    for (const [key, entry] of this.cache.entries()) {
      totalSize += JSON.stringify(entry.data).length;
      
      if (key.startsWith('logs_') || key.startsWith('log_')) {
        logsCount++;
      } else if (key.startsWith('stats_')) {
        statsCount++;
      }
    }
    
    return {
      logsCount,
      statsCount,
      totalSize,
      lastCleanup: Date.now()
    };
  }

  /**
   * Verifica se entrada está expirada
   */
  private isExpired(entry: CacheEntry<any>): boolean {
    return Date.now() - entry.timestamp > entry.ttl;
  }

  /**
   * Gera chave para cache de logs
   */
  private generateLogsKey(filters: ActivityFilters): string {
    const parts = ['logs'];
    
    if (filters.search) parts.push(`search_${filters.search}`);
    if (filters.type && filters.type !== 'all') parts.push(`type_${filters.type}`);
    if (filters.user && filters.user !== 'all') parts.push(`user_${filters.user}`);
    if (filters.date && filters.date !== 'all') parts.push(`date_${filters.date}`);
    if (filters.page) parts.push(`page_${filters.page}`);
    if (filters.per_page) parts.push(`per_page_${filters.per_page}`);
    
    return parts.join('_');
  }

  /**
   * Gera chave para cache de estatísticas
   */
  private generateStatsKey(filters: ActivityFilters): string {
    const parts = ['stats'];
    
    if (filters.search) parts.push(`search_${filters.search}`);
    if (filters.type && filters.type !== 'all') parts.push(`type_${filters.type}`);
    if (filters.user && filters.user !== 'all') parts.push(`user_${filters.user}`);
    if (filters.date && filters.date !== 'all') parts.push(`date_${filters.date}`);
    
    return parts.join('_');
  }

  /**
   * Configura TTL personalizado
   */
  setTTL(key: string, ttl: number): void {
    const entry = this.cache.get(key);
    if (entry) {
      entry.ttl = ttl;
    }
  }

  /**
   * Obtém TTL de uma entrada
   */
  getTTL(key: string): number | null {
    const entry = this.cache.get(key);
    return entry ? entry.ttl : null;
  }

  /**
   * Verifica se chave existe no cache
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
   * Obtém todas as chaves do cache
   */
  getKeys(): string[] {
    this.cleanup();
    return Array.from(this.cache.keys());
  }

  /**
   * Obtém tamanho do cache
   */
  getSize(): number {
    this.cleanup();
    return this.cache.size;
  }
}

export const activityCacheService = new ActivityCacheService();
export default activityCacheService;
