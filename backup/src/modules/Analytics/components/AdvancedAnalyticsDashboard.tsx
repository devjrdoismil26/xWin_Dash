/**
 * Advanced Analytics Dashboard - Módulo Analytics
 * Dashboard de analytics de classe mundial com insights em tempo real
 */
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Eye, 
  MousePointer, 
  ShoppingCart, 
  DollarSign, 
  Target, 
  Calendar, 
  Filter, 
  Download, 
  RefreshCw, 
  Settings,
  ArrowUpRight,
  ArrowDownRight,
  Percent,
  Clock,
  Globe,
  Smartphone,
  Monitor,
  Tablet,
  MapPin,
  Zap,
  Sparkles,
  PieChart,
  LineChart,
  Activity,
  AlertTriangle,
  CheckCircle,
  Info,
  ExternalLink,
  Share2,
  Bookmark,
  PlayCircle,
  PauseCircle
} from 'lucide-react';
// Design System
import { ENHANCED_TRANSITIONS, VISUAL_EFFECTS } from '@/components/ui/design-tokens';
// Hooks
import { useT } from '@/hooks/useTranslation';
import { useAdvancedNotifications } from '@/hooks/useAdvancedNotifications';
import { useDataLoadingStates } from '@/hooks/useLoadingStates';
// Componentes
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { Select } from '@/components/ui/select';
import Input from '@/components/ui/Input';
import Progress from '@/components/ui/Progress';
import Skeleton from '@/components/ui/SkeletonLoaders';
import Tooltip from '@/components/ui/Tooltip';
import BarChart from '@/components/ui/BarChart';
import Tabs from '@/components/ui/Tabs';
interface AnalyticsMetrics {
  total_visits: number;
  unique_visitors: number;
  page_views: number;
  bounce_rate: number;
  avg_session_duration: number;
  conversion_rate: number;
  revenue: number;
  transactions: number;
  new_users_percentage: number;
  return_visitors_percentage: number;
  mobile_percentage: number;
  desktop_percentage: number;
  tablet_percentage: number;
  top_source: string;
  growth_rate: number;
  comparison_period: 'up' | 'down' | 'stable';
}
interface TrafficSource {
  source: string;
  visitors: number;
  percentage: number;
  change: number;
  conversion_rate: number;
  revenue: number;
}
interface PageMetrics {
  page: string;
  views: number;
  unique_views: number;
  avg_time: number;
  bounce_rate: number;
  conversion_rate: number;
  exit_rate: number;
}
interface ConversionFunnel {
  step: string;
  visitors: number;
  conversion_rate: number;
  drop_off: number;
  revenue: number;
}
interface GeographicData {
  country: string;
  visitors: number;
  percentage: number;
  revenue: number;
  conversion_rate: number;
}
interface RealTimeMetrics {
  active_users: number;
  page_views_last_hour: number;
  top_pages: string[];
  traffic_spike: boolean;
  server_response_time: number;
  error_rate: number;
}
const MOCK_METRICS: AnalyticsMetrics = {
  total_visits: 156789,
  unique_visitors: 124567,
  page_views: 489234,
  bounce_rate: 38.5,
  avg_session_duration: 245,
  conversion_rate: 3.8,
  revenue: 89650.45,
  transactions: 1456,
  new_users_percentage: 42.3,
  return_visitors_percentage: 57.7,
  mobile_percentage: 65.2,
  desktop_percentage: 28.4,
  tablet_percentage: 6.4,
  top_source: 'google',
  growth_rate: 15.7,
  comparison_period: 'up',
};
const MOCK_TRAFFIC_SOURCES: TrafficSource[] = [
  {
    source: 'Google',
    visitors: 45678,
    percentage: 36.7,
    change: 12.5,
    conversion_rate: 4.2,
    revenue: 32450.67,
  },
  {
    source: 'Facebook',
    visitors: 28934,
    percentage: 23.2,
    change: 8.9,
    conversion_rate: 3.1,
    revenue: 18920.34,
  },
  {
    source: 'Direct',
    visitors: 22456,
    percentage: 18.0,
    change: -2.1,
    conversion_rate: 5.8,
    revenue: 25780.12,
  },
  {
    source: 'Instagram',
    visitors: 15678,
    percentage: 12.6,
    change: 25.4,
    conversion_rate: 2.9,
    revenue: 8950.45,
  },
  {
    source: 'LinkedIn',
    visitors: 11789,
    percentage: 9.5,
    change: 18.7,
    conversion_rate: 6.2,
    revenue: 15670.23,
  },
];
const MOCK_PAGE_METRICS: PageMetrics[] = [
  {
    page: '/dashboard',
    views: 45678,
    unique_views: 34567,
    avg_time: 185,
    bounce_rate: 25.4,
    conversion_rate: 8.9,
    exit_rate: 15.2,
  },
  {
    page: '/produtos',
    views: 38945,
    unique_views: 29834,
    avg_time: 220,
    bounce_rate: 42.1,
    conversion_rate: 12.3,
    exit_rate: 35.7,
  },
  {
    page: '/checkout',
    views: 12456,
    unique_views: 11234,
    avg_time: 156,
    bounce_rate: 65.8,
    conversion_rate: 45.6,
    exit_rate: 28.9,
  },
];
const MOCK_CONVERSION_FUNNEL: ConversionFunnel[] = [
  {
    step: 'Visitantes',
    visitors: 124567,
    conversion_rate: 100,
    drop_off: 0,
    revenue: 0,
  },
  {
    step: 'Visualizaram Produto',
    visitors: 89456,
    conversion_rate: 71.8,
    drop_off: 28.2,
    revenue: 0,
  },
  {
    step: 'Adicionaram ao Carrinho',
    visitors: 25678,
    conversion_rate: 20.6,
    drop_off: 51.2,
    revenue: 0,
  },
  {
    step: 'Iniciaram Checkout',
    visitors: 12345,
    conversion_rate: 9.9,
    drop_off: 10.7,
    revenue: 0,
  },
  {
    step: 'Completaram Compra',
    visitors: 4567,
    conversion_rate: 3.7,
    drop_off: 6.2,
    revenue: 89650.45,
  },
];
const MOCK_GEOGRAPHIC_DATA: GeographicData[] = [
  {
    country: 'Brasil',
    visitors: 89456,
    percentage: 71.8,
    revenue: 64567.89,
    conversion_rate: 4.2,
  },
  {
    country: 'Estados Unidos',
    visitors: 15678,
    percentage: 12.6,
    revenue: 18945.67,
    conversion_rate: 5.8,
  },
  {
    country: 'Argentina',
    visitors: 8934,
    percentage: 7.2,
    revenue: 4567.23,
    conversion_rate: 2.9,
  },
  {
    country: 'Portugal',
    visitors: 5678,
    percentage: 4.6,
    revenue: 3456.78,
    conversion_rate: 3.4,
  },
  {
    country: 'Outros',
    visitors: 4821,
    percentage: 3.8,
    revenue: 2113.88,
    conversion_rate: 2.1,
  },
];
const MOCK_REALTIME: RealTimeMetrics = {
  active_users: 2847,
  page_views_last_hour: 12456,
  top_pages: ['/dashboard', '/produtos', '/campanhas'],
  traffic_spike: true,
  server_response_time: 145,
  error_rate: 0.8,
};
interface AdvancedAnalyticsDashboardProps {
  className?: string;
}
const AdvancedAnalyticsDashboard: React.FC<AdvancedAnalyticsDashboardProps> = ({
  className = '',
}) => {
  const { t } = useT();
  const { showSuccess, showError, showInfo } = useAdvancedNotifications();
  const { operations, isFetching } = useDataLoadingStates();
  // State
  const [metrics, setMetrics] = useState<AnalyticsMetrics>(MOCK_METRICS);
  const [trafficSources, setTrafficSources] = useState<TrafficSource[]>(MOCK_TRAFFIC_SOURCES);
  const [pageMetrics, setPageMetrics] = useState<PageMetrics[]>(MOCK_PAGE_METRICS);
  const [conversionFunnel, setConversionFunnel] = useState<ConversionFunnel[]>(MOCK_CONVERSION_FUNNEL);
  const [geographicData, setGeographicData] = useState<GeographicData[]>(MOCK_GEOGRAPHIC_DATA);
  const [realTimeMetrics, setRealTimeMetrics] = useState<RealTimeMetrics>(MOCK_REALTIME);
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [selectedView, setSelectedView] = useState('overview');
  const [realTimeEnabled, setRealTimeEnabled] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  // Fetch data
  const fetchAnalyticsData = useCallback(async () => {
    try {
      await operations.fetch('analytics-dashboard', async () => {
        await new Promise(resolve => setTimeout(resolve, 1200));
        // Mock data refresh with realistic variations
        setMetrics(prev => ({
          ...prev,
          total_visits: prev.total_visits + Math.floor(Math.random() * 100),
          unique_visitors: prev.unique_visitors + Math.floor(Math.random() * 80),
          page_views: prev.page_views + Math.floor(Math.random() * 200),
          revenue: prev.revenue + Math.random() * 500,
        }));
        if (realTimeEnabled) {
          setRealTimeMetrics(prev => ({
            ...prev,
            active_users: Math.floor(Math.random() * 1000) + 2000,
            page_views_last_hour: Math.floor(Math.random() * 5000) + 10000,
          }));
        }
        return true;
      });
    } catch (error) {
      showError('Erro ao carregar dados de analytics');
    }
  }, [operations, showError, realTimeEnabled]);
  // Chart data para tráfego por fonte
  const trafficSourceChartData = useMemo(() => {
    return trafficSources.map(source => ({
      name: source.source,
      visitors: source.visitors,
      revenue: source.revenue,
      conversion_rate: source.conversion_rate,
    }));
  }, [trafficSources]);
  // Chart data para funil de conversão
  const funnelChartData = useMemo(() => {
    return conversionFunnel.map(step => ({
      step: step.step,
      visitors: step.visitors,
      conversion_rate: step.conversion_rate,
    }));
  }, [conversionFunnel]);
  // Actions
  const handleRefresh = useCallback(() => {
    setRefreshKey(prev => prev + 1);
    fetchAnalyticsData();
    showSuccess('Analytics atualizados');
  }, [fetchAnalyticsData, showSuccess]);
  const handleExport = useCallback(async () => {
    try {
      await operations.export('analytics-data', async () => {
        await new Promise(resolve => setTimeout(resolve, 2000));
        return { filename: `analytics-${selectedPeriod}-${Date.now()}.csv` };
      });
      showSuccess('Relatório exportado com sucesso');
    } catch (error) {
      showError('Erro ao exportar relatório');
    }
  }, [operations, selectedPeriod, showSuccess, showError]);
  // Real-time updates
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (realTimeEnabled) {
      interval = setInterval(() => {
        setRealTimeMetrics(prev => ({
          ...prev,
          active_users: Math.floor(Math.random() * 500) + 2500,
          page_views_last_hour: prev.page_views_last_hour + Math.floor(Math.random() * 50),
          server_response_time: Math.floor(Math.random() * 100) + 100,
          error_rate: Math.random() * 2,
        }));
      }, 5000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [realTimeEnabled]);
  // Initial load
  useEffect(() => {
    fetchAnalyticsData();
  }, [fetchAnalyticsData, refreshKey]);
  const isLoading = isFetching('analytics-dashboard');
  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t('analytics.title')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Insights avançados e métricas de performance em tempo real
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Select
            value={selectedPeriod}
            onValueChange={setSelectedPeriod}
            className="w-32"
          >
            <option value="24h">24 horas</option>
            <option value="7d">7 dias</option>
            <option value="30d">30 dias</option>
            <option value="90d">90 dias</option>
            <option value="1y">1 ano</option>
          </Select>
          <Button
            variant={realTimeEnabled ? "primary" : "outline"}
            onClick={() => setRealTimeEnabled(!realTimeEnabled)}
            className="flex items-center space-x-2"
          >
            {realTimeEnabled ? <PauseCircle className="h-4 w-4" /> : <PlayCircle className="h-4 w-4" />}
            <span>Tempo Real</span>
          </Button>
          <Button
            variant="outline"
            onClick={handleRefresh}
            loading={isLoading}
            className="flex items-center space-x-2"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Atualizar</span>
          </Button>
          <Button
            variant="outline"
            onClick={handleExport}
            className="flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Exportar</span>
          </Button>
        </div>
      </div>
      {/* Real-time Alerts */}
      {realTimeEnabled && realTimeMetrics.traffic_spike && (
        <Card className="p-4 border-orange-200 bg-orange-50 dark:bg-orange-950 dark:border-orange-800">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            <div>
              <p className="font-medium text-orange-800 dark:text-orange-200">
                Pico de Tráfego Detectado
              </p>
              <p className="text-sm text-orange-600 dark:text-orange-300">
                +35% de visitantes nas últimas 2 horas. Monitor de performance ativo.
              </p>
            </div>
            <Button variant="ghost" size="sm" className="ml-auto">
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      )}
      {/* Real-time Metrics Bar */}
      {realTimeEnabled && (
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm font-medium">Tempo Real</span>
              </div>
            </div>
            <div className="flex items-center space-x-8">
              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">Usuários Ativos</p>
                <p className="text-xl font-bold text-green-600">
                  {realTimeMetrics.active_users.toLocaleString()}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">Páginas/Hora</p>
                <p className="text-xl font-bold text-blue-600">
                  {realTimeMetrics.page_views_last_hour.toLocaleString()}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">Tempo Resposta</p>
                <p className="text-xl font-bold text-purple-600">
                  {realTimeMetrics.server_response_time}ms
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">Taxa de Erro</p>
                <p className={`text-xl font-bold ${
                  realTimeMetrics.error_rate < 1 ? 'text-green-600' : 
                  realTimeMetrics.error_rate < 3 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {realTimeMetrics.error_rate.toFixed(1)}%
                </p>
              </div>
            </div>
          </div>
        </Card>
      )}
      {/* Main KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Visits */}
        <Card className="p-6 backdrop-blur-xl bg-white/10 dark:bg-gray-900/10 border border-white/20 dark:border-gray-700/20 hover:bg-white/20 dark:hover:bg-gray-900/20 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10">
          {isLoading ? (
            <Skeleton className="h-24" />
          ) : (
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total de Visitas
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {metrics.total_visits.toLocaleString()}
                </p>
                <div className="flex items-center mt-1">
                  <ArrowUpRight className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-600 ml-1">+{metrics.growth_rate}% vs. período anterior</span>
                </div>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          )}
        </Card>
        {/* Page Views */}
        <Card className="p-6 backdrop-blur-xl bg-white/10 dark:bg-gray-900/10 border border-white/20 dark:border-gray-700/20 hover:bg-white/20 dark:hover:bg-gray-900/20 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10">
          {isLoading ? (
            <Skeleton className="h-24" />
          ) : (
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Visualizações
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {metrics.page_views.toLocaleString()}
                </p>
                <div className="flex items-center mt-1">
                  <span className="text-sm text-gray-600">
                    {(metrics.page_views / metrics.total_visits).toFixed(1)} páginas/visita
                  </span>
                </div>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                <Eye className="h-6 w-6 text-green-600" />
              </div>
            </div>
          )}
        </Card>
        {/* Conversion Rate */}
        <Card className="p-6 backdrop-blur-xl bg-white/10 dark:bg-gray-900/10 border border-white/20 dark:border-gray-700/20 hover:bg-white/20 dark:hover:bg-gray-900/20 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10">
          {isLoading ? (
            <Skeleton className="h-24" />
          ) : (
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Taxa de Conversão
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {metrics.conversion_rate.toFixed(1)}%
                </p>
                <div className="flex items-center mt-1">
                  <ArrowUpRight className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-600 ml-1">+0.8% vs. período anterior</span>
                </div>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <Target className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          )}
        </Card>
        {/* Revenue */}
        <Card className="p-6 backdrop-blur-xl bg-white/10 dark:bg-gray-900/10 border border-white/20 dark:border-gray-700/20 hover:bg-white/20 dark:hover:bg-gray-900/20 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10">
          {isLoading ? (
            <Skeleton className="h-24" />
          ) : (
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Receita
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  R$ {metrics.revenue.toLocaleString('pt-BR')}
                </p>
                <div className="flex items-center mt-1">
                  <ArrowUpRight className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-600 ml-1">+22.4% vs. período anterior</span>
                </div>
              </div>
              <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-lg">
                <DollarSign className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          )}
        </Card>
      </div>
      {/* Secondary KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Bounce Rate */}
        <Card className="p-6 backdrop-blur-xl bg-white/10 dark:bg-gray-900/10 border border-white/20 dark:border-gray-700/20 hover:bg-white/20 dark:hover:bg-gray-900/20 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Taxa de Rejeição</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {metrics.bounce_rate.toFixed(1)}%
              </p>
            </div>
            <Progress value={metrics.bounce_rate} className="w-20 h-2" />
          </div>
        </Card>
        {/* Avg Session Duration */}
        <Card className="p-6 backdrop-blur-xl bg-white/10 dark:bg-gray-900/10 border border-white/20 dark:border-gray-700/20 hover:bg-white/20 dark:hover:bg-gray-900/20 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Duração Média</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {Math.floor(metrics.avg_session_duration / 60)}m {metrics.avg_session_duration % 60}s
              </p>
            </div>
            <Clock className="h-6 w-6 text-gray-400" />
          </div>
        </Card>
        {/* Device Distribution */}
        <Card className="p-6 backdrop-blur-xl bg-white/10 dark:bg-gray-900/10 border border-white/20 dark:border-gray-700/20 hover:bg-white/20 dark:hover:bg-gray-900/20 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">Dispositivos</p>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Smartphone className="h-4 w-4 text-blue-500" />
                  <span className="text-sm">Mobile</span>
                </div>
                <span className="text-sm font-medium">{metrics.mobile_percentage.toFixed(1)}%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Monitor className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Desktop</span>
                </div>
                <span className="text-sm font-medium">{metrics.desktop_percentage.toFixed(1)}%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Tablet className="h-4 w-4 text-purple-500" />
                  <span className="text-sm">Tablet</span>
                </div>
                <span className="text-sm font-medium">{metrics.tablet_percentage.toFixed(1)}%</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
      {/* Main Content Tabs */}
      <Tabs value={selectedView} onValueChange={setSelectedView}>
        <div className="border-b">
          <nav className="flex space-x-8">
            <button 
              className={`py-2 px-1 border-b-2 text-sm font-medium ${
                selectedView === 'overview' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setSelectedView('overview')}
            >
              Visão Geral
            </button>
            <button 
              className={`py-2 px-1 border-b-2 text-sm font-medium ${
                selectedView === 'sources' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setSelectedView('sources')}
            >
              Fontes de Tráfego
            </button>
            <button 
              className={`py-2 px-1 border-b-2 text-sm font-medium ${
                selectedView === 'pages' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setSelectedView('pages')}
            >
              Páginas
            </button>
            <button 
              className={`py-2 px-1 border-b-2 text-sm font-medium ${
                selectedView === 'conversions' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setSelectedView('conversions')}
            >
              Conversões
            </button>
            <button 
              className={`py-2 px-1 border-b-2 text-sm font-medium ${
                selectedView === 'geographic' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setSelectedView('geographic')}
            >
              Geografia
            </button>
          </nav>
        </div>
        {/* Overview Tab */}
        {selectedView === 'overview' && (
          <div className="mt-6 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Traffic Sources Chart */}
              <Card className="p-6 backdrop-blur-xl bg-white/10 dark:bg-gray-900/10 border border-white/20 dark:border-gray-700/20 hover:bg-white/20 dark:hover:bg-gray-900/20 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Fontes de Tráfego</h3>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
                {isLoading ? (
                  <Skeleton className="h-64" />
                ) : (
                  <div className="h-64">
                    <BarChart
                      data={trafficSourceChartData}
                      categories={['visitors', 'revenue']}
                      index="name"
                      colors={['blue', 'green']}
                      valueFormatter={(value, name) => 
                        name === 'revenue' 
                          ? `R$ ${value.toLocaleString('pt-BR')}` 
                          : value.toLocaleString()
                      }
                    />
                  </div>
                )}
              </Card>
              {/* Conversion Funnel */}
              <Card className="p-6 backdrop-blur-xl bg-white/10 dark:bg-gray-900/10 border border-white/20 dark:border-gray-700/20 hover:bg-white/20 dark:hover:bg-gray-900/20 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Funil de Conversão</h3>
                  <Button variant="ghost" size="sm">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
                {isLoading ? (
                  <Skeleton className="h-64" />
                ) : (
                  <div className="space-y-3">
                    {conversionFunnel.map((step, index) => (
                      <div key={step.step} className="relative">
                        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                              {index + 1}
                            </div>
                            <span className="font-medium">{step.step}</span>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{step.visitors.toLocaleString()}</p>
                            <p className="text-sm text-gray-500">{step.conversion_rate.toFixed(1)}%</p>
                          </div>
                        </div>
                        {index < conversionFunnel.length - 1 && (
                          <div className="absolute left-4 top-full w-0.5 h-3 bg-gray-300 dark:bg-gray-600" />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </div>
          </div>
        )}
        {/* Traffic Sources Tab */}
        {selectedView === 'sources' && (
          <div className="mt-6">
            <Card className="p-6 backdrop-blur-xl bg-white/10 dark:bg-gray-900/10 border border-white/20 dark:border-gray-700/20 hover:bg-white/20 dark:hover:bg-gray-900/20 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Análise de Fontes de Tráfego</h3>
                <div className="flex items-center space-x-2">
                  <Select defaultValue="all">
                    <option value="all">Todas as Fontes</option>
                    <option value="paid">Pago</option>
                    <option value="organic">Orgânico</option>
                    <option value="social">Social</option>
                  </Select>
                </div>
              </div>
              {isLoading ? (
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-16" />
                  ))}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium">Fonte</th>
                        <th className="text-right py-3 px-4 font-medium">Visitantes</th>
                        <th className="text-right py-3 px-4 font-medium">%</th>
                        <th className="text-right py-3 px-4 font-medium">Mudança</th>
                        <th className="text-right py-3 px-4 font-medium">Conv. Rate</th>
                        <th className="text-right py-3 px-4 font-medium">Receita</th>
                      </tr>
                    </thead>
                    <tbody>
                      {trafficSources.map((source) => (
                        <tr key={source.source} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                          <td className="py-3 px-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                                <Globe className="h-4 w-4 text-blue-600" />
                              </div>
                              <span className="font-medium">{source.source}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-right font-medium">
                            {source.visitors.toLocaleString()}
                          </td>
                          <td className="py-3 px-4 text-right">
                            {source.percentage.toFixed(1)}%
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className={`flex items-center justify-end space-x-1 ${
                              source.change > 0 ? 'text-green-600' : 
                              source.change < 0 ? 'text-red-600' : 'text-gray-600'
                            }`}>
                              {source.change > 0 ? (
                                <ArrowUpRight className="h-4 w-4" />
                              ) : source.change < 0 ? (
                                <ArrowDownRight className="h-4 w-4" />
                              ) : null}
                              <span>{Math.abs(source.change).toFixed(1)}%</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-right">
                            {source.conversion_rate.toFixed(1)}%
                          </td>
                          <td className="py-3 px-4 text-right font-medium">
                            R$ {source.revenue.toLocaleString('pt-BR')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          </div>
        )}
        {/* Pages Tab */}
        {selectedView === 'pages' && (
          <div className="mt-6">
            <Card className="p-6 backdrop-blur-xl bg-white/10 dark:bg-gray-900/10 border border-white/20 dark:border-gray-700/20 hover:bg-white/20 dark:hover:bg-gray-900/20 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Performance das Páginas</h3>
                <div className="flex items-center space-x-2">
                  <Input placeholder="Buscar páginas..." className="w-64" />
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              {isLoading ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-16" />
                  ))}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium">Página</th>
                        <th className="text-right py-3 px-4 font-medium">Visualizações</th>
                        <th className="text-right py-3 px-4 font-medium">Únicos</th>
                        <th className="text-right py-3 px-4 font-medium">Tempo Médio</th>
                        <th className="text-right py-3 px-4 font-medium">Taxa Rejeição</th>
                        <th className="text-right py-3 px-4 font-medium">Conv. Rate</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pageMetrics.map((page) => (
                        <tr key={page.page} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                          <td className="py-3 px-4">
                            <span className="font-mono text-sm">{page.page}</span>
                          </td>
                          <td className="py-3 px-4 text-right font-medium">
                            {page.views.toLocaleString()}
                          </td>
                          <td className="py-3 px-4 text-right">
                            {page.unique_views.toLocaleString()}
                          </td>
                          <td className="py-3 px-4 text-right">
                            {Math.floor(page.avg_time / 60)}m {page.avg_time % 60}s
                          </td>
                          <td className="py-3 px-4 text-right">
                            <span className={
                              page.bounce_rate < 30 ? 'text-green-600' :
                              page.bounce_rate < 50 ? 'text-yellow-600' : 'text-red-600'
                            }>
                              {page.bounce_rate.toFixed(1)}%
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <span className={
                              page.conversion_rate > 10 ? 'text-green-600' :
                              page.conversion_rate > 5 ? 'text-yellow-600' : 'text-red-600'
                            }>
                              {page.conversion_rate.toFixed(1)}%
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          </div>
        )}
        {/* Geography Tab */}
        {selectedView === 'geographic' && (
          <div className="mt-6">
            <Card className="p-6 backdrop-blur-xl bg-white/10 dark:bg-gray-900/10 border border-white/20 dark:border-gray-700/20 hover:bg-white/20 dark:hover:bg-gray-900/20 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Análise Geográfica</h3>
                <Badge variant="info">Top 5 Países</Badge>
              </div>
              {isLoading ? (
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-16" />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {geographicData.map((country, index) => (
                    <div key={country.country} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center justify-center w-8 h-8 bg-blue-100 dark:bg-blue-900 text-blue-600 rounded-lg font-medium">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium">{country.country}</p>
                          <p className="text-sm text-gray-500">{country.percentage.toFixed(1)}% do tráfego total</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-8">
                        <div className="text-center">
                          <p className="text-sm font-medium">{country.visitors.toLocaleString()}</p>
                          <p className="text-xs text-gray-500">Visitantes</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-medium">{country.conversion_rate.toFixed(1)}%</p>
                          <p className="text-xs text-gray-500">Conv. Rate</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-medium">R$ {country.revenue.toLocaleString('pt-BR')}</p>
                          <p className="text-xs text-gray-500">Receita</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        )}
      </Tabs>
    </div>
  );
};
export default AdvancedAnalyticsDashboard;
