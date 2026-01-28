import React from 'react';
import Card from '@/components/ui/Card';
import { AnalyticsOverviewData, WidgetProps } from '../../types';
interface AnalyticsOverviewWidgetProps extends WidgetProps {
  data?: AnalyticsOverviewData;
}
const AnalyticsOverviewWidget: React.FC<AnalyticsOverviewWidgetProps> = ({ data = {}, loading, error }) => {
  if (loading) {
    return (
      <Card>
        <Card.Header>
          <Card.Title>Visão Geral Analytics</Card.Title>
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
          <Card.Title>Visão Geral Analytics</Card.Title>
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
        <Card.Title>Visão Geral Analytics</Card.Title>
      </Card.Header>
      <Card.Content className="p-4 text-sm">
        <div className="space-y-2">
          <div>Visualizações: {(data.totalViews || 0).toLocaleString('pt-BR')}</div>
          <div>Visitantes Únicos: {(data.uniqueVisitors || 0).toLocaleString('pt-BR')}</div>
          {data.bounceRate && (
            <div>Taxa de Rejeição: {data.bounceRate.toFixed(1)}%</div>
          )}
          {data.avgSessionDuration && (
            <div>Duração Média: {Math.round(data.avgSessionDuration / 60)}min</div>
          )}
        </div>
      </Card.Content>
    </Card>
  );
};
export default AnalyticsOverviewWidget;
