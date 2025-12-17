/**
 * Testes Unitários - Módulo Products
 * Services, Validação e Cache
 */

import "../setup";
import { describe, it, expect, beforeEach, afterEach, vi, Mock } from 'vitest';
import { apiClient } from '@/services';

const mockApiClient = apiClient as { get: Mock; post: Mock; put: Mock; delete: Mock};

describe("Módulo Products - Testes Unitários", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    cacheUtils.clearAllCaches();

  });

  afterEach(() => {
    vi.restoreAllMocks();

  });

  describe("Services", () => {
    describe("productsCoreService", () => {
      it("deve criar produto com sucesso", async () => {
        const productData = {
          name: "Produto Teste",
          description: "Descrição do produto",
          price: 99.99,
          currency: "BRL",
          status: "active",
          category: "electronics",
          tags: ["teste", "produto"],
          sku: "TEST-001",};

        mockApiClient.post.mockResolvedValueOnce({
          data: {
            id: "1",
            ...productData,
            created_at: new Date().toISOString(),
          },
        });

        const result = await productsCoreService.createProduct(productData);

        expect(mockApiClient.post).toHaveBeenCalledWith(
          "/products",
          productData,);

        expect(result).toHaveProperty("id", "1");

        expect(result).toHaveProperty("name", "Produto Teste");

      });

      it("deve tratar erro ao criar produto", async () => {
        const productData = {
          name: "Produto Teste",
          description: "Descrição do produto",
          price: 99.99,
          currency: "BRL",
          status: "active",
          category: "electronics",
          tags: ["teste", "produto"],
          sku: "TEST-001",};

        mockApiClient.post.mockRejectedValueOnce(new Error("SKU já existe"));

        await expect(
          productsCoreService.createProduct(productData),
        ).rejects.toThrow("SKU já existe");

      });

      it("deve buscar produtos com filtros", async () => {
        const filters = {
          status: "active",
          category: "electronics",
          page: 1,
          limit: 10,};

        const mockResponse = {
          data: {
            products: [
              { id: "1", name: "Produto 1", price: 99.99, status: "active" },
              { id: "2", name: "Produto 2", price: 149.99, status: "active" },
            ],
            total: 2,
            page: 1,
            limit: 10,
          },};

        mockApiClient.get.mockResolvedValueOnce(mockResponse);

        const result = await productsCoreService.getProducts(filters);

        expect(mockApiClient.get).toHaveBeenCalledWith("/products", {
          params: filters,
        });

        expect(result.products).toHaveLength(2);

        expect(result.total).toBe(2);

      });

      it("deve atualizar produto", async () => {
        const productId = "1";
        const updateData = { name: "Produto Atualizado", price: 199.99};

        mockApiClient.put.mockResolvedValueOnce({
          data: {
            id: productId,
            ...updateData,
            updated_at: new Date().toISOString(),
          },
        });

        const result = await productsCoreService.updateProduct(
          productId,
          updateData,);

        expect(mockApiClient.put).toHaveBeenCalledWith(
          `/products/${productId}`,
          updateData,);

        expect(result.name).toBe("Produto Atualizado");

        expect(result.price).toBe(199.99);

      });

      it("deve deletar produto", async () => {
        const productId = "1";
        mockApiClient.delete.mockResolvedValueOnce({
          data: { success: true },
        });

        const result = await productsCoreService.deleteProduct(productId);

        expect(mockApiClient.delete).toHaveBeenCalledWith(
          `/products/${productId}`,);

        expect(result.success).toBe(true);

      });

    });

    describe("productsVariationsService", () => {
      it("deve criar variação de produto", async () => {
        const productId = "1";
        const variationData = {
          name: "Variação Tamanho M",
          price: 109.99,
          sku: "TEST-001-M",
          attributes: { size: "M", color: "blue" },
          inventory: 50,};

        mockApiClient.post.mockResolvedValueOnce({
          data: {
            id: "1",
            product_id: productId,
            ...variationData,
            created_at: new Date().toISOString(),
          },
        });

        const result = await productsVariationsService.createVariation(
          productId,
          variationData,);

        expect(mockApiClient.post).toHaveBeenCalledWith(
          `/products/${productId}/variations`,
          variationData,);

        expect(result).toHaveProperty("id", "1");

        expect(result.product_id).toBe(productId);

      });

      it("deve buscar variações de produto", async () => {
        const productId = "1";
        const mockVariations = [
          {
            id: "1",
            name: "Variação M",
            price: 109.99,
            attributes: { size: "M" },
          },
          {
            id: "2",
            name: "Variação L",
            price: 119.99,
            attributes: { size: "L" },
          },
        ];

        mockApiClient.get.mockResolvedValueOnce({
          data: mockVariations,
        });

        const result = await productsVariationsService.getVariations(productId);

        expect(mockApiClient.get).toHaveBeenCalledWith(
          `/products/${productId}/variations`,);

        expect(result).toHaveLength(2);

        expect(result[0].name).toBe("Variação M");

      });

    });

    describe("productsImagesService", () => {
      it("deve fazer upload de imagem", async () => {
        const productId = "1";
        const file = new File(["test"], "test.jpg", { type: "image/jpeg" });

        const metadata = {
          alt: "Imagem do produto",
          caption: "Descrição da imagem",};

        mockApiClient.post.mockResolvedValueOnce({
          data: {
            id: "1",
            url: "https://example.com/image.jpg",
            alt: "Imagem do produto",
          },
        });

        const result = await productsImagesService.uploadImage(
          productId,
          file,
          metadata,);

        expect(mockApiClient.post).toHaveBeenCalled();

        expect(result).toHaveProperty("id", "1");

        expect(result.url).toBe("https://example.com/image.jpg");

      });

      it("deve buscar imagens de produto", async () => {
        const productId = "1";
        const mockImages = [
          {
            id: "1",
            url: "https://example.com/image1.jpg",
            alt: "Imagem 1",
            is_primary: true,
          },
          {
            id: "2",
            url: "https://example.com/image2.jpg",
            alt: "Imagem 2",
            is_primary: false,
          },
        ];

        mockApiClient.get.mockResolvedValueOnce({
          data: mockImages,
        });

        const result = await productsImagesService.getImages(productId);

        expect(mockApiClient.get).toHaveBeenCalledWith(
          `/products/${productId}/images`,);

        expect(result).toHaveLength(2);

        expect(result[0].is_primary).toBe(true);

      });

    });

    describe("productsReviewsService", () => {
      it("deve criar review de produto", async () => {
        const productId = "1";
        const reviewData = {
          rating: 5,
          title: "Excelente produto",
          comment: "Produto de alta qualidade",
          user_id: "user1",};

        mockApiClient.post.mockResolvedValueOnce({
          data: {
            id: "1",
            product_id: productId,
            ...reviewData,
            created_at: new Date().toISOString(),
          },
        });

        const result = await productsReviewsService.createReview(
          productId,
          reviewData,);

        expect(mockApiClient.post).toHaveBeenCalledWith(
          `/products/${productId}/reviews`,
          reviewData,);

        expect(result).toHaveProperty("id", "1");

        expect(result.rating).toBe(5);

      });

      it("deve buscar reviews de produto", async () => {
        const productId = "1";
        const mockReviews = [
          { id: "1", rating: 5, title: "Excelente", comment: "Muito bom" },
          { id: "2", rating: 4, title: "Bom", comment: "Recomendo" },
        ];

        mockApiClient.get.mockResolvedValueOnce({
          data: mockReviews,
        });

        const result = await productsReviewsService.getReviews(productId);

        expect(mockApiClient.get).toHaveBeenCalledWith(
          `/products/${productId}/reviews`,);

        expect(result).toHaveLength(2);

        expect(result[0].rating).toBe(5);

      });

    });

    describe("productsAnalyticsService", () => {
      it("deve buscar analytics de produto", async () => {
        const productId = "1";
        const mockAnalytics = {
          views: 1500,
          sales: 45,
          conversion_rate: 3.0,
          revenue: 4499.55,
          top_sources: ["google", "facebook", "direct"],};

        mockApiClient.get.mockResolvedValueOnce({
          data: mockAnalytics,
        });

        const result =
          await productsAnalyticsService.getProductAnalytics(productId);

        expect(mockApiClient.get).toHaveBeenCalledWith(
          `/products/${productId}/analytics`,);

        expect(result.views).toBe(1500);

        expect(result.sales).toBe(45);

        expect(result.conversion_rate).toBe(3.0);

      });

      it("deve buscar analytics gerais", async () => {
        const mockAnalytics = {
          total_products: 100,
          total_views: 50000,
          total_sales: 1500,
          total_revenue: 150000,
          top_products: [
            { id: "1", name: "Produto Top", sales: 100 },
            { id: "2", name: "Produto Popular", sales: 80 },
          ],};

        mockApiClient.get.mockResolvedValueOnce({
          data: mockAnalytics,
        });

        const result = await productsAnalyticsService.getGeneralAnalytics();

        expect(mockApiClient.get).toHaveBeenCalledWith(
          "/products/analytics/general",);

        expect(result.total_products).toBe(100);

        expect(result.top_products).toHaveLength(2);

      });

    });

  });

  describe("Validação", () => {
    describe("productValidator", () => {
      it("deve validar dados de produto válidos", async () => {
        const productData = {
          name: "Produto Teste",
          description: "Descrição do produto",
          price: 99.99,
          currency: "BRL",
          status: "active",
          category: "electronics",
          tags: ["teste", "produto"],
          sku: "TEST-001",};

        const result = await productValidator.validateObject(productData);

        expect(result.isValid).toBe(true);

        expect(result.errors).toHaveLength(0);

        expect(result.score).toBe(100);

      });

      it("deve detectar dados inválidos", async () => {
        const productData = {
          name: "", // Nome vazio
          description: "", // Descrição vazia
          price: -10, // Preço negativo
          currency: "INVALID", // Moeda inválida
          status: "invalid", // Status inválido
          category: "", // Categoria vazia
          tags: [], // Tags vazias
          sku: "", // SKU vazio};

        const result = await productValidator.validateObject(productData);

        expect(result.isValid).toBe(false);

        expect(result.errors.length).toBeGreaterThan(0);

        expect(result.score).toBeLessThan(100);

      });

      it("deve validar preço em tempo real", async () => {
        const callback = vi.fn();

        productValidator.validateFieldRealtime("price", "99.99", callback);

        await waitFor(() => {
          expect(callback).toHaveBeenCalled();

        });

        const result = callback.mock.calls[0][0];
        expect(result.isValid).toBe(true);

      });

      it("deve validar SKU único", async () => {
        const callback = vi.fn();

        productValidator.validateFieldRealtime("sku", "TEST-001", callback);

        await waitFor(() => {
          expect(callback).toHaveBeenCalled();

        });

        const result = callback.mock.calls[0][0];
        expect(result.isValid).toBe(true);

      });

    });

    describe("validationUtils", () => {
      it("deve validar dados de criação de produto", async () => {
        const productData = {
          name: "Produto Teste",
          description: "Descrição do produto",
          price: 99.99,
          currency: "BRL",
          status: "active",
          category: "electronics",
          tags: ["teste", "produto"],
          sku: "TEST-001",};

        const result = await validationUtils.validateCreateProduct(productData);

        expect(result.isValid).toBe(true);

      });

      it("deve validar dados de atualização de produto", async () => {
        const updateData = {
          name: "Produto Atualizado",
          price: 199.99,};

        const result = await validationUtils.validateUpdateProduct(updateData);

        expect(result.isValid).toBe(true);

      });

      it("deve validar dados de variação", async () => {
        const variationData = {
          name: "Variação Tamanho M",
          price: 109.99,
          sku: "TEST-001-M",
          attributes: { size: "M", color: "blue" },
          inventory: 50,};

        const result = await validationUtils.validateVariation(variationData);

        expect(result.isValid).toBe(true);

      });

    });

  });

  describe("Cache", () => {
    describe("productCache", () => {
      it("deve armazenar e recuperar dados", () => {
        const key = "product:1";
        const data = { id: "1", name: "Produto Teste", price: 99.99};

        productCache.set(key, data);

        const retrieved = productCache.get(key);

        expect(retrieved).toEqual(data);

      });

      it("deve respeitar TTL", async () => {
        const key = "product:1";
        const data = { id: "1", name: "Produto Teste"};

        productCache.set(key, data, 100); // TTL de 100ms

        expect(productCache.get(key)).toEqual(data);

        await new Promise((resolve) => setTimeout(resolve, 150));

        expect(productCache.get(key)).toBeNull();

      });

      it("deve limpar por tag", () => {
        const product1 = { id: "1", name: "Produto 1"};

        const product2 = { id: "2", name: "Produto 2"};

        productCache.set("product:1", product1, undefined, ["product:1"]);

        productCache.set("product:2", product2, undefined, ["product:2"]);

        expect(productCache.size()).toBe(2);

        productCache.deleteByTag("product:1");

        expect(productCache.size()).toBe(1);

        expect(productCache.get("product:1")).toBeNull();

        expect(productCache.get("product:2")).toEqual(product2);

      });

      it("deve evictar LRU quando atingir limite", () => {
        const cache = new (productCache.constructor as any)({ maxSize: 2 });

        cache.set("key1", "data1");

        cache.set("key2", "data2");

        cache.set("key3", "data3"); // Deve evictar key1

        expect(cache.size()).toBe(2);

        expect(cache.get("key1")).toBeNull();

        expect(cache.get("key2")).toBe("data2");

        expect(cache.get("key3")).toBe("data3");

      });

    });

    describe("cacheUtils", () => {
      it("deve gerar chave de cache corretamente", () => {
        const key = cacheUtils.generateKey("products", {
          status: "active",
          page: 1,
        });

        expect(key).toBe("products|page:1|status:active");

      });

      it("deve limpar caches relacionados a produto", () => {
        productCache.set("product:1", { id: "1" }, undefined, ["product:1"]);

        variationsCache.set("variations:1", { id: "1" }, undefined, [
          "product:1",
        ]);

        imagesCache.set("images:1", { id: "1" }, undefined, ["product:1"]);

        cacheUtils.clearProductCaches("1");

        expect(productCache.get("product:1")).toBeNull();

        expect(variationsCache.get("variations:1")).toBeNull();

        expect(imagesCache.get("images:1")).toBeNull();

      });

      it("deve obter estatísticas de todos os caches", () => {
        productCache.set("test", "data");

        const stats = cacheUtils.getAllCacheStats();

        expect(stats).toHaveProperty("product");

        expect(stats).toHaveProperty("variations");

        expect(stats).toHaveProperty("images");

        expect(stats).toHaveProperty("reviews");

        expect(stats).toHaveProperty("analytics");

      });

    });

  });

});

describe("Módulo Products - Testes de Integração", () => {
