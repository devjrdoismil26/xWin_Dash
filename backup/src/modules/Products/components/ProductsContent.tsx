// =========================================
// PRODUCTS CONTENT - CONTEÚDO PRINCIPAL
// =========================================
// Componente de conteúdo principal do módulo Products
// Máximo: 200 linhas

import React, { Suspense, lazy } from 'react';
import { LoadingSpinner } from '@/components/ui/LoadingStates';
import { ErrorState } from '@/components/ui/ErrorState';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { Plus } from 'lucide-react';

// Lazy loading de componentes de visualização
const ProductsGrid = lazy(() => import('./ProductsGrid'));
const ProductsList = lazy(() => import('./ProductsList'));

interface ProductsContentProps {
  products: any[];
  loading?: boolean;
  error?: string | null;
  selectedProducts?: string[];
  onProductSelect?: (productId: string) => void;
  onSelectAll?: () => void;
  viewMode?: 'grid' | 'list';
  onViewModeChange?: (mode: 'grid' | 'list') => void;
  className?: string;
}

export const ProductsContent: React.FC<ProductsContentProps> = ({
  products,
  loading = false,
  error = null,
  selectedProducts = [],
  onProductSelect,
  onSelectAll,
  viewMode = 'grid',
  onViewModeChange,
  className = ''
}) => {
  // =========================================
  // HANDLERS
  // =========================================

  const handleCreateProduct = () => {
    window.location.href = '/products/create';
  };

  // =========================================
  // RENDERIZAÇÃO DE ERRO
  // =========================================

  if (error) {
    return (
      <div className={`products-content ${className}`}>
        <ErrorState
          title="Erro ao carregar produtos"
          message={error}
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

  // =========================================
  // RENDERIZAÇÃO DE LOADING
  // =========================================

  if (loading) {
    return (
      <div className={`products-content ${className}`}>
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner size="large" />
        </div>
      </div>
    );
  }

  // =========================================
  // RENDERIZAÇÃO DE ESTADO VAZIO
  // =========================================

  if (!products || products.length === 0) {
    return (
      <div className={`products-content ${className}`}>
        <EmptyState
          title="Nenhum produto encontrado"
          description="Comece criando seu primeiro produto ou ajuste os filtros de busca."
          action={{
            label: 'Criar Produto',
            onClick: handleCreateProduct,
            icon: <Plus className="w-4 h-4" />
          }}
        />
      </div>
    );
  }

  // =========================================
  // RENDERIZAÇÃO PRINCIPAL
  // =========================================

  return (
    <div className={`products-content ${className}`}>
      {/* Header do conteúdo */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <h2 className="text-lg font-semibold text-gray-900">
            {products.length} produto{products.length !== 1 ? 's' : ''}
          </h2>
          
          {/* Checkbox de seleção */}
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={selectedProducts.length === products.length && products.length > 0}
              onChange={onSelectAll}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-600">
              Selecionar todos
            </span>
          </label>
        </div>

        {/* Contador de selecionados */}
        {selectedProducts.length > 0 && (
          <div className="text-sm text-gray-600">
            {selectedProducts.length} de {products.length} selecionado{selectedProducts.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>

      {/* Conteúdo com lazy loading */}
      <Suspense fallback={<LoadingSpinner size="medium" />}>
        {viewMode === 'grid' ? (
          <ProductsGrid
            products={products}
            selectedProducts={selectedProducts}
            onProductSelect={onProductSelect}
          />
        ) : (
          <ProductsList
            products={products}
            selectedProducts={selectedProducts}
            onProductSelect={onProductSelect}
          />
        )}
      </Suspense>

      {/* Paginação (se necessário) */}
      {products.length >= 50 && (
        <div className="mt-8 flex items-center justify-center">
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" disabled>
              Anterior
            </Button>
            <span className="text-sm text-gray-600">
              Página 1 de 1
            </span>
            <Button variant="outline" size="sm" disabled>
              Próxima
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsContent;
