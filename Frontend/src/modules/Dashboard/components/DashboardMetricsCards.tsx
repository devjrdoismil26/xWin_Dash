/**
 * @module modules/Dashboard/components/DashboardMetricsCards
 * @description
 * Componente de cards de métricas do dashboard.
 * 
 * Exibe métricas principais em formato de cards:
 * - Receita
 * - Leads
 * - Conversões
 * - Taxa de conversão
 * 
 * @example
 * ```typescript
 * <DashboardMetricsCards
 *   metrics={
 *     revenue: 50000,
 *     leads: 1000,
 *     conversions: 100,
 *     conversionRate: 10
 *   } * / />
 * ```
 * 
 * @since 1.0.0
 */
import React from 'react';
import Card from '@/shared/components/ui/Card';
import { DashboardMetricsCardsProps } from '../types';
interface MetricProps {
  title: string;
  value: string;
  subtitle?: string;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }
const Metric: React.FC<MetricProps> = ({ title, value, subtitle    }) => (
  <Card />
    <Card.Content className="p-4" />
      <p className="text-sm text-gray-600">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
      {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
    </Card.Content>
  </Card>);

const DashboardMetricsCards: React.FC<DashboardMetricsCardsProps> = ({ metrics = {} as any }) => (
  <div className=" ">$2</div><Metric 
      title="Receita" 
      value={new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(metrics.revenue || 0)} 
    / />
    <Metric 
      title="Leads" 
      value={ (metrics.leads || 0).toLocaleString('pt-BR') }
    / />
    <Metric 
      title="Conversões" 
      value={ (metrics.conversions || 0).toLocaleString('pt-BR') }
    / />
    <Metric 
      title="Taxa Conversão" 
      value={`${metrics.conversionRate || 0}%`} 
    / />
  </div>);

export default DashboardMetricsCards;
