import React from 'react';
import Card from '@/components/ui/Card';
import { LeadsTrendData, ChartProps } from '../types';
interface LeadsTrendChartProps extends ChartProps {
  data: LeadsTrendData[];
}
const LeadsTrendChart: React.FC<LeadsTrendChartProps> = ({ data, loading, error }) => {
  if (loading) {
    return (
      <Card>
        <Card.Header>
          <Card.Title>Tendência de Leads</Card.Title>
        </Card.Header>
        <Card.Content className="p-4">
          <div className="animate-pulse h-64 bg-gray-200 rounded"></div>
        </Card.Content>
      </Card>
    );
  }
  if (error) {
    return (
      <Card>
        <Card.Header>
          <Card.Title>Tendência de Leads</Card.Title>
        </Card.Header>
        <Card.Content className="p-4 text-red-500">
          Erro: {error}
        </Card.Content>
      </Card>
    );
  }
  if (!data || data.length === 0) {
    return (
      <Card>
        <Card.Header>
          <Card.Title>Tendência de Leads</Card.Title>
        </Card.Header>
        <Card.Content className="p-4">
          <div className="text-center text-gray-500">Nenhum dado disponível</div>
        </Card.Content>
      </Card>
    );
  }
  return (
    <Card>
      <Card.Header>
        <Card.Title>Tendência de Leads</Card.Title>
      </Card.Header>
      <Card.Content className="p-4">
        <div className="space-y-4">
          {data.map((item, index) => (
            <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <div>
                <div className="font-medium">{item.period}</div>
                <div className="text-sm text-gray-600">
                  Leads: {item.leads.toLocaleString('pt-BR')} | 
                  Conversões: {item.conversions.toLocaleString('pt-BR')}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-600">
                  Taxa: {item.leads > 0 ? ((item.conversions / item.leads) * 100).toFixed(1) : 0}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card.Content>
    </Card>
  );
};
export default LeadsTrendChart;
