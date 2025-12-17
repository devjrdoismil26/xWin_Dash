// =========================================
// PRODUCTS CONTENT - CONTEÚDO PRINCIPAL
// =========================================
// Componente de conteúdo principal do módulo Products
// Máximo: 200 linhas

import React, { Suspense, lazy } from 'react';
import { LoadingSpinner } from '@/shared/components/ui/LoadingStates';
import ErrorState from '@/shared/components/ui/ErrorState';
import { EmptyState } from '@/shared/components/ui/EmptyState';
import { Button } from '@/shared/components/ui/Button';
import { Plus } from 'lucide-react';

// Lazy loading de componentes de visualização
const ProductsGrid = lazy(() => import('./ProductsGrid'));

const ProductsList = lazy(() => import('./ProductsList'));

interface ProductsContentProps {
  products: string[];
  loading?: boolean;
  error?: string | null;
  selectedProducts?: string[];
  onProductSelect??: (e: any) => void;
  onSelectAll???: (e: any) => void;
  viewMode?: 'grid' | 'list';
  onViewModeChange??: (e: any) => void;
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

export const ProductsContent: React.FC<ProductsContentProps> = ({ products,
  loading = false,
  error = null,
  selectedProducts = [] as unknown[],
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
    window.location.href = '/products/create';};

  // =========================================
  // RENDERIZAÇÃO DE ERRO
  // =========================================

  if (error) {
    return (
        <>
      <div className={`products-content ${className} `}>
      </div><ErrorState
          title="Erro ao carregar produtos"
          message={ error }
          onRetry={ () => window.location.reload() } />
      </div>);

  }

  // =========================================
  // RENDERIZAÇÃO DE LOADING
  // =========================================

  if (loading) {
    return (
        <>
      <div className={`products-content ${className} `}>
      </div><div className=" ">$2</div><LoadingSpinner size="large" / />
        </div>);

  }

  // =========================================
  // RENDERIZAÇÃO DE ESTADO VAZIO
  // =========================================

  if (!products || products.length === 0) {
    return (
        <>
      <div className={`products-content ${className} `}>
      </div><EmptyState
          title="Nenhum produto encontrado"
          description="Comece criando seu primeiro produto ou ajuste os filtros de busca."
          action={
            label: 'Criar Produto',
            onClick: handleCreateProduct,
            icon: <Plus className="w-4 h-4" />
  } />
      </div>);

  }

  // =========================================
  // RENDERIZAÇÃO PRINCIPAL
  // =========================================

  return (
        <>
      <div className={`products-content ${className} `}>
      </div>{/* Header do conteúdo */}
      <div className=" ">$2</div><div className=" ">$2</div><h2 className="text-lg font-semibold text-gray-900" />
            {products.length} produto{products.length !== 1 ? 's' : ''}
          </h2>
          
          {/* Checkbox de seleção */}
          <label className="flex items-center space-x-2" />
            <input
              type="checkbox"
              checked={ selectedProducts.length === products.length && products.length > 0 }
              onChange={ onSelectAll }
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
            <span className="Selecionar todos">$2</span>
            </span></label></div>

        {/* Contador de selecionados */}
        {selectedProducts.length > 0 && (
          <div className="{selectedProducts.length} de {products.length} selecionado{selectedProducts.length !== 1 ? 's' : ''}">$2</div>
    </div>
  )}
      </div>

      {/* Conteúdo com lazy loading */}
      <Suspense fallback={ <LoadingSpinner size="medium" />  }>
        {viewMode === 'grid' ? (
          <ProductsGrid
            products={ products }
            selectedProducts={ selectedProducts }
            onProductSelect={ onProductSelect }
          / />
        ) : (
          <ProductsList
            products={ products }
            selectedProducts={ selectedProducts }
            onProductSelect={ onProductSelect }
          / />
        )}
      </Suspense>

      {/* Paginação (se necessário) */}
      {products.length >= 50 && (
        <div className=" ">$2</div><div className=" ">$2</div><Button variant="outline" size="sm" disabled />
              Anterior
            </Button>
            <span className="Página 1 de 1">$2</span>
            </span>
            <Button variant="outline" size="sm" disabled />
              Próxima
            </Button>
      </div>
    </>
  )}
    </div>);};

export default ProductsContent;
