import React from 'react';
import Card from '@/components/ui/Card';
import { ProductsPerformanceData, WidgetProps } from '../../types';
interface ProductsPerformanceWidgetProps extends WidgetProps {
  data?: ProductsPerformanceData;
}
const ProductsPerformanceWidget: React.FC<ProductsPerformanceWidgetProps> = ({ data = {}, loading, error }) => {
  if (loading) {
    return (
      <Card>
        <Card.Header>
          <Card.Title>Performance Produtos</Card.Title>
        </Card.Header>
        <Card.Content className="p-4">
          <div className="animate-pulse">Carregando...</div>
        </Card.Content>
      </Card>
    );
  }
  if (error) {
    return (
      <Card>
        <Card.Header>
          <Card.Title>Performance Produtos</Card.Title>
        </Card.Header>
        <Card.Content className="p-4 text-red-500">
          Erro: {error}
        </Card.Content>
      </Card>
    );
  }
  return (
    <Card>
      <Card.Header>
        <Card.Title>Performance Produtos</Card.Title>
      </Card.Header>
      <Card.Content className="p-4 text-sm">
        <div className="space-y-2">
          <div>Total: {(data.totalProducts || 0).toLocaleString('pt-BR')}</div>
          <div className="text-green-600">Ativos: {(data.activeProducts || 0).toLocaleString('pt-BR')}</div>
          <div>Vendas: {(data.totalSales || 0).toLocaleString('pt-BR')}</div>
          {data.avgRating && (
            <div>Avaliação Média: {data.avgRating.toFixed(1)} ⭐</div>
          )}
        </div>
      </Card.Content>
    </Card>
  );
};
export default ProductsPerformanceWidget;
