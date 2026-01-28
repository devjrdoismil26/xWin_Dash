import { Card } from "@/components/ui/Card";
/**
 * Intelligent Dashboard - Componente Universal
 * Dashboard inteligente com métricas, gráficos e insights automáticos
 */
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  LineChart,
  Activity,
  Zap,
  Brain,
  Target,
  AlertTriangle,
  CheckCircle,
  Clock,
  RefreshCw,
  Settings,
  Download,
  Filter,
  Search,
  Eye,
  EyeOff
} from 'lucide-react';
import Button from './Button';
import Badge from './Badge';
import { AnimatedCounter } from './AdvancedAnimations';
import { ENHANCED_TRANSITIONS, VISUAL_EFFECTS } from './design-tokens';

export interface Metric {
  id: string;
  title: string;
  value: number;
  previousValue?: number;
  unit?: string;
  format?: 'number' | 'currency' | 'percentage';
  trend?: 'up' | 'down' | 'stable';
  status?: 'success' | 'warning' | 'error' | 'info';
  icon?: React.ReactNode;
  description?: string;
  actionable?: boolean;
  actionLabel?: string;
  onAction?: () => void;
}

export interface ChartData {
  id: string;
  title: string;
  type: 'line' | 'bar' | 'pie' | 'area';
  data: any[];
  color?: string;
  showLegend?: boolean;
  showTooltip?: boolean;
}

export interface Insight {
  id: string;
  type: 'success' | 'warning' | 'info' | 'action';
  title: string;
  description: string;
  impact?: 'high' | 'medium' | 'low';
  actionable?: boolean;
  actionLabel?: string;
  onAction?: () => void;
}

export interface IntelligentDashboardProps {
  title: string;
  description?: string;
  metrics: Metric[];
  charts?: ChartData[];
  insights?: Insight[];
  loading?: boolean;
  error?: string;
  onRefresh?: () => void;
  onConfigure?: () => void;
  className?: string;
  showInsights?: boolean;
  showCharts?: boolean;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

const IntelligentDashboard: React.FC<IntelligentDashboardProps> = ({
  title,
  description,
  metrics,
  charts = [],
  insights = [],
  loading = false,
  error,
  onRefresh,
  onConfigure,
  className = '',
  showInsights = true,
  showCharts = true,
  autoRefresh = false,
  refreshInterval = 30000
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showAdvancedMetrics, setShowAdvancedMetrics] = useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d');

  // Auto refresh effect
  useEffect(() => {
    if (!autoRefresh || !onRefresh) return;

    const interval = setInterval(() => {
      handleRefresh();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, onRefresh]);

  const handleRefresh = useCallback(async () => {
    if (!onRefresh) return;
    
    setIsRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setTimeout(() => setIsRefreshing(false), 1000);
    }
  }, [onRefresh]);

  // Memoized calculations
  const totalMetrics = useMemo(() => metrics.length, [metrics]);
  
  const criticalMetrics = useMemo(() => 
    metrics.filter(m => m.status === 'error' || m.status === 'warning'),
    [metrics]
  );

  const positiveTrends = useMemo(() => 
    metrics.filter(m => m.trend === 'up'),
    [metrics]
  );

  const getTrendIcon = (trend?: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-red-500" />;
      default: return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'success': return 'text-green-600 bg-green-50 border-green-200';
      case 'warning': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'error': return 'text-red-600 bg-red-50 border-red-200';
      case 'info': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'info': return <Brain className="w-5 h-5 text-blue-500" />;
      case 'action': return <Zap className="w-5 h-5 text-purple-500" />;
      default: return <Activity className="w-5 h-5 text-gray-500" />;
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

  if (error) {
    return (
      <Card className={`p-6 ${className}`}>
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Erro ao carregar dashboard</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={handleRefresh} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Tentar novamente
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="backdrop-blur-xl bg-white/10 dark:bg-gray-900/10 border border-white/20 dark:border-gray-700/20 rounded-2xl p-6 shadow-xl shadow-blue-500/10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <Brain className="w-8 h-8 text-blue-600" />
              {title}
            </h1>
            {description && (
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {description}
              </p>
            )}
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAdvancedMetrics(!showAdvancedMetrics)}
              className={ENHANCED_TRANSITIONS.button}
            >
              {showAdvancedMetrics ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {showAdvancedMetrics ? 'Ocultar' : 'Avançado'}
            </Button>
            {onRefresh && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                loading={isRefreshing}
                className={ENHANCED_TRANSITIONS.button}
              >
                <RefreshCw className="w-4 h-4" />
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
              <AnimatedCounter value={totalMetrics} duration={1000} />
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Métricas</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              <AnimatedCounter value={positiveTrends.length} duration={1000} />
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Tendências Positivas</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">
              <AnimatedCounter value={criticalMetrics.length} duration={1000} />
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Críticas</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              <AnimatedCounter value={insights.length} duration={1000} />
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Insights</div>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <AnimatePresence>
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`p-6 backdrop-blur-xl bg-white/10 dark:bg-gray-900/10 border border-white/20 dark:border-gray-700/20 hover:bg-white/20 dark:hover:bg-gray-900/20 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 ${getStatusColor(metric.status)}`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    {metric.icon}
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {metric.title}
                    </h3>
                  </div>
                  {getTrendIcon(metric.trend)}
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
                  {metric.previousValue && (
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Anterior: {formatValue(metric.previousValue, metric.format, metric.unit)}
                    </div>
                  )}
                </div>

                {metric.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    {metric.description}
                  </p>
                )}

                {metric.actionable && metric.onAction && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={metric.onAction}
                    className={`w-full ${ENHANCED_TRANSITIONS.button}`}
                  >
                    {metric.actionLabel || 'Ver detalhes'}
                  </Button>
                )}
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Insights */}
      {showInsights && insights.length > 0 && (
        <Card className="backdrop-blur-xl bg-white/10 dark:bg-gray-900/10 border border-white/20 dark:border-gray-700/20 hover:bg-white/20 dark:hover:bg-gray-900/20 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10">
          <Card.Header>
            <Card.Title className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-blue-600" />
              Insights Inteligentes
            </Card.Title>
            <Card.Description>
              Análises automáticas e recomendações baseadas nos seus dados
            </Card.Description>
          </Card.Header>
          <Card.Content>
            <div className="space-y-4">
              <AnimatePresence>
                {insights.map((insight, index) => (
                  <motion.div
                    key={insight.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-4 p-4 rounded-lg bg-white/50 dark:bg-gray-800/50 border border-white/20 dark:border-gray-700/20"
                  >
                    <div className="flex-shrink-0">
                      {getInsightIcon(insight.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          {insight.title}
                        </h4>
                        {insight.impact && (
                          <Badge variant={insight.impact === 'high' ? 'destructive' : insight.impact === 'medium' ? 'secondary' : 'outline'}>
                            {insight.impact}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        {insight.description}
                      </p>
                      {insight.actionable && insight.onAction && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={insight.onAction}
                          className={ENHANCED_TRANSITIONS.button}
                        >
                          {insight.actionLabel || 'Ação recomendada'}
                        </Button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </Card.Content>
        </Card>
      )}

      {/* Charts Placeholder */}
      {showCharts && charts.length > 0 && (
        <Card className="backdrop-blur-xl bg-white/10 dark:bg-gray-900/10 border border-white/20 dark:border-gray-700/20 hover:bg-white/20 dark:hover:bg-gray-900/20 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10">
          <Card.Header>
            <Card.Title className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              Análises Visuais
            </Card.Title>
            <Card.Description>
              Gráficos e visualizações dos seus dados
            </Card.Description>
          </Card.Header>
          <Card.Content>
            <div className="text-center py-12">
              <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Gráficos em Desenvolvimento
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Os gráficos interativos serão implementados na próxima versão
              </p>
            </div>
          </Card.Content>
        </Card>
      )}
    </div>
  );
};

export default IntelligentDashboard;
