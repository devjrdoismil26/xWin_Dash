// =========================================
// EXPORTS - HOOKS DO MÓDULO PRODUCTS
// =========================================

// Hook orquestrador principal
export { useProducts } from './useProducts';

// Store global
export { useProductsStore } from './useProductsStore';
export { useProductsSelector, useVariationsSelector, useImagesSelector, useReviewsSelector, useAnalyticsSelector, useBundlesSelector, useInventorySelector, useUISelector } from './useProductsStore';

// Hook de otimizações
export { useProductsOptimization } from './useProductsOptimization';

// Hooks especializados
export { useProductsCore } from '../ProductsCore/hooks/useProductsCore';
export { useProductVariations } from '../ProductsVariations/hooks/useProductVariations';
export { useProductImages } from '../ProductsImages/hooks/useProductImages';
export { useProductReviews } from '../ProductsReviews/hooks/useProductReviews';
export { useProductAnalytics } from '../ProductsAnalytics/hooks/useProductAnalytics';
export { useProductBundles } from '../ProductsBundles/hooks/useProductBundles';
export { useProductInventory } from '../ProductsInventory/hooks/useProductInventory';
