import React from 'react';
import Card from '@/components/ui/Card';
import { DashboardMetricsCardsProps } from '../types';
interface MetricProps {
  title: string;
  value: string;
  subtitle?: string;
}
const Metric: React.FC<MetricProps> = ({ title, value, subtitle }) => (
  <Card>
    <Card.Content className="p-4">
      <p className="text-sm text-gray-600">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
      {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
    </Card.Content>
  </Card>
);
const DashboardMetricsCards: React.FC<DashboardMetricsCardsProps> = ({ metrics = {} }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    <Metric 
      title="Receita" 
      value={new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(metrics.revenue || 0)} 
    />
    <Metric 
      title="Leads" 
      value={(metrics.leads || 0).toLocaleString('pt-BR')} 
    />
    <Metric 
      title="Conversões" 
      value={(metrics.conversions || 0).toLocaleString('pt-BR')} 
    />
    <Metric 
      title="Taxa Conversão" 
      value={`${metrics.conversionRate || 0}%`} 
    />
  </div>
);
export default DashboardMetricsCards;
