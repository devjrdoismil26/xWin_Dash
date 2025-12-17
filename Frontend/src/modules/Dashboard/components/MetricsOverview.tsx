/**
 * @module modules/Dashboard/components/MetricsOverview
 * @description
 * Componente de visão geral das métricas.
 * 
 * Exibe visão geral consolidada das métricas principais:
 * - Receita total
 * - Total de leads
 * - Total de conversões
 * - Taxa de conversão
 * 
 * @example
 * ```typescript
 * <MetricsOverview
 *   metrics={
 *     total_revenue: 50000,
 *     total_leads: 1000,
 *     total_conversions: 100,
 *     conversion_rate: 10
 *   } *   loading={ false }
 * / />
 * ```
 * 
 * @since 1.0.0
 */
import React from 'react';
import Card from '@/shared/components/ui/Card';
import { DashboardMetrics } from '../types';

/**
 * Props do componente de visão geral das métricas
 * @interface MetricsOverviewProps
 */
interface MetricsOverviewProps {
  /** Métricas do dashboard */
metrics: DashboardMetrics;
  /** Estado de loading */
loading?: boolean;
  /** Mensagem de erro */
error?: string;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

/**
 * Componente de visão geral das métricas
 * @param {MetricsOverviewProps} props - Props do componente
 * @returns {JSX.Element} Visão geral das métricas
 */
const MetricsOverview: React.FC<MetricsOverviewProps> = ({ metrics, loading, error    }) => {
  if (loading) {
    return (
        <>
      <Card />
      <Card.Header />
          <Card.Title>Visão Geral das Métricas</Card.Title>
        </Card.Header>
        <Card.Content className="p-4" />
          <div className=" ">$2</div><div className=" ">$2</div><div className=" ">$2</div><div className="h-4 bg-gray-200 rounded w-2/3">
           
        </div></Card.Content>
      </Card>);

  }
  if (error) {
    return (
        <>
      <Card />
      <Card.Header />
          <Card.Title>Visão Geral das Métricas</Card.Title>
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
        <Card.Title>Visão Geral das Métricas</Card.Title>
      </Card.Header>
      <Card.Content className="p-4" />
        <div className=" ">$2</div><div className=" ">$2</div><div className="{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(metrics.revenue || 0)}">$2</div>
            </div>
            <div className="text-sm text-gray-600">Receita Total</div>
          <div className=" ">$2</div><div className="{(metrics.leads || 0).toLocaleString('pt-BR')}">$2</div>
            </div>
            <div className="text-sm text-gray-600">Total de Leads</div>
          <div className=" ">$2</div><div className="{(metrics.conversions || 0).toLocaleString('pt-BR')}">$2</div>
            </div>
            <div className="text-sm text-gray-600">Conversões</div>
          <div className=" ">$2</div><div className="{metrics.conversionRate || 0}%">$2</div>
            </div>
            <div className="text-sm text-gray-600">Taxa de Conversão</div></div></Card.Content>
    </Card>);};

export default MetricsOverview;
