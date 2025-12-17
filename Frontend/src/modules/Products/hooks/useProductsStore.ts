// =========================================
// PRODUCTS STORE - ZUSTAND TIPADO
// =========================================
// Store global para o módulo Products
// Máximo: 300 linhas

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { Product, ProductVariation, ProductImage, ProductReview, ProductAnalytics, ProductBundle, ProductInventory, ProductsFilter, ReviewStats, InventoryAlert, StockLevel } from '../types';

// =========================================
// INTERFACES DO ESTADO
// =========================================

interface ProductsState {
  // Dados principais
  products: Product[];
  currentProduct: Product | null;
  productsFilter: ProductsFilter;
  // Variações
  variations: ProductVariation[];
  currentVariation: ProductVariation | null;
  // Imagens
  images: ProductImage[];
  currentImage: ProductImage | null;
  // Reviews
  reviews: ProductReview[];
  currentReview: ProductReview | null;
  reviewStats: ReviewStats | null;
  // Analytics
  analytics: ProductAnalytics | null;
  metrics: Record<string, any> | null;
  performance: Record<string, any> | null;
  // Bundles
  bundles: ProductBundle[];
  currentBundle: ProductBundle | null;
  // Inventory
  inventory: ProductInventory | null;
  allInventory: ProductInventory[];
  inventoryAlerts: InventoryAlert[];
  stockLevels: StockLevel[];
  // Estado de UI
  loading: boolean;
  error: string | null;
  selectedProducts: string[];
  viewMode: 'grid' | 'list';
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  // Cache
  cache: Record<string, any>;
  lastUpdated: Record<string, number>; }

interface ProductsActions {
  // Ações de produtos
  setProducts?: (e: any) => void;
  setCurrentProduct?: (e: any) => void;
  addProduct?: (e: any) => void;
  updateProduct?: (e: any) => void;
  removeProduct?: (e: any) => void;
  setProductsFilter?: (e: any) => void;
  // Ações de variações
  setVariations?: (e: any) => void;
  setCurrentVariation?: (e: any) => void;
  addVariation?: (e: any) => void;
  updateVariation?: (e: any) => void;
  removeVariation?: (e: any) => void;
  // Ações de imagens
  setImages?: (e: any) => void;
  setCurrentImage?: (e: any) => void;
  addImage?: (e: any) => void;
  updateImage?: (e: any) => void;
  removeImage?: (e: any) => void;
  // Ações de reviews
  setReviews?: (e: any) => void;
  setCurrentReview?: (e: any) => void;
  addReview?: (e: any) => void;
  updateReview?: (e: any) => void;
  removeReview?: (e: any) => void;
  setReviewStats?: (e: any) => void;
  // Ações de analytics
  setAnalytics?: (e: any) => void;
  setMetrics?: (e: any) => void;
  setPerformance?: (e: any) => void;
  // Ações de bundles
  setBundles?: (e: any) => void;
  setCurrentBundle?: (e: any) => void;
  addBundle?: (e: any) => void;
  updateBundle?: (e: any) => void;
  removeBundle?: (e: any) => void;
  // Ações de inventory
  setInventory?: (e: any) => void;
  setAllInventory?: (e: any) => void;
  updateInventory?: (e: any) => void;
  setInventoryAlerts?: (e: any) => void;
  addInventoryAlert?: (e: any) => void;
  updateInventoryAlert?: (e: any) => void;
  removeInventoryAlert?: (e: any) => void;
  setStockLevels?: (e: any) => void;
  // Ações de UI
  setLoading?: (e: any) => void;
  setError?: (e: any) => void;
  setSelectedProducts?: (e: any) => void;
  toggleProductSelection?: (e: any) => void;
  clearSelection??: (e: any) => void;
  setViewMode?: (e: any) => void;
  setSortBy?: (e: any) => void;
  setSortOrder?: (e: any) => void;
  // Ações de cache
  setCache?: (e: any) => void;
  getCache: (key: string) => any;
  clearCache?: (e: any) => void;
  updateLastUpdated?: (e: any) => void;
  // Ações de reset
  resetProducts??: (e: any) => void;
  resetAll??: (e: any) => void; }

// =========================================
// ESTADO INICIAL
// =========================================

const initialState: ProductsState = {
  // Dados principais
  products: [],
  currentProduct: null,
  productsFilter: {},
  
  // Variações
  variations: [],
  currentVariation: null,
  
  // Imagens
  images: [],
  currentImage: null,
  
  // Reviews
  reviews: [],
  currentReview: null,
  reviewStats: null,
  
  // Analytics
  analytics: null,
  metrics: null,
  performance: null,
  
  // Bundles
  bundles: [],
  currentBundle: null,
  
  // Inventory
  inventory: null,
  allInventory: [],
  inventoryAlerts: [],
  stockLevels: [],
  
  // Estado de UI
  loading: false,
  error: null,
  selectedProducts: [],
  viewMode: 'grid',
  sortBy: 'created_at',
  sortOrder: 'desc',
  
  // Cache
  cache: {},
  lastUpdated: {} ;

// =========================================
// STORE PRINCIPAL
// =========================================

export const useProductsStore = create<ProductsState & ProductsActions>()(
  devtools(
    persist(
      immer((set: unknown, get: unknown) => ({
        ...initialState,
        
        // =========================================
        // AÇÕES DE PRODUTOS
        // =========================================
        
        setProducts: (products: unknown) => set((state: unknown) => {
          state.products = products;
          state.lastUpdated.products = Date.now();

        }),
        
        setCurrentProduct: (product: unknown) => set((state: unknown) => {
          state.currentProduct = product;
        }),
        
        addProduct: (product: unknown) => set((state: unknown) => {
          state.products.unshift(product);

          state.lastUpdated.products = Date.now();

        }),
        
        updateProduct: (id: unknown, updates: unknown) => set((state: unknown) => {
          const index = state.products.findIndex(p => p.id === id);

          if (index !== -1) {
            state.products[index] = { ...state.products[index], ...updates};

          }
          if (state.currentProduct?.id === id) {
            state.currentProduct = { ...state.currentProduct, ...updates};

          }
          state.lastUpdated.products = Date.now();

        }),
        
        removeProduct: (id: unknown) => set((state: unknown) => {
          state.products = state.products.filter(p => p.id !== id);

          if (state.currentProduct?.id === id) {
            state.currentProduct = null;
          }
          state.selectedProducts = state.selectedProducts.filter(pid => pid !== id);

          state.lastUpdated.products = Date.now();

        }),
        
        setProductsFilter: (filter: unknown) => set((state: unknown) => {
          state.productsFilter = filter;
        }),
        
        // =========================================
        // AÇÕES DE VARIAÇÕES
        // =========================================
        
        setVariations: (variations: unknown) => set((state: unknown) => {
          state.variations = variations;
          state.lastUpdated.variations = Date.now();

        }),
        
        setCurrentVariation: (variation: unknown) => set((state: unknown) => {
          state.currentVariation = variation;
        }),
        
        addVariation: (variation: unknown) => set((state: unknown) => {
          state.variations.unshift(variation);

          state.lastUpdated.variations = Date.now();

        }),
        
        updateVariation: (id: unknown, updates: unknown) => set((state: unknown) => {
          const index = state.variations.findIndex(v => v.id === id);

          if (index !== -1) {
            state.variations[index] = { ...state.variations[index], ...updates};

          }
          if (state.currentVariation?.id === id) {
            state.currentVariation = { ...state.currentVariation, ...updates};

          }
          state.lastUpdated.variations = Date.now();

        }),
        
        removeVariation: (id: unknown) => set((state: unknown) => {
          state.variations = state.variations.filter(v => v.id !== id);

          if (state.currentVariation?.id === id) {
            state.currentVariation = null;
          }
          state.lastUpdated.variations = Date.now();

        }),
        
        // =========================================
        // AÇÕES DE IMAGENS
        // =========================================
        
        setImages: (images: unknown) => set((state: unknown) => {
          state.images = images;
          state.lastUpdated.images = Date.now();

        }),
        
        setCurrentImage: (image: unknown) => set((state: unknown) => {
          state.currentImage = image;
        }),
        
        addImage: (image: unknown) => set((state: unknown) => {
          state.images.unshift(image);

          state.lastUpdated.images = Date.now();

        }),
        
        updateImage: (id: unknown, updates: unknown) => set((state: unknown) => {
          const index = state.images.findIndex(img => img.id === id);

          if (index !== -1) {
            state.images[index] = { ...state.images[index], ...updates};

          }
          if (state.currentImage?.id === id) {
            state.currentImage = { ...state.currentImage, ...updates};

          }
          state.lastUpdated.images = Date.now();

        }),
        
        removeImage: (id: unknown) => set((state: unknown) => {
          state.images = state.images.filter(img => img.id !== id);

          if (state.currentImage?.id === id) {
            state.currentImage = null;
          }
          state.lastUpdated.images = Date.now();

        }),
        
        // =========================================
        // AÇÕES DE REVIEWS
        // =========================================
        
        setReviews: (reviews: unknown) => set((state: unknown) => {
          state.reviews = reviews;
          state.lastUpdated.reviews = Date.now();

        }),
        
        setCurrentReview: (review: unknown) => set((state: unknown) => {
          state.currentReview = review;
        }),
        
        addReview: (review: unknown) => set((state: unknown) => {
          state.reviews.unshift(review);

          state.lastUpdated.reviews = Date.now();

        }),
        
        updateReview: (id: unknown, updates: unknown) => set((state: unknown) => {
          const index = state.reviews.findIndex(r => r.id === id);

          if (index !== -1) {
            state.reviews[index] = { ...state.reviews[index], ...updates};

          }
          if (state.currentReview?.id === id) {
            state.currentReview = { ...state.currentReview, ...updates};

          }
          state.lastUpdated.reviews = Date.now();

        }),
        
        removeReview: (id: unknown) => set((state: unknown) => {
          state.reviews = state.reviews.filter(r => r.id !== id);

          if (state.currentReview?.id === id) {
            state.currentReview = null;
          }
          state.lastUpdated.reviews = Date.now();

        }),
        
        setReviewStats: (stats: unknown) => set((state: unknown) => {
          state.reviewStats = stats;
        }),
        
        // =========================================
        // AÇÕES DE ANALYTICS
        // =========================================
        
        setAnalytics: (analytics: unknown) => set((state: unknown) => {
          state.analytics = analytics;
        }),
        
        setMetrics: (metrics: unknown) => set((state: unknown) => {
          state.metrics = metrics;
        }),
        
        setPerformance: (performance: unknown) => set((state: unknown) => {
          state.performance = performance;
        }),
        
        // =========================================
        // AÇÕES DE BUNDLES
        // =========================================
        
        setBundles: (bundles: unknown) => set((state: unknown) => {
          state.bundles = bundles;
          state.lastUpdated.bundles = Date.now();

        }),
        
        setCurrentBundle: (bundle: unknown) => set((state: unknown) => {
          state.currentBundle = bundle;
        }),
        
        addBundle: (bundle: unknown) => set((state: unknown) => {
          state.bundles.unshift(bundle);

          state.lastUpdated.bundles = Date.now();

        }),
        
        updateBundle: (id: unknown, updates: unknown) => set((state: unknown) => {
          const index = state.bundles.findIndex(b => b.id === id);

          if (index !== -1) {
            state.bundles[index] = { ...state.bundles[index], ...updates};

          }
          if (state.currentBundle?.id === id) {
            state.currentBundle = { ...state.currentBundle, ...updates};

          }
          state.lastUpdated.bundles = Date.now();

        }),
        
        removeBundle: (id: unknown) => set((state: unknown) => {
          state.bundles = state.bundles.filter(b => b.id !== id);

          if (state.currentBundle?.id === id) {
            state.currentBundle = null;
          }
          state.lastUpdated.bundles = Date.now();

        }),
        
        // =========================================
        // AÇÕES DE INVENTORY
        // =========================================
        
        setInventory: (inventory: unknown) => set((state: unknown) => {
          state.inventory = inventory;
        }),
        
        setAllInventory: (inventory: unknown) => set((state: unknown) => {
          state.allInventory = inventory;
          state.lastUpdated.inventory = Date.now();

        }),
        
        updateInventory: (productId: unknown, updates: unknown) => set((state: unknown) => {
          const index = state.allInventory.findIndex(inv => inv.product_id === productId);

          if (index !== -1) {
            state.allInventory[index] = { ...state.allInventory[index], ...updates};

          }
          if (state.inventory?.product_id === productId) {
            state.inventory = { ...state.inventory, ...updates};

          }
          state.lastUpdated.inventory = Date.now();

        }),
        
        setInventoryAlerts: (alerts: unknown) => set((state: unknown) => {
          state.inventoryAlerts = alerts;
        }),
        
        addInventoryAlert: (alert: unknown) => set((state: unknown) => {
          state.inventoryAlerts.unshift(alert);

        }),
        
        updateInventoryAlert: (id: unknown, updates: unknown) => set((state: unknown) => {
          const index = state.inventoryAlerts.findIndex(a => a.id === id);

          if (index !== -1) {
            state.inventoryAlerts[index] = { ...state.inventoryAlerts[index], ...updates};

          } ),
        
        removeInventoryAlert: (id: unknown) => set((state: unknown) => {
          state.inventoryAlerts = state.inventoryAlerts.filter(a => a.id !== id);

        }),
        
        setStockLevels: (levels: unknown) => set((state: unknown) => {
          state.stockLevels = levels;
        }),
        
        // =========================================
        // AÇÕES DE UI
        // =========================================
        
        setLoading: (loading: unknown) => set((state: unknown) => {
          state.loading = loading;
        }),
        
        setError: (error: unknown) => set((state: unknown) => {
          state.error = error;
        }),
        
        setSelectedProducts: (ids: unknown) => set((state: unknown) => {
          state.selectedProducts = ids;
        }),
        
        toggleProductSelection: (id: unknown) => set((state: unknown) => {
          const index = state.selectedProducts.indexOf(id);

          if (index === -1) {
            state.selectedProducts.push(id);

          } else {
            state.selectedProducts.splice(index, 1);

          } ),
        
        clearSelection: () => set((state: unknown) => {
          state.selectedProducts = [];
        }),
        
        setViewMode: (mode: unknown) => set((state: unknown) => {
          state.viewMode = mode;
        }),
        
        setSortBy: (field: unknown) => set((state: unknown) => {
          state.sortBy = field;
        }),
        
        setSortOrder: (order: unknown) => set((state: unknown) => {
          state.sortOrder = order;
        }),
        
        // =========================================
        // AÇÕES DE CACHE
        // =========================================
        
        setCache: (key: unknown, value: unknown) => set((state: unknown) => {
          state.cache[key] = value;
          state.lastUpdated[key] = Date.now();

        }),
        
        getCache: (key: unknown) => {
          const state = get();

          return state.cache[key];
        },
        
        clearCache: (key: unknown) => set((state: unknown) => {
          if (key) {
            delete state.cache[key];
            delete state.lastUpdated[key];
          } else {
            state.cache = {};

            state.lastUpdated = {};

          } ),
        
        updateLastUpdated: (key: unknown) => set((state: unknown) => {
          state.lastUpdated[key] = Date.now();

        }),
        
        // =========================================
        // AÇÕES DE RESET
        // =========================================
        
        resetProducts: () => set((state: unknown) => {
          state.products = [];
          state.currentProduct = null;
          state.variations = [];
          state.currentVariation = null;
          state.images = [];
          state.currentImage = null;
          state.reviews = [];
          state.currentReview = null;
          state.reviewStats = null;
          state.selectedProducts = [];
        }),
        
        resetAll: () => set(() => ({ ...initialState }))
  })),
      {
        name: 'products-store',
        partialize: (state: unknown) => ({
          productsFilter: state.productsFilter,
          viewMode: state.viewMode,
          sortBy: state.sortBy,
          sortOrder: state.sortOrder,
          cache: state.cache,
          lastUpdated: state.lastUpdated
        })
  }
    ),
    {
      name: 'ProductsStore'
    }
  ));

// =========================================
// SELECTORS OTIMIZADOS
// =========================================

export const useProductsSelector = () => useProductsStore((state: unknown) => ({
  products: state.products,
  currentProduct: state.currentProduct,
  loading: state.loading,
  error: state.error
}));

export const useVariationsSelector = () => useProductsStore((state: unknown) => ({
  variations: state.variations,
  currentVariation: state.currentVariation
}));

export const useImagesSelector = () => useProductsStore((state: unknown) => ({
  images: state.images,
  currentImage: state.currentImage
}));

export const useReviewsSelector = () => useProductsStore((state: unknown) => ({
  reviews: state.reviews,
  currentReview: state.currentReview,
  reviewStats: state.reviewStats
}));

export const useAnalyticsSelector = () => useProductsStore((state: unknown) => ({
  analytics: state.analytics,
  metrics: state.metrics,
  performance: state.performance
}));

export const useBundlesSelector = () => useProductsStore((state: unknown) => ({
  bundles: state.bundles,
  currentBundle: state.currentBundle
}));

export const useInventorySelector = () => useProductsStore((state: unknown) => ({
  inventory: state.inventory,
  allInventory: state.allInventory,
  inventoryAlerts: state.inventoryAlerts,
  stockLevels: state.stockLevels
}));

export const useUISelector = () => useProductsStore((state: unknown) => ({
  loading: state.loading,
  error: state.error,
  selectedProducts: state.selectedProducts,
  viewMode: state.viewMode,
  sortBy: state.sortBy,
  sortOrder: state.sortOrder
}));
