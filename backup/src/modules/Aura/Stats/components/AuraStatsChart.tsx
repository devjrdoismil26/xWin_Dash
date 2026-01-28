import React, { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import { LoadingSpinner } from '@/components/ui/LoadingStates';
import { EmptyStates } from '@/components/ui/EmptyState';
import auraService from '../../services/auraService';
import { useAdvancedNotifications } from '@/hooks/useAdvancedNotifications';
interface ChartDataPoint {
  date: string;
  messages: number;
  conversations: number;
  conversions: number;
}
interface AuraStatsChartProps {
  data?: ChartDataPoint[];
  period?: '7d' | '30d' | '90d';
}
// Simple SVG chart component for basic visualization
const SimpleLineChart: React.FC<{ data: ChartDataPoint[]; metric: keyof Omit<ChartDataPoint, 'date'> }> = ({ 
  data, 
  metric 
}) => {
  const values = data.map(d => d[metric]);
  const maxValue = Math.max(...values);
  const minValue = Math.min(...values);
  const range = maxValue - minValue || 1;
  const points = data.map((d, index) => {
    const x = (index / (data.length - 1)) * 300;
    const y = 100 - ((d[metric] - minValue) / range) * 80;
    return `${x},${y}`;
  }).join(' ');
  return (
    <div className="w-full h-32 bg-gray-50 rounded-lg p-4">
      <svg width="100%" height="100%" viewBox="0 0 300 100" className="overflow-visible">
        <polyline
          fill="none"
          stroke="#3B82F6"
          strokeWidth="2"
          points={points}
        />
        {data.map((d, index) => {
          const x = (index / (data.length - 1)) * 300;
          const y = 100 - ((d[metric] - minValue) / range) * 80;
          return (
            <circle
              key={index}
              cx={x}
              cy={y}
              r="3"
              fill="#3B82F6"
              className="hover:r-4 cursor-pointer"
            >
              <title>{`${d.date}: ${d[metric]}`}</title>
            </circle>
          );
        })}
      </svg>
    </div>
  );
};
const MetricSelector: React.FC<{
  selected: keyof Omit<ChartDataPoint, 'date'>;
  onChange: (metric: keyof Omit<ChartDataPoint, 'date'>) => void;
}> = ({ selected, onChange }) => {
  const metrics = [
    { key: 'messages' as const, label: 'Mensagens', color: 'bg-blue-500' },
    { key: 'conversations' as const, label: 'Conversas', color: 'bg-green-500' },
    { key: 'conversions' as const, label: 'Conversões', color: 'bg-purple-500' },
  ];
  return (
    <div className="flex space-x-2">
      {metrics.map(({ key, label, color }) => (
        <button
          key={key}
          onClick={() => onChange(key)}
          className={`flex items-center space-x-2 px-3 py-1 rounded-md text-sm transition-colors ${
            selected === key 
              ? 'bg-blue-100 text-blue-800 border border-blue-200' 
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <div className={`w-3 h-3 rounded-full ${color}`} />
          <span>{label}</span>
        </button>
      ))}
    </div>
  );
};
const AuraStatsChart: React.FC<AuraStatsChartProps> = React.memo(function AuraStatsChart({ 
  data: initialData, 
  period = '7d' 
}) {
  const [data, setData] = useState<ChartDataPoint[]>(initialData || []);
  const [selectedMetric, setSelectedMetric] = useState<keyof Omit<ChartDataPoint, 'date'>>('messages');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const loadChartData = async () => {
    if (initialData && initialData.length > 0) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await auraService.stats.getChartData({ period });
      if (response.data && response.data.length > 0) {
        setData(response.data);
      } else {
        // Generate mock data for demonstration
        const mockData = generateMockData(period);
        setData(mockData);
      }
    } catch (err) {
      // Generate mock data as fallback
      const mockData = generateMockData(period);
      setData(mockData);
      notify.info('Dados de Demonstração', 'Usando dados simulados para demonstração.');
    } finally {
      setIsLoading(false);
    }
  };
  const generateMockData = (period: string): ChartDataPoint[] => {
    const days = period === '7d' ? 7 : period === '30d' ? 30 : 90;
    const data: ChartDataPoint[] = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      data.push({
        date: date.toISOString().split('T')[0],
        messages: Math.floor(Math.random() * 100) + 20,
        conversations: Math.floor(Math.random() * 30) + 5,
        conversions: Math.floor(Math.random() * 10) + 1,
      });
    }
    return data;
  };
  useEffect(() => {
    loadChartData();
  }, [period]);
  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('pt-BR', { 
        day: '2-digit', 
        month: '2-digit' 
      });
    } catch {
      return dateStr;
    }
  };
  const getMetricTotal = () => {
    return data.reduce((sum, d) => sum + d[selectedMetric], 0);
  };
  const getMetricAverage = () => {
    return data.length > 0 ? Math.round(getMetricTotal() / data.length) : 0;
  };
  if (isLoading) {
    return (
      <Card>
        <Card.Header>
          <Card.Title>Gráfico de Tendências</Card.Title>
        </Card.Header>
        <Card.Content>
          <LoadingSpinner text="Carregando dados do gráfico..." />
        </Card.Content>
      </Card>
    );
  }
  if (error && data.length === 0) {
    return (
      <Card>
        <Card.Header>
          <Card.Title>Gráfico de Tendências</Card.Title>
        </Card.Header>
        <Card.Content>
          <EmptyStates.Error 
            title="Erro ao carregar gráfico"
            description={error}
            action={{
              label: 'Tentar Novamente',
              onClick: loadChartData
            }}
          />
        </Card.Content>
      </Card>
    );
  }
  if (data.length === 0) {
    return (
      <Card>
        <Card.Header>
          <Card.Title>Gráfico de Tendências</Card.Title>
        </Card.Header>
        <Card.Content>
          <EmptyStates.NoStats 
            action={{
              label: 'Atualizar Dados',
              onClick: loadChartData
            }}
          />
        </Card.Content>
      </Card>
    );
  }
  return (
    <Card>
      <Card.Header>
        <div className="flex items-center justify-between">
          <Card.Title>Tendências ({period === '7d' ? '7 dias' : period === '30d' ? '30 dias' : '90 dias'})</Card.Title>
          <button
            onClick={loadChartData}
            className="text-blue-600 hover:text-blue-800 text-sm transition-colors"
            title="Atualizar gráfico"
          >
            🔄
          </button>
        </div>
      </Card.Header>
      <Card.Content className="space-y-4">
        <div className="flex items-center justify-between">
          <MetricSelector 
            selected={selectedMetric} 
            onChange={setSelectedMetric} 
          />
          <div className="text-right text-sm text-gray-600">
            <div>Total: <span className="font-medium">{getMetricTotal().toLocaleString()}</span></div>
            <div>Média: <span className="font-medium">{getMetricAverage()}</span>/dia</div>
          </div>
        </div>
        <SimpleLineChart data={data} metric={selectedMetric} />
        <div className="grid grid-cols-7 gap-1 text-xs text-gray-500 mt-2">
          {data.slice(-7).map((d, index) => (
            <div key={index} className="text-center">
              {formatDate(d.date)}
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between pt-4 border-t text-sm">
          <div className="text-gray-600">
            Período: {formatDate(data[0]?.date)} - {formatDate(data[data.length - 1]?.date)}
          </div>
          <div className="text-blue-600">
            {data.length} pontos de dados
          </div>
        </div>
      </Card.Content>
    </Card>
  );
});
export default AuraStatsChart;
