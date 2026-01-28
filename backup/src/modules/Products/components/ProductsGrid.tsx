// =========================================
// PRODUCTS GRID - GRADE DE PRODUTOS
// =========================================
// Componente de grade para visualização de produtos
// Máximo: 200 linhas

import React from 'react';
import { ProductsCard } from './ProductsCard';
import { ResponsiveGrid } from '@/components/ui/ResponsiveSystem';
import { LoadingSpinner } from '@/components/ui/LoadingStates';

interface ProductsGridProps {
  products: any[];
  selectedProducts?: string[];
  onProductSelect?: (productId: string) => void;
  loading?: boolean;
  className?: string;
}

export const ProductsGrid: React.FC<ProductsGridProps> = ({
  products,
  selectedProducts = [],
  onProductSelect,
  loading = false,
  className = ''
}) => {
  // =========================================
  // RENDERIZAÇÃO DE LOADING
  // =========================================

  if (loading) {
    return (
      <div className={`products-grid ${className}`}>
        <ResponsiveGrid
          columns={{ sm: 1, md: 2, lg: 3, xl: 4 }}
          gap={6}
        >
          {[...Array(8)].map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="bg-gray-200 rounded-lg h-64 mb-4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              </div>
            </div>
          ))}
        </ResponsiveGrid>
      </div>
    );
  }

  // =========================================
  // RENDERIZAÇÃO PRINCIPAL
  // =========================================

  return (
    <div className={`products-grid ${className}`}>
      <ResponsiveGrid
        columns={{ sm: 1, md: 2, lg: 3, xl: 4 }}
        gap={6}
      >
        {products.map((product) => (
          <ProductsCard
            key={product.id}
            product={product}
            selected={selectedProducts.includes(product.id)}
            onSelect={() => onProductSelect?.(product.id)}
            loading={loading}
          />
        ))}
      </ResponsiveGrid>
    </div>
  );
};

export default ProductsGrid;
