// =========================================
// PRODUCTS LIST - LISTA DE PRODUTOS
// =========================================
// Componente de lista para visualização de produtos
// Máximo: 200 linhas

import React from 'react';
import { Card } from '@/shared/components/ui/Card';
import { Badge } from '@/shared/components/ui/Badge';
import { Button } from '@/shared/components/ui/Button';
import { Eye, Pencil, Trash2, ShoppingBag, DollarSign, BarChart3, ShoppingBag, DollarSign, BarChart3, Eye, Pencil, TrashIcon } from 'lucide-react';

interface ProductsListProps {
  products: string[];
  selectedProducts?: string[];
  onProductSelect??: (e: any) => void;
  loading?: boolean;
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

export const ProductsList: React.FC<ProductsListProps> = ({ products,
  selectedProducts = [] as unknown[],
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
    }).format(value);};

  const formatDate = (date: string): string => {
    return new Date(date).toLocaleDateString('pt-BR');};

  // =========================================
  // HANDLERS
  // =========================================

  const handleView = (productId: string) => {
    window.location.href = `/products/${productId}`;};

  const handleEdit = (productId: string) => {
    window.location.href = `/products/${productId}/edit`;};

  const handleDelete = (productId: string) => {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
      // Implementar exclusão
    } ;

  // =========================================
  // RENDERIZAÇÃO DE LOADING
  // =========================================

  if (loading) {
    return (
        <>
      <div className={`products-list ${className} `}>
      </div><div className="{[...Array(5)].map((_: unknown, index: unknown) => (">$2</div>
            <Card key={index} className="p-6" />
              <div className=" ">$2</div><div className=" ">$2</div><div className=" ">$2</div><div className=" ">$2</div><div className=" ">$2</div><div className=" ">$2</div><div className="h-4 bg-gray-200 rounded w-1/3" /></div></Card>
          ))}
        </div>);

  }

  // =========================================
  // RENDERIZAÇÃO PRINCIPAL
  // =========================================

  return (
        <>
      <div className={`products-list ${className} `}>
      </div><div className="{(products || []).map((product: unknown) => (">$2</div>
          <Card key={product.id} className="p-6" />
            <div className="{/* Checkbox de seleção */}">$2</div>
              <input
                type="checkbox"
                checked={ selectedProducts.includes(product.id) }
                onChange={ () => onProductSelect?.(product.id) }
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />

              {/* Imagem do produto */}
              <div className="{product.images && product.images.length > 0 ? (">$2</div>
      <img
                    src={ product.images[0].url }
                    alt={ product.name }
                    className="h-16 w-16 rounded-lg object-cover"
                  / />
    </>
  ) : (
                  <div className=" ">$2</div><ShoppingBag className="h-8 w-8 text-gray-400" />
                  </div>
                )}
              </div>

              {/* Informações do produto */}
              <div className=" ">$2</div><div className=" ">$2</div><h3 className="text-lg font-medium text-gray-900 truncate" />
                    {product.name}
                  </h3>
                  <Badge 
                    variant={ product.status === 'active' ? 'success' : 'secondary' }
                    className="text-xs" />
                    {product.status}
                  </Badge></div><p className="text-sm text-gray-600 truncate" />
                  {product.description}
                </p>
                
                <div className=" ">$2</div><div className=" ">$2</div><DollarSign className="h-4 w-4" />
                    <span>{formatCurrency(product.price)}</span></div><div className=" ">$2</div><BarChart3 className="h-4 w-4" />
                    <span>Estoque: {product.inventory?.quantity || 0}</span></div><span className="SKU: {product.sku}">$2</span>
                  </span>
                </div>

              {/* Ações */}
              <div className=" ">$2</div><Button
                  variant="outline"
                  size="sm"
                  onClick={ () => handleView(product.id) }
                  className="flex items-center space-x-1"
                >
                  <Eye className="h-4 w-4" />
                  <span>Ver</span></Button><Button
                  variant="outline"
                  size="sm"
                  onClick={ () => handleEdit(product.id) }
                  className="flex items-center space-x-1"
                >
                  <Pencil className="h-4 w-4" />
                  <span>Editar</span></Button><Button
                  variant="outline"
                  size="sm"
                  onClick={ () => handleDelete(product.id) }
                  className="flex items-center space-x-1 text-red-600 hover:text-red-700"
                >
                  <TrashIcon className="h-4 w-4" />
                  <span>Excluir</span></Button></div>
      </Card>
    </>
  ))}
      </div>);};

export default ProductsList;
