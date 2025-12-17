/**
 * @module modules/Dashboard/components/LeadsTrendChart
 * @description
 * Componente de gráfico de tendência de leads.
 * 
 * Exibe gráfico de tendência de leads e conversões ao longo do tempo:
 * - Dados por período
 * - Leads e conversões
 * - Indicadores de crescimento
 * 
 * @example
 * ```typescript
 * <LeadsTrendChart
 *   data={[
 *     { period: 'Jan', leads: 100, conversions: 10 },
 *     { period: 'Feb', leads: 150, conversions: 15 }
 *   ]}
 *   loading={ false }
 * / />
 * ```
 * 
 * @since 1.0.0
 */
import React from 'react';
import Card from '@/shared/components/ui/Card';
import { LeadsTrendData, ChartProps } from '../types';

/**
 * Props do gráfico de tendência de leads
 * @interface LeadsTrendChartProps
 * @extends ChartProps
 */
interface LeadsTrendChartProps extends ChartProps {
  /** Dados de tendência de leads */
  data: LeadsTrendData[];
}

/**
 * Componente gráfico de tendência de leads
 * @param {LeadsTrendChartProps} props - Props do gráfico
 * @returns {JSX.Element} Gráfico de tendência de leads
 */
const LeadsTrendChart: React.FC<LeadsTrendChartProps> = ({ data, loading, error    }) => {
  if (loading) {
    return (
        <>
      <Card />
      <Card.Header />
          <Card.Title>Tendência de Leads</Card.Title>
        </Card.Header>
        <Card.Content className="p-4" />
          <div className=" ">$2</div></Card.Content>
      </Card>);

  }
  if (error) {
    return (
        <>
      <Card />
      <Card.Header />
          <Card.Title>Tendência de Leads</Card.Title>
        </Card.Header>
        <Card.Content className="p-4 text-red-500" />
          Erro: {error}
        </Card.Content>
      </Card>);

  }
  if (!data || (data as any).length === 0) {
    return (
        <>
      <Card />
      <Card.Header />
          <Card.Title>Tendência de Leads</Card.Title>
        </Card.Header>
        <Card.Content className="p-4" />
          <div className="text-center text-gray-500">Nenhum dado disponível</div>
        </Card.Content>
      </Card>);

  }
  return (
        <>
      <Card />
      <Card.Header />
        <Card.Title>Tendência de Leads</Card.Title>
      </Card.Header>
      <Card.Content className="p-4" />
        <div className="{(data || []).map((item: unknown, index: unknown) => (">$2</div>
            <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
           
        </div><div>
           
        </div><div className="font-medium">{item.period}</div>
                <div className="Leads: {item.leads.toLocaleString('pt-BR')} | ">$2</div>
                  Conversões: {item.conversions.toLocaleString('pt-BR')}
                </div>
              <div className=" ">$2</div><div className="Taxa: {item.leads > 0 ? ((item.conversions / item.leads) * 100).toFixed(1) : 0}%">$2</div>
                </div>
    </div>
  ))}
        </div>
      </Card.Content>
    </Card>);};

export default LeadsTrendChart;
