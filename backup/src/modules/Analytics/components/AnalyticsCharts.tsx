/**
 * Componente de gráficos avançados para Analytics
 * Suporte a múltiplos tipos de visualização com interatividade
 */
import React, { useState, useMemo } from 'react';
import { Card } from "@/components/ui/Card";
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { 
  BarChart3, 
  LineChart, 
  PieChart, 
  TrendingUp, 
  TrendingDown,
  Activity,
  Download,
  RefreshCw,
  Settings,
  Eye,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { AnalyticsChart } from '../types';

interface AnalyticsChartsProps {
  data?: AnalyticsChart[];
  loading?: boolean;
  onChartClick?: (chart: AnalyticsChart) => void;
  onExport?: (chart: AnalyticsChart, format: string) => void;
  onRefresh?: () => void;
  className?: string;
}

export const AnalyticsCharts: React.FC<AnalyticsChartsProps> = ({
  data = [],
  loading = false,
  onChartClick,
  onExport,
  onRefresh,
  className
}) => {
  const [expandedChart, setExpandedChart] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d'>('30d');

  // Mock data para demonstração
  const mockCharts: AnalyticsChart[] = useMemo(() => [
    {
      id: '1',
      type: 'line',
      title: 'Page Views Over Time',
      data: [
        { date: '2024-01-01', value: 1200 },
        { date: '2024-01-02', value: 1350 },
        { date: '2024-01-03', value: 1100 },
        { date: '2024-01-04', value: 1450 },
        { date: '2024-01-05', value: 1600 },
        { date: '2024-01-06', value: 1800 },
        { date: '2024-01-07', value: 1750 },
      ],
      period: '7days',
      created_at: '2024-01-01T00:00:00Z',
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top' as const,
          },
          title: {
            display: true,
            text: 'Page Views Trend'
          }
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    },
    {
      id: '2',
      type: 'bar',
      title: 'Traffic Sources',
      data: [
        { source: 'Google', value: 45 },
        { source: 'Facebook', value: 25 },
        { source: 'Direct', value: 20 },
        { source: 'Referral', value: 10 },
      ],
      period: '30days',
      created_at: '2024-01-01T00:00:00Z',
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top' as const,
          },
          title: {
            display: true,
            text: 'Traffic Sources Distribution'
          }
        }
      }
    },
    {
      id: '3',
      type: 'pie',
      title: 'Device Types',
      data: [
        { device: 'Desktop', value: 60 },
        { device: 'Mobile', value: 30 },
        { device: 'Tablet', value: 10 },
      ],
      period: '30days',
      created_at: '2024-01-01T00:00:00Z',
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right' as const,
          },
          title: {
            display: true,
            text: 'Device Usage Distribution'
          }
        }
      }
    },
    {
      id: '4',
      type: 'area',
      title: 'Conversion Funnel',
      data: [
        { stage: 'Visitors', value: 10000 },
        { stage: 'Leads', value: 1000 },
        { stage: 'Customers', value: 100 },
        { stage: 'Revenue', value: 50 },
      ],
      period: '30days',
      created_at: '2024-01-01T00:00:00Z',
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top' as const,
          },
          title: {
            display: true,
            text: 'Conversion Funnel Analysis'
          }
        }
      }
    }
  ], []);

  const charts = data.length > 0 ? data : mockCharts;

  const getChartIcon = (type: string) => {
    switch (type) {
      case 'line': return LineChart;
      case 'bar': return BarChart3;
      case 'pie': return PieChart;
      case 'area': return Activity;
      default: return BarChart3;
    }
  };

  const getChartColor = (type: string) => {
    switch (type) {
      case 'line': return 'text-blue-600 bg-blue-100';
      case 'bar': return 'text-green-600 bg-green-100';
      case 'pie': return 'text-purple-600 bg-purple-100';
      case 'area': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTrendIcon = (chart: AnalyticsChart) => {
    // Mock trend calculation
    const values = chart.data.map((item: any) => item.value || 0);
    const firstValue = values[0] || 0;
    const lastValue = values[values.length - 1] || 0;
    
    if (lastValue > firstValue) {
      return <TrendingUp className="w-4 h-4 text-green-600" />;
    } else if (lastValue < firstValue) {
      return <TrendingDown className="w-4 h-4 text-red-600" />;
    }
    return <Activity className="w-4 h-4 text-gray-600" />;
  };

  const calculateTrend = (chart: AnalyticsChart) => {
    const values = chart.data.map((item: any) => item.value || 0);
    const firstValue = values[0] || 0;
    const lastValue = values[values.length - 1] || 0;
    
    if (firstValue === 0) return 0;
    return ((lastValue - firstValue) / firstValue) * 100;
  };

  const renderChart = (chart: AnalyticsChart) => {
    const ChartIcon = getChartIcon(chart.type);
    
    return (
      <div className="relative">
        {/* Chart Placeholder */}
        <div className="h-64 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <ChartIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-500">{chart.title}</p>
            <p className="text-xs text-gray-400 mt-1">
              {chart.data.length} data points
            </p>
          </div>
        </div>
        
        {/* Chart Actions Overlay */}
        <div className="absolute top-2 right-2 flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setExpandedChart(
              expandedChart === chart.id ? null : chart.id
            )}
            className="h-8 w-8 p-0 bg-white/80 hover:bg-white"
          >
            {expandedChart === chart.id ? (
              <Minimize2 className="w-4 h-4" />
            ) : (
              <Maximize2 className="w-4 h-4" />
            )}
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onExport?.(chart, 'png')}
            className="h-8 w-8 p-0 bg-white/80 hover:bg-white"
          >
            <Download className="w-4 h-4" />
          </Button>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <Card className={cn("", className)}>
        <Card.Header>
          <Card.Title className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Analytics Charts
          </Card.Title>
        </Card.Header>
        <Card.Content>
          <div className="flex items-center justify-center h-64">
            <RefreshCw className="w-6 h-6 animate-spin text-blue-600 mr-2" />
            <span className="text-gray-600">Loading charts...</span>
          </div>
        </Card.Content>
      </Card>
    );
  }

  return (
    <Card className={cn("", className)}>
      <Card.Header>
        <div className="flex items-center justify-between">
          <Card.Title className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Analytics Charts
            <Badge variant="outline" className="text-xs">
              {charts.length} charts
            </Badge>
          </Card.Title>
          
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Button
                variant={selectedPeriod === '7d' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedPeriod('7d')}
              >
                7D
              </Button>
              <Button
                variant={selectedPeriod === '30d' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedPeriod('30d')}
              >
                30D
              </Button>
              <Button
                variant={selectedPeriod === '90d' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedPeriod('90d')}
              >
                90D
              </Button>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>
      </Card.Header>
      
      <Card.Content>
        {charts.length === 0 ? (
          <div className="text-center py-8">
            <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Charts Available
            </h3>
            <p className="text-gray-600 mb-4">
              Create your first analytics chart to visualize your data.
            </p>
            <Button>
              <BarChart3 className="w-4 h-4 mr-2" />
              Create Chart
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {charts.map((chart) => {
              const ChartIcon = getChartIcon(chart.type);
              const trend = calculateTrend(chart);
              const isExpanded = expandedChart === chart.id;
              
              return (
                <div
                  key={chart.id}
                  className={cn(
                    "border rounded-lg p-4 hover:shadow-md transition-shadow",
                    isExpanded && "md:col-span-2"
                  )}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={cn("p-2 rounded-lg", getChartColor(chart.type))}>
                        <ChartIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{chart.title}</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          {getTrendIcon(chart)}
                          <span>
                            {trend > 0 ? '+' : ''}{trend.toFixed(1)}%
                          </span>
                          <span>•</span>
                          <span>{chart.period}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onChartClick?.(chart)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onExport?.(chart, 'csv')}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {renderChart(chart)}
                </div>
              );
            })}
          </div>
        )}
      </Card.Content>
    </Card>
  );
};

export default AnalyticsCharts;