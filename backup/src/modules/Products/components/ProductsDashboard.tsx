// =========================================
// PRODUCTS DASHBOARD - DASHBOARD PRINCIPAL
// =========================================
// Dashboard principal do módulo Products
// Máximo: 200 linhas

import React, { useEffect, useState } from 'react';
import { useProducts } from '../hooks/useProducts';
import { ProductsHeader } from './ProductsHeader';
import { ProductsStats } from './ProductsStats';
import { ProductsFilters } from './ProductsFilters';
import { ProductsContent } from './ProductsContent';
import { ProductsActions } from './ProductsActions';
import { Card } from '@/components/ui/Card';
import { LoadingSpinner } from '@/components/ui/LoadingStates';
import { ErrorState } from '@/components/ui/ErrorState';

interface ProductsDashboardProps {
  className?: string;
}

export const ProductsDashboard: React.FC<ProductsDashboardProps> = ({
  className = ''
}) => {
  const {
    products,
    loading,
    error,
    loadProducts,
    clearError,
    optimization
  } = useProducts();

  const [filters, setFilters] = useState<any>({});
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // =========================================
  // EFEITOS
  // =========================================

  useEffect(() => {
    loadProducts(filters);
  }, [filters, loadProducts]);

  // =========================================
  // HANDLERS
  // =========================================

  const handleFiltersChange = (newFilters: any) => {
    setFilters(newFilters);
  };

  const handleProductSelect = (productId: string) => {
    setSelectedProducts(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleSelectAll = () => {
    if (selectedProducts.length === products.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(products.map(p => p.id));
    }
  };

  const handleBulkAction = async (action: string) => {
    if (selectedProducts.length === 0) return;

    try {
      switch (action) {
        case 'delete':
          // Implementar delete em lote
          break;
        case 'activate':
          // Implementar ativação em lote
          break;
        case 'deactivate':
          // Implementar desativação em lote
          break;
        default:
          break;
      }
    } catch (error) {
      console.error('Erro na ação em lote:', error);
    }
  };

  // =========================================
  // RENDERIZAÇÃO DE ERRO
  // =========================================

  if (error) {
    return (
      <div className={`products-dashboard ${className}`}>
        <ErrorState
          title="Erro ao carregar dashboard"
          message={error}
          onRetry={clearError}
        />
      </div>
    );
  }

  // =========================================
  // RENDERIZAÇÃO PRINCIPAL
  // =========================================

  return (
    <div className={`products-dashboard ${className}`}>
      {/* Header */}
      <ProductsHeader
        title="Produtos"
        subtitle="Gerencie seus produtos e inventário"
        onViewModeChange={setViewMode}
        viewMode={viewMode}
      />

      {/* Estatísticas */}
      <ProductsStats
        products={products}
        loading={loading}
        className="mb-6"
      />

      {/* Filtros */}
      <Card className="mb-6">
        <ProductsFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
          loading={loading}
        />
      </Card>

      {/* Ações em lote */}
      {selectedProducts.length > 0 && (
        <ProductsActions
          selectedCount={selectedProducts.length}
          onBulkAction={handleBulkAction}
          loading={loading}
          className="mb-4"
        />
      )}

      {/* Conteúdo principal */}
      <Card>
        <ProductsContent
          products={products}
          loading={loading}
          error={error}
          selectedProducts={selectedProducts}
          onProductSelect={handleProductSelect}
          onSelectAll={handleSelectAll}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />
      </Card>

      {/* Métricas de performance (apenas em desenvolvimento) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-4 p-4 bg-gray-100 rounded-lg">
          <h3 className="text-sm font-medium text-gray-700 mb-2">
            Métricas de Performance
          </h3>
          <div className="text-xs text-gray-600">
            <p>Cache Hit Rate: {optimization.metrics.cacheHitRate}%</p>
            <p>Average Response Time: {optimization.metrics.averageResponseTime}ms</p>
            <p>Network Requests: {optimization.metrics.networkRequests}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsDashboard;
