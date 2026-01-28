// =========================================
// SERVIÇO DE CACHE - CONFIGURAÇÕES
// =========================================

interface CacheItem<T = any> {
  data: T;
  timestamp: number;
  ttl: number;
}

interface CacheConfig {
  defaultTTL: number;
  maxSize: number;
  cleanupInterval: number;
}

// =========================================
// CONFIGURAÇÕES DO CACHE
// =========================================

const CACHE_CONFIG: CacheConfig = {
  defaultTTL: 5 * 60 * 1000, // 5 minutos
  maxSize: 100, // Máximo 100 itens
  cleanupInterval: 10 * 60 * 1000 // Limpeza a cada 10 minutos
};

// =========================================
// SERVIÇO DE CACHE
// =========================================

class SettingsCacheService {
  private cache = new Map<string, CacheItem>();
  private cleanupTimer: NodeJS.Timeout | null = null;

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
      ttl
    };

    this.cache.set(key, item);
    this.saveToLocalStorage(key, item);
  }

  /**
   * Recuperar item do cache
   */
  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    
    if (!item) {
      return null;
    }

    // Verificar se expirou
    if (this.isExpired(item)) {
      this.delete(key);
      return null;
    }

    return item.data as T;
  }

  /**
   * Verificar se item existe no cache
   */
  has(key: string): boolean {
    const item = this.cache.get(key);
    return item ? !this.isExpired(item) : false;
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

  // ===== MÉTODOS ESPECÍFICOS PARA CONFIGURAÇÕES =====

  /**
   * Cache para configurações gerais
   */
  setGeneralSettings(data: any, ttl?: number): void {
    this.set('general-settings', data, ttl);
  }

  getGeneralSettings(): any | null {
    return this.get('general-settings');
  }

  /**
   * Cache para configurações de autenticação
   */
  setAuthSettings(data: any, ttl?: number): void {
    this.set('auth-settings', data, ttl);
  }

  getAuthSettings(): any | null {
    return this.get('auth-settings');
  }

  /**
   * Cache para configurações de usuário
   */
  setUserSettings(data: any, ttl?: number): void {
    this.set('user-settings', data, ttl);
  }

  getUserSettings(): any | null {
    return this.get('user-settings');
  }

  /**
   * Cache para configurações de banco de dados
   */
  setDatabaseSettings(data: any, ttl?: number): void {
    this.set('database-settings', data, ttl);
  }

  getDatabaseSettings(): any | null {
    return this.get('database-settings');
  }

  /**
   * Cache para configurações de email
   */
  setEmailSettings(data: any, ttl?: number): void {
    this.set('email-settings', data, ttl);
  }

  getEmailSettings(): any | null {
    return this.get('email-settings');
  }

  /**
   * Cache para configurações de integração
   */
  setIntegrationSettings(data: any, ttl?: number): void {
    this.set('integration-settings', data, ttl);
  }

  getIntegrationSettings(): any | null {
    return this.get('integration-settings');
  }

  /**
   * Cache para configurações de IA
   */
  setAISettings(data: any, ttl?: number): void {
    this.set('ai-settings', data, ttl);
  }

  getAISettings(): any | null {
    return this.get('ai-settings');
  }

  /**
   * Cache para configurações de API
   */
  setAPISettings(data: any, ttl?: number): void {
    this.set('api-settings', data, ttl);
  }

  getAPISettings(): any | null {
    return this.get('api-settings');
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
      }
    });
  }

  /**
   * Invalidar cache de configurações gerais
   */
  invalidateGeneralSettings(): void {
    this.invalidateByPattern('general-settings');
  }

  /**
   * Invalidar cache de configurações de autenticação
   */
  invalidateAuthSettings(): void {
    this.invalidateByPattern('auth-settings');
  }

  /**
   * Invalidar cache de configurações de usuário
   */
  invalidateUserSettings(): void {
    this.invalidateByPattern('user-settings');
  }

  /**
   * Invalidar cache de configurações de banco de dados
   */
  invalidateDatabaseSettings(): void {
    this.invalidateByPattern('database-settings');
  }

  /**
   * Invalidar cache de configurações de email
   */
  invalidateEmailSettings(): void {
    this.invalidateByPattern('email-settings');
  }

  /**
   * Invalidar cache de configurações de integração
   */
  invalidateIntegrationSettings(): void {
    this.invalidateByPattern('integration-settings');
  }

  /**
   * Invalidar cache de configurações de IA
   */
  invalidateAISettings(): void {
    this.invalidateByPattern('ai-settings');
  }

  /**
   * Invalidar cache de configurações de API
   */
  invalidateAPISettings(): void {
    this.invalidateByPattern('api-settings');
  }

  // ===== PERSISTÊNCIA LOCAL =====

  /**
   * Salvar no localStorage
   */
  private saveToLocalStorage(key: string, item: CacheItem): void {
    try {
      const storageKey = `settings_cache_${key}`;
      localStorage.setItem(storageKey, JSON.stringify(item));
    } catch (error) {
      console.warn('Erro ao salvar cache no localStorage:', error);
    }
  }

  /**
   * Carregar do localStorage
   */
  private loadFromLocalStorage(): void {
    try {
      const keys = Object.keys(localStorage);
      const cacheKeys = keys.filter(key => key.startsWith('settings_cache_'));
      
      cacheKeys.forEach(storageKey => {
        const cacheKey = storageKey.replace('settings_cache_', '');
        const itemData = localStorage.getItem(storageKey);
        
        if (itemData) {
          const item: CacheItem = JSON.parse(itemData);
          if (!this.isExpired(item)) {
            this.cache.set(cacheKey, item);
          } else {
            localStorage.removeItem(storageKey);
          }
        }
      });
    } catch (error) {
      console.warn('Erro ao carregar cache do localStorage:', error);
    }
  }

  /**
   * Remover do localStorage
   */
  private removeFromLocalStorage(key: string): void {
    try {
      const storageKey = `settings_cache_${key}`;
      localStorage.removeItem(storageKey);
    } catch (error) {
      console.warn('Erro ao remover cache do localStorage:', error);
    }
  }

  /**
   * Limpar localStorage
   */
  private clearLocalStorage(): void {
    try {
      const keys = Object.keys(localStorage);
      const cacheKeys = keys.filter(key => key.startsWith('settings_cache_'));
      cacheKeys.forEach(key => localStorage.removeItem(key));
    } catch (error) {
      console.warn('Erro ao limpar cache do localStorage:', error);
    }
  }

  // ===== LIMPEZA AUTOMÁTICA =====

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

    this.cache.forEach((item, key) => {
      if (item.timestamp < oldestTime) {
        oldestTime = item.timestamp;
        oldestKey = key;
      }
    });

    if (oldestKey) {
      this.delete(oldestKey);
    }
  }

  /**
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
      }
    });
  }

  /**
   * Parar timer de limpeza
   */
  destroy(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
      this.cleanupTimer = null;
    }
  }

  // ===== ESTATÍSTICAS =====

  /**
   * Obter estatísticas do cache
   */
  getStats(): {
    size: number;
    maxSize: number;
    hitRate: number;
    items: Array<{ key: string; age: number; ttl: number }>;
  } {
    const items = Array.from(this.cache.entries()).map(([key, item]) => ({
      key,
      age: Date.now() - item.timestamp,
      ttl: item.ttl
    }));

    return {
      size: this.cache.size,
      maxSize: CACHE_CONFIG.maxSize,
      hitRate: 0, // TODO: Implementar tracking de hit rate
      items
    };
  }
}

// =========================================
// INSTÂNCIA SINGLETON
// =========================================

const settingsCacheService = new SettingsCacheService();

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
  const cached = settingsCacheService.get<T>(key);
  if (cached !== null) {
    return cached;
  }

  // Se não estiver no cache, buscar e armazenar
  const data = await fetcher();
  settingsCacheService.set(key, data, ttl);
  return data;
}

/**
 * Invalidar cache por padrão
 */
export function invalidateSettingsCache(pattern: string): void {
  settingsCacheService.invalidateByPattern(pattern);
}

/**
 * Limpar todo o cache de configurações
 */
export function clearSettingsCache(): void {
  settingsCacheService.clear();
}

// =========================================
// EXPORTS
// =========================================

export { settingsCacheService };
export default settingsCacheService;
