// =========================================
// PRODUCTS LIST - LISTA DE PRODUTOS
// =========================================
// Componente de lista para visualização de produtos
// Máximo: 200 linhas

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { 
  Eye,
  Pencil,
  Trash2,
  ShoppingBag,
  DollarSign,
  BarChart3,
  ShoppingBag,
  DollarSign,
  BarChart3,
  Eye,
  Pencil,
  TrashIcon
} from 'lucide-react';

interface ProductsListProps {
  products: any[];
  selectedProducts?: string[];
  onProductSelect?: (productId: string) => void;
  loading?: boolean;
  className?: string;
}

export const ProductsList: React.FC<ProductsListProps> = ({
  products,
  selectedProducts = [],
  onProductSelect,
  loading = false,
  className = ''
}) => {
  // =========================================
  // FORMATADORES
  // =========================================

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (date: string): string => {
    return new Date(date).toLocaleDateString('pt-BR');
  };

  // =========================================
  // HANDLERS
  // =========================================

  const handleView = (productId: string) => {
    window.location.href = `/products/${productId}`;
  };

  const handleEdit = (productId: string) => {
    window.location.href = `/products/${productId}/edit`;
  };

  const handleDelete = (productId: string) => {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
      // Implementar exclusão
      console.log('Excluir produto:', productId);
    }
  };

  // =========================================
  // RENDERIZAÇÃO DE LOADING
  // =========================================

  if (loading) {
    return (
      <div className={`products-list ${className}`}>
        <div className="space-y-4">
          {[...Array(5)].map((_, index) => (
            <Card key={index} className="p-6">
              <div className="animate-pulse">
                <div className="flex items-center space-x-4">
                  <div className="bg-gray-200 rounded-lg h-16 w-16"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // =========================================
  // RENDERIZAÇÃO PRINCIPAL
  // =========================================

  return (
    <div className={`products-list ${className}`}>
      <div className="space-y-4">
        {products.map((product) => (
          <Card key={product.id} className="p-6">
            <div className="flex items-center space-x-4">
              {/* Checkbox de seleção */}
              <input
                type="checkbox"
                checked={selectedProducts.includes(product.id)}
                onChange={() => onProductSelect?.(product.id)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />

              {/* Imagem do produto */}
              <div className="flex-shrink-0">
                {product.images && product.images.length > 0 ? (
                  <img
                    src={product.images[0].url}
                    alt={product.name}
                    className="h-16 w-16 rounded-lg object-cover"
                  />
                ) : (
                  <div className="h-16 w-16 rounded-lg bg-gray-200 flex items-center justify-center">
                    <ShoppingBag className="h-8 w-8 text-gray-400" />
                  </div>
                )}
              </div>

              {/* Informações do produto */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <h3 className="text-lg font-medium text-gray-900 truncate">
                    {product.name}
                  </h3>
                  <Badge 
                    variant={product.status === 'active' ? 'success' : 'secondary'}
                    className="text-xs"
                  >
                    {product.status}
                  </Badge>
                </div>
                
                <p className="text-sm text-gray-600 truncate">
                  {product.description}
                </p>
                
                <div className="flex items-center space-x-4 mt-2">
                  <div className="flex items-center space-x-1 text-sm text-gray-500">
                    <DollarSign className="h-4 w-4" />
                    <span>{formatCurrency(product.price)}</span>
                  </div>
                  
                  <div className="flex items-center space-x-1 text-sm text-gray-500">
                    <BarChart3 className="h-4 w-4" />
                    <span>Estoque: {product.inventory?.quantity || 0}</span>
                  </div>
                  
                  <span className="text-sm text-gray-500">
                    SKU: {product.sku}
                  </span>
                </div>
              </div>

              {/* Ações */}
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleView(product.id)}
                  className="flex items-center space-x-1"
                >
                  <Eye className="h-4 w-4" />
                  <span>Ver</span>
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(product.id)}
                  className="flex items-center space-x-1"
                >
                  <Pencil className="h-4 w-4" />
                  <span>Editar</span>
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(product.id)}
                  className="flex items-center space-x-1 text-red-600 hover:text-red-700"
                >
                  <TrashIcon className="h-4 w-4" />
                  <span>Excluir</span>
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ProductsList;
