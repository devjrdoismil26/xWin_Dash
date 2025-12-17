/**
 * @module AuraStatsChart
 * @description Componente para exibir gráfico de tendências de estatísticas do Aura.
 * 
 * Este componente exibe um gráfico de linha SVG com tendências de mensagens, conversas
 * e conversões ao longo do tempo. Permite selecionar diferentes métricas e períodos
 * (7 dias, 30 dias, 90 dias). Carrega dados da API ou usa dados mock em caso de erro.
 * 
 * @example
 * ```tsx
 * <AuraStatsChart
 *   data={ chartData }
 *   period="30d"
 * / />
 * ```
 * 
 * @since 1.0.0
 */

import React, { useState, useEffect } from 'react';
import Card from '@/shared/components/ui/Card';
import { LoadingSpinner } from '@/shared/components/ui/LoadingStates';
import { EmptyStates } from '@/shared/components/ui/EmptyState';
import auraService from '@/services/auraService';
import { useAdvancedNotifications } from '@/hooks/useAdvancedNotifications';

/**
 * Interface para um ponto de dados do gráfico
 * 
 * @interface ChartDataPoint
 * @property {string} date - Data do ponto (formato ISO string ou YYYY-MM-DD)
 * @property {number} messages - Número de mensagens na data
 * @property {number} conversations - Número de conversas na data
 * @property {number} conversions - Número de conversões na data
 */
interface ChartDataPoint {
  /** Data do ponto de dados */
  date: string;
  /** Número de mensagens na data */
  messages: number;
  /** Número de conversas na data */
  conversations: number;
  /** Número de conversões na data */
  conversions: number; }

/**
 * Interface para as propriedades do componente AuraStatsChart
 * 
 * @interface AuraStatsChartProps
 * @property {ChartDataPoint[]} [data] - Dados iniciais do gráfico (opcional, se não fornecido, carrega via API)
 * @property {'7d' | '30d' | '90d'} [period] - Período do gráfico (padrão: '7d')
 */
interface AuraStatsChartProps {
  /** Dados iniciais do gráfico (se fornecido, não carrega via API) */
data?: ChartDataPoint[];
  /** Período do gráfico (padrão: '7d') */
period?: '7d' | '30d' | '90d';
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

/**
 * Componente de gráfico de linha SVG simples para visualização básica
 * 
 * @interface SimpleLineChartProps
 * @property {ChartDataPoint[]} data - Dados do gráfico
 * @property {keyof Omit<ChartDataPoint, 'date'>} metric - Métrica a ser exibida
 */
interface SimpleLineChartProps {
  /** Dados do gráfico */
data: ChartDataPoint[];
  /** Métrica a ser exibida (messages, conversations ou conversions) */
metric: keyof Omit<ChartDataPoint, 'date'>;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties; }

/**
 * Componente de gráfico de linha SVG simples
 * 
 * @param {SimpleLineChartProps} props - Propriedades do componente
 * @returns {JSX.Element} Componente renderizado
 */
const SimpleLineChart: React.FC<SimpleLineChartProps> = ({ data, 
  metric 
   }) => {
  const values = (data || []).map(d => d[metric]);

  const maxValue = Math.max(...values);

  const minValue = Math.min(...values);

  const range = maxValue - minValue || 1;
  const points = (data || []).map((d: unknown, index: unknown) => {
    const x = (index / (data.length - 1)) * 300;
    const y = 100 - ((d[metric] - minValue) / range) * 80;
    return `${x},${y}`;
  }).join(' ');

  return (
            <div className=" ">$2</div><svg width="100%" height="100%" viewBox="0 0 300 100" className="overflow-visible" />
        <polyline
          fill="none"
          stroke="#3B82F6"
          strokeWidth="2"
          points={ points  }>
          {(data || []).map((d: unknown, index: unknown) => {
          const x = (index / (data.length - 1)) * 300;
          const y = 100 - ((d[metric] - minValue) / range) * 80;
          return (
        <>
      <circle
              key={ index }
              cx={ x }
              cy={ y }
              r="3"
              fill="#3B82F6"
              className="hover:r-4 cursor-pointer" />
      <title>{`${d.date}: ${d[metric]}`}</title>
            </circle>);

        })}
      </svg>
    </div>);};

/**
 * Interface para as propriedades do componente MetricSelector
 * 
 * @interface MetricSelectorProps
 * @property {keyof Omit<ChartDataPoint, 'date'>} selected - Métrica selecionada
 * @property {(metric: keyof Omit<ChartDataPoint, 'date'>) => void} onChange - Callback quando a métrica é alterada
 */
interface MetricSelectorProps {
  /** Métrica selecionada atualmente */
selected: keyof Omit<ChartDataPoint, 'date'>;
  /** Callback chamado quando a métrica é alterada */
onChange?: (e: any) => void;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties; }

/**
 * Componente seletor de métricas para o gráfico
 * 
 * @param {MetricSelectorProps} props - Propriedades do componente
 * @returns {JSX.Element} Componente renderizado
 */
const MetricSelector: React.FC<MetricSelectorProps> = ({ selected, onChange    }) => {
  const metrics = [
    { key: 'messages' as const, label: 'Mensagens', color: 'bg-blue-500' },
    { key: 'conversations' as const, label: 'Conversas', color: 'bg-green-500' },
    { key: 'conversions' as const, label: 'Conversões', color: 'bg-purple-500' },
  ];
  return (
            <div className="{(metrics || []).map(({ key, label, color }) => (">$2</div>
        <button
          key={ key }
          onClick={ () => onChange(key) }
          className={`flex items-center space-x-2 px-3 py-1 rounded-md text-sm transition-colors ${
            selected === key 
              ? 'bg-blue-100 text-blue-800 border border-blue-200' 
              : 'text-gray-600 hover:bg-gray-100'
          } `}
  >
          <div className={`w-3 h-3 rounded-full ${color} `} />
           
        </div><span>{label}</span>
      </button>
    </>
  ))}
    </div>);};

/**
 * Componente para exibir gráfico de tendências de estatísticas do Aura
 * 
 * Componente memoizado para otimização de performance.
 * 
 * @param {AuraStatsChartProps} props - Propriedades do componente
 * @returns {JSX.Element} Componente renderizado
 */
const AuraStatsChart: React.FC<AuraStatsChartProps> = React.memo(function AuraStatsChart({ 
  data: initialData, 
  period = '7d' 
}) {
  const [data, setData] = useState<ChartDataPoint[]>(initialData || []);

  const [selectedMetric, setSelectedMetric] = useState<keyof Omit<ChartDataPoint, 'date'>>('messages');

  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const { notify } = useAdvancedNotifications();

  /**
   * Carrega os dados do gráfico da API
   * 
   * Se initialData for fornecido e não estiver vazio, não carrega da API.
   * Em caso de erro, gera dados mock como fallback.
   * 
   * @async
   */
  const loadChartData = async () => {
    if (initialData && initialData.length > 0) return;
    setIsLoading(true);

    setError(null);

    try {
      const response = await auraService.stats.getChartData({ period });

      if (response.data && (response as any).data.length > 0) {
        setData(response.data);

      } else {
        // Generate mock data for demonstration
        const mockData = generateMockData(period);

        setData(mockData);

      } catch (err) {
      // Generate mock data as fallback
      const mockData = generateMockData(period);

      setData(mockData);

      notify?.info('Dados de Demonstração', 'Usando dados simulados para demonstração.');

    } finally {
      setIsLoading(false);

    } ;

  /**
   * Gera dados mock para demonstração
   * 
   * @param {string} period - Período para gerar dados ('7d', '30d' ou '90d')
   * @returns {ChartDataPoint[]} Array de pontos de dados mock
   */
  const generateMockData = (period: string): ChartDataPoint[] => {
    const days = period === '7d' ? 7 : period === '30d' ? 30 : 90;
    const data: ChartDataPoint[] = [] as unknown[];
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();

      date.setDate(date.getDate() - i);

      (data as any).push({
        date: date.toISOString().split('T')[0],
        messages: Math.floor(Math.random() * 100) + 20,
        conversations: Math.floor(Math.random() * 30) + 5,
        conversions: Math.floor(Math.random() * 10) + 1,
      });

    }
    return data;};

  useEffect(() => {
    loadChartData();

  }, [period]);

  /**
   * Formata uma data para exibição (DD/MM)
   * 
   * @param {string} dateStr - Data em formato ISO string ou YYYY-MM-DD
   * @returns {string} Data formatada ou a string original se houver erro
   */
  const formatDate = (dateStr: string): string => {
    try {
      return new Date(dateStr).toLocaleDateString('pt-BR', { 
        day: '2-digit', 
        month: '2-digit' 
      });

    } catch {
      return dateStr;
    } ;

  /**
   * Calcula o total da métrica selecionada
   * 
   * @returns {number} Soma total da métrica selecionada
   */
  const getMetricTotal = (): number => {
    return (data as any).reduce((sum: unknown, d: unknown) => sum + d[selectedMetric], 0);};

  /**
   * Calcula a média diária da métrica selecionada
   * 
   * @returns {number} Média diária arredondada
   */
  const getMetricAverage = (): number => {
    return (data as any).length > 0 ? Math.round(getMetricTotal() / (data as any).length) : 0;};

  if (isLoading) {
    return (
        <>
      <Card />
      <Card.Header />
          <Card.Title>Gráfico de Tendências</Card.Title>
        </Card.Header>
        <Card.Content />
          <LoadingSpinner text="Carregando dados do gráfico..." / />
        </Card.Content>
      </Card>);

  }
  if (error && (data as any).length === 0) {
    return (
        <>
      <Card />
      <Card.Header />
          <Card.Title>Gráfico de Tendências</Card.Title>
        </Card.Header>
        <Card.Content />
          <EmptyStates.Error 
            title="Erro ao carregar gráfico"
            description={ error }
            action={
              label: 'Tentar Novamente',
              onClick: loadChartData
            } / />
        </Card.Content>
      </Card>);

  }
  if (data.length === 0) {
    return (
        <>
      <Card />
      <Card.Header />
          <Card.Title>Gráfico de Tendências</Card.Title>
        </Card.Header>
        <Card.Content />
          <EmptyStates.NoStats 
            action={
              label: 'Atualizar Dados',
              onClick: loadChartData
            } / />
        </Card.Content>
      </Card>);

  }
  return (
        <>
      <Card />
      <Card.Header />
        <div className=" ">$2</div><Card.Title>Tendências ({period === '7d' ? '7 dias' : period === '30d' ? '30 dias' : '90 dias'})</Card.Title>
          <button
            onClick={ loadChartData }
            className="text-blue-600 hover:text-blue-800 text-sm transition-colors"
            title="Atualizar gráfico" />
            🔄
          </button></div></Card.Header>
      <Card.Content className="space-y-6" />
        <div className=" ">$2</div><MetricSelector 
            selected={ selectedMetric }
            onChange={ setSelectedMetric }
          / />
          <div className=" ">$2</div><div>Total: <span className="font-medium">{getMetricTotal().toLocaleString()}</span></div><div>Média: <span className="font-medium">{getMetricAverage()}</span>/dia</div></div><SimpleLineChart data={data} metric={selectedMetric} / />
        <div className="{data.slice(-7).map((d: unknown, index: unknown) => (">$2</div>
            <div key={index} className="text-center">
            {formatDate(d.date)}
          </div>
          ))}
        </div>
        <div className=" ">$2</div><div className="Período: {formatDate(data[0]?.date)} - {formatDate(data[data.length - 1]?.date)}">$2</div>
          </div>
          <div className="{data.length} pontos de dados">$2</div>
          </div>
      </Card.Content>
    </Card>);

});

export default AuraStatsChart;
