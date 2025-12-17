/**
 * @module modules/Dashboard/components/widgets/AnalyticsOverviewWidget
 * @description
 * Widget de visão geral de analytics.
 * 
 * Exibe métricas principais de analytics e tráfego:
 * - Visualizações totais
 * - Visitantes únicos
 * - Taxa de rejeição (bounce rate)
 * - Duração média de sessão
 * 
 * @example
 * ```typescript
 * <AnalyticsOverviewWidget
 *   data={
 *     totalViews: 50000,
 *     uniqueVisitors: 25000,
 *     bounceRate: 35.5,
 *     avgSessionDuration: 180
 *   } *   loading={ false }
 * / />
 * ```
 * 
 * @since 1.0.0
 */
import React from 'react';
import Card from '@/shared/components/ui/Card';
import { AnalyticsOverviewData, WidgetProps } from '@/types';

/**
 * Props do widget de visão geral de analytics
 * @interface AnalyticsOverviewWidgetProps
 * @extends WidgetProps
 */
interface AnalyticsOverviewWidgetProps extends WidgetProps {
  /** Dados de overview de analytics */
  data?: AnalyticsOverviewData;
}

/**
 * Componente widget de visão geral de analytics
 * @param {AnalyticsOverviewWidgetProps} props - Props do widget
 * @returns {JSX.Element} Widget de visão geral de analytics
 */
const AnalyticsOverviewWidget: React.FC<AnalyticsOverviewWidgetProps> = ({ data = {} as any, loading, error }) => {
  if (loading) {
    return (
        <>
      <Card />
      <Card.Header />
          <Card.Title>Visão Geral Analytics</Card.Title>
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
          <Card.Title>Visão Geral Analytics</Card.Title>
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
        <Card.Title>Visão Geral Analytics</Card.Title>
      </Card.Header>
      <Card.Content className="p-4 text-sm" />
        <div className=" ">$2</div><div>Visualizações: {(data.totalViews || 0).toLocaleString('pt-BR')}</div>
          <div>Visitantes Únicos: {(data.uniqueVisitors || 0).toLocaleString('pt-BR')}</div>
          {data.bounceRate && (
            <div>Taxa de Rejeição: {data.bounceRate.toFixed(1)}%</div>
          )}
          {data.avgSessionDuration && (
            <div>Duração Média: {Math.round(data.avgSessionDuration / 60)}min</div>
          )}
        </div>
      </Card.Content>
    </Card>);};

export default AnalyticsOverviewWidget;
