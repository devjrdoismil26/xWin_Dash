/**
 * Métricas principais de Analytics
 *
 * @description
 * Componente para exibir cards de métricas principais com valores,
 * comparações com período anterior, tendências e indicadores visuais.
 * Suporta múltiplos tipos de métricas (views, cliques, conversões, etc).
 *
 * @module modules/Analytics/components/AnalyticsMetrics
 * @since 1.0.0
 */

import React, { useMemo } from 'react';
import { Card } from '@/shared/components/ui/Card';
import { Badge } from '@/shared/components/ui/Badge';
import { TrendingUp, TrendingDown, Users, Eye, MousePointer, DollarSign, Clock, Target, Activity, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AnalyticsMetric } from '../types';

/**
 * Props do componente AnalyticsMetrics
 *
 * @interface AnalyticsMetricsProps
 * @property {AnalyticsMetric[]} [data] - Lista de métricas para exibir
 * @property {boolean} [loading] - Se está carregando dados
 * @property {string} [period] - Período selecionado para métricas
 * @property {string} [className] - Classes CSS adicionais
 */
interface AnalyticsMetricsProps {
  data?: AnalyticsMetric[];
  loading?: boolean;
  period?: string;
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

/**
 * Componente AnalyticsMetrics
 *
 * @description
 * Renderiza grid responsivo de cards de métricas com valores,
 * percentuais de mudança, ícones e cores baseadas em tendências.
 * Exibe estado de loading quando necessário.
 *
 * @param {AnalyticsMetricsProps} props - Props do componente
 * @returns {JSX.Element} Grid de métricas
 *
 * @example
 * ```tsx
 * <AnalyticsMetrics
 *   data={ metrics }
 *   period="30days"
 *   loading={ isLoading }
 * / />
 * ```
 */
export const AnalyticsMetrics: React.FC<AnalyticsMetricsProps> = ({ data = [] as unknown[],
  loading = false,
  period = '30days',
  className
   }) => {
  // Mock data para demonstração
  const mockMetrics: AnalyticsMetric[] = useMemo(() => [
    {
      id: '1',
      name: 'Page Views',
      type: 'page_views',
      value: 125000,
      previous_value: 110000,
      change_percentage: 13.6,
      trend: 'up',
      unit: 'views',
      description: 'Total page views in the selected period',
      timestamp: '2024-01-01T00:00:00Z'
    },
    {
      id: '2',
      name: 'Unique Visitors',
      type: 'unique_visitors',
      value: 45000,
      previous_value: 42000,
      change_percentage: 7.1,
      trend: 'up',
      unit: 'visitors',
      description: 'Number of unique visitors',
      timestamp: '2024-01-01T00:00:00Z'
    },
    {
      id: '3',
      name: 'Bounce Rate',
      type: 'bounce_rate',
      value: 35.2,
      previous_value: 38.5,
      change_percentage: -8.6,
      trend: 'down',
      unit: '%',
      description: 'Percentage of single-page sessions',
      timestamp: '2024-01-01T00:00:00Z'
    },
    {
      id: '4',
      name: 'Avg Session Duration',
      type: 'avg_session_duration',
      value: 245,
      previous_value: 220,
      change_percentage: 11.4,
      trend: 'up',
      unit: 'seconds',
      description: 'Average time spent on site',
      timestamp: '2024-01-01T00:00:00Z'
    },
    {
      id: '5',
      name: 'Conversion Rate',
      type: 'conversion_rate',
      value: 2.8,
      previous_value: 2.5,
      change_percentage: 12.0,
      trend: 'up',
      unit: '%',
      description: 'Percentage of visitors who convert',
      timestamp: '2024-01-01T00:00:00Z'
    },
    {
      id: '6',
      name: 'Revenue',
      type: 'revenue',
      value: 12500,
      previous_value: 11000,
      change_percentage: 13.6,
      trend: 'up',
      unit: '$',
      description: 'Total revenue generated',
      timestamp: '2024-01-01T00:00:00Z'
    }
  ], []);

  const metrics = (data as any).length > 0 ? data : mockMetrics;

  const getMetricIcon = (type: string) => {
    switch (type) {
      case 'page_views': return Eye;
      case 'unique_visitors': return Users;
      case 'bounce_rate': return MousePointer;
      case 'avg_session_duration': return Clock;
      case 'conversion_rate': return Target;
      case 'revenue': return DollarSign;
      default: return Activity;
    } ;

  const getMetricColor = (type: string) => {
    switch (type) {
      case 'page_views': return 'text-blue-600 bg-blue-100';
      case 'unique_visitors': return 'text-green-600 bg-green-100';
      case 'bounce_rate': return 'text-red-600 bg-red-100';
      case 'avg_session_duration': return 'text-purple-600 bg-purple-100';
      case 'conversion_rate': return 'text-orange-600 bg-orange-100';
      case 'revenue': return 'text-emerald-600 bg-emerald-100';
      default: return 'text-gray-600 bg-gray-100';
    } ;

  const formatValue = (value: number, unit: string) => {
    if (unit === '$') {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(value);

    }
    
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M ${unit}`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K ${unit}`;
    }
    
    return `${value.toLocaleString()} ${unit}`;};

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-red-600" />;
      default: return <Activity className="w-4 h-4 text-gray-600" />;
    } ;

  const getTrendColor = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return 'text-green-600 bg-green-50';
      case 'down': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    } ;

  if (loading) { return (
        <>
      <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", className)  }>
      </div>{[...Array(6)].map((_: unknown, index: unknown) => (
          <Card key={index} className="animate-pulse" />
            <Card.Content className="p-6" />
              <div className=" ">$2</div><div className=" ">$2</div><div className=" ">$2</div><div className="h-8 bg-gray-200 rounded w-32">
           
        </div><div className="h-10 w-10 bg-gray-200 rounded">
           
        </div></Card.Content>
      </Card>
    </>
  ))}
      </div>);

  }

  return (
        <>
      <div className={cn("space-y-6", className)  }>
      </div><div className=" ">$2</div><h2 className="text-lg font-semibold text-gray-900">Key Metrics</h2>
        <Badge variant="outline" className="text-xs" />
          {period}
        </Badge></div><div className="{(metrics || []).map((metric: unknown) => {">$2</div>
          const MetricIcon = getMetricIcon(metric.type);

          const isPositiveTrend = metric.trend === 'up';
          const isNegativeTrend = metric.trend === 'down';
          
          return (
        <>
      <Card key={metric.id} className="hover:shadow-md transition-shadow" />
      <Card.Content className="p-6" />
                <div className=" ">$2</div><div className=" ">$2</div><div className=" ">$2</div><h3 className="text-sm font-medium text-gray-600" />
                        {metric.name}
                      </h3>
                      {metric.description && (
                        <div className=" ">$2</div><div className=" ">$2</div><span className="text-xs text-gray-600">?</span></div><div className="{metric.description}">$2</div>
    </div>
  )}
                    </div>
                    
                    <div className="{formatValue(metric.value, metric.unit)}">$2</div>
                    </div>
                    
                    <div className={cn(
                      "flex items-center gap-1 text-sm",
                      getTrendColor(metric.trend)
                    )  }>
        </div>{getTrendIcon(metric.trend)}
                      <span>
           
        </span>{metric.change_percentage > 0 ? '+' : ''}{metric.change_percentage.toFixed(1)}%
                      </span>
                      <span className="text-gray-500">vs previous period</span></div><div className={cn("p-3 rounded-lg", getMetricColor(metric.type))  }>
        </div><MetricIcon className="w-6 h-6" /></div></Card.Content>
            </Card>);

        })}
      </div>
      
      {/* Summary Stats */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200" />
        <Card.Content className="p-6" />
          <div className=" ">$2</div><div>
           
        </div><h3 className="text-lg font-semibold text-gray-900 mb-2" />
                Performance Summary
              </h3>
              <p className="text-gray-600 text-sm" />
                Overall performance compared to previous period
              </p></div><div className=" ">$2</div><div className=" ">$2</div><TrendingUp className="w-5 h-5 text-green-600" />
                <span className="text-2xl font-bold text-green-600">+8.2%</span></div><p className="text-sm text-gray-500">Average improvement</p></div><div className=" ">$2</div><div className=" ">$2</div><div className="{(metrics || []).filter(m => m.trend === 'up').length}">$2</div>
              </div>
              <div className="text-sm text-gray-500">Improving</div>
            
            <div className=" ">$2</div><div className="{(metrics || []).filter(m => m.trend === 'down').length}">$2</div>
              </div>
              <div className="text-sm text-gray-500">Declining</div>
            
            <div className=" ">$2</div><div className="{(metrics || []).filter(m => m.trend === 'stable').length}">$2</div>
              </div>
              <div className="text-sm text-gray-500">Stable</div>
            
            <div className=" ">$2</div><div className="{metrics.length}">$2</div>
              </div>
              <div className="text-sm text-gray-500">Total Metrics</div></div></Card.Content></Card></div>);};

export default AnalyticsMetrics;