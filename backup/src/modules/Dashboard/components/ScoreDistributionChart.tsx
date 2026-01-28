import React from 'react';
import Card from '@/components/ui/Card';
import { ScoreDistributionData, ChartProps } from '../types';
interface ScoreDistributionChartProps extends ChartProps {
  data: ScoreDistributionData[];
}
const ScoreDistributionChart: React.FC<ScoreDistributionChartProps> = ({ data, loading, error }) => {
  if (loading) {
    return (
      <Card>
        <Card.Header>
          <Card.Title>Distribuição de Scores</Card.Title>
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
          <Card.Title>Distribuição de Scores</Card.Title>
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
          <Card.Title>Distribuição de Scores</Card.Title>
        </Card.Header>
        <Card.Content className="p-4">
          <div className="text-center text-gray-500">Nenhum dado disponível</div>
        </Card.Content>
      </Card>
    );
  }
  const maxCount = Math.max(...data.map(item => item.count));
  return (
    <Card>
      <Card.Header>
        <Card.Title>Distribuição de Scores</Card.Title>
      </Card.Header>
      <Card.Content className="p-4">
        <div className="space-y-3">
          {data.map((item, index) => {
            const percentage = (item.count / maxCount) * 100;
            return (
              <div key={index} className="flex items-center space-x-3">
                <div className="w-12 text-sm font-medium">Score {item.score}</div>
                <div className="flex-1 bg-gray-200 rounded-full h-4">
                  <div 
                    className="bg-blue-500 h-4 rounded-full transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <div className="w-16 text-sm text-gray-600 text-right">
                  {item.count.toLocaleString('pt-BR')}
                </div>
              </div>
            );
          })}
        </div>
      </Card.Content>
    </Card>
  );
};
export default ScoreDistributionChart;
