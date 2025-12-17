// =========================================
// PRODUCTS GRID - GRADE DE PRODUTOS
// =========================================
// Componente de grade para visualização de produtos
// Máximo: 200 linhas

import React from 'react';
import { ProductsCard } from './ProductsCard';
import { ResponsiveGrid } from '@/shared/components/ui/ResponsiveSystem';
import { LoadingSpinner } from '@/shared/components/ui/LoadingStates';

interface ProductsGridProps {
  products: string[];
  selectedProducts?: string[];
  onProductSelect??: (e: any) => void;
  loading?: boolean;
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

export const ProductsGrid: React.FC<ProductsGridProps> = ({ products,
  selectedProducts = [] as unknown[],
  onProductSelect,
  loading = false,
  className = ''
   }) => {
  // =========================================
  // RENDERIZAÇÃO DE LOADING
  // =========================================

  if (loading) {
    return (
        <>
      <div className={`products-grid ${className} `}>
      </div><ResponsiveGrid
          columns={ sm: 1, md: 2, lg: 3, xl: 4 } gap={ 6 } />
          {[...Array(8)].map((_: unknown, index: unknown) => (
            <div key={index} className="animate-pulse">
           
        </div><div className=" ">$2</div><div className=" ">$2</div><div className=" ">$2</div><div className=" ">$2</div><div className="h-4 bg-gray-200 rounded w-1/4">
           
        </div></div>
          ))}
        </ResponsiveGrid>
      </div>);

  }

  // =========================================
  // RENDERIZAÇÃO PRINCIPAL
  // =========================================

  return (
        <>
      <div className={`products-grid ${className} `}>
      </div><ResponsiveGrid
        columns={ sm: 1, md: 2, lg: 3, xl: 4 } gap={ 6 } />
        {(products || []).map((product: unknown) => (
          <ProductsCard
            key={ product.id }
            product={ product }
            selected={ selectedProducts.includes(product.id) }
            onSelect={ () => onProductSelect?.(product.id) }
            loading={ loading } />
        ))}
      </ResponsiveGrid>
    </div>);};

export default ProductsGrid;
