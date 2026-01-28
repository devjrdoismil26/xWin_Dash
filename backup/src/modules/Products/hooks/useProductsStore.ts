// =========================================
// PRODUCTS STORE - ZUSTAND TIPADO
// =========================================
// Store global para o módulo Products
// Máximo: 300 linhas

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import {
  Product,
  ProductVariation,
  ProductImage,
  ProductReview,
  ProductAnalytics,
  ProductBundle,
  ProductInventory,
  ProductsFilter,
  ReviewStats,
  InventoryAlert,
  StockLevel
} from '../types';

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
  metrics: any;
  performance: any;
  
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
  lastUpdated: Record<string, number>;
}

interface ProductsActions {
  // Ações de produtos
  setProducts: (products: Product[]) => void;
  setCurrentProduct: (product: Product | null) => void;
  addProduct: (product: Product) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  removeProduct: (id: string) => void;
  setProductsFilter: (filter: ProductsFilter) => void;
  
  // Ações de variações
  setVariations: (variations: ProductVariation[]) => void;
  setCurrentVariation: (variation: ProductVariation | null) => void;
  addVariation: (variation: ProductVariation) => void;
  updateVariation: (id: string, updates: Partial<ProductVariation>) => void;
  removeVariation: (id: string) => void;
  
  // Ações de imagens
  setImages: (images: ProductImage[]) => void;
  setCurrentImage: (image: ProductImage | null) => void;
  addImage: (image: ProductImage) => void;
  updateImage: (id: string, updates: Partial<ProductImage>) => void;
  removeImage: (id: string) => void;
  
  // Ações de reviews
  setReviews: (reviews: ProductReview[]) => void;
  setCurrentReview: (review: ProductReview | null) => void;
  addReview: (review: ProductReview) => void;
  updateReview: (id: string, updates: Partial<ProductReview>) => void;
  removeReview: (id: string) => void;
  setReviewStats: (stats: ReviewStats | null) => void;
  
  // Ações de analytics
  setAnalytics: (analytics: ProductAnalytics | null) => void;
  setMetrics: (metrics: any) => void;
  setPerformance: (performance: any) => void;
  
  // Ações de bundles
  setBundles: (bundles: ProductBundle[]) => void;
  setCurrentBundle: (bundle: ProductBundle | null) => void;
  addBundle: (bundle: ProductBundle) => void;
  updateBundle: (id: string, updates: Partial<ProductBundle>) => void;
  removeBundle: (id: string) => void;
  
  // Ações de inventory
  setInventory: (inventory: ProductInventory | null) => void;
  setAllInventory: (inventory: ProductInventory[]) => void;
  updateInventory: (productId: string, updates: Partial<ProductInventory>) => void;
  setInventoryAlerts: (alerts: InventoryAlert[]) => void;
  addInventoryAlert: (alert: InventoryAlert) => void;
  updateInventoryAlert: (id: string, updates: Partial<InventoryAlert>) => void;
  removeInventoryAlert: (id: string) => void;
  setStockLevels: (levels: StockLevel[]) => void;
  
  // Ações de UI
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSelectedProducts: (ids: string[]) => void;
  toggleProductSelection: (id: string) => void;
  clearSelection: () => void;
  setViewMode: (mode: 'grid' | 'list') => void;
  setSortBy: (field: string) => void;
  setSortOrder: (order: 'asc' | 'desc') => void;
  
  // Ações de cache
  setCache: (key: string, value: any) => void;
  getCache: (key: string) => any;
  clearCache: (key?: string) => void;
  updateLastUpdated: (key: string) => void;
  
  // Ações de reset
  resetProducts: () => void;
  resetAll: () => void;
}

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
  lastUpdated: {}
};

// =========================================
// STORE PRINCIPAL
// =========================================

export const useProductsStore = create<ProductsState & ProductsActions>()(
  devtools(
    persist(
      immer((set, get) => ({
        ...initialState,
        
        // =========================================
        // AÇÕES DE PRODUTOS
        // =========================================
        
        setProducts: (products) => set((state) => {
          state.products = products;
          state.lastUpdated.products = Date.now();
        }),
        
        setCurrentProduct: (product) => set((state) => {
          state.currentProduct = product;
        }),
        
        addProduct: (product) => set((state) => {
          state.products.unshift(product);
          state.lastUpdated.products = Date.now();
        }),
        
        updateProduct: (id, updates) => set((state) => {
          const index = state.products.findIndex(p => p.id === id);
          if (index !== -1) {
            state.products[index] = { ...state.products[index], ...updates };
          }
          if (state.currentProduct?.id === id) {
            state.currentProduct = { ...state.currentProduct, ...updates };
          }
          state.lastUpdated.products = Date.now();
        }),
        
        removeProduct: (id) => set((state) => {
          state.products = state.products.filter(p => p.id !== id);
          if (state.currentProduct?.id === id) {
            state.currentProduct = null;
          }
          state.selectedProducts = state.selectedProducts.filter(pid => pid !== id);
          state.lastUpdated.products = Date.now();
        }),
        
        setProductsFilter: (filter) => set((state) => {
          state.productsFilter = filter;
        }),
        
        // =========================================
        // AÇÕES DE VARIAÇÕES
        // =========================================
        
        setVariations: (variations) => set((state) => {
          state.variations = variations;
          state.lastUpdated.variations = Date.now();
        }),
        
        setCurrentVariation: (variation) => set((state) => {
          state.currentVariation = variation;
        }),
        
        addVariation: (variation) => set((state) => {
          state.variations.unshift(variation);
          state.lastUpdated.variations = Date.now();
        }),
        
        updateVariation: (id, updates) => set((state) => {
          const index = state.variations.findIndex(v => v.id === id);
          if (index !== -1) {
            state.variations[index] = { ...state.variations[index], ...updates };
          }
          if (state.currentVariation?.id === id) {
            state.currentVariation = { ...state.currentVariation, ...updates };
          }
          state.lastUpdated.variations = Date.now();
        }),
        
        removeVariation: (id) => set((state) => {
          state.variations = state.variations.filter(v => v.id !== id);
          if (state.currentVariation?.id === id) {
            state.currentVariation = null;
          }
          state.lastUpdated.variations = Date.now();
        }),
        
        // =========================================
        // AÇÕES DE IMAGENS
        // =========================================
        
        setImages: (images) => set((state) => {
          state.images = images;
          state.lastUpdated.images = Date.now();
        }),
        
        setCurrentImage: (image) => set((state) => {
          state.currentImage = image;
        }),
        
        addImage: (image) => set((state) => {
          state.images.unshift(image);
          state.lastUpdated.images = Date.now();
        }),
        
        updateImage: (id, updates) => set((state) => {
          const index = state.images.findIndex(img => img.id === id);
          if (index !== -1) {
            state.images[index] = { ...state.images[index], ...updates };
          }
          if (state.currentImage?.id === id) {
            state.currentImage = { ...state.currentImage, ...updates };
          }
          state.lastUpdated.images = Date.now();
        }),
        
        removeImage: (id) => set((state) => {
          state.images = state.images.filter(img => img.id !== id);
          if (state.currentImage?.id === id) {
            state.currentImage = null;
          }
          state.lastUpdated.images = Date.now();
        }),
        
        // =========================================
        // AÇÕES DE REVIEWS
        // =========================================
        
        setReviews: (reviews) => set((state) => {
          state.reviews = reviews;
          state.lastUpdated.reviews = Date.now();
        }),
        
        setCurrentReview: (review) => set((state) => {
          state.currentReview = review;
        }),
        
        addReview: (review) => set((state) => {
          state.reviews.unshift(review);
          state.lastUpdated.reviews = Date.now();
        }),
        
        updateReview: (id, updates) => set((state) => {
          const index = state.reviews.findIndex(r => r.id === id);
          if (index !== -1) {
            state.reviews[index] = { ...state.reviews[index], ...updates };
          }
          if (state.currentReview?.id === id) {
            state.currentReview = { ...state.currentReview, ...updates };
          }
          state.lastUpdated.reviews = Date.now();
        }),
        
        removeReview: (id) => set((state) => {
          state.reviews = state.reviews.filter(r => r.id !== id);
          if (state.currentReview?.id === id) {
            state.currentReview = null;
          }
          state.lastUpdated.reviews = Date.now();
        }),
        
        setReviewStats: (stats) => set((state) => {
          state.reviewStats = stats;
        }),
        
        // =========================================
        // AÇÕES DE ANALYTICS
        // =========================================
        
        setAnalytics: (analytics) => set((state) => {
          state.analytics = analytics;
        }),
        
        setMetrics: (metrics) => set((state) => {
          state.metrics = metrics;
        }),
        
        setPerformance: (performance) => set((state) => {
          state.performance = performance;
        }),
        
        // =========================================
        // AÇÕES DE BUNDLES
        // =========================================
        
        setBundles: (bundles) => set((state) => {
          state.bundles = bundles;
          state.lastUpdated.bundles = Date.now();
        }),
        
        setCurrentBundle: (bundle) => set((state) => {
          state.currentBundle = bundle;
        }),
        
        addBundle: (bundle) => set((state) => {
          state.bundles.unshift(bundle);
          state.lastUpdated.bundles = Date.now();
        }),
        
        updateBundle: (id, updates) => set((state) => {
          const index = state.bundles.findIndex(b => b.id === id);
          if (index !== -1) {
            state.bundles[index] = { ...state.bundles[index], ...updates };
          }
          if (state.currentBundle?.id === id) {
            state.currentBundle = { ...state.currentBundle, ...updates };
          }
          state.lastUpdated.bundles = Date.now();
        }),
        
        removeBundle: (id) => set((state) => {
          state.bundles = state.bundles.filter(b => b.id !== id);
          if (state.currentBundle?.id === id) {
            state.currentBundle = null;
          }
          state.lastUpdated.bundles = Date.now();
        }),
        
        // =========================================
        // AÇÕES DE INVENTORY
        // =========================================
        
        setInventory: (inventory) => set((state) => {
          state.inventory = inventory;
        }),
        
        setAllInventory: (inventory) => set((state) => {
          state.allInventory = inventory;
          state.lastUpdated.inventory = Date.now();
        }),
        
        updateInventory: (productId, updates) => set((state) => {
          const index = state.allInventory.findIndex(inv => inv.product_id === productId);
          if (index !== -1) {
            state.allInventory[index] = { ...state.allInventory[index], ...updates };
          }
          if (state.inventory?.product_id === productId) {
            state.inventory = { ...state.inventory, ...updates };
          }
          state.lastUpdated.inventory = Date.now();
        }),
        
        setInventoryAlerts: (alerts) => set((state) => {
          state.inventoryAlerts = alerts;
        }),
        
        addInventoryAlert: (alert) => set((state) => {
          state.inventoryAlerts.unshift(alert);
        }),
        
        updateInventoryAlert: (id, updates) => set((state) => {
          const index = state.inventoryAlerts.findIndex(a => a.id === id);
          if (index !== -1) {
            state.inventoryAlerts[index] = { ...state.inventoryAlerts[index], ...updates };
          }
        }),
        
        removeInventoryAlert: (id) => set((state) => {
          state.inventoryAlerts = state.inventoryAlerts.filter(a => a.id !== id);
        }),
        
        setStockLevels: (levels) => set((state) => {
          state.stockLevels = levels;
        }),
        
        // =========================================
        // AÇÕES DE UI
        // =========================================
        
        setLoading: (loading) => set((state) => {
          state.loading = loading;
        }),
        
        setError: (error) => set((state) => {
          state.error = error;
        }),
        
        setSelectedProducts: (ids) => set((state) => {
          state.selectedProducts = ids;
        }),
        
        toggleProductSelection: (id) => set((state) => {
          const index = state.selectedProducts.indexOf(id);
          if (index === -1) {
            state.selectedProducts.push(id);
          } else {
            state.selectedProducts.splice(index, 1);
          }
        }),
        
        clearSelection: () => set((state) => {
          state.selectedProducts = [];
        }),
        
        setViewMode: (mode) => set((state) => {
          state.viewMode = mode;
        }),
        
        setSortBy: (field) => set((state) => {
          state.sortBy = field;
        }),
        
        setSortOrder: (order) => set((state) => {
          state.sortOrder = order;
        }),
        
        // =========================================
        // AÇÕES DE CACHE
        // =========================================
        
        setCache: (key, value) => set((state) => {
          state.cache[key] = value;
          state.lastUpdated[key] = Date.now();
        }),
        
        getCache: (key) => {
          const state = get();
          return state.cache[key];
        },
        
        clearCache: (key) => set((state) => {
          if (key) {
            delete state.cache[key];
            delete state.lastUpdated[key];
          } else {
            state.cache = {};
            state.lastUpdated = {};
          }
        }),
        
        updateLastUpdated: (key) => set((state) => {
          state.lastUpdated[key] = Date.now();
        }),
        
        // =========================================
        // AÇÕES DE RESET
        // =========================================
        
        resetProducts: () => set((state) => {
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
        partialize: (state) => ({
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
  )
);

// =========================================
// SELECTORS OTIMIZADOS
// =========================================

export const useProductsSelector = () => useProductsStore((state) => ({
  products: state.products,
  currentProduct: state.currentProduct,
  loading: state.loading,
  error: state.error
}));

export const useVariationsSelector = () => useProductsStore((state) => ({
  variations: state.variations,
  currentVariation: state.currentVariation
}));

export const useImagesSelector = () => useProductsStore((state) => ({
  images: state.images,
  currentImage: state.currentImage
}));

export const useReviewsSelector = () => useProductsStore((state) => ({
  reviews: state.reviews,
  currentReview: state.currentReview,
  reviewStats: state.reviewStats
}));

export const useAnalyticsSelector = () => useProductsStore((state) => ({
  analytics: state.analytics,
  metrics: state.metrics,
  performance: state.performance
}));

export const useBundlesSelector = () => useProductsStore((state) => ({
  bundles: state.bundles,
  currentBundle: state.currentBundle
}));

export const useInventorySelector = () => useProductsStore((state) => ({
  inventory: state.inventory,
  allInventory: state.allInventory,
  inventoryAlerts: state.inventoryAlerts,
  stockLevels: state.stockLevels
}));

export const useUISelector = () => useProductsStore((state) => ({
  loading: state.loading,
  error: state.error,
  selectedProducts: state.selectedProducts,
  viewMode: state.viewMode,
  sortBy: state.sortBy,
  sortOrder: state.sortOrder
}));
