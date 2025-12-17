/**
 * @module modules/Dashboard/components/SegmentGrowthChart
 * @description
 * Componente de gráfico de crescimento por segmento.
 * 
 * Exibe gráfico de crescimento por segmento:
 * - Valor atual e anterior por segmento
 * - Taxa de crescimento
 * - Indicadores visuais de crescimento
 * 
 * @example
 * ```typescript
 * <SegmentGrowthChart
 *   data={[
 *     { segment: 'B2B', current: 1000, previous: 800, growth: 25 },
 *     { segment: 'B2C', current: 500, previous: 600, growth: -16.67 }
 *   ]}
 *   loading={ false }
 * / />
 * ```
 * 
 * @since 1.0.0
 */
import React from 'react';
import Card from '@/shared/components/ui/Card';
import { SegmentGrowthData, ChartProps } from '../types';

/**
 * Props do gráfico de crescimento por segmento
 * @interface SegmentGrowthChartProps
 * @extends ChartProps
 */
interface SegmentGrowthChartProps extends ChartProps {
  /** Dados de crescimento por segmento */
  data: SegmentGrowthData[];
}

/**
 * Componente gráfico de crescimento por segmento
 * @param {SegmentGrowthChartProps} props - Props do gráfico
 * @returns {JSX.Element} Gráfico de crescimento por segmento
 */
const SegmentGrowthChart: React.FC<SegmentGrowthChartProps> = ({ data, loading, error    }) => {
  if (loading) {
    return (
        <>
      <Card />
      <Card.Header />
          <Card.Title>Crescimento por Segmento</Card.Title>
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
          <Card.Title>Crescimento por Segmento</Card.Title>
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
          <Card.Title>Crescimento por Segmento</Card.Title>
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
        <Card.Title>Crescimento por Segmento</Card.Title>
      </Card.Header>
      <Card.Content className="p-4" />
        <div className="{(data || []).map((item: unknown, index: unknown) => (">$2</div>
            <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
           
        </div><div>
           
        </div><div className="font-medium">{item.segment}</div>
                <div className="Atual: {item.current.toLocaleString('pt-BR')}">$2</div>
                </div>
              <div className=" ">$2</div><div className={`text-sm font-medium ${
                  item.growth >= 0 ? 'text-green-600' : 'text-red-600'
                } `}>
                  {item.growth >= 0 ? '+' : ''}{item.growth.toFixed(1)}%
                </div>
    </div>
  ))}
        </div>
      </Card.Content>
    </Card>);};

export default SegmentGrowthChart;
