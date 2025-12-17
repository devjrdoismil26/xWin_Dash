// =========================================
// PRODUCTS MODULE - COMPONENTE PRINCIPAL
// =========================================
// Componente principal do módulo Products
// Máximo: 100 linhas

import React, { Suspense } from 'react';
import { useProducts } from '../hooks/useProducts';
import { useProductsOptimization } from '../hooks/useProductsOptimization';
import { ProductsHeader, ProductsStats, ProductsFilters, ProductsContent, ProductsActions, LazyWrapper, LazyLoading, preloadProductsForm, preloadVariationsManager, preloadImagesManager, preloadReviewsManager, preloadAnalyticsDashboard } from './index';
import ErrorState from '@/shared/components/ui/ErrorState';
import { PageTransition } from '@/shared/components/ui/AdvancedAnimations';

interface ProductsModuleProps {
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

export const ProductsModule: React.FC<ProductsModuleProps> = ({ className = ''    }) => {
  const {
    loading,
    error,
    products,
    loadProducts,
    clearError
  } = useProducts();

  const { useOptimizedCallback } = useProductsOptimization();

  // =========================================
  // CALLBACKS OTIMIZADOS
  // =========================================

  const handleLoadProducts = useOptimizedCallback(
    async (filters?: string) => {
      await loadProducts(filters);

    },
    [loadProducts],
    'loadProducts');

  const handleClearError = useOptimizedCallback(
    () => {
      clearError();

    },
    [clearError],
    'clearError');

  // =========================================
  // EFEITOS
  // =========================================

  React.useEffect(() => {
    handleLoadProducts();

  }, [handleLoadProducts]);

  // =========================================
  // RENDER
  // =========================================

  if (error) {
    return (
        <>
      <PageTransition />
      <div className={`products-module ${className} `}>
           
        </div><ErrorState
            title="Erro ao carregar produtos"
            message={ error }
            onRetry={ handleLoadProducts }
            onDismiss={ handleClearError }
          / /></div></PageTransition>);

  }

  return (
        <>
      <PageTransition />
      <div className={`products-module ${className} `}>
           
        </div>{/* Header */}
        <ProductsHeader>
          {/* Stats */}
        <LazyWrapper fallback={ <LazyLoading message="Carregando estatísticas..." />  }>
          <ProductsStats / />
        </LazyWrapper>

        {/* Filters */}
        <ProductsFilters onFiltersChange={ handleLoadProducts  }>
          {/* Actions */}
        <ProductsActions>
          {/* Content */}
        <LazyWrapper fallback={ <LazyLoading message="Carregando produtos..." />  }>
          <ProductsContent
            products={ products }
            loading={ loading }
            onRefresh={ handleLoadProducts }
          / /></LazyWrapper></div>
    </PageTransition>);};

export default ProductsModule;
