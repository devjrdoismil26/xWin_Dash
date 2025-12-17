/**
 * @module modules/Dashboard/components/ScoreDistributionChart
 * @description
 * Componente de gráfico de distribuição de scores.
 * 
 * Exibe gráfico de distribuição de scores de leads:
 * - Distribuição por faixa de score
 * - Contagem por score
 * - Visualização em barras horizontais
 * 
 * @example
 * ```typescript
 * <ScoreDistributionChart
 *   data={[
 *     { score: 0, count: 10 },
 *     { score: 50, count: 20 },
 *     { score: 100, count: 5 }
 *   ]}
 *   loading={ false }
 * / />
 * ```
 * 
 * @since 1.0.0
 */
import React from 'react';
import Card from '@/shared/components/ui/Card';
import { ScoreDistributionData, ChartProps } from '../types';

/**
 * Props do gráfico de distribuição de scores
 * @interface ScoreDistributionChartProps
 * @extends ChartProps
 */
interface ScoreDistributionChartProps extends ChartProps {
  /** Dados de distribuição de scores */
  data: ScoreDistributionData[];
}

/**
 * Componente gráfico de distribuição de scores
 * @param {ScoreDistributionChartProps} props - Props do gráfico
 * @returns {JSX.Element} Gráfico de distribuição de scores
 */
const ScoreDistributionChart: React.FC<ScoreDistributionChartProps> = ({ data, loading, error    }) => {
  if (loading) {
    return (
        <>
      <Card />
      <Card.Header />
          <Card.Title>Distribuição de Scores</Card.Title>
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
          <Card.Title>Distribuição de Scores</Card.Title>
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
          <Card.Title>Distribuição de Scores</Card.Title>
        </Card.Header>
        <Card.Content className="p-4" />
          <div className="text-center text-gray-500">Nenhum dado disponível</div>
        </Card.Content>
      </Card>);

  }
  const maxCount = Math.max(...(data || []).map(item => item.count));

  return (
        <>
      <Card />
      <Card.Header />
        <Card.Title>Distribuição de Scores</Card.Title>
      </Card.Header>
      <Card.Content className="p-4" />
        <div className="{(data || []).map((item: unknown, index: unknown) => {">$2</div>
            const percentage = (item.count / maxCount) * 100;
            return (
        <>
      <div key={index} className="flex items-center space-x-3">
      </div><div className="w-12 text-sm font-medium">Score {item.score}</div>
                <div className=" ">$2</div><div 
                    className="bg-blue-500 h-4 rounded-full transition-all duration-300"
                    style={width: `${percentage} %` } />
           
        </div><div className="{item.count.toLocaleString('pt-BR')}">$2</div>
                </div>);

          })}
        </div>
      </Card.Content>
    </Card>);};

export default ScoreDistributionChart;
