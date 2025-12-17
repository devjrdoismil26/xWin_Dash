/**
 * @module modules/Dashboard/components/widgets/ADSPerformanceWidget
 * @description
 * Widget de performance de anúncios ADS (Google Ads, Facebook Ads, etc.).
 * 
 * Exibe métricas principais de performance de campanhas publicitárias:
 * - Cliques e impressões
 * - CTR (Click-Through Rate)
 * - CPC (Custo por Clique)
 * - Custo total
 * 
 * @example
 * ```typescript
 * <ADSPerformanceWidget
 *   data={
 *     clicks: 1500,
 *     impressions: 50000,
 *     ctr: 3.0,
 *     cpc: 2.50,
 *     cost: 3750
 *   } *   loading={ false }
 * / />
 * ```
 * 
 * @since 1.0.0
 */
import React from 'react';
import Card from '@/shared/components/ui/Card';
import { ADSPerformanceData, WidgetProps } from '@/types';

/**
 * Props do widget de performance de ADS
 * @interface ADSPerformanceWidgetProps
 * @extends WidgetProps
 */
interface ADSPerformanceWidgetProps extends WidgetProps {
  /** Dados de performance de ADS */
  data?: ADSPerformanceData;
}

/**
 * Componente widget de performance de ADS
 * @param {ADSPerformanceWidgetProps} props - Props do widget
 * @returns {JSX.Element} Widget de performance de ADS
 */
const ADSPerformanceWidget: React.FC<ADSPerformanceWidgetProps> = ({ data = {} as any, loading, error }) => {
  if (loading) {
    return (
        <>
      <Card />
      <Card.Header />
          <Card.Title>Performance de ADS</Card.Title>
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
          <Card.Title>Performance de ADS</Card.Title>
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
        <Card.Title>Performance de ADS</Card.Title>
      </Card.Header>
      <Card.Content className="p-4 text-sm" />
        <div className=" ">$2</div><div>Cliques: {(data.clicks || 0).toLocaleString('pt-BR')}</div>
          <div>Impressões: {(data.impressions || 0).toLocaleString('pt-BR')}</div>
          {data.ctr && <div>CTR: {data.ctr.toFixed(2)}%</div>}
          {data.cpc && <div>CPC: R$ {data.cpc.toFixed(2)}</div>}
          {data.cost && <div>Custo: R$ {data.cost.toFixed(2)}</div>}
        </div>
      </Card.Content>
    </Card>);};

export default ADSPerformanceWidget;
