class AnalyticsCacheService {
  private cache = new Map<string, { data: unknown; timestamp: number }>();
  private readonly TTL = 5 * 60 * 1000; // 5 minutos

  set(key: string, data: unknown): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  get(key: string): unknown | null {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() - item.timestamp > this.TTL) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  clear(): void {
    this.cache.clear();
  }

  has(key: string): boolean {
    return this.cache.has(key) && this.get(key) !== null;
  }
}

export default new AnalyticsCacheService();