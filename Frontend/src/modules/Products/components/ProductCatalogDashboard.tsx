/**
 * Product Catalog Dashboard Simplificado
 * 
 * @description
 * Dashboard de catálogo de produtos com integração real ao backend.
 * Versão simplificada e mantível do AdvancedProductCatalogDashboard.
 * 
 * @module modules/Products/components/ProductCatalogDashboardSimple
 * @since 2.0.0
 */

import React, { useState } from 'react';
import { useValidatedGet } from '@/hooks/useValidatedApi';
import { ProductCatalogDashboardDataSchema, type ProductCatalogDashboardData, type Product,  } from '@/schemas';
import { Package, ShoppingCart, DollarSign, TrendingUp, AlertTriangle, Archive, Plus, RefreshCw, Search, Filter, Eye, Edit, Trash2,  } from 'lucide-react';

// Components
import Card from '@/shared/components/ui/Card';
import Button from '@/shared/components/ui/Button';
import Badge from '@/shared/components/ui/Badge';
import Input from '@/shared/components/ui/Input';
import { LoadingSpinner } from '@/shared/components/ui/LoadingStates';
import ErrorState from '@/shared/components/ui/ErrorState';
import Progress from '@/shared/components/ui/Progress';

interface ProductCatalogDashboardSimpleProps {
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

/**
 * Formata número como moeda
 */
const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);};

/**
 * Formata número
 */
const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('pt-BR').format(value);};

/**
 * Retorna cor do badge de status
 */
const getStatusColor = (status: Product['status']): 'success' | 'secondary' | 'destructive' => {
  switch (status) {
    case 'active':
      return 'success';
    case 'draft':
      return 'secondary';
    case 'archived':
      return 'destructive';
    default:
      return 'secondary';
  } ;

/**
 * Card de métrica
 */
const MetricCard: React.FC<{
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color?: string;
}> = ({ title, value, icon, color = 'blue'    }) => (
  <Card className="p-6" />
    <div className=" ">$2</div><div>
           
        </div><p className="text-sm text-gray-600 dark:text-gray-400">{title}</p>
        <p className="text-2xl font-bold mt-1">{value}</p></div><div className={`p-3 bg-${color} -100 dark:bg-${color}-900/20 rounded-lg`}>
           
        </div>{icon}
      </div>
  </Card>);

/**
 * Componente principal
 */
export const ProductCatalogDashboardSimple: React.FC<ProductCatalogDashboardSimpleProps> = ({ className = '',
   }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Hook para buscar dados do catálogo
  const {
    data: catalogData,
    loading,
    error,
    fetch: refreshData,
  } = useValidatedGet<ProductCatalogDashboardData>(
    '/api/products/catalog',
    ProductCatalogDashboardDataSchema,
    true // autoFetch);

  // Loading state
  if (loading) {
    return (
              <div className=" ">$2</div><LoadingSpinner size="lg" / />
      </div>);

  }

  // Error state
  if (error || !catalogData) {
    return (
              <div className=" ">$2</div><ErrorState
          title="Erro ao carregar catálogo"
          description={ typeof error === 'string' ? error : 'Não foi possível carregar os produtos' }
          onRetry={ refreshData }
        / />
      </div>);

  }

  const { products, categories, stats } = catalogData;

  // Filtrar produtos
  const filteredProducts = products.filter((product: unknown) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === 'all' || product.category_id === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
        <>
      <div className={`space-y-6 ${className} `}>
      </div>{/* Header */}
      <div className=" ">$2</div><div>
           
        </div><h1 className="text-3xl font-bold text-gray-900 dark:text-white" />
            Catálogo de Produtos
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1" />
            Gerencie seus produtos e inventário
          </p></div><div className=" ">$2</div><Button variant="outline" onClick={ refreshData } />
            <RefreshCw className="w-4 h-4 mr-2" />
            Atualizar
          </Button>
          <Button />
            <Plus className="w-4 h-4 mr-2" />
            Novo Produto
          </Button>
        </div>

      {/* Métricas */}
      <div className=" ">$2</div><MetricCard
          title="Total de Produtos"
          value={ formatNumber(stats.total_products) }
          icon={ <Package className="w-6 h-6 text-blue-600" /> }
          color="blue" />
        <MetricCard
          title="Valor Total"
          value={ formatCurrency(stats.total_value) }
          icon={ <DollarSign className="w-6 h-6 text-green-600" /> }
          color="green" />
        <MetricCard
          title="Estoque Baixo"
          value={ stats.low_stock_count }
          icon={ <AlertTriangle className="w-6 h-6 text-yellow-600" /> }
          color="yellow" />
        <MetricCard
          title="Sem Estoque"
          value={ stats.out_of_stock_count }
          icon={ <Archive className="w-6 h-6 text-red-600" /> }
          color="red" />
      </div>

      {/* Status Breakdown */}
      <Card className="p-6" />
        <h2 className="text-lg font-semibold mb-4">Status dos Produtos</h2>
        <div className=" ">$2</div><div className=" ">$2</div><p className="text-3xl font-bold text-green-600">{stats.active_products}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Ativos</p></div><div className=" ">$2</div><p className="text-3xl font-bold text-gray-600">{stats.draft_products}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Rascunhos</p></div><div className=" ">$2</div><p className="text-3xl font-bold text-red-600">{stats.archived_products}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Arquivados</p></div></Card>

      {/* Busca e Filtros */}
      <div className=" ">$2</div><div className=" ">$2</div><Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Buscar produtos..."
            value={ searchTerm }
            onChange={ (e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value) }
            className="pl-10" /></div><select
          value={ selectedCategory }
          onChange={ (e: React.ChangeEvent<HTMLInputElement>) => setSelectedCategory(e.target.value) }
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
        >
          <option value="all">Todas Categorias</option>
          {categories.map((cat: unknown) => (
            <option key={cat.id} value={ cat.id } />
              {cat.name} ({cat.products_count})
            </option>
          ))}
        </select>
      </div>

      {/* Lista de Produtos */}
      <Card />
        <div className=" ">$2</div><table className="w-full" />
            <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700" />
              <tr />
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase" />
                  Produto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase" />
                  SKU
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase" />
                  Preço
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase" />
                  Estoque
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase" />
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase" />
                  Vendas
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-600 dark:text-gray-400 uppercase" />
                  Ações
                </th></tr></thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700" />
              {filteredProducts.map((product: unknown) => (
                <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-800" />
                  <td className="px-6 py-4" />
                    <div className="{product.images && product.images.length > 0 ? (">$2</div>
      <img
                          src={ product.images[0] }
                          alt={ product.name }
                          className="w-12 h-12 rounded object-cover"
                        / />
    </>
  ) : (
                        <div className=" ">$2</div><Package className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                      <div>
           
        </div><p className="font-medium">{product.name}</p>
                        {product.category && (
                          <p className="text-sm text-gray-600 dark:text-gray-400" />
                            {product.category.name}
                          </p>
                        )}
                      </div></td><td className="px-6 py-4" />
                    <span className="text-sm font-mono">{product.sku || '-'}</span></td><td className="px-6 py-4" />
                    <div>
           
        </div><p className="font-semibold">{formatCurrency(product.price)}</p>
                      {product.compare_price && product.compare_price > product.price && (
                        <p className="text-sm text-gray-500 line-through" />
                          {formatCurrency(product.compare_price)}
                        </p>
                      )}
                    </div></td><td className="px-6 py-4" />
                    <div className=" ">$2</div><span className="font-semibold">{product.stock_quantity}</span>
                      {product.stock_quantity === 0 && (
                        <Badge variant="destructive" className="text-xs" />
                          Esgotado
                        </Badge>
                      )}
                      {product.stock_quantity > 0 && product.stock_quantity < 10 && (
                        <Badge variant="warning" className="text-xs" />
                          Baixo
                        </Badge>
                      )}
                    </div></td><td className="px-6 py-4" />
                    <Badge variant={ getStatusColor(product.status) } />
                      {product.status}
                    </Badge></td><td className="px-6 py-4" />
                    <div className=" ">$2</div><ShoppingCart className="w-4 h-4 text-gray-400" />
                      <span>{product.sales_count || 0}</span></div></td>
                  <td className="px-6 py-4" />
                    <div className=" ">$2</div><Button variant="ghost" size="sm" />
                        <Eye className="w-4 h-4" /></Button><Button variant="ghost" size="sm" />
                        <Edit className="w-4 h-4" /></Button><Button variant="ghost" size="sm" />
                        <Trash2 className="w-4 h-4" /></Button></div></td></tr>
              ))}
            </tbody></table></div>
      </Card>

      {filteredProducts.length === 0 && (
        <div className=" ">$2</div><Package className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2" />
            Nenhum produto encontrado
          </h3>
          <p className="text-gray-600 dark:text-gray-400" />
            {searchTerm ? 'Tente ajustar sua busca' : 'Crie seu primeiro produto'}
          </p>
      </div>
    </>
  )}
    </div>);};

export default ProductCatalogDashboardSimple;
