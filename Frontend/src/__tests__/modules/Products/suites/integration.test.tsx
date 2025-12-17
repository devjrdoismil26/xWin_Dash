/**
 * Testes de Integração - Módulo Products
 * Fluxos completos end-to-end
 */

import "../setup";
import { describe, it, expect, beforeEach, vi, Mock } from 'vitest';
import { apiClient } from '@/services';

const mockApiClient = apiClient as { get: Mock; post: Mock; put: Mock; delete: Mock};

describe("Módulo Products - Testes de Integração", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    cacheUtils.clearAllCaches();

  });

  describe("Fluxo Completo de Criação de Produto", () => {
    it("deve criar produto com validação, cache e analytics", async () => {
      const productData = {
        name: "Produto Teste",
        description: "Descrição do produto",
        price: 99.99,
        currency: "BRL",
        status: "active",
        category: "electronics",
        tags: ["teste", "produto"],
        sku: "TEST-001",};

      // Mock das chamadas de API
      mockApiClient.post
        .mockResolvedValueOnce({
          data: {
            id: "1",
            ...productData,
            created_at: new Date().toISOString(),
          },
        }) // createProduct
        .mockResolvedValueOnce({
          data: { id: "1", product_id: "1", name: "Variação M", price: 109.99 },
        }); // createVariation

      // 1. Validar dados
      const validation = await productValidator.validateObject(productData);

      expect(validation.isValid).toBe(true);

      // 2. Criar produto
      const product = await productsCoreService.createProduct(productData);

      expect(product.id).toBe("1");

      // 3. Verificar cache
      const cached = productCache.get("product:1");

      expect(cached).toBeDefined();

      // 4. Criar variação
      const variation = await productsVariationsService.createVariation("1", {
        name: "Variação M",
        price: 109.99,
        sku: "TEST-001-M",
        attributes: { size: "M" },
        inventory: 50,
      });

      expect(variation).toBeDefined();

      // 5. Buscar analytics
      const analytics = await productsAnalyticsService.getProductAnalytics("1");

      expect(analytics).toBeDefined();

    });

  });

  describe("Fluxo de Gerenciamento de Imagens", () => {
    it("deve fazer upload e gerenciar imagens", async () => {
      const productId = "1";
      const file = new File(["test"], "test.jpg", { type: "image/jpeg" });

      mockApiClient.post.mockResolvedValueOnce({
        data: {
          id: "1",
          url: "https://example.com/image.jpg",
          alt: "Imagem do produto",
        },
      });

      // 1. Fazer upload da imagem
      const image = await productsImagesService.uploadImage(productId, file, {
        alt: "Imagem do produto",
        caption: "Descrição da imagem",
      });

      expect(image).toBeDefined();

      // 2. Verificar cache
      const cached = imagesCache.get(`images:${productId}`);

      expect(cached).toBeDefined();

      // 3. Buscar imagens do produto
      const images = await productsImagesService.getImages(productId);

      expect(images).toBeDefined();

    });

  });

  describe("Fluxo de Analytics", () => {
    it("deve buscar e cachear analytics", async () => {
      const productId = "1";
      const mockAnalytics = {
        views: 1500,
        sales: 45,
        conversion_rate: 3.0,
        revenue: 4499.55,};

      mockApiClient.get.mockResolvedValueOnce({ data: mockAnalytics });

      // 1. Buscar analytics
      const analytics =
        await productsAnalyticsService.getProductAnalytics(productId);

      expect(analytics.views).toBe(1500);

      // 2. Verificar cache
      const cached = productCache.get(`analytics:${productId}`);

      expect(cached).toBeDefined();

      // 3. Segunda busca deve usar cache
      const analytics2 =
        await productsAnalyticsService.getProductAnalytics(productId);

      expect(analytics2).toEqual(analytics);

      expect(mockApiClient.get).toHaveBeenCalledTimes(1);

    });

  });

});

describe("Módulo Products - Testes de Performance", () => {
