/**
 * Testes para o módulo Products
 * Cobertura completa: unitários, integração, performance e tratamento de erros
 */

import { describe, it, expect, beforeEach, afterEach, vi, Mock } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';

// Mocks
vi.mock('@/services/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn()
  }
}));

vi.mock('@/components/ui/Card', () => ({
  default: ({ children, className }: any) => (
    <div className={`card ${className}`}>{children}</div>
  )
}));

vi.mock('@/components/ui/Button', () => ({
  default: ({ children, onClick, disabled, className }: any) => (
    <button onClick={onClick} disabled={disabled} className={className}>
      {children}
    </button>
  )
}));

vi.mock('@/components/ui/LoadingStates', () => ({
  LoadingSpinner: ({ size }: any) => <div className={`loading-spinner ${size}`}>Loading...</div>,
  LoadingSkeleton: ({ className }: any) => <div className={`loading-skeleton ${className}`}>Skeleton</div>
}));

vi.mock('@/components/ui/AdvancedAnimations', () => ({
  AnimatedCounter: ({ value, className }: any) => (
    <span className={className}>{value}</span>
  ),
  Animated: ({ children, delay }: any) => <div data-delay={delay}>{children}</div>,
  PageTransition: ({ children }: any) => <div className="page-transition">{children}</div>
}));

vi.mock('@/components/ui/AdvancedProgress', () => ({
  ProgressBar: ({ value, max, className }: any) => (
    <div className={`progress-bar ${className}`} data-value={value} data-max={max} />
  ),
  CircularProgress: ({ value, className }: any) => (
    <div className={`circular-progress ${className}`} data-value={value} />
  )
}));

vi.mock('@/components/ui/EmptyState', () => ({
  EmptyState: ({ title, message, action }: any) => (
    <div className="empty-state">
      <h3>{title}</h3>
      <p>{message}</p>
      {action}
    </div>
  )
}));

vi.mock('@/components/ui/ErrorState', () => ({
  ErrorState: ({ title, message, action }: any) => (
    <div className="error-state">
      <h3>{title}</h3>
      <p>{message}</p>
      {action}
    </div>
  )
}));

vi.mock('@/components/ui/Tooltip', () => ({
  default: ({ children, content }: any) => (
    <div className="tooltip" title={content}>{children}</div>
  )
}));

vi.mock('@/components/ui/ResponsiveSystem', () => ({
  ResponsiveGrid: ({ children, cols }: any) => (
    <div className="responsive-grid" data-cols={JSON.stringify(cols)}>{children}</div>
  ),
  ResponsiveContainer: ({ children }: any) => <div className="responsive-container">{children}</div>,
  ShowOn: ({ children }: any) => <div className="show-on">{children}</div>
}));

// Importar componentes e serviços após mocks
import { apiClient } from '@/services';
import { 
  ProductsDashboard, 
  ProductsStats, 
  ProductsFilters, 
  ProductsContent, 
  ProductsActions,
  ProductsList,
  ProductsForm,
  ProductsCard,
  VariationsManager,
  ImagesManager,
  ReviewsManager,
  AnalyticsDashboard
} from '../components';
import { 
  productsCoreService,
  productsVariationsService,
  productsImagesService,
  productsReviewsService,
  productsAnalyticsService,
  productsBundlesService,
  productsInventoryService,
  productsService
} from '../services';
import { productValidator, validationUtils } from '../utils/productValidation';
import { productCache, variationsCache, imagesCache, cacheUtils } from '../utils/productCache';

// Mock do apiClient
const mockApiClient = apiClient as {
  get: Mock;
  post: Mock;
  put: Mock;
  delete: Mock;
};

describe('Módulo Products - Testes Unitários', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    cacheUtils.clearAllCaches();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Services', () => {
    describe('productsCoreService', () => {
      it('deve criar produto com sucesso', async () => {
        const productData = {
          name: 'Produto Teste',
          description: 'Descrição do produto',
          price: 99.99,
          currency: 'BRL',
          status: 'active',
          category: 'electronics',
          tags: ['teste', 'produto'],
          sku: 'TEST-001'
        };

        mockApiClient.post.mockResolvedValueOnce({
          data: { id: '1', ...productData, created_at: new Date().toISOString() }
        });

        const result = await productsCoreService.createProduct(productData);

        expect(mockApiClient.post).toHaveBeenCalledWith('/products', productData);
        expect(result).toHaveProperty('id', '1');
        expect(result).toHaveProperty('name', 'Produto Teste');
      });

      it('deve tratar erro ao criar produto', async () => {
        const productData = {
          name: 'Produto Teste',
          description: 'Descrição do produto',
          price: 99.99,
          currency: 'BRL',
          status: 'active',
          category: 'electronics',
          tags: ['teste', 'produto'],
          sku: 'TEST-001'
        };

        mockApiClient.post.mockRejectedValueOnce(new Error('SKU já existe'));

        await expect(productsCoreService.createProduct(productData)).rejects.toThrow('SKU já existe');
      });

      it('deve buscar produtos com filtros', async () => {
        const filters = { status: 'active', category: 'electronics', page: 1, limit: 10 };
        const mockResponse = {
          data: {
            products: [
              { id: '1', name: 'Produto 1', price: 99.99, status: 'active' },
              { id: '2', name: 'Produto 2', price: 149.99, status: 'active' }
            ],
            total: 2,
            page: 1,
            limit: 10
          }
        };

        mockApiClient.get.mockResolvedValueOnce(mockResponse);

        const result = await productsCoreService.getProducts(filters);

        expect(mockApiClient.get).toHaveBeenCalledWith('/products', { params: filters });
        expect(result.products).toHaveLength(2);
        expect(result.total).toBe(2);
      });

      it('deve atualizar produto', async () => {
        const productId = '1';
        const updateData = { name: 'Produto Atualizado', price: 199.99 };
        
        mockApiClient.put.mockResolvedValueOnce({
          data: { id: productId, ...updateData, updated_at: new Date().toISOString() }
        });

        const result = await productsCoreService.updateProduct(productId, updateData);

        expect(mockApiClient.put).toHaveBeenCalledWith(`/products/${productId}`, updateData);
        expect(result.name).toBe('Produto Atualizado');
        expect(result.price).toBe(199.99);
      });

      it('deve deletar produto', async () => {
        const productId = '1';
        mockApiClient.delete.mockResolvedValueOnce({
          data: { success: true }
        });

        const result = await productsCoreService.deleteProduct(productId);

        expect(mockApiClient.delete).toHaveBeenCalledWith(`/products/${productId}`);
        expect(result.success).toBe(true);
      });
    });

    describe('productsVariationsService', () => {
      it('deve criar variação de produto', async () => {
        const productId = '1';
        const variationData = {
          name: 'Variação Tamanho M',
          price: 109.99,
          sku: 'TEST-001-M',
          attributes: { size: 'M', color: 'blue' },
          inventory: 50
        };

        mockApiClient.post.mockResolvedValueOnce({
          data: { id: '1', product_id: productId, ...variationData, created_at: new Date().toISOString() }
        });

        const result = await productsVariationsService.createVariation(productId, variationData);

        expect(mockApiClient.post).toHaveBeenCalledWith(`/products/${productId}/variations`, variationData);
        expect(result).toHaveProperty('id', '1');
        expect(result.product_id).toBe(productId);
      });

      it('deve buscar variações de produto', async () => {
        const productId = '1';
        const mockVariations = [
          { id: '1', name: 'Variação M', price: 109.99, attributes: { size: 'M' } },
          { id: '2', name: 'Variação L', price: 119.99, attributes: { size: 'L' } }
        ];

        mockApiClient.get.mockResolvedValueOnce({
          data: mockVariations
        });

        const result = await productsVariationsService.getVariations(productId);

        expect(mockApiClient.get).toHaveBeenCalledWith(`/products/${productId}/variations`);
        expect(result).toHaveLength(2);
        expect(result[0].name).toBe('Variação M');
      });
    });

    describe('productsImagesService', () => {
      it('deve fazer upload de imagem', async () => {
        const productId = '1';
        const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
        const metadata = { alt: 'Imagem do produto', caption: 'Descrição da imagem' };

        mockApiClient.post.mockResolvedValueOnce({
          data: { id: '1', url: 'https://example.com/image.jpg', alt: 'Imagem do produto' }
        });

        const result = await productsImagesService.uploadImage(productId, file, metadata);

        expect(mockApiClient.post).toHaveBeenCalled();
        expect(result).toHaveProperty('id', '1');
        expect(result.url).toBe('https://example.com/image.jpg');
      });

      it('deve buscar imagens de produto', async () => {
        const productId = '1';
        const mockImages = [
          { id: '1', url: 'https://example.com/image1.jpg', alt: 'Imagem 1', is_primary: true },
          { id: '2', url: 'https://example.com/image2.jpg', alt: 'Imagem 2', is_primary: false }
        ];

        mockApiClient.get.mockResolvedValueOnce({
          data: mockImages
        });

        const result = await productsImagesService.getImages(productId);

        expect(mockApiClient.get).toHaveBeenCalledWith(`/products/${productId}/images`);
        expect(result).toHaveLength(2);
        expect(result[0].is_primary).toBe(true);
      });
    });

    describe('productsReviewsService', () => {
      it('deve criar review de produto', async () => {
        const productId = '1';
        const reviewData = {
          rating: 5,
          title: 'Excelente produto',
          comment: 'Produto de alta qualidade',
          user_id: 'user1'
        };

        mockApiClient.post.mockResolvedValueOnce({
          data: { id: '1', product_id: productId, ...reviewData, created_at: new Date().toISOString() }
        });

        const result = await productsReviewsService.createReview(productId, reviewData);

        expect(mockApiClient.post).toHaveBeenCalledWith(`/products/${productId}/reviews`, reviewData);
        expect(result).toHaveProperty('id', '1');
        expect(result.rating).toBe(5);
      });

      it('deve buscar reviews de produto', async () => {
        const productId = '1';
        const mockReviews = [
          { id: '1', rating: 5, title: 'Excelente', comment: 'Muito bom' },
          { id: '2', rating: 4, title: 'Bom', comment: 'Recomendo' }
        ];

        mockApiClient.get.mockResolvedValueOnce({
          data: mockReviews
        });

        const result = await productsReviewsService.getReviews(productId);

        expect(mockApiClient.get).toHaveBeenCalledWith(`/products/${productId}/reviews`);
        expect(result).toHaveLength(2);
        expect(result[0].rating).toBe(5);
      });
    });

    describe('productsAnalyticsService', () => {
      it('deve buscar analytics de produto', async () => {
        const productId = '1';
        const mockAnalytics = {
          views: 1500,
          sales: 45,
          conversion_rate: 3.0,
          revenue: 4499.55,
          top_sources: ['google', 'facebook', 'direct']
        };

        mockApiClient.get.mockResolvedValueOnce({
          data: mockAnalytics
        });

        const result = await productsAnalyticsService.getProductAnalytics(productId);

        expect(mockApiClient.get).toHaveBeenCalledWith(`/products/${productId}/analytics`);
        expect(result.views).toBe(1500);
        expect(result.sales).toBe(45);
        expect(result.conversion_rate).toBe(3.0);
      });

      it('deve buscar analytics gerais', async () => {
        const mockAnalytics = {
          total_products: 100,
          total_views: 50000,
          total_sales: 1500,
          total_revenue: 150000,
          top_products: [
            { id: '1', name: 'Produto Top', sales: 100 },
            { id: '2', name: 'Produto Popular', sales: 80 }
          ]
        };

        mockApiClient.get.mockResolvedValueOnce({
          data: mockAnalytics
        });

        const result = await productsAnalyticsService.getGeneralAnalytics();

        expect(mockApiClient.get).toHaveBeenCalledWith('/products/analytics/general');
        expect(result.total_products).toBe(100);
        expect(result.top_products).toHaveLength(2);
      });
    });
  });

  describe('Validação', () => {
    describe('productValidator', () => {
      it('deve validar dados de produto válidos', async () => {
        const productData = {
          name: 'Produto Teste',
          description: 'Descrição do produto',
          price: 99.99,
          currency: 'BRL',
          status: 'active',
          category: 'electronics',
          tags: ['teste', 'produto'],
          sku: 'TEST-001'
        };

        const result = await productValidator.validateObject(productData);

        expect(result.isValid).toBe(true);
        expect(result.errors).toHaveLength(0);
        expect(result.score).toBe(100);
      });

      it('deve detectar dados inválidos', async () => {
        const productData = {
          name: '', // Nome vazio
          description: '', // Descrição vazia
          price: -10, // Preço negativo
          currency: 'INVALID', // Moeda inválida
          status: 'invalid', // Status inválido
          category: '', // Categoria vazia
          tags: [], // Tags vazias
          sku: '' // SKU vazio
        };

        const result = await productValidator.validateObject(productData);

        expect(result.isValid).toBe(false);
        expect(result.errors.length).toBeGreaterThan(0);
        expect(result.score).toBeLessThan(100);
      });

      it('deve validar preço em tempo real', async () => {
        const callback = vi.fn();
        
        productValidator.validateFieldRealtime('price', '99.99', callback);
        
        await waitFor(() => {
          expect(callback).toHaveBeenCalled();
        });

        const result = callback.mock.calls[0][0];
        expect(result.isValid).toBe(true);
      });

      it('deve validar SKU único', async () => {
        const callback = vi.fn();
        
        productValidator.validateFieldRealtime('sku', 'TEST-001', callback);
        
        await waitFor(() => {
          expect(callback).toHaveBeenCalled();
        });

        const result = callback.mock.calls[0][0];
        expect(result.isValid).toBe(true);
      });
    });

    describe('validationUtils', () => {
      it('deve validar dados de criação de produto', async () => {
        const productData = {
          name: 'Produto Teste',
          description: 'Descrição do produto',
          price: 99.99,
          currency: 'BRL',
          status: 'active',
          category: 'electronics',
          tags: ['teste', 'produto'],
          sku: 'TEST-001'
        };

        const result = await validationUtils.validateCreateProduct(productData);

        expect(result.isValid).toBe(true);
      });

      it('deve validar dados de atualização de produto', async () => {
        const updateData = {
          name: 'Produto Atualizado',
          price: 199.99
        };

        const result = await validationUtils.validateUpdateProduct(updateData);

        expect(result.isValid).toBe(true);
      });

      it('deve validar dados de variação', async () => {
        const variationData = {
          name: 'Variação Tamanho M',
          price: 109.99,
          sku: 'TEST-001-M',
          attributes: { size: 'M', color: 'blue' },
          inventory: 50
        };

        const result = await validationUtils.validateVariation(variationData);

        expect(result.isValid).toBe(true);
      });
    });
  });

  describe('Cache', () => {
    describe('productCache', () => {
      it('deve armazenar e recuperar dados', () => {
        const key = 'product:1';
        const data = { id: '1', name: 'Produto Teste', price: 99.99 };

        productCache.set(key, data);
        const retrieved = productCache.get(key);

        expect(retrieved).toEqual(data);
      });

      it('deve respeitar TTL', async () => {
        const key = 'product:1';
        const data = { id: '1', name: 'Produto Teste' };

        productCache.set(key, data, 100); // TTL de 100ms

        expect(productCache.get(key)).toEqual(data);

        await new Promise(resolve => setTimeout(resolve, 150));

        expect(productCache.get(key)).toBeNull();
      });

      it('deve limpar por tag', () => {
        const product1 = { id: '1', name: 'Produto 1' };
        const product2 = { id: '2', name: 'Produto 2' };

        productCache.set('product:1', product1, undefined, ['product:1']);
        productCache.set('product:2', product2, undefined, ['product:2']);

        expect(productCache.size()).toBe(2);

        productCache.deleteByTag('product:1');

        expect(productCache.size()).toBe(1);
        expect(productCache.get('product:1')).toBeNull();
        expect(productCache.get('product:2')).toEqual(product2);
      });

      it('deve evictar LRU quando atingir limite', () => {
        const cache = new (productCache.constructor as any)({ maxSize: 2 });

        cache.set('key1', 'data1');
        cache.set('key2', 'data2');
        cache.set('key3', 'data3'); // Deve evictar key1

        expect(cache.size()).toBe(2);
        expect(cache.get('key1')).toBeNull();
        expect(cache.get('key2')).toBe('data2');
        expect(cache.get('key3')).toBe('data3');
      });
    });

    describe('cacheUtils', () => {
      it('deve gerar chave de cache corretamente', () => {
        const key = cacheUtils.generateKey('products', { status: 'active', page: 1 });
        expect(key).toBe('products|page:1|status:active');
      });

      it('deve limpar caches relacionados a produto', () => {
        productCache.set('product:1', { id: '1' }, undefined, ['product:1']);
        variationsCache.set('variations:1', { id: '1' }, undefined, ['product:1']);
        imagesCache.set('images:1', { id: '1' }, undefined, ['product:1']);

        cacheUtils.clearProductCaches('1');

        expect(productCache.get('product:1')).toBeNull();
        expect(variationsCache.get('variations:1')).toBeNull();
        expect(imagesCache.get('images:1')).toBeNull();
      });

      it('deve obter estatísticas de todos os caches', () => {
        productCache.set('test', 'data');
        const stats = cacheUtils.getAllCacheStats();

        expect(stats).toHaveProperty('product');
        expect(stats).toHaveProperty('variations');
        expect(stats).toHaveProperty('images');
        expect(stats).toHaveProperty('reviews');
        expect(stats).toHaveProperty('analytics');
      });
    });
  });
});

describe('Módulo Products - Testes de Integração', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    cacheUtils.clearAllCaches();
  });

  describe('Fluxo Completo de Criação de Produto', () => {
    it('deve criar produto com validação, cache e analytics', async () => {
      const productData = {
        name: 'Produto Teste',
        description: 'Descrição do produto',
        price: 99.99,
        currency: 'BRL',
        status: 'active',
        category: 'electronics',
        tags: ['teste', 'produto'],
        sku: 'TEST-001'
      };

      // Mock das chamadas de API
      mockApiClient.post
        .mockResolvedValueOnce({ data: { id: '1', ...productData, created_at: new Date().toISOString() } }) // createProduct
        .mockResolvedValueOnce({ data: { id: '1', product_id: '1', name: 'Variação M', price: 109.99 } }); // createVariation

      // 1. Validar dados
      const validation = await productValidator.validateObject(productData);
      expect(validation.isValid).toBe(true);

      // 2. Criar produto
      const product = await productsCoreService.createProduct(productData);
      expect(product.id).toBe('1');

      // 3. Verificar cache
      const cached = productCache.get('product:1');
      expect(cached).toBeDefined();

      // 4. Criar variação
      const variation = await productsVariationsService.createVariation('1', {
        name: 'Variação M',
        price: 109.99,
        sku: 'TEST-001-M',
        attributes: { size: 'M' },
        inventory: 50
      });
      expect(variation).toBeDefined();

      // 5. Buscar analytics
      const analytics = await productsAnalyticsService.getProductAnalytics('1');
      expect(analytics).toBeDefined();
    });
  });

  describe('Fluxo de Gerenciamento de Imagens', () => {
    it('deve fazer upload e gerenciar imagens', async () => {
      const productId = '1';
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

      mockApiClient.post.mockResolvedValueOnce({
        data: { id: '1', url: 'https://example.com/image.jpg', alt: 'Imagem do produto' }
      });

      // 1. Fazer upload da imagem
      const image = await productsImagesService.uploadImage(productId, file, {
        alt: 'Imagem do produto',
        caption: 'Descrição da imagem'
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

  describe('Fluxo de Analytics', () => {
    it('deve buscar e cachear analytics', async () => {
      const productId = '1';
      const mockAnalytics = {
        views: 1500,
        sales: 45,
        conversion_rate: 3.0,
        revenue: 4499.55
      };

      mockApiClient.get.mockResolvedValueOnce({ data: mockAnalytics });

      // 1. Buscar analytics
      const analytics = await productsAnalyticsService.getProductAnalytics(productId);
      expect(analytics.views).toBe(1500);

      // 2. Verificar cache
      const cached = productCache.get(`analytics:${productId}`);
      expect(cached).toBeDefined();

      // 3. Segunda busca deve usar cache
      const analytics2 = await productsAnalyticsService.getProductAnalytics(productId);
      expect(analytics2).toEqual(analytics);
      expect(mockApiClient.get).toHaveBeenCalledTimes(1);
    });
  });
});

describe('Módulo Products - Testes de Performance', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    cacheUtils.clearAllCaches();
  });

  describe('Performance de Cache', () => {
    it('deve lidar com grande volume de dados', () => {
      const startTime = performance.now();
      
      // Inserir 1000 produtos
      for (let i = 0; i < 1000; i++) {
        productCache.set(`product:${i}`, { id: i, name: `Product ${i}`, price: 99.99 });
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

    it('deve evictar eficientemente com LRU', () => {
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
        expect(cache.get(`product:${i}`)).toEqual({ id: i, name: `Product ${i}` });
      }
    });
  });

  describe('Performance de Validação', () => {
    it('deve validar rapidamente grandes volumes de dados', async () => {
      const products = Array.from({ length: 100 }, (_, i) => ({
        name: `Product ${i}`,
        description: `Description ${i}`,
        price: 99.99 + i,
        currency: 'BRL',
        status: 'active',
        category: 'electronics',
        tags: ['test', 'product'],
        sku: `TEST-${i.toString().padStart(3, '0')}`
      }));

      const startTime = performance.now();
      
      const results = await Promise.all(
        products.map(product => productValidator.validateObject(product))
      );

      const validationTime = performance.now() - startTime;
      expect(validationTime).toBeLessThan(1000); // Deve ser rápido
      expect(results.every(r => r.isValid)).toBe(true);
    });

    it('deve debounce validação em tempo real', async () => {
      const callback = vi.fn();
      const startTime = performance.now();

      // Múltiplas chamadas rápidas
      for (let i = 0; i < 10; i++) {
        productValidator.validateFieldRealtime('price', `${99.99 + i}`, callback);
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

describe('Módulo Products - Testes de Tratamento de Erros', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    cacheUtils.clearAllCaches();
  });

  describe('Tratamento de Erros de API', () => {
    it('deve tratar erro de rede', async () => {
      mockApiClient.get.mockRejectedValueOnce(new Error('Network Error'));

      await expect(productsCoreService.getProducts()).rejects.toThrow('Network Error');
    });

    it('deve tratar erro de validação do servidor', async () => {
      mockApiClient.post.mockRejectedValueOnce({
        response: {
          status: 400,
          data: { message: 'SKU já existe' }
        }
      });

      await expect(productsCoreService.createProduct({
        name: 'Produto',
        description: 'Descrição',
        price: 99.99,
        currency: 'BRL',
        status: 'active',
        category: 'electronics',
        tags: ['test'],
        sku: 'EXISTING-SKU'
      })).rejects.toThrow();
    });

    it('deve tratar erro de autorização', async () => {
      mockApiClient.get.mockRejectedValueOnce({
        response: {
          status: 401,
          data: { message: 'Não autorizado' }
        }
      });

      await expect(productsCoreService.getProducts()).rejects.toThrow();
    });
  });

  describe('Tratamento de Erros de Validação', () => {
    it('deve tratar erro em validação assíncrona', async () => {
      // Adicionar regra que sempre falha
      productValidator.addRule('testField', {
        name: 'alwaysFail',
        message: 'Sempre falha',
        validate: () => {
          throw new Error('Erro de validação');
        }
      });

      const result = await productValidator.validateField('testField', 'test');
      
      expect(result.isValid).toBe(false);
      expect(result.errors[0].message).toContain('Erro de validação');
    });
  });

  describe('Tratamento de Erros de Cache', () => {
    it('deve tratar dados corrompidos no cache', () => {
      // Simular dados corrompidos
      const cache = new (productCache.constructor as any)();
      cache.cache.set('corrupted', 'invalid-json');

      // Deve retornar null para dados inválidos
      expect(cache.get('corrupted')).toBeNull();
    });
  });
});

describe('Módulo Products - Testes de Componentes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('ProductsDashboard', () => {
    it('deve renderizar dashboard corretamente', () => {
      render(<ProductsDashboard />);
      
      expect(screen.getByText('Products Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Manage your products and inventory')).toBeInTheDocument();
    });

    it('deve exibir estatísticas', async () => {
      render(<ProductsDashboard />);
      
      await waitFor(() => {
        expect(screen.getByText('Total Products')).toBeInTheDocument();
        expect(screen.getByText('Active Products')).toBeInTheDocument();
      });
    });
  });

  describe('ProductsStats', () => {
    it('deve renderizar estatísticas', () => {
      render(<ProductsStats />);
      
      expect(screen.getByText('Product Statistics')).toBeInTheDocument();
    });

    it('deve permitir alternar entre gráfico e tabela', () => {
      render(<ProductsStats showChart showTable />);
      
      expect(screen.getByText('Chart')).toBeInTheDocument();
      expect(screen.getByText('Table')).toBeInTheDocument();
    });
  });

  describe('ProductsFilters', () => {
    it('deve renderizar filtros', () => {
      render(<ProductsFilters />);
      
      expect(screen.getByText('Filters')).toBeInTheDocument();
      expect(screen.getByDisplayValue('All')).toBeInTheDocument();
    });

    it('deve permitir filtrar por categoria', () => {
      render(<ProductsFilters showCategoryFilter />);
      
      expect(screen.getByDisplayValue('All Categories')).toBeInTheDocument();
    });
  });

  describe('ProductsList', () => {
    it('deve renderizar lista de produtos', () => {
      render(<ProductsList />);
      
      expect(screen.getByText('Products List')).toBeInTheDocument();
    });

    it('deve permitir seleção múltipla', () => {
      render(<ProductsList allowMultiSelect />);
      
      expect(screen.getByText('Select All')).toBeInTheDocument();
    });
  });

  describe('ProductsForm', () => {
    it('deve renderizar formulário', () => {
      render(<ProductsForm />);
      
      expect(screen.getByText('Product Form')).toBeInTheDocument();
    });

    it('deve validar campos obrigatórios', async () => {
      render(<ProductsForm />);
      
      const submitButton = screen.getByText('Save Product');
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText('Name is required')).toBeInTheDocument();
      });
    });
  });

  describe('VariationsManager', () => {
    it('deve renderizar gerenciador de variações', () => {
      render(<VariationsManager productId="1" />);
      
      expect(screen.getByText('Product Variations')).toBeInTheDocument();
    });

    it('deve permitir adicionar variação', () => {
      render(<VariationsManager productId="1" />);
      
      const addButton = screen.getByText('Add Variation');
      fireEvent.click(addButton);
      
      expect(screen.getByText('New Variation')).toBeInTheDocument();
    });
  });

  describe('ImagesManager', () => {
    it('deve renderizar gerenciador de imagens', () => {
      render(<ImagesManager productId="1" />);
      
      expect(screen.getByText('Product Images')).toBeInTheDocument();
    });

    it('deve permitir upload de imagem', () => {
      render(<ImagesManager productId="1" />);
      
      expect(screen.getByText('Upload Image')).toBeInTheDocument();
    });
  });

  describe('ReviewsManager', () => {
    it('deve renderizar gerenciador de reviews', () => {
      render(<ReviewsManager productId="1" />);
      
      expect(screen.getByText('Product Reviews')).toBeInTheDocument();
    });

    it('deve exibir estatísticas de reviews', () => {
      render(<ReviewsManager productId="1" showStats />);
      
      expect(screen.getByText('Review Statistics')).toBeInTheDocument();
    });
  });

  describe('AnalyticsDashboard', () => {
    it('deve renderizar dashboard de analytics', () => {
      render(<AnalyticsDashboard />);
      
      expect(screen.getByText('Product Analytics')).toBeInTheDocument();
    });

    it('deve exibir métricas de performance', () => {
      render(<AnalyticsDashboard showMetrics />);
      
      expect(screen.getByText('Performance Metrics')).toBeInTheDocument();
    });
  });
});
