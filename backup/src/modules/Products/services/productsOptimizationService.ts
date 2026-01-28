// =========================================
// PRODUCTS OPTIMIZATION SERVICE - OTIMIZAÇÕES AVANÇADAS
// =========================================
// Serviço para otimizações de performance e cache
// Máximo: 200 linhas

import { productsCache } from './productsCacheService';

// =========================================
// INTERFACES DE OTIMIZAÇÃO
// =========================================

interface OptimizationConfig {
  enableDebounce: boolean;
  debounceDelay: number;
  enablePreloading: boolean;
  preloadThreshold: number;
  enableVirtualization: boolean;
  virtualizationThreshold: number;
  enableMemoization: boolean;
  enableCompression: boolean;
}

interface CacheStrategy {
  ttl: number;
  maxSize: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
  preload: boolean;
  compress: boolean;
}

interface PerformanceMetrics {
  cacheHitRate: number;
  averageResponseTime: number;
  memoryUsage: number;
  networkRequests: number;
  lastOptimized: number;
}

// =========================================
// CONFIGURAÇÃO PADRÃO
// =========================================

const defaultConfig: OptimizationConfig = {
  enableDebounce: true,
  debounceDelay: 300,
  enablePreloading: true,
  preloadThreshold: 0.8,
  enableVirtualization: true,
  virtualizationThreshold: 100,
  enableMemoization: true,
  enableCompression: true
};

const cacheStrategies: Record<string, CacheStrategy> = {
  products: {
    ttl: 5 * 60 * 1000, // 5 minutos
    maxSize: 1000,
    priority: 'high',
    preload: true,
    compress: false
  },
  product: {
    ttl: 10 * 60 * 1000, // 10 minutos
    maxSize: 500,
    priority: 'critical',
    preload: true,
    compress: false
  },
  variations: {
    ttl: 5 * 60 * 1000, // 5 minutos
    maxSize: 2000,
    priority: 'medium',
    preload: false,
    compress: true
  },
  images: {
    ttl: 30 * 60 * 1000, // 30 minutos
    maxSize: 100,
    priority: 'medium',
    preload: true,
    compress: true
  },
  reviews: {
    ttl: 2 * 60 * 1000, // 2 minutos
    maxSize: 5000,
    priority: 'low',
    preload: false,
    compress: true
  },
  analytics: {
    ttl: 1 * 60 * 1000, // 1 minuto
    maxSize: 100,
    priority: 'high',
    preload: false,
    compress: true
  },
  bundles: {
    ttl: 5 * 60 * 1000, // 5 minutos
    maxSize: 500,
    priority: 'medium',
    preload: false,
    compress: false
  },
  inventory: {
    ttl: 1 * 60 * 1000, // 1 minuto
    maxSize: 1000,
    priority: 'critical',
    preload: true,
    compress: false
  }
};

// =========================================
// DEBOUNCE UTILITIES
// =========================================

class DebounceManager {
  private timers: Map<string, NodeJS.Timeout> = new Map();

  debounce<T extends (...args: any[]) => any>(
    key: string,
    func: T,
    delay: number = 300
  ): T {
    return ((...args: Parameters<T>) => {
      const existingTimer = this.timers.get(key);
      if (existingTimer) {
        clearTimeout(existingTimer);
      }

      const timer = setTimeout(() => {
        func(...args);
        this.timers.delete(key);
      }, delay);

      this.timers.set(key, timer);
    }) as T;
  }

  cancel(key: string): void {
    const timer = this.timers.get(key);
    if (timer) {
      clearTimeout(timer);
      this.timers.delete(key);
    }
  }

  cancelAll(): void {
    this.timers.forEach(timer => clearTimeout(timer));
    this.timers.clear();
  }
}

const debounceManager = new DebounceManager();

// =========================================
// PRELOADING UTILITIES
// =========================================

class PreloadManager {
  private preloaded: Set<string> = new Set();
  private preloadQueue: string[] = [];

  async preload(key: string, fetcher: () => Promise<any>): Promise<void> {
    if (this.preloaded.has(key)) {
      return;
    }

    try {
      await fetcher();
      this.preloaded.add(key);
    } catch (error) {
      console.warn(`Failed to preload ${key}:`, error);
    }
  }

  queuePreload(key: string, fetcher: () => Promise<any>): void {
    if (!this.preloadQueue.includes(key) && !this.preloaded.has(key)) {
      this.preloadQueue.push(key);
      
      // Preload com delay para não bloquear a UI
      setTimeout(() => {
        this.preload(key, fetcher);
        this.preloadQueue = this.preloadQueue.filter(k => k !== key);
      }, 100);
    }
  }

  isPreloaded(key: string): boolean {
    return this.preloaded.has(key);
  }

  clearPreloaded(): void {
    this.preloaded.clear();
    this.preloadQueue = [];
  }
}

const preloadManager = new PreloadManager();

// =========================================
// MEMOIZATION UTILITIES
// =========================================

class MemoizationManager {
  private cache = new Map<string, { value: any; timestamp: number; ttl: number }>();

  memoize<T extends (...args: any[]) => any>(
    key: string,
    func: T,
    ttl: number = 5 * 60 * 1000
  ): T {
    return ((...args: Parameters<T>) => {
      const cacheKey = `${key}_${JSON.stringify(args)}`;
      const cached = this.cache.get(cacheKey);

      if (cached && Date.now() - cached.timestamp < cached.ttl) {
        return cached.value;
      }

      const result = func(...args);
      this.cache.set(cacheKey, {
        value: result,
        timestamp: Date.now(),
        ttl
      });

      return result;
    }) as T;
  }

  clear(key?: string): void {
    if (key) {
      const keysToDelete = Array.from(this.cache.keys()).filter(k => k.startsWith(key));
      keysToDelete.forEach(k => this.cache.delete(k));
    } else {
      this.cache.clear();
    }
  }

  getStats(): { size: number; hitRate: number } {
    return {
      size: this.cache.size,
      hitRate: 0 // TODO: Implementar tracking de hit rate
    };
  }
}

const memoizationManager = new MemoizationManager();

// =========================================
// COMPRESSION UTILITIES
// =========================================

class CompressionManager {
  compress(data: any): string {
    try {
      return JSON.stringify(data);
    } catch (error) {
      console.warn('Failed to compress data:', error);
      return JSON.stringify(data);
    }
  }

  decompress<T>(compressed: string): T {
    try {
      return JSON.parse(compressed);
    } catch (error) {
      console.warn('Failed to decompress data:', error);
      throw error;
    }
  }

  isCompressible(data: any): boolean {
    const size = JSON.stringify(data).length;
    return size > 1024; // Compress only if > 1KB
  }
}

const compressionManager = new CompressionManager();

// =========================================
// PERFORMANCE MONITORING
// =========================================

class PerformanceMonitor {
  private metrics: PerformanceMetrics = {
    cacheHitRate: 0,
    averageResponseTime: 0,
    memoryUsage: 0,
    networkRequests: 0,
    lastOptimized: Date.now()
  };

  private responseTimes: number[] = [];
  private networkRequestCount = 0;

  recordResponseTime(time: number): void {
    this.responseTimes.push(time);
    
    // Manter apenas os últimos 100 tempos de resposta
    if (this.responseTimes.length > 100) {
      this.responseTimes = this.responseTimes.slice(-100);
    }

    this.metrics.averageResponseTime = this.responseTimes.reduce((a, b) => a + b, 0) / this.responseTimes.length;
  }

  recordNetworkRequest(): void {
    this.networkRequestCount++;
    this.metrics.networkRequests = this.networkRequestCount;
  }

  recordCacheHit(): void {
    // TODO: Implementar tracking de cache hits
  }

  getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  reset(): void {
    this.metrics = {
      cacheHitRate: 0,
      averageResponseTime: 0,
      memoryUsage: 0,
      networkRequests: 0,
      lastOptimized: Date.now()
    };
    this.responseTimes = [];
    this.networkRequestCount = 0;
  }
}

const performanceMonitor = new PerformanceMonitor();

// =========================================
// FUNÇÕES PRINCIPAIS
// =========================================

export const createOptimizedFetcher = <T>(
  key: string,
  fetcher: () => Promise<T>,
  strategy?: Partial<CacheStrategy>
): (() => Promise<T>) => {
  const cacheStrategy = { ...cacheStrategies[key] || cacheStrategies.products, ...strategy };
  
  return async (): Promise<T> => {
    const startTime = Date.now();
    
    try {
      // Verificar cache primeiro
      const cached = productsCache.get<T>(key);
      if (cached !== null) {
        performanceMonitor.recordCacheHit();
        return cached;
      }

      // Fazer requisição
      performanceMonitor.recordNetworkRequest();
      const result = await fetcher();
      
      // Armazenar no cache
      productsCache.set(key, result, cacheStrategy.ttl);
      
      // Registrar tempo de resposta
      const responseTime = Date.now() - startTime;
      performanceMonitor.recordResponseTime(responseTime);
      
      return result;
    } catch (error) {
      const responseTime = Date.now() - startTime;
      performanceMonitor.recordResponseTime(responseTime);
      throw error;
    }
  };
};

export const createDebouncedFunction = <T extends (...args: any[]) => any>(
  key: string,
  func: T,
  delay?: number
): T => {
  return debounceManager.debounce(key, func, delay || defaultConfig.debounceDelay);
};

export const createMemoizedFunction = <T extends (...args: any[]) => any>(
  key: string,
  func: T,
  ttl?: number
): T => {
  return memoizationManager.memoize(key, func, ttl);
};

export const preloadData = async (key: string, fetcher: () => Promise<any>): Promise<void> => {
  await preloadManager.preload(key, fetcher);
};

export const queuePreload = (key: string, fetcher: () => Promise<any>): void => {
  preloadManager.queuePreload(key, fetcher);
};

export const isDataPreloaded = (key: string): boolean => {
  return preloadManager.isPreloaded(key);
};

export const getPerformanceMetrics = (): PerformanceMetrics => {
  return performanceMonitor.getMetrics();
};

export const resetPerformanceMetrics = (): void => {
  performanceMonitor.reset();
};

export const clearAllOptimizations = (): void => {
  debounceManager.cancelAll();
  memoizationManager.clear();
  preloadManager.clearPreloaded();
  productsCache.clear();
};

// =========================================
// SELECTORS OTIMIZADOS
// =========================================

export const createOptimizedSelector = <T, R>(
  selector: (state: T) => R,
  key: string,
  ttl: number = 5 * 60 * 1000
) => {
  return memoizationManager.memoize(key, selector, ttl);
};

// =========================================
// CONFIGURAÇÃO
// =========================================

export const updateOptimizationConfig = (config: Partial<OptimizationConfig>): void => {
  Object.assign(defaultConfig, config);
};

export const getOptimizationConfig = (): OptimizationConfig => {
  return { ...defaultConfig };
};

export const updateCacheStrategy = (key: string, strategy: Partial<CacheStrategy>): void => {
  if (cacheStrategies[key]) {
    Object.assign(cacheStrategies[key], strategy);
  } else {
    cacheStrategies[key] = { ...cacheStrategies.products, ...strategy };
  }
};

export const getCacheStrategy = (key: string): CacheStrategy => {
  return { ...cacheStrategies[key] || cacheStrategies.products };
};
