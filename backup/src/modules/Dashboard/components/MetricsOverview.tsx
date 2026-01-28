import React from 'react';
import Card from '@/components/ui/Card';
import { DashboardMetrics } from '../types';
interface MetricsOverviewProps {
  metrics: DashboardMetrics;
  loading?: boolean;
  error?: string;
}
const MetricsOverview: React.FC<MetricsOverviewProps> = ({ metrics, loading, error }) => {
  if (loading) {
    return (
      <Card>
        <Card.Header>
          <Card.Title>Visão Geral das Métricas</Card.Title>
        </Card.Header>
        <Card.Content className="p-4">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </Card.Content>
      </Card>
    );
  }
  if (error) {
    return (
      <Card>
        <Card.Header>
          <Card.Title>Visão Geral das Métricas</Card.Title>
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
        <Card.Title>Visão Geral das Métricas</Card.Title>
      </Card.Header>
      <Card.Content className="p-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded">
            <div className="text-2xl font-bold text-blue-600">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(metrics.revenue || 0)}
            </div>
            <div className="text-sm text-gray-600">Receita Total</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded">
            <div className="text-2xl font-bold text-green-600">
              {(metrics.leads || 0).toLocaleString('pt-BR')}
            </div>
            <div className="text-sm text-gray-600">Total de Leads</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded">
            <div className="text-2xl font-bold text-purple-600">
              {(metrics.conversions || 0).toLocaleString('pt-BR')}
            </div>
            <div className="text-sm text-gray-600">Conversões</div>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded">
            <div className="text-2xl font-bold text-orange-600">
              {metrics.conversionRate || 0}%
            </div>
            <div className="text-sm text-gray-600">Taxa de Conversão</div>
          </div>
        </div>
      </Card.Content>
    </Card>
  );
};
export default MetricsOverview;
