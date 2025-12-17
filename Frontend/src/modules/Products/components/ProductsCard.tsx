// =========================================
// PRODUCTS CARD - CARD DE PRODUTO
// =========================================
// Componente para exibir um produto em formato de card
// Máximo: 150 linhas

import React from 'react';
import { Card } from '@/shared/components/ui/Card';
import { Button } from '@/shared/components/ui/Button';
import { Badge } from '@/shared/components/ui/Badge';

interface ProductsCardProps {
  product: unknown;
  selected?: boolean;
  onSelect??: (e: any) => void;
  onEdit??: (e: any) => void;
  onDelete??: (e: any) => void;
  onView??: (e: any) => void;
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

export const ProductsCard: React.FC<ProductsCardProps> = ({ product,
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
    onView?.(product);};

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    onEdit?.(product);};

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    onDelete?.(product);};

  const handleSelectClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    onSelect?.(product.id);};

  // =========================================
  // UTILITÁRIOS
  // =========================================

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'pending': return 'warning';
      case 'inactive': return 'danger';
      default: return 'info';
    } ;

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Ativo';
      case 'pending': return 'Pendente';
      case 'inactive': return 'Inativo';
      default: return 'Rascunho';
    } ;

  const formatPrice = (price: number, currency: string = 'BRL') => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: currency
    }).format(price);};

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR');};

  // =========================================
  // RENDER
  // =========================================

  return (
            <Card
      className={`products-card relative overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-lg ${
        selected ? 'ring-2 ring-blue-500' : ''
      } ${className}`}
      onClick={ handleCardClick } />
      {/* Checkbox de seleção */}
      {onSelect && (
        <div className=" ">$2</div><input
            type="checkbox"
            checked={ selected }
            onChange={ handleSelectClick }
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          / />
        </div>
      )}

      {/* Imagem do produto */}
      <div className="{product.images && product.images.length > 0 ? (">$2</div>
      <img
            className="w-full h-48 object-cover"
            src={ product.images[0].url }
            alt={ product.name }
          / />
    </>
  ) : (
          <div className=" ">$2</div><svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" / /></svg></div>
        )}
      </div>

      {/* Conteúdo do card */}
      <div className="{/* Status e ações */}">$2</div>
        <div className=" ">$2</div><Badge
            variant={ getStatusVariant(product.status) }
            size="sm" />
            {getStatusLabel(product.status)}
          </Badge>
          
          <div className="{onEdit && (">$2</div>
              <Button
                variant="ghost"
                size="sm"
                onClick={ handleEditClick }
                className="p-1" />
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" / /></svg></Button>
            )}
            {onDelete && (
              <Button
                variant="ghost"
                size="sm"
                onClick={ handleDeleteClick }
                className="p-1 text-red-600 hover:text-red-700" />
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" / /></svg></Button>
            )}
          </div>

        {/* Nome do produto */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2" />
          {product.name}
        </h3>

        {/* Descrição */}
        <p className="text-sm text-gray-600 mb-3 line-clamp-2" />
          {product.description}
        </p>

        {/* SKU */}
        {product.sku && (
          <p className="text-xs text-gray-500 mb-2" />
            SKU: {product.sku}
          </p>
        )}

        {/* Preço e estoque */}
        <div className=" ">$2</div><div className="{formatPrice(product.price || 0, product.currency)}">$2</div>
          </div>
          <div className="Estoque: {product.inventory?.quantity || 0}">$2</div>
          </div>

        {/* Categoria */}
        {product.category && (
          <div className=" ">$2</div><span className="{product.category}">$2</span>
            </span>
      </div>
    </>
  )}

        {/* Tags */}
        {product.tags && product.tags.length > 0 && (
          <div className="{product.tags.slice(0, 3).map((tag: string, index: number) => (">$2</div>
              <span
                key={ index }
                className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
            {tag}
          </span>
            ))}
            {product.tags.length > 3 && (
              <span className="+{product.tags.length - 3}">$2</span>
      </span>
    </>
  )}
          </div>
        )}

        {/* Ações */}
        <div className=" ">$2</div><Button
            variant="outline"
            size="sm"
            onClick={ handleCardClick } />
            Ver detalhes
          </Button>
          
          <div className="{formatDate(product.created_at)}">$2</div>
          </div></div></Card>);};

export default ProductsCard;
