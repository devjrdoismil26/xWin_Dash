/**
 * @module modules/Dashboard/components/widgets/ProductsPerformanceWidget
 * @description
 * Widget de performance de produtos.
 * 
 * Exibe métricas de performance de produtos:
 * - Total de produtos
 * - Produtos ativos
 * - Total de vendas
 * - Avaliação média
 * 
 * @example
 * ```typescript
 * <ProductsPerformanceWidget
 *   data={
 *     totalProducts: 500,
 *     activeProducts: 450,
 *     totalSales: 15000,
 *     avgRating: 4.5
 *   } *   loading={ false }
 * / />
 * ```
 * 
 * @since 1.0.0
 */
import React from 'react';
import Card from '@/shared/components/ui/Card';
import { ProductsPerformanceData, WidgetProps } from '@/types';

/**
 * Props do widget de performance de produtos
 * @interface ProductsPerformanceWidgetProps
 * @extends WidgetProps
 */
interface ProductsPerformanceWidgetProps extends WidgetProps {
  /** Dados de performance de produtos */
  data?: ProductsPerformanceData;
}

/**
 * Componente widget de performance de produtos
 * @param {ProductsPerformanceWidgetProps} props - Props do widget
 * @returns {JSX.Element} Widget de performance de produtos
 */
const ProductsPerformanceWidget: React.FC<ProductsPerformanceWidgetProps> = ({ data = {} as any, loading, error }) => {
  if (loading) {
    return (
        <>
      <Card />
      <Card.Header />
          <Card.Title>Performance Produtos</Card.Title>
        </Card.Header>
        <Card.Content className="p-4" />
          <div className="animate-pulse">Carregando...</div>
        </Card.Content>
      </Card>);

  }
  if (error) {
    return (
        <>
      <Card />
      <Card.Header />
          <Card.Title>Performance Produtos</Card.Title>
        </Card.Header>
        <Card.Content className="p-4 text-red-500" />
          Erro: {error}
        </Card.Content>
      </Card>);

  }
  return (
        <>
      <Card />
      <Card.Header />
        <Card.Title>Performance Produtos</Card.Title>
      </Card.Header>
      <Card.Content className="p-4 text-sm" />
        <div className=" ">$2</div><div>Total: {(data.totalProducts || 0).toLocaleString('pt-BR')}</div>
          <div className="text-green-600">Ativos: {(data.activeProducts || 0).toLocaleString('pt-BR')}</div>
          <div>Vendas: {(data.totalSales || 0).toLocaleString('pt-BR')}</div>
          {data.avgRating && (
            <div>Avaliação Média: {data.avgRating.toFixed(1)} ⭐</div>
          )}
        </div>
      </Card.Content>
    </Card>);};

export default ProductsPerformanceWidget;
