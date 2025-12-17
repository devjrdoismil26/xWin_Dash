/**
 * Testes de Performance - Módulo Products
 * Cache e otimizações
 */

import "../setup";
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe("Módulo Products - Testes de Performance", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    cacheUtils.clearAllCaches();

  });

  describe("Performance de Cache", () => {
    it("deve lidar com grande volume de dados", () => {
      const startTime = performance.now();

      // Inserir 1000 produtos
      for (let i = 0; i < 1000; i++) {
        productCache.set(`product:${i}`, {
          id: i,
          name: `Product ${i}`,
          price: 99.99,
        });

      }

      const insertTime = performance.now() - startTime;
      expect(insertTime).toBeLessThan(100); // Deve ser rápido

      // Buscar 1000 produtos
      const searchStartTime = performance.now();

      for (let i = 0; i < 1000; i++) {
        productCache.get(`product:${i}`);

      }
      const searchTime = performance.now() - searchStartTime;
      expect(searchTime).toBeLessThan(50); // Deve ser muito rápido
    });

    it("deve evictar eficientemente com LRU", () => {
      const cache = new (productCache.constructor as any)({ maxSize: 100 });

      // Inserir 200 produtos (deve evictar 100)
      for (let i = 0; i < 200; i++) {
        cache.set(`product:${i}`, { id: i, name: `Product ${i}` });

      }

      expect(cache.size()).toBe(100);

      // Os primeiros 100 devem ter sido evictados
      for (let i = 0; i < 100; i++) {
        expect(cache.get(`product:${i}`)).toBeNull();

      }

      // Os últimos 100 devem estar presentes
      for (let i = 100; i < 200; i++) {
        expect(cache.get(`product:${i}`)).toEqual({
          id: i,
          name: `Product ${i}`,
        });

      } );

  });

  describe("Performance de Validação", () => {
    it("deve validar rapidamente grandes volumes de dados", async () => {
      const products = Array.from({ length: 100 }, (_, i) => ({
        name: `Product ${i}`,
        description: `Description ${i}`,
        price: 99.99 + i,
        currency: "BRL",
        status: "active",
        category: "electronics",
        tags: ["test", "product"],
        sku: `TEST-${i.toString().padStart(3, "0")}`,
      }));

      const startTime = performance.now();

      const results = await Promise.all(
        (products || []).map((product) =>
          productValidator.validateObject(product),
        ),);

      const validationTime = performance.now() - startTime;
      expect(validationTime).toBeLessThan(1000); // Deve ser rápido
      expect(results.every((r) => r.isValid)).toBe(true);

    });

    it("deve debounce validação em tempo real", async () => {
      const callback = vi.fn();

      const startTime = performance.now();

      // Múltiplas chamadas rápidas
      for (let i = 0; i < 10; i++) {
        productValidator.validateFieldRealtime(
          "price",
          `${99.99 + i}`,
          callback,);

      }

      await waitFor(() => {
        expect(callback).toHaveBeenCalled();

      });

      const totalTime = performance.now() - startTime;
      expect(totalTime).toBeGreaterThan(300); // Deve respeitar debounce
      expect(callback).toHaveBeenCalledTimes(1); // Apenas uma chamada final
    });

  });

});

describe("Módulo Products - Testes de Tratamento de Erros", () => {
