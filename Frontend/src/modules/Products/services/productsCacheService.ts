// =========================================
// PRODUCTS CACHE SERVICE - SISTEMA DE CACHE INTELIGENTE
// =========================================
// Serviço para gerenciamento de cache de produtos
// Máximo: 200 linhas

interface CacheItem<T> {
  data: T;
  timestamp: number;
  ttl: number;
  key: string;
}

interface CacheConfig {
  defaultTTL: number;
  maxSize: number;
  enablePersistence: boolean;
  [key: string]: unknown; }

class ProductsCacheService {
  private cache = new Map<string, CacheItem<any>>();

  private config: CacheConfig;

  constructor(config: Partial<CacheConfig> = {}) {
    this.config = {
      defaultTTL: 5 * 60 * 1000, // 5 minutos
      maxSize: 1000,
      enablePersistence: true,
      ...config};

    this.loadFromStorage();

    this.startCleanupInterval();

  }

  // =========================================
  // OPERAÇÕES BÁSICAS DE CACHE
  // =========================================

  set<T>(key: string, data: T, ttl?: number): void {
    const item: CacheItem<T> = {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.config.defaultTTL,
      key};

    this.cache.set(key, item);

    this.enforceMaxSize();

    if (this.config.enablePersistence) {
      this.saveToStorage();

    } get<T>(key: string): T | null {
    const item = this.cache.get(key);

    if (!item) {
      return null;
    }

    if (this.isExpired(item)) {
      this.cache.delete(key);

      return null;
    }

    return item.data as T;
  }

  has(key: string): boolean {
    const item = this.cache.get(key);

    return item ? !this.isExpired(item) : false;
  }

  delete(key: string): boolean {
    const deleted = this.cache.delete(key);

    if (deleted && this.config.enablePersistence) {
      this.saveToStorage();

    }
    return deleted;
  }

  clear(): void {
    this.cache.clear();

    if (this.config.enablePersistence) {
      localStorage.removeItem('products_cache');

    } // =========================================
  // OPERAÇÕES DE CACHE ESPECÍFICAS PARA PRODUTOS
  // =========================================

  setProducts(products: string[], filters?: string, ttl?: number): void {
    const key = this.generateProductsKey(filters);

    this.set(key, products, ttl);

  }

  getProducts(filters?: string): unknown[] | null {
    const key = this.generateProductsKey(filters);

    return this.get(key);

  }

  setProduct(productId: string, product: unknown, ttl?: number): void {
    const key = `product:${productId}`;
    this.set(key, product, ttl);

  }

  getProduct(productId: string): unknown | null {
    const key = `product:${productId}`;
    return this.get(key);

  }

  setProductVariations(productId: string, variations: string[], ttl?: number): void {
    const key = `product:${productId}:variations`;
    this.set(key, variations, ttl);

  }

  getProductVariations(productId: string): unknown[] | null {
    const key = `product:${productId}:variations`;
    return this.get(key);

  }

  setProductImages(productId: string, images: string[], ttl?: number): void {
    const key = `product:${productId}:images`;
    this.set(key, images, ttl);

  }

  getProductImages(productId: string): unknown[] | null {
    const key = `product:${productId}:images`;
    return this.get(key);

  }

  setProductReviews(productId: string, reviews: string[], ttl?: number): void {
    const key = `product:${productId}:reviews`;
    this.set(key, reviews, ttl);

  }

  getProductReviews(productId: string): unknown[] | null {
    const key = `product:${productId}:reviews`;
    return this.get(key);

  }

  setProductAnalytics(productId: string, analytics: unknown, ttl?: number): void {
    const key = `product:${productId}:analytics`;
    this.set(key, analytics, ttl);

  }

  getProductAnalytics(productId: string): unknown | null {
    const key = `product:${productId}:analytics`;
    return this.get(key);

  }

  // =========================================
  // OPERAÇÕES DE INVALIDAÇÃO
  // =========================================

  invalidateProduct(productId: string): void {
    const patterns = [
      `product:${productId}`,
      `product:${productId}:variations`,
      `product:${productId}:images`,
      `product:${productId}:reviews`,
      `product:${productId}:analytics`
    ];

    patterns.forEach(pattern => {
      this.cache.delete(pattern);

    });

    // Invalidar listas de produtos que podem conter este produto
    this.invalidateProductsLists();

  }

  invalidateProductsLists(): void {
    const keysToDelete: string[] = [];
    
    this.cache.forEach((_: unknown, key: unknown) => {
      if (key.startsWith('products:') || key.startsWith('products_list:')) {
        keysToDelete.push(key);

      } );

    keysToDelete.forEach(key => this.cache.delete(key));

  }

  invalidateByPattern(pattern: string): void {
    const regex = new RegExp(pattern);

    const keysToDelete: string[] = [];
    
    this.cache.forEach((_: unknown, key: unknown) => {
      if (regex.test(key)) {
        keysToDelete.push(key);

      } );

    keysToDelete.forEach(key => this.cache.delete(key));

  }

  // =========================================
  // OPERAÇÕES DE PERSISTÊNCIA
  // =========================================

  private saveToStorage(): void {
    try {
      const cacheData = Array.from(this.cache.entries());

      localStorage.setItem('products_cache', JSON.stringify(cacheData));

    } catch (error) {
    } private loadFromStorage(): void {
    try {
      const cacheData = localStorage.getItem('products_cache');

      if (cacheData) {
        const entries = JSON.parse(cacheData);

        entries.forEach(([key, item]: [string, CacheItem<any>]) => {
          if (!this.isExpired(item)) {
            this.cache.set(key, item);

          } );

      } catch (error) {
    } // =========================================
  // UTILITÁRIOS
  // =========================================

  private isExpired(item: CacheItem<any>): boolean {
    return Date.now() - item.timestamp > item.ttl;
  }

  private generateProductsKey(filters?: string): string {
    if (!filters || Object.keys(filters).length === 0) {
      return 'products:all';
    }
    
    const filterString = JSON.stringify(filters);

    return `products:${btoa(filterString)}`;
  }

  private enforceMaxSize(): void {
    if (this.cache.size > this.config.maxSize) {
      const entries = Array.from(this.cache.entries());

      entries.sort((a: unknown, b: unknown) => a[1].timestamp - b[1].timestamp);

      const toDelete = entries.slice(0, this.cache.size - this.config.maxSize);

      toDelete.forEach(([key]) => this.cache.delete(key));

    } private startCleanupInterval(): void {
    setInterval(() => {
      const now = Date.now();

      const keysToDelete: string[] = [];
      
      this.cache.forEach((item: unknown, key: unknown) => {
        if (now - item.timestamp > item.ttl) {
          keysToDelete.push(key);

        } );

      keysToDelete.forEach(key => this.cache.delete(key));

      if (keysToDelete.length > 0 && this.config.enablePersistence) {
        this.saveToStorage();

      } , 60000); // Limpeza a cada minuto
  }

  // =========================================
  // ESTATÍSTICAS DO CACHE
  // =========================================

  getStats(): { size: number; maxSize: number; hitRate: number } {
    return {
      size: this.cache.size,
      maxSize: this.config.maxSize,
      hitRate: 0};

  } // Instância singleton
export const productsCache = new ProductsCacheService();

// Funções utilitárias para uso nos serviços
export const withCache = async <T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl?: number
): Promise<T> => {
  const cached = productsCache.get<T>(key);

  if (cached !== null) {
    return cached;
  }

  const data = await fetcher();

  productsCache.set(key, data, ttl);

  return data;};

export const invalidateProductCache = (productId: string): void => {
  productsCache.invalidateProduct(productId);};

export const clearProductsCache = (): void => {
  productsCache.clear();};

export default productsCache;
