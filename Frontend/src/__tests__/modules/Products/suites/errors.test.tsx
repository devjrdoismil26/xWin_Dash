/**
 * Testes de Tratamento de Erros - Módulo Products
 */

import "../setup";
import { describe, it, expect, beforeEach, vi, Mock } from 'vitest';
import { apiClient } from '@/services';

const mockApiClient = apiClient as { get: Mock; post: Mock; put: Mock; delete: Mock};

describe("Módulo Products - Testes de Tratamento de Erros", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    cacheUtils.clearAllCaches();

  });

  describe("Tratamento de Erros de API", () => {
    it("deve tratar erro de rede", async () => {
      mockApiClient.get.mockRejectedValueOnce(new Error("Network Error"));

      await expect(productsCoreService.getProducts()).rejects.toThrow(
        "Network Error",);

    });

    it("deve tratar erro de validação do servidor", async () => {
      mockApiClient.post.mockRejectedValueOnce({
        response: {
          status: 400,
          data: { message: "SKU já existe" },
        },
      });

      await expect(
        productsCoreService.createProduct({
          name: "Produto",
          description: "Descrição",
          price: 99.99,
          currency: "BRL",
          status: "active",
          category: "electronics",
          tags: ["test"],
          sku: "EXISTING-SKU",
        }),
      ).rejects.toThrow();

    });

    it("deve tratar erro de autorização", async () => {
      mockApiClient.get.mockRejectedValueOnce({
        response: {
          status: 401,
          data: { message: "Não autorizado" },
        },
      });

      await expect(productsCoreService.getProducts()).rejects.toThrow();

    });

  });

  describe("Tratamento de Erros de Validação", () => {
    it("deve tratar erro em validação assíncrona", async () => {
      // Adicionar regra que sempre falha
      productValidator.addRule("testField", {
        name: "alwaysFail",
        message: "Sempre falha",
        validate: () => {
          throw new Error("Erro de validação");

        },
      });

      const result = await productValidator.validateField("testField", "test");

      expect(result.isValid).toBe(false);

      expect(result.errors[0].message).toContain("Erro de validação");

    });

  });

  describe("Tratamento de Erros de Cache", () => {
    it("deve tratar dados corrompidos no cache", () => {
      // Simular dados corrompidos
      const cache = new (productCache.constructor as any)();

      cache.cache.set("corrupted", "invalid-json");

      // Deve retornar null para dados inválidos
      expect(cache.get("corrupted")).toBeNull();

    });

  });

});

describe("Módulo Products - Testes de Componentes", () => {
