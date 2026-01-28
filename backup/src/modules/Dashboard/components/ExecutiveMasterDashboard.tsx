/**
 * Executive Master Dashboard - Módulo Dashboard
 * Visão executiva unificada de classe mundial 95%+
 */
import React, { useState, useEffect, useMemo, useCallback } from 'react';
// Design System
import { ENHANCED_TRANSITIONS, VISUAL_EFFECTS } from '@/components/ui/design-tokens';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  DollarSign, 
  Target, 
  Activity, 
  Brain, 
  MessageCircle, 
  ShoppingCart, 
  Mail, 
  Image, 
  Zap, 
  Calendar, 
  Clock, 
  Globe, 
  Smartphone, 
  Monitor, 
  ArrowUpRight, 
  ArrowDownRight, 
  Plus, 
  Minus, 
  RefreshCw, 
  Settings, 
  Download, 
  Filter, 
  Search,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Info,
  Star,
  Heart,
  ThumbsUp,
  Eye,
  MousePointer,
  Percent,
  PieChart,
  LineChart,
  BarChart,
  Layers,
  Database,
  Cpu,
  HardDrive,
  Wifi,
  WifiOff,
  PlayCircle,
  PauseCircle,
  StopCircle,
  Maximize2,
  Minimize2,
  ExternalLink
} from 'lucide-react';
// Hooks
import { useTranslation } from '../../../hooks/useTranslation';
// Componentes UI
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';
import { Select } from '../../../components/ui/select';
import Input from '../../../components/ui/Input';
import Progress from '../../../components/ui/Progress';
import Skeleton from '../../../components/ui/SkeletonLoaders';
import Tooltip from '../../../components/ui/Tooltip';
import BarChartComponent from '../../../components/ui/BarChart';
import Tabs from '../../../components/ui/Tabs';
import { ProgressBar, CircularProgress, StepProgress, OperationProgress, AnimatedCounter } from '../../../components/ui/AdvancedProgress';
import { LoadingSpinner, LoadingSkeleton, TableLoadingSkeleton, CardLoadingSkeleton } from '../../../components/ui/LoadingStates';
import { ResponsiveGrid, ResponsiveContainer, ShowOn } from '../../../components/ui/ResponsiveSystem';
import { Animated, PageTransition, AnimatedCounter as AnimatedCounterComponent } from '../../../components/ui/AdvancedAnimations';
import WorkspaceModeSelector from '../../../components/universe/WorkspaceModeSelector';
interface ExecutiveMetrics {
  // Métricas globais
  total_revenue: number;
  monthly_growth: number;
  total_users: number;
  active_sessions: number;
  conversion_rate: number;
  customer_satisfaction: number;
  // Performance por módulo
  modules: {
    leads: {
      count: number;
      quality_score: number;
      conversion_rate: number;
      growth: number;
    };
    campaigns: {
      active: number;
      total_spend: number;
      roas: number;
      performance: number;
    };
    ai: {
      requests: number;
      cost: number;
      efficiency: number;
      models_active: number;
    };
    aura: {
      connections: number;
      messages_sent: number;
      automation_rate: number;
      response_rate: number;
    };
    email: {
      campaigns_sent: number;
      open_rate: number;
      click_rate: number;
      revenue_generated: number;
    };
    social: {
      posts_scheduled: number;
      engagement_rate: number;
      reach: number;
      growth_rate: number;
    };
    analytics: {
      sessions: number;
      bounce_rate: number;
      avg_duration: number;
      goals_completed: number;
    };
  };
  // Alertas e notificações
  alerts: {
    critical: number;
    warning: number;
    info: number;
  };
  // Sistema
  system: {
    uptime: number;
    cpu_usage: number;
    memory_usage: number;
    storage_usage: number;
    response_time: number;
  };
}
interface RealtimeActivity {
  id: string;
  module: string;
  action: string;
  description: string;
  timestamp: string;
  type: 'success' | 'warning' | 'error' | 'info';
  user?: string;
  value?: number;
}
interface TopPerformers {
  campaigns: Array<{
    name: string;
    performance: number;
    revenue: number;
    type: string;
  }>;
  leads: Array<{
    name: string;
    score: number;
    source: string;
    value: number;
  }>;
  contents: Array<{
    title: string;
    engagement: number;
    platform: string;
    reach: number;
  }>;
}
const MOCK_METRICS: ExecutiveMetrics = {
  total_revenue: 1245678.90,
  monthly_growth: 15.7,
  total_users: 45678,
  active_sessions: 2847,
  conversion_rate: 4.2,
  customer_satisfaction: 4.7,
  modules: {
    leads: {
      count: 12456,
      quality_score: 87.5,
      conversion_rate: 3.8,
      growth: 22.4,
    },
    campaigns: {
      active: 34,
      total_spend: 89650.45,
      roas: 4.2,
      performance: 94.5,
    },
    ai: {
      requests: 156789,
      cost: 2456.78,
      efficiency: 92.1,
      models_active: 8,
    },
    aura: {
      connections: 12,
      messages_sent: 45678,
      automation_rate: 78.5,
      response_rate: 94.2,
    },
    email: {
      campaigns_sent: 156,
      open_rate: 28.5,
      click_rate: 5.7,
      revenue_generated: 45678.90,
    },
    social: {
      posts_scheduled: 234,
      engagement_rate: 6.8,
      reach: 456789,
      growth_rate: 18.9,
    },
    analytics: {
      sessions: 89456,
      bounce_rate: 38.5,
      avg_duration: 245,
      goals_completed: 3456,
    },
  },
  alerts: {
    critical: 2,
    warning: 5,
    info: 12,
  },
  system: {
    uptime: 99.8,
    cpu_usage: 72,
    memory_usage: 58,
    storage_usage: 34,
    response_time: 145,
  },
};
const MOCK_ACTIVITIES: RealtimeActivity[] = [
  {
    id: '1',
    module: 'Leads',
    action: 'Nova conversão',
    description: 'Lead João Silva converteu em cliente',
    timestamp: '2024-08-15T10:30:00Z',
    type: 'success',
    user: 'Sistema',
    value: 2500,
  },
  {
    id: '2',
    module: 'Campanhas',
    action: 'Otimização automática',
    description: 'Campanha Black Friday otimizada pelo AI',
    timestamp: '2024-08-15T10:28:00Z',
    type: 'info',
    user: 'AI Engine',
  },
  {
    id: '3',
    module: 'Aura',
    action: 'Conexão restaurada',
    description: 'WhatsApp Vendas reconectado',
    timestamp: '2024-08-15T10:25:00Z',
    type: 'success',
    user: 'Sistema',
  },
  {
    id: '4',
    module: 'AI',
    action: 'Limite atingido',
    description: 'Limite mensal de tokens GPT-4 em 85%',
    timestamp: '2024-08-15T10:20:00Z',
    type: 'warning',
    user: 'Monitor',
  },
];
const MOCK_TOP_PERFORMERS: TopPerformers = {
  campaigns: [
    { name: 'Black Friday Eletrônicos', performance: 94.5, revenue: 25670.45, type: 'google' },
    { name: 'Reconhecimento Marca Q4', performance: 87.2, revenue: 18950.23, type: 'facebook' },
    { name: 'Retargeting Carrinho', performance: 92.1, revenue: 15780.67, type: 'google' },
  ],
  leads: [
    { name: 'João Silva', score: 95, source: 'Google Ads', value: 5600 },
    { name: 'Maria Santos', score: 92, source: 'Facebook', value: 4200 },
    { name: 'Pedro Costa', score: 89, source: 'Orgânico', value: 3800 },
  ],
  contents: [
    { title: 'Guia Completo E-commerce 2024', engagement: 8.5, platform: 'LinkedIn', reach: 45678 },
    { title: 'Black Friday: Prepare-se!', engagement: 7.2, platform: 'Instagram', reach: 89456 },
    { title: 'Automação WhatsApp', engagement: 9.1, platform: 'YouTube', reach: 23456 },
  ],
};
interface ExecutiveMasterDashboardProps {
  className?: string;
}
const ExecutiveMasterDashboard: React.FC<ExecutiveMasterDashboardProps> = ({
  className = '',
}) => {
  const { t } = useT();
  const { showSuccess, showError, showInfo } = useAdvancedNotifications();
  const { operations, isFetching } = useDataLoadingStates();
  // State
  const [metrics, setMetrics] = useState<ExecutiveMetrics>(MOCK_METRICS);
  const [activities, setActivities] = useState<RealtimeActivity[]>(MOCK_ACTIVITIES);
  const [topPerformers, setTopPerformers] = useState<TopPerformers>(MOCK_TOP_PERFORMERS);
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [activeTab, setActiveTab] = useState('overview');
  const [realTimeEnabled, setRealTimeEnabled] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [expandedWidget, setExpandedWidget] = useState<string | null>(null);
  // Fetch data
  const fetchDashboardData = useCallback(async () => {
    try {
      await operations.fetch('executive-dashboard', async () => {
        await new Promise(resolve => setTimeout(resolve, 1500));
        // Mock real-time updates
        setMetrics(prev => ({
          ...prev,
          total_revenue: prev.total_revenue + Math.random() * 1000,
          active_sessions: Math.floor(Math.random() * 500) + 2500,
          modules: {
            ...prev.modules,
            leads: {
              ...prev.modules.leads,
              count: prev.modules.leads.count + Math.floor(Math.random() * 10),
            },
            ai: {
              ...prev.modules.ai,
              requests: prev.modules.ai.requests + Math.floor(Math.random() * 100),
            },
          },
        }));
        return true;
      });
    } catch (error) {
      showError('Erro ao carregar dashboard executivo');
    }
  }, [operations, showError]);
  // Chart data para módulos
  const modulePerformanceData = useMemo(() => {
    return [
      { name: 'Leads', performance: metrics.modules.leads.quality_score, revenue: metrics.modules.leads.count * 50 },
      { name: 'Campanhas', performance: metrics.modules.campaigns.performance, revenue: metrics.modules.campaigns.total_spend },
      { name: 'AI', performance: metrics.modules.ai.efficiency, revenue: metrics.modules.ai.cost },
      { name: 'Aura', performance: metrics.modules.aura.automation_rate, revenue: metrics.modules.aura.messages_sent * 0.02 },
      { name: 'Email', performance: metrics.modules.email.open_rate * 3, revenue: metrics.modules.email.revenue_generated },
      { name: 'Social', performance: metrics.modules.social.engagement_rate * 10, revenue: metrics.modules.social.reach * 0.01 },
    ];
  }, [metrics]);
  // Actions
  const handleRefresh = useCallback(() => {
    setRefreshKey(prev => prev + 1);
    fetchDashboardData();
    showSuccess('Dashboard executivo atualizado');
  }, [fetchDashboardData, showSuccess]);
  const handleWidgetExpand = useCallback((widgetId: string) => {
    setExpandedWidget(prev => prev === widgetId ? null : widgetId);
  }, []);
  // Real-time updates
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (realTimeEnabled) {
      interval = setInterval(() => {
        // Add new activity
        const newActivity: RealtimeActivity = {
          id: Date.now().toString(),
          module: ['Leads', 'AI', 'Aura', 'Campanhas'][Math.floor(Math.random() * 4)],
          action: 'Atividade em tempo real',
          description: 'Nova atividade detectada no sistema',
          timestamp: new Date().toISOString(),
          type: ['success', 'info', 'warning'][Math.floor(Math.random() * 3)] as any,
          user: 'Sistema',
        };
        setActivities(prev => [newActivity, ...prev.slice(0, 9)]);
        // Update metrics
        setMetrics(prev => ({
          ...prev,
          active_sessions: Math.floor(Math.random() * 200) + 2700,
          system: {
            ...prev.system,
            cpu_usage: Math.max(50, Math.min(90, prev.system.cpu_usage + (Math.random() - 0.5) * 10)),
            memory_usage: Math.max(40, Math.min(80, prev.system.memory_usage + (Math.random() - 0.5) * 8)),
            response_time: Math.max(100, Math.min(300, prev.system.response_time + (Math.random() - 0.5) * 20)),
          },
        }));
      }, 8000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [realTimeEnabled]);
  // Initial load
  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData, refreshKey]);
  const isLoading = isFetching('executive-dashboard');
  return (
    <PageTransition type="fade" duration={500}>
      <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Dashboard Executivo
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Visão unificada de performance e insights de todos os módulos da plataforma
          </p>
        </div>
        {/* Workspace Mode Selector */}
        <div className="flex justify-end">
          <WorkspaceModeSelector />
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
            className="flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Relatório</span>
          </Button>
        </div>
      </div>
      {/* System Status */}
      {realTimeEnabled && (
        <Card className="p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950 dark:to-blue-950">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                <span className="font-medium text-green-800 dark:text-green-200">
                  Sistema Operacional - Monitoramento Ativo
                </span>
              </div>
              <Badge variant="success">
                Uptime: {metrics.system.uptime}%
              </Badge>
            </div>
            <div className="flex items-center space-x-6 text-sm">
              <div className="flex items-center space-x-1">
                <Cpu className="h-4 w-4 text-blue-500" />
                <span>CPU: {metrics.system.cpu_usage}%</span>
              </div>
              <div className="flex items-center space-x-1">
                <Database className="h-4 w-4 text-purple-500" />
                <span>RAM: {metrics.system.memory_usage}%</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4 text-orange-500" />
                <span>{metrics.system.response_time}ms</span>
              </div>
              <div className="flex items-center space-x-1">
                <Users className="h-4 w-4 text-green-500" />
                <span>{metrics.active_sessions.toLocaleString()} ativos</span>
              </div>
            </div>
          </div>
        </Card>
      )}
      {/* Executive KPIs */}
      <ResponsiveGrid 
        columns={{ xs: 1, sm: 2, lg: 4 }}
        gap={{ xs: '1rem', md: '1.5rem' }}
      >
        {/* Total Revenue */}
        <Card className="backdrop-blur-xl bg-white/10 dark:bg-gray-900/10 border border-white/20 dark:border-gray-700/20 shadow-xl shadow-blue-500/10 hover:bg-white/20 dark:hover:bg-gray-900/20 transition-all duration-300 p-6">
          {isLoading ? (
            <LoadingSkeleton lines={2} />
          ) : (
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Receita Total
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  R$ <AnimatedCounterComponent 
                    value={metrics.total_revenue} 
                    duration={2000}
                    suffix=""
                  />
                </p>
                <div className="flex items-center mt-1">
                  <ArrowUpRight className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-600 ml-1">+{metrics.monthly_growth}% este mês</span>
                </div>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          )}
        </Card>
        {/* Active Users */}
        <Card className="backdrop-blur-xl bg-white/10 dark:bg-gray-900/10 border border-white/20 dark:border-gray-700/20 shadow-xl shadow-blue-500/10 hover:bg-white/20 dark:hover:bg-gray-900/20 transition-all duration-300 p-6">
          {isLoading ? (
            <LoadingSkeleton lines={2} />
          ) : (
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Usuários Ativos
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  <AnimatedCounterComponent 
                    value={metrics.active_sessions} 
                    duration={1500}
                  />
                </p>
                <div className="flex items-center mt-1">
                  <span className="text-sm text-gray-600">
                    de {metrics.total_users.toLocaleString()} totais
                  </span>
                </div>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          )}
        </Card>
        {/* Conversion Rate */}
        <Card className="backdrop-blur-xl bg-white/10 dark:bg-gray-900/10 border border-white/20 dark:border-gray-700/20 shadow-xl shadow-blue-500/10 hover:bg-white/20 dark:hover:bg-gray-900/20 transition-all duration-300 p-6">
          {isLoading ? (
            <LoadingSkeleton lines={2} />
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
                  <span className="text-sm text-green-600 ml-1">+0.7% vs. período anterior</span>
                </div>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <Target className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          )}
        </Card>
        {/* Customer Satisfaction */}
        <Card className="backdrop-blur-xl bg-white/10 dark:bg-gray-900/10 border border-white/20 dark:border-gray-700/20 shadow-xl shadow-blue-500/10 hover:bg-white/20 dark:hover:bg-gray-900/20 transition-all duration-300 p-6">
          {isLoading ? (
            <LoadingSkeleton lines={2} />
          ) : (
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Satisfação Cliente
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {metrics.customer_satisfaction.toFixed(1)}/5.0
                </p>
                <div className="flex items-center mt-1">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm text-yellow-600 ml-1">Excelente avaliação</span>
                </div>
              </div>
              <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                <Heart className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          )}
        </Card>
      </ResponsiveGrid>
      {/* Advanced Progress Indicators */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System Performance */}
        <Card>
          <Card.Header>
            <Card.Title>Performance do Sistema</Card.Title>
            <Card.Description>Monitoramento em tempo real dos recursos</Card.Description>
          </Card.Header>
          <Card.Content className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">CPU Usage</span>
                <span className="text-sm text-gray-600">{metrics.system.cpu_usage}%</span>
              </div>
              <ProgressBar 
                value={metrics.system.cpu_usage} 
                variant={metrics.system.cpu_usage > 80 ? 'danger' : metrics.system.cpu_usage > 60 ? 'warning' : 'default'}
                animated={realTimeEnabled}
                size="md"
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Memory Usage</span>
                <span className="text-sm text-gray-600">{metrics.system.memory_usage}%</span>
              </div>
              <ProgressBar 
                value={metrics.system.memory_usage} 
                variant={metrics.system.memory_usage > 80 ? 'danger' : metrics.system.memory_usage > 60 ? 'warning' : 'default'}
                animated={realTimeEnabled}
                size="md"
              />
            </div>
            <div className="flex justify-center pt-4">
              <CircularProgress 
                value={metrics.system.uptime} 
                size={120}
                variant="success"
                showPercentage={true}
                icon={<CheckCircle className="h-6 w-6 text-green-600" />}
              />
            </div>
          </Card.Content>
        </Card>
        {/* Operations Progress */}
        <Card>
          <Card.Header>
            <Card.Title>Operações em Andamento</Card.Title>
            <Card.Description>Acompanhe o progresso das operações ativas</Card.Description>
          </Card.Header>
          <Card.Content className="space-y-4">
            <OperationProgress
              operation={{
                type: 'ai',
                title: 'Processamento de IA',
                description: 'Gerando conteúdo com Gemini',
                progress: 75,
                status: 'running',
                eta: '2 min restantes',
                speed: '15 req/min'
              }}
            />
            <OperationProgress
              operation={{
                type: 'sync',
                title: 'Sincronização de Dados',
                description: 'Atualizando leads e campanhas',
                progress: 45,
                status: 'running',
                eta: '5 min restantes',
                speed: '120 items/min'
              }}
            />
            <OperationProgress
              operation={{
                type: 'upload',
                title: 'Upload de Arquivos',
                description: 'Enviando mídias para o servidor',
                progress: 100,
                status: 'completed',
                eta: 'Concluído',
                speed: '2.5 MB/s'
              }}
            />
          </Card.Content>
        </Card>
      </div>
      {/* Alerts Section */}
      {(metrics.alerts.critical > 0 || metrics.alerts.warning > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {metrics.alerts.critical > 0 && (
            <Card className="p-4 border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-800">
              <div className="flex items-center space-x-3">
                <XCircle className="h-5 w-5 text-red-500" />
                <div>
                  <p className="font-medium text-red-800 dark:text-red-200">
                    {metrics.alerts.critical} Alerta{metrics.alerts.critical > 1 ? 's' : ''} Crítico{metrics.alerts.critical > 1 ? 's' : ''}
                  </p>
                  <p className="text-sm text-red-600 dark:text-red-300">
                    Requer atenção imediata
                  </p>
                </div>
                <Button variant="ghost" size="sm" className="ml-auto">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          )}
          {metrics.alerts.warning > 0 && (
            <Card className="p-4 border-yellow-200 bg-yellow-50 dark:bg-yellow-950 dark:border-yellow-800">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                <div>
                  <p className="font-medium text-yellow-800 dark:text-yellow-200">
                    {metrics.alerts.warning} Aviso{metrics.alerts.warning > 1 ? 's' : ''}
                  </p>
                  <p className="text-sm text-yellow-600 dark:text-yellow-300">
                    Monitoramento recomendado
                  </p>
                </div>
                <Button variant="ghost" size="sm" className="ml-auto">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          )}
          <Card className="p-4 border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800">
            <div className="flex items-center space-x-3">
              <Info className="h-5 w-5 text-blue-500" />
              <div>
                <p className="font-medium text-blue-800 dark:text-blue-200">
                  {metrics.alerts.info} Informação{metrics.alerts.info > 1 ? 'ões' : ''}
                </p>
                <p className="text-sm text-blue-600 dark:text-blue-300">
                  Atualizações do sistema
                </p>
              </div>
              <Button variant="ghost" size="sm" className="ml-auto">
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        </div>
      )}
      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Module Performance Chart */}
        <div className="lg:col-span-2">
          <Card className="backdrop-blur-xl bg-white/10 dark:bg-gray-900/10 border border-white/20 dark:border-gray-700/20 shadow-xl shadow-blue-500/10 hover:bg-white/20 dark:hover:bg-gray-900/20 transition-all duration-300 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Performance por Módulo</h3>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleWidgetExpand('performance-chart')}
                >
                  {expandedWidget === 'performance-chart' ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                </Button>
                <Button variant="ghost" size="sm">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
            {isLoading ? (
              <Skeleton className="h-64" />
            ) : (
              <div className={expandedWidget === 'performance-chart' ? 'h-96' : 'h-64'}>
                <BarChartComponent
                  data={modulePerformanceData}
                  categories={['performance', 'revenue']}
                  index="name"
                  colors={['blue', 'green']}
                  valueFormatter={(value, name) => 
                    name === 'revenue' 
                      ? `R$ ${value.toLocaleString('pt-BR')}` 
                      : `${value.toFixed(1)}%`
                  }
                />
              </div>
            )}
          </Card>
        </div>
        {/* Real-time Activity Feed */}
        <Card className="backdrop-blur-xl bg-white/10 dark:bg-gray-900/10 border border-white/20 dark:border-gray-700/20 shadow-xl shadow-blue-500/10 hover:bg-white/20 dark:hover:bg-gray-900/20 transition-all duration-300 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Atividade em Tempo Real</h3>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs text-green-600">Live</span>
            </div>
          </div>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  activity.type === 'success' ? 'bg-green-500' :
                  activity.type === 'warning' ? 'bg-yellow-500' :
                  activity.type === 'error' ? 'bg-red-500' :
                  'bg-blue-500'
                }`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium truncate">{activity.module}</p>
                    <span className="text-xs text-gray-500">
                      {new Date(activity.timestamp).toLocaleTimeString('pt-BR', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{activity.action}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.description}</p>
                  {activity.value && (
                    <p className="text-xs font-medium text-green-600 mt-1">
                      +R$ {activity.value.toLocaleString('pt-BR')}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
      {/* Module Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Leads Module */}
        <Card className="backdrop-blur-xl bg-white/10 dark:bg-gray-900/10 border border-white/20 dark:border-gray-700/20 shadow-xl shadow-blue-500/10 hover:bg-white/20 dark:hover:bg-gray-900/20 transition-all duration-300 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <h4 className="font-medium">Gestão de Leads</h4>
            </div>
            <Badge variant="success">+{metrics.modules.leads.growth.toFixed(1)}%</Badge>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Total de Leads</span>
              <span className="font-medium">{metrics.modules.leads.count.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Score de Qualidade</span>
              <span className={`font-medium ${
                metrics.modules.leads.quality_score > 80 ? 'text-green-600' : 'text-yellow-600'
              }`}>
                {metrics.modules.leads.quality_score.toFixed(1)}/100
              </span>
            </div>
            <div className="flex justify-between">
              <span>Taxa de Conversão</span>
              <span className="font-medium">{metrics.modules.leads.conversion_rate.toFixed(1)}%</span>
            </div>
          </div>
        </Card>
        {/* AI Module */}
        <Card className="backdrop-blur-xl bg-white/10 dark:bg-gray-900/10 border border-white/20 dark:border-gray-700/20 shadow-xl shadow-blue-500/10 hover:bg-white/20 dark:hover:bg-gray-900/20 transition-all duration-300 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <Brain className="h-5 w-5 text-purple-600" />
              </div>
              <h4 className="font-medium">Inteligência Artificial</h4>
            </div>
            <Badge variant="info">{metrics.modules.ai.models_active} modelos</Badge>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Requisições Processadas</span>
              <span className="font-medium">{metrics.modules.ai.requests.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Eficiência</span>
              <span className={`font-medium ${
                metrics.modules.ai.efficiency > 90 ? 'text-green-600' : 'text-yellow-600'
              }`}>
                {metrics.modules.ai.efficiency.toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between">
              <span>Custo Total</span>
              <span className="font-medium">R$ {metrics.modules.ai.cost.toLocaleString('pt-BR')}</span>
            </div>
          </div>
        </Card>
        {/* Aura Module */}
        <Card className="backdrop-blur-xl bg-white/10 dark:bg-gray-900/10 border border-white/20 dark:border-gray-700/20 shadow-xl shadow-blue-500/10 hover:bg-white/20 dark:hover:bg-gray-900/20 transition-all duration-300 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <MessageCircle className="h-5 w-5 text-green-600" />
              </div>
              <h4 className="font-medium">Aura WhatsApp</h4>
            </div>
            <Badge variant="success">{metrics.modules.aura.connections} conectadas</Badge>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Mensagens Enviadas</span>
              <span className="font-medium">{metrics.modules.aura.messages_sent.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Taxa de Automação</span>
              <span className={`font-medium ${
                metrics.modules.aura.automation_rate > 75 ? 'text-green-600' : 'text-yellow-600'
              }`}>
                {metrics.modules.aura.automation_rate.toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between">
              <span>Taxa de Resposta</span>
              <span className="font-medium">{metrics.modules.aura.response_rate.toFixed(1)}%</span>
            </div>
          </div>
        </Card>
      </div>
      {/* Top Performers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Campaigns */}
        <Card className="backdrop-blur-xl bg-white/10 dark:bg-gray-900/10 border border-white/20 dark:border-gray-700/20 shadow-xl shadow-blue-500/10 hover:bg-white/20 dark:hover:bg-gray-900/20 transition-all duration-300 p-6">
          <h3 className="text-lg font-semibold mb-4">Top Campanhas</h3>
          <div className="space-y-3">
            {topPerformers.campaigns.map((campaign, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{campaign.name}</p>
                    <p className="text-xs text-gray-500">{campaign.type}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{campaign.performance}%</p>
                  <p className="text-xs text-gray-500">R$ {campaign.revenue.toLocaleString('pt-BR')}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
        {/* Top Leads */}
        <Card className="backdrop-blur-xl bg-white/10 dark:bg-gray-900/10 border border-white/20 dark:border-gray-700/20 shadow-xl shadow-blue-500/10 hover:bg-white/20 dark:hover:bg-gray-900/20 transition-all duration-300 p-6">
          <h3 className="text-lg font-semibold mb-4">Top Leads</h3>
          <div className="space-y-3">
            {topPerformers.leads.map((lead, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{lead.name}</p>
                    <p className="text-xs text-gray-500">{lead.source}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{lead.score}/100</p>
                  <p className="text-xs text-gray-500">R$ {lead.value.toLocaleString('pt-BR')}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
        {/* Top Contents */}
        <Card className="backdrop-blur-xl bg-white/10 dark:bg-gray-900/10 border border-white/20 dark:border-gray-700/20 shadow-xl shadow-blue-500/10 hover:bg-white/20 dark:hover:bg-gray-900/20 transition-all duration-300 p-6">
          <h3 className="text-lg font-semibold mb-4">Top Conteúdos</h3>
          <div className="space-y-3">
            {topPerformers.contents.map((content, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{content.title}</p>
                    <p className="text-xs text-gray-500">{content.platform}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{content.engagement}%</p>
                  <p className="text-xs text-gray-500">{content.reach.toLocaleString()} alcance</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
      </div>
    </PageTransition>
  );
};
export default ExecutiveMasterDashboard;
