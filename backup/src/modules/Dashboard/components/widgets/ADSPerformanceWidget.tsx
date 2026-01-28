import React from 'react';
import Card from '@/components/ui/Card';
import { ADSPerformanceData, WidgetProps } from '../../types';
interface ADSPerformanceWidgetProps extends WidgetProps {
  data?: ADSPerformanceData;
}
const ADSPerformanceWidget: React.FC<ADSPerformanceWidgetProps> = ({ data = {}, loading, error }) => {
  if (loading) {
    return (
      <Card>
        <Card.Header>
          <Card.Title>Performance de ADS</Card.Title>
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
          <Card.Title>Performance de ADS</Card.Title>
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
        <Card.Title>Performance de ADS</Card.Title>
      </Card.Header>
      <Card.Content className="p-4 text-sm">
        <div className="space-y-2">
          <div>Cliques: {(data.clicks || 0).toLocaleString('pt-BR')}</div>
          <div>Impressões: {(data.impressions || 0).toLocaleString('pt-BR')}</div>
          {data.ctr && <div>CTR: {data.ctr.toFixed(2)}%</div>}
          {data.cpc && <div>CPC: R$ {data.cpc.toFixed(2)}</div>}
          {data.cost && <div>Custo: R$ {data.cost.toFixed(2)}</div>}
        </div>
      </Card.Content>
    </Card>
  );
};
export default ADSPerformanceWidget;
