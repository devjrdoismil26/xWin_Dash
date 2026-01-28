/**
 * Advanced Analytics - Sistema de Analytics Avançado
 * Componente para análises profundas, insights de IA e relatórios inteligentes
 */
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  PieChart,
  LineChart,
  Activity,
  Brain,
  Target,
  Zap,
  Users,
  DollarSign,
  Eye,
  MousePointer,
  Calendar,
  Filter,
  Download,
  RefreshCw,
  Settings,
  Search,
  AlertTriangle,
  CheckCircle,
  Info,
  Clock,
  Globe,
  Smartphone,
  Monitor,
  Tablet,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Maximize2,
  Minimize2,
  RotateCcw,
  Play,
  Pause,
  Square
} from 'lucide-react';
import Card from './Card';
import Button from './Button';
import Badge from './Badge';
import Input from './Input';
import Select from './Select';
import { AnimatedCounter } from './AdvancedAnimations';
import { ENHANCED_TRANSITIONS, VISUAL_EFFECTS } from './design-tokens';

export interface MetricData {
  id: string;
  name: string;
  value: number;
  previousValue?: number;
  change?: number;
  changeType?: 'increase' | 'decrease' | 'stable';
  format?: 'number' | 'currency' | 'percentage';
  unit?: string;
  description?: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  trend?: Array<{
    date: string;
    value: number;
  }>;
}

export interface ChartData {
  id: string;
  title: string;
  type: 'line' | 'bar' | 'pie' | 'area' | 'scatter' | 'heatmap';
  data: any[];
  config?: {
    xAxis?: string;
    yAxis?: string;
    color?: string;
    showLegend?: boolean;
    showTooltip?: boolean;
    stacked?: boolean;
  };
  insights?: string[];
}

export interface Insight {
  id: string;
  type: 'opportunity' | 'warning' | 'success' | 'info';
  title: string;
  description: string;
  impact: 'low' | 'medium' | 'high';
  confidence: number;
  actionable: boolean;
  actionLabel?: string;
  onAction?: () => void;
  metrics?: string[];
  timeframe?: string;
}

export interface Segment {
  id: string;
  name: string;
  description: string;
  size: number;
  growth: number;
  characteristics: Record<string, any>;
  metrics: Record<string, number>;
}

export interface AdvancedAnalyticsProps {
  metrics?: MetricData[];
  charts?: ChartData[];
  insights?: Insight[];
  segments?: Segment[];
  loading?: boolean;
  error?: string;
  timeRange?: '1h' | '24h' | '7d' | '30d' | '90d' | '1y';
  onTimeRangeChange?: (range: string) => void;
  onRefresh?: () => void;
  onExport?: (format: 'csv' | 'pdf' | 'excel') => void;
  onConfigure?: () => void;
  className?: string;
}

const AdvancedAnalytics: React.FC<AdvancedAnalyticsProps> = ({
  metrics = [],
  charts = [],
  insights = [],
  segments = [],
  loading = false,
  error,
  timeRange = '7d',
  onTimeRangeChange,
  onRefresh,
  onExport,
  onConfigure,
  className = ''
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'metrics' | 'charts' | 'insights' | 'segments'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([]);
  const [isAutoRefresh, setIsAutoRefresh] = useState(false);

  // Memoized filtered data
  const filteredMetrics = useMemo(() => {
    return metrics.filter(metric => {
      const matchesSearch = metric.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           metric.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || metric.category === categoryFilter;
      const matchesPriority = priorityFilter === 'all' || metric.priority === priorityFilter;
      
      return matchesSearch && matchesCategory && matchesPriority;
    });
  }, [metrics, searchTerm, categoryFilter, priorityFilter]);

  // Memoized calculations
  const analyticsStats = useMemo(() => {
    const totalMetrics = metrics.length;
    const positiveTrends = metrics.filter(m => m.changeType === 'increase').length;
    const negativeTrends = metrics.filter(m => m.changeType === 'decrease').length;
    const criticalMetrics = metrics.filter(m => m.priority === 'critical').length;
    
    const avgChange = metrics.length > 0 
      ? metrics.reduce((sum, m) => sum + (m.change || 0), 0) / metrics.length 
      : 0;

    return {
      total: totalMetrics,
      positive: positiveTrends,
      negative: negativeTrends,
      critical: criticalMetrics,
      avgChange
    };
  }, [metrics]);

  const getChangeIcon = (changeType?: string) => {
    switch (changeType) {
      case 'increase': return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'decrease': return <TrendingDown className="w-4 h-4 text-red-500" />;
      default: return <Minus className="w-4 h-4 text-gray-500" />;
    }
  };

  const getChangeColor = (changeType?: string) => {
    switch (changeType) {
      case 'increase': return 'text-green-600';
      case 'decrease': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'destructive';
      case 'high': return 'secondary';
      case 'medium': return 'outline';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'opportunity': return <Target className="w-5 h-5 text-blue-500" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'success': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'info': return <Info className="w-5 h-5 text-blue-500" />;
      default: return <Brain className="w-5 h-5 text-gray-500" />;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'opportunity': return 'bg-blue-50 border-blue-200 text-blue-800';
      case 'warning': return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'success': return 'bg-green-50 border-green-200 text-green-800';
      case 'info': return 'bg-blue-50 border-blue-200 text-blue-800';
      default: return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const formatValue = (value: number, format?: string, unit?: string) => {
    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }).format(value);
      case 'percentage':
        return `${value.toFixed(1)}%`;
      default:
        return unit ? `${value.toLocaleString()} ${unit}` : value.toLocaleString();
    }
  };

  const formatChange = (change?: number) => {
    if (!change) return '0%';
    const sign = change > 0 ? '+' : '';
    return `${sign}${change.toFixed(1)}%`;
  };

  // Auto refresh effect
  useEffect(() => {
    if (!isAutoRefresh || !onRefresh) return;

    const interval = setInterval(() => {
      onRefresh();
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [isAutoRefresh, onRefresh]);

  if (loading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-32 bg-gray-200 rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="backdrop-blur-xl bg-white/10 dark:bg-gray-900/10 border border-white/20 dark:border-gray-700/20 rounded-2xl p-6 shadow-xl shadow-blue-500/10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <BarChart3 className="w-8 h-8 text-blue-600" />
              Analytics Avançado
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Análises profundas com IA e insights inteligentes
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Select value={timeRange} onValueChange={onTimeRangeChange}>
              <option value="1h">Última hora</option>
              <option value="24h">Últimas 24h</option>
              <option value="7d">Últimos 7 dias</option>
              <option value="30d">Últimos 30 dias</option>
              <option value="90d">Últimos 90 dias</option>
              <option value="1y">Último ano</option>
            </Select>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAutoRefresh(!isAutoRefresh)}
              className={ENHANCED_TRANSITIONS.button}
            >
              {isAutoRefresh ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </Button>
            {onRefresh && (
              <Button
                variant="outline"
                size="sm"
                onClick={onRefresh}
                className={ENHANCED_TRANSITIONS.button}
              >
                <RefreshCw className="w-4 h-4" />
              </Button>
            )}
            {onExport && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onExport('csv')}
                className={ENHANCED_TRANSITIONS.button}
              >
                <Download className="w-4 h-4" />
              </Button>
            )}
            {onConfigure && (
              <Button
                variant="outline"
                size="sm"
                onClick={onConfigure}
                className={ENHANCED_TRANSITIONS.button}
              >
                <Settings className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              <AnimatedCounter value={analyticsStats.total} duration={1000} />
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Métricas</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              <AnimatedCounter value={analyticsStats.positive} duration={1000} />
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Tendências Positivas</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">
              <AnimatedCounter value={analyticsStats.negative} duration={1000} />
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Tendências Negativas</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              <AnimatedCounter value={analyticsStats.critical} duration={1000} />
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Críticas</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
        {[
          { id: 'overview', label: 'Visão Geral', icon: <BarChart3 className="w-4 h-4" /> },
          { id: 'metrics', label: 'Métricas', icon: <Activity className="w-4 h-4" /> },
          { id: 'charts', label: 'Gráficos', icon: <LineChart className="w-4 h-4" /> },
          { id: 'insights', label: 'Insights', icon: <Brain className="w-4 h-4" /> },
          { id: 'segments', label: 'Segmentos', icon: <Users className="w-4 h-4" /> }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-white dark:bg-gray-700 text-blue-600 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Top Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMetrics.slice(0, 6).map((metric, index) => (
                <motion.div
                  key={metric.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="p-6 backdrop-blur-xl bg-white/10 dark:bg-gray-900/10 border border-white/20 dark:border-gray-700/20 hover:bg-white/20 dark:hover:bg-gray-900/20 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {metric.name}
                        </h3>
                        <Badge variant={getPriorityColor(metric.priority)}>
                          {metric.priority}
                        </Badge>
                      </div>
                      {getChangeIcon(metric.changeType)}
                    </div>
                    
                    <div className="mb-4">
                      <div className="text-3xl font-bold text-gray-900 dark:text-white">
                        <AnimatedCounter
                          value={metric.value}
                          duration={2000}
                          prefix={metric.format === 'currency' ? 'R$ ' : ''}
                          suffix={metric.format === 'percentage' ? '%' : ''}
                          decimals={metric.format === 'currency' ? 2 : 0}
                        />
                      </div>
                      {metric.change !== undefined && (
                        <div className={`text-sm ${getChangeColor(metric.changeType)}`}>
                          {formatChange(metric.change)} vs período anterior
                        </div>
                      )}
                    </div>

                    {metric.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {metric.description}
                      </p>
                    )}
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Insights Summary */}
            {insights.length > 0 && (
              <Card className="backdrop-blur-xl bg-white/10 dark:bg-gray-900/10 border border-white/20 dark:border-gray-700/20 hover:bg-white/20 dark:hover:bg-gray-900/20 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10">
                <Card.Header>
                  <Card.Title className="flex items-center gap-2">
                    <Brain className="w-5 h-5 text-blue-600" />
                    Insights Principais
                  </Card.Title>
                </Card.Header>
                <Card.Content>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {insights.slice(0, 4).map((insight) => (
                      <div key={insight.id} className={`p-4 rounded-lg border ${getInsightColor(insight.type)}`}>
                        <div className="flex items-center gap-2 mb-2">
                          {getInsightIcon(insight.type)}
                          <h4 className="font-semibold">{insight.title}</h4>
                          <Badge variant="outline">{insight.impact}</Badge>
                        </div>
                        <p className="text-sm mb-2">{insight.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs">Confiança: {insight.confidence}%</span>
                          {insight.actionable && (
                            <Button size="sm" variant="outline">
                              {insight.actionLabel || 'Ver detalhes'}
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </Card.Content>
              </Card>
            )}
          </motion.div>
        )}

        {activeTab === 'metrics' && (
          <motion.div
            key="metrics"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Filters */}
            <Card className="backdrop-blur-xl bg-white/10 dark:bg-gray-900/10 border border-white/20 dark:border-gray-700/20">
              <Card.Content className="p-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <Input
                      placeholder="Buscar métricas..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <option value="all">Todas as categorias</option>
                    <option value="performance">Performance</option>
                    <option value="engagement">Engajamento</option>
                    <option value="conversion">Conversão</option>
                    <option value="revenue">Receita</option>
                    <option value="traffic">Tráfego</option>
                  </Select>
                  <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                    <option value="all">Todas as prioridades</option>
                    <option value="critical">Crítica</option>
                    <option value="high">Alta</option>
                    <option value="medium">Média</option>
                    <option value="low">Baixa</option>
                  </Select>
                </div>
              </Card.Content>
            </Card>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {filteredMetrics.map((metric, index) => (
                  <motion.div
                    key={metric.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="p-6 backdrop-blur-xl bg-white/10 dark:bg-gray-900/10 border border-white/20 dark:border-gray-700/20 hover:bg-white/20 dark:hover:bg-gray-900/20 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {metric.name}
                          </h3>
                          <Badge variant={getPriorityColor(metric.priority)}>
                            {metric.priority}
                          </Badge>
                        </div>
                        {getChangeIcon(metric.changeType)}
                      </div>
                      
                      <div className="mb-4">
                        <div className="text-3xl font-bold text-gray-900 dark:text-white">
                          <AnimatedCounter
                            value={metric.value}
                            duration={2000}
                            prefix={metric.format === 'currency' ? 'R$ ' : ''}
                            suffix={metric.format === 'percentage' ? '%' : ''}
                            decimals={metric.format === 'currency' ? 2 : 0}
                          />
                        </div>
                        {metric.change !== undefined && (
                          <div className={`text-sm ${getChangeColor(metric.changeType)}`}>
                            {formatChange(metric.change)} vs período anterior
                          </div>
                        )}
                      </div>

                      {metric.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                          {metric.description}
                        </p>
                      )}

                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span className="capitalize">{metric.category}</span>
                        <span>{metric.unit || 'unidade'}</span>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {activeTab === 'charts' && (
          <motion.div
            key="charts"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <Card className="backdrop-blur-xl bg-white/10 dark:bg-gray-900/10 border border-white/20 dark:border-gray-700/20 hover:bg-white/20 dark:hover:bg-gray-900/20 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10">
              <Card.Header>
                <Card.Title className="flex items-center gap-2">
                  <LineChart className="w-5 h-5 text-blue-600" />
                  Visualizações de Dados
                </Card.Title>
              </Card.Header>
              <Card.Content>
                <div className="text-center py-12">
                  <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Gráficos Interativos em Desenvolvimento
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Visualizações avançadas com Chart.js e D3.js serão implementadas na próxima versão
                  </p>
                </div>
              </Card.Content>
            </Card>
          </motion.div>
        )}

        {activeTab === 'insights' && (
          <motion.div
            key="insights"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AnimatePresence>
                {insights.map((insight, index) => (
                  <motion.div
                    key={insight.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className={`p-6 backdrop-blur-xl bg-white/10 dark:bg-gray-900/10 border border-white/20 dark:border-gray-700/20 hover:bg-white/20 dark:hover:bg-gray-900/20 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 ${getInsightColor(insight.type)}`}>
                      <div className="flex items-center gap-3 mb-4">
                        {getInsightIcon(insight.type)}
                        <div className="flex-1">
                          <h3 className="font-semibold">{insight.title}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline">{insight.impact}</Badge>
                            <span className="text-xs">Confiança: {insight.confidence}%</span>
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-sm mb-4">{insight.description}</p>
                      
                      {insight.metrics && (
                        <div className="mb-4">
                          <h4 className="text-xs font-semibold mb-2">Métricas relacionadas:</h4>
                          <div className="flex flex-wrap gap-1">
                            {insight.metrics.map((metric) => (
                              <Badge key={metric} variant="outline" className="text-xs">
                                {metric}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {insight.timeframe && (
                        <div className="text-xs text-gray-500 mb-4">
                          Período: {insight.timeframe}
                        </div>
                      )}
                      
                      {insight.actionable && insight.onAction && (
                        <Button
                          size="sm"
                          onClick={insight.onAction}
                          className={ENHANCED_TRANSITIONS.button}
                        >
                          {insight.actionLabel || 'Executar ação'}
                        </Button>
                      )}
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {activeTab === 'segments' && (
          <motion.div
            key="segments"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {segments.map((segment, index) => (
                  <motion.div
                    key={segment.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="p-6 backdrop-blur-xl bg-white/10 dark:bg-gray-900/10 border border-white/20 dark:border-gray-700/20 hover:bg-white/20 dark:hover:bg-gray-900/20 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10">
                      <div className="flex items-center gap-3 mb-4">
                        <Users className="w-6 h-6 text-blue-600" />
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {segment.name}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {segment.description}
                          </p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <div className="text-sm text-gray-500">Tamanho</div>
                          <div className="text-lg font-semibold text-gray-900 dark:text-white">
                            <AnimatedCounter value={segment.size} duration={1000} />
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Crescimento</div>
                          <div className={`text-lg font-semibold ${segment.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            <AnimatedCounter 
                              value={segment.growth} 
                              duration={1000}
                              suffix="%"
                              decimals={1}
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                          Principais métricas:
                        </h4>
                        {Object.entries(segment.metrics).slice(0, 3).map(([key, value]) => (
                          <div key={key} className="flex justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400 capitalize">
                              {key.replace(/([A-Z])/g, ' $1').trim()}
                            </span>
                            <span className="font-medium text-gray-900 dark:text-white">
                              {value.toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdvancedAnalytics;
