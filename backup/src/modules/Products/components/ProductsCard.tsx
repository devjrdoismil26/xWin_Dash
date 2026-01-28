// =========================================
// PRODUCTS CARD - CARD DE PRODUTO
// =========================================
// Componente para exibir um produto em formato de card
// Máximo: 150 linhas

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

interface ProductsCardProps {
  product: any;
  selected?: boolean;
  onSelect?: (productId: string) => void;
  onEdit?: (product: any) => void;
  onDelete?: (product: any) => void;
  onView?: (product: any) => void;
  className?: string;
}

export const ProductsCard: React.FC<ProductsCardProps> = ({
  product,
  selected = false,
  onSelect,
  onEdit,
  onDelete,
  onView,
  className = ''
}) => {
  // =========================================
  // HANDLERS
  // =========================================

  const handleCardClick = () => {
    onView?.(product);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit?.(product);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.(product);
  };

  const handleSelectClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect?.(product.id);
  };

  // =========================================
  // UTILITÁRIOS
  // =========================================

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'pending': return 'warning';
      case 'inactive': return 'danger';
      default: return 'info';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Ativo';
      case 'pending': return 'Pendente';
      case 'inactive': return 'Inativo';
      default: return 'Rascunho';
    }
  };

  const formatPrice = (price: number, currency: string = 'BRL') => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: currency
    }).format(price);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR');
  };

  // =========================================
  // RENDER
  // =========================================

  return (
    <Card
      className={`products-card relative overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-lg ${
        selected ? 'ring-2 ring-blue-500' : ''
      } ${className}`}
      onClick={handleCardClick}
    >
      {/* Checkbox de seleção */}
      {onSelect && (
        <div className="absolute top-3 left-3 z-10">
          <input
            type="checkbox"
            checked={selected}
            onChange={handleSelectClick}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
        </div>
      )}

      {/* Imagem do produto */}
      <div className="aspect-w-16 aspect-h-12 bg-gray-200">
        {product.images && product.images.length > 0 ? (
          <img
            className="w-full h-48 object-cover"
            src={product.images[0].url}
            alt={product.name}
          />
        ) : (
          <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
            <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
      </div>

      {/* Conteúdo do card */}
      <div className="p-4">
        {/* Status e ações */}
        <div className="flex items-center justify-between mb-2">
          <Badge
            variant={getStatusVariant(product.status)}
            size="sm"
          >
            {getStatusLabel(product.status)}
          </Badge>
          
          <div className="flex items-center space-x-1">
            {onEdit && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleEditClick}
                className="p-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </Button>
            )}
            {onDelete && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDeleteClick}
                className="p-1 text-red-600 hover:text-red-700"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </Button>
            )}
          </div>
        </div>

        {/* Nome do produto */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {product.name}
        </h3>

        {/* Descrição */}
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {product.description}
        </p>

        {/* SKU */}
        {product.sku && (
          <p className="text-xs text-gray-500 mb-2">
            SKU: {product.sku}
          </p>
        )}

        {/* Preço e estoque */}
        <div className="flex items-center justify-between mb-3">
          <div className="text-lg font-bold text-gray-900">
            {formatPrice(product.price || 0, product.currency)}
          </div>
          <div className="text-sm text-gray-600">
            Estoque: {product.inventory?.quantity || 0}
          </div>
        </div>

        {/* Categoria */}
        {product.category && (
          <div className="mb-3">
            <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
              {product.category}
            </span>
          </div>
        )}

        {/* Tags */}
        {product.tags && product.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {product.tags.slice(0, 3).map((tag: string, index: number) => (
              <span
                key={index}
                className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
              >
                {tag}
              </span>
            ))}
            {product.tags.length > 3 && (
              <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                +{product.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Ações */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-200">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCardClick}
          >
            Ver detalhes
          </Button>
          
          <div className="text-xs text-gray-500">
            {formatDate(product.created_at)}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ProductsCard;
