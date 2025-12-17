// =========================================
// PRODUCTS STATS - ESTATÍSTICAS
// =========================================
// Componente de estatísticas do módulo Products
// Máximo: 150 linhas

import React from 'react';
import { Card } from '@/shared/components/ui/Card';
import { Badge } from '@/shared/components/ui/Badge';
import { AnimatedCounter } from '@/shared/components/ui/AdvancedAnimations';
import { ShoppingBag, DollarSign, BarChart3, AlertTriangle, ShoppingBag, DollarSign, AlertTriangle, BarChart3 } from 'lucide-react';

interface ProductsStatsProps {
  products: string[];
  loading?: boolean;
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

export const ProductsStats: React.FC<ProductsStatsProps> = ({ products,
  loading = false,
  className = ''
   }) => {
  // =========================================
  // CÁLCULOS DE ESTATÍSTICAS
  // =========================================

  const stats = React.useMemo(() => {
    if (!products || products.length === 0) {
      return {
        total: 0,
        active: 0,
        inactive: 0,
        totalValue: 0,
        lowStock: 0,
        outOfStock: 0};

    }

    const total = products.length;
    const active = (products || []).filter(p => p.status === 'active').length;
    const inactive = (products || []).filter(p => p.status === 'inactive').length;
    
    const totalValue = products.reduce((sum: unknown, p: unknown) => {
      const price = parseFloat(p.price) || 0;
      const inventory = parseInt(p.inventory?.quantity) || 0;
      return sum + (price * inventory);

    }, 0);

    const lowStock = (products || []).filter(p => {
      const inventory = parseInt(p.inventory?.quantity) || 0;
      const minStock = parseInt(p.inventory?.min_stock) || 0;
      return inventory > 0 && inventory <= minStock;
    }).length;

    const outOfStock = (products || []).filter(p => {
      const inventory = parseInt(p.inventory?.quantity) || 0;
      return inventory === 0;
    }).length;

    return {
      total,
      active,
      inactive,
      totalValue,
      lowStock,
      outOfStock};

  }, [products]);

  // =========================================
  // FORMATADORES
  // =========================================

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);};

  // =========================================
  // RENDERIZAÇÃO
  // =========================================

  if (loading) {
    return (
        <>
      <div className={`products-stats ${className} `}>
      </div><div className="{[...Array(4)].map((_: unknown, index: unknown) => (">$2</div>
            <Card key={index} className="p-6" />
              <div className=" ">$2</div><div className=" ">$2</div><div className="h-8 bg-gray-200 rounded w-1/2">
           
        </div></Card>
          ))}
        </div>);

  }

  return (
        <>
      <div className={`products-stats ${className} `}>
      </div><div className="{/* Total de Produtos */}">$2</div>
        <Card className="p-6" />
          <div className=" ">$2</div><div className=" ">$2</div><ShoppingBag className="h-8 w-8 text-blue-600" /></div><div className=" ">$2</div><p className="text-sm font-medium text-gray-500">Total de Produtos</p>
              <p className="text-2xl font-bold text-gray-900" />
                <AnimatedCounter value={stats.total} / /></p></div>
          <div className=" ">$2</div><Badge variant="secondary" className="text-xs" />
              {stats.active} ativos
            </Badge>
            {stats.inactive > 0 && (
              <Badge variant="outline" className="text-xs ml-2" />
                {stats.inactive} inativos
              </Badge>
            )}
          </div>
        </Card>

        {/* Valor Total do Estoque */}
        <Card className="p-6" />
          <div className=" ">$2</div><div className=" ">$2</div><DollarSign className="h-8 w-8 text-green-600" /></div><div className=" ">$2</div><p className="text-sm font-medium text-gray-500">Valor do Estoque</p>
              <p className="text-2xl font-bold text-gray-900" />
                {formatCurrency(stats.totalValue)}
              </p></div><div className=" ">$2</div><p className="text-xs text-gray-500" />
              Baseado no preço atual
            </p></div></Card>

        {/* Produtos com Estoque Baixo */}
        <Card className="p-6" />
          <div className=" ">$2</div><div className=" ">$2</div><AlertTriangle className="h-8 w-8 text-yellow-600" /></div><div className=" ">$2</div><p className="text-sm font-medium text-gray-500">Estoque Baixo</p>
              <p className="text-2xl font-bold text-gray-900" />
                <AnimatedCounter value={stats.lowStock} / /></p></div>
          <div className=" ">$2</div><Badge 
              variant={ stats.lowStock > 0 ? "warning" : "success" }
              className="text-xs"
            >
              {stats.lowStock > 0 ? 'Atenção necessária' : 'Tudo em ordem'}
            </Badge></div></Card>

        {/* Produtos Sem Estoque */}
        <Card className="p-6" />
          <div className=" ">$2</div><div className=" ">$2</div><BarChart3 className="h-8 w-8 text-red-600" /></div><div className=" ">$2</div><p className="text-sm font-medium text-gray-500">Sem Estoque</p>
              <p className="text-2xl font-bold text-gray-900" />
                <AnimatedCounter value={stats.outOfStock} / /></p></div>
          <div className=" ">$2</div><Badge 
              variant={ stats.outOfStock > 0 ? "danger" : "success" }
              className="text-xs"
            >
              {stats.outOfStock > 0 ? 'Reabastecimento necessário' : 'Estoque OK'}
            </Badge></div></Card>
      </div>);};

export default ProductsStats;
