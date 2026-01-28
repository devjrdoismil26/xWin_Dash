// ========================================
// ANALYTICS MODERNOS - LEADS
// ========================================
import React, { useState, useCallback, useMemo } from 'react';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  Target,
  Star,
  Calendar,
  Filter,
  Download,
  RefreshCw,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp,
  Activity,
  Zap,
  Award,
  Clock,
  DollarSign,
  Percent,
  ArrowUpRight,
  ArrowDownRight,
  Minus
} from 'lucide-react';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';
import { cn } from '@/lib/utils';
import { LeadAnalytics, LeadMetrics } from '../types';
interface ModernLeadAnalyticsProps {
  analytics: LeadAnalytics | null;
  metrics: LeadMetrics | null;
  loading?: boolean;
  onRefresh?: () => void;
  onExport?: (format: 'csv' | 'xlsx' | 'pdf') => void;
  className?: string;
  compact?: boolean;
}
interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string[];
    borderColor: string[];
    borderWidth: number;
  }[];
}
const ModernLeadAnalytics: React.FC<ModernLeadAnalyticsProps> = ({
  analytics,
  metrics,
  loading = false,
  onRefresh,
  onExport,
  className,
  compact = false
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['overview', 'trends']));
  const [showDetailedCharts, setShowDetailedCharts] = useState(false);
  const toggleSection = useCallback((section: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(section)) {
        newSet.delete(section);
      } else {
        newSet.add(section);
      }
      return newSet;
    });
  }, []);
  const formatNumber = useCallback((value: number) => {
    return new Intl.NumberFormat('pt-BR').format(value);
  }, []);
  const formatCurrency = useCallback((value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  }, []);
  const formatPercentage = useCallback((value: number) => {
    return `${value.toFixed(1)}%`;
  }, []);
  const getTrendIcon = useCallback((value: number) => {
    if (value > 0) return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (value < 0) return <TrendingDown className="w-4 h-4 text-red-600" />;
    return <Minus className="w-4 h-4 text-gray-600" />;
  }, []);
  const getTrendColor = useCallback((value: number) => {
    if (value > 0) return 'text-green-600';
    if (value < 0) return 'text-red-600';
    return 'text-gray-600';
  }, []);
  const getStatusColor = useCallback((status: string) => {
    const config = LEAD_STATUSES[status as keyof typeof LEAD_STATUSES];
    if (!config) return 'bg-gray-100 text-gray-700';
    const colorMap = {
      blue: 'bg-blue-100 text-blue-700',
      yellow: 'bg-yellow-100 text-yellow-700',
      green: 'bg-green-100 text-green-700',
      orange: 'bg-orange-100 text-orange-700',
      purple: 'bg-purple-100 text-purple-700',
      emerald: 'bg-emerald-100 text-emerald-700',
      red: 'bg-red-100 text-red-700',
      gray: 'bg-gray-100 text-gray-700'
    };
    return colorMap[config.color as keyof typeof colorMap] || 'bg-gray-100 text-gray-700';
  }, []);
  const getScoreColor = useCallback((score: number) => {
    if (score >= 80) return 'text-emerald-600';
    if (score >= 60) return 'text-green-600';
    if (score >= 40) return 'text-yellow-600';
    if (score >= 20) return 'text-orange-600';
    return 'text-red-600';
  }, []);
  // Mock data for demonstration
  const mockAnalytics: LeadAnalytics = useMemo(() => ({
    overview: {
      total_leads: 1247,
      new_this_month: 89,
      conversion_rate: 23.4,
      average_score: 67.2,
      top_performing_source: 'website'
    },
    trends: {
      leads_created: [
        { date: '2024-01-01', count: 45 },
        { date: '2024-01-02', count: 52 },
        { date: '2024-01-03', count: 38 },
        { date: '2024-01-04', count: 61 },
        { date: '2024-01-05', count: 47 },
        { date: '2024-01-06', count: 55 },
        { date: '2024-01-07', count: 43 }
      ],
      conversions: [
        { date: '2024-01-01', count: 12 },
        { date: '2024-01-02', count: 15 },
        { date: '2024-01-03', count: 8 },
        { date: '2024-01-04', count: 18 },
        { date: '2024-01-05', count: 11 },
        { date: '2024-01-06', count: 16 },
        { date: '2024-01-07', count: 9 }
      ],
      score_distribution: [
        { range: '0-20', count: 45 },
        { range: '21-40', count: 89 },
        { range: '41-60', count: 156 },
        { range: '61-80', count: 234 },
        { range: '81-100', count: 123 }
      ]
    },
    sources: [
      { source: 'website', leads: 456, conversions: 89, conversion_rate: 19.5, average_score: 72.3 },
      { source: 'social_media', leads: 234, conversions: 45, conversion_rate: 19.2, average_score: 68.7 },
      { source: 'email_marketing', leads: 189, conversions: 38, conversion_rate: 20.1, average_score: 71.2 },
      { source: 'referral', leads: 156, conversions: 42, conversion_rate: 26.9, average_score: 78.9 },
      { source: 'paid_ads', leads: 123, conversions: 23, conversion_rate: 18.7, average_score: 65.4 },
      { source: 'other', leads: 89, conversions: 15, conversion_rate: 16.9, average_score: 62.1 }
    ],
    performance: {
      by_user: [
        { user: { id: 1, name: 'João Silva', email: 'joao@example.com' }, leads_assigned: 89, conversions: 23, conversion_rate: 25.8 },
        { user: { id: 2, name: 'Maria Santos', email: 'maria@example.com' }, leads_assigned: 76, conversions: 18, conversion_rate: 23.7 },
        { user: { id: 3, name: 'Pedro Costa', email: 'pedro@example.com' }, leads_assigned: 65, conversions: 14, conversion_rate: 21.5 }
      ],
      by_segment: [
        { segment: { id: 1, name: 'VIP', description: 'Leads VIP' }, leads: 45, conversions: 18, conversion_rate: 40.0 },
        { segment: { id: 2, name: 'Qualificados', description: 'Leads qualificados' }, leads: 234, conversions: 67, conversion_rate: 28.6 },
        { segment: { id: 3, name: 'Interessados', description: 'Leads interessados' }, leads: 456, conversions: 89, conversion_rate: 19.5 }
      ]
    }
  }), []);
  const mockMetrics: LeadMetrics = useMemo(() => ({
    total: 1247,
    new: 89,
    contacted: 234,
    qualified: 456,
    converted: 291,
    lost: 177,
    conversion_rate: 23.4,
    average_score: 67.2,
    average_lifetime_value: 12500,
    top_sources: [
      { source: 'website', count: 456, conversion_rate: 19.5 },
      { source: 'referral', count: 156, conversion_rate: 26.9 },
      { source: 'social_media', count: 234, conversion_rate: 19.2 }
    ],
    score_distribution: [
      { range: '0-20', count: 45 },
      { range: '21-40', count: 89 },
      { range: '41-60', count: 156 },
      { range: '61-80', count: 234 },
      { range: '81-100', count: 123 }
    ],
    monthly_trends: [
      { month: 'Jan', created: 89, converted: 23 },
      { month: 'Fev', created: 76, converted: 18 },
      { month: 'Mar', created: 98, converted: 25 },
      { month: 'Abr', created: 112, converted: 28 },
      { month: 'Mai', created: 95, converted: 22 },
      { month: 'Jun', created: 87, converted: 19 }
    ]
  }), []);
  const currentAnalytics = analytics || mockAnalytics;
  const currentMetrics = metrics || mockMetrics;
  if (compact) {
    return (
      <div className={cn("grid grid-cols-2 md:grid-cols-4 gap-4", className)}>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Leads</p>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(currentMetrics.total)}</p>
            </div>
            <Users className="w-8 h-8 text-blue-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Taxa de Conversão</p>
              <p className="text-2xl font-bold text-green-600">{formatPercentage(currentMetrics.conversion_rate)}</p>
            </div>
            <Target className="w-8 h-8 text-green-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Score Médio</p>
              <p className="text-2xl font-bold text-yellow-600">{currentMetrics.average_score.toFixed(1)}</p>
            </div>
            <Star className="w-8 h-8 text-yellow-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Valor Médio</p>
              <p className="text-2xl font-bold text-purple-600">{formatCurrency(currentMetrics.average_lifetime_value)}</p>
            </div>
            <DollarSign className="w-8 h-8 text-purple-500" />
          </div>
        </Card>
      </div>
    );
  }
  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Analytics de Leads</h2>
          <p className="text-gray-600">Insights e métricas de performance</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="7d">Últimos 7 dias</option>
            <option value="30d">Últimos 30 dias</option>
            <option value="90d">Últimos 90 dias</option>
            <option value="1y">Último ano</option>
          </select>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowDetailedCharts(!showDetailedCharts)}
          >
            {showDetailedCharts ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </Button>
          {onRefresh && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              disabled={loading}
            >
              <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
            </Button>
          )}
          {onExport && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onExport('csv')}
            >
              <Download className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total de Leads</p>
              <p className="text-3xl font-bold text-gray-900">{formatNumber(currentAnalytics.overview.total_leads)}</p>
              <div className="flex items-center gap-1 mt-1">
                {getTrendIcon(12.5)}
                <span className={cn("text-sm font-medium", getTrendColor(12.5))}>
                  +12.5% vs mês anterior
                </span>
              </div>
            </div>
            <Users className="w-12 h-12 text-blue-500" />
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Novos Este Mês</p>
              <p className="text-3xl font-bold text-green-600">{formatNumber(currentAnalytics.overview.new_this_month)}</p>
              <div className="flex items-center gap-1 mt-1">
                {getTrendIcon(8.2)}
                <span className={cn("text-sm font-medium", getTrendColor(8.2))}>
                  +8.2% vs mês anterior
                </span>
              </div>
            </div>
            <Zap className="w-12 h-12 text-green-500" />
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Taxa de Conversão</p>
              <p className="text-3xl font-bold text-purple-600">{formatPercentage(currentAnalytics.overview.conversion_rate)}</p>
              <div className="flex items-center gap-1 mt-1">
                {getTrendIcon(2.1)}
                <span className={cn("text-sm font-medium", getTrendColor(2.1))}>
                  +2.1% vs mês anterior
                </span>
              </div>
            </div>
            <Target className="w-12 h-12 text-purple-500" />
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Score Médio</p>
              <p className="text-3xl font-bold text-yellow-600">{currentAnalytics.overview.average_score.toFixed(1)}</p>
              <div className="flex items-center gap-1 mt-1">
                {getTrendIcon(1.8)}
                <span className={cn("text-sm font-medium", getTrendColor(1.8))}>
                  +1.8 vs mês anterior
                </span>
              </div>
            </div>
            <Star className="w-12 h-12 text-yellow-500" />
          </div>
        </Card>
      </div>
      {/* Trends Section */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Tendências</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => toggleSection('trends')}
          >
            {expandedSections.has('trends') ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
        </div>
        {expandedSections.has('trends') && (
          <div className="space-y-6">
            {/* Leads Created Chart */}
            <div>
              <h4 className="text-md font-medium text-gray-700 mb-3">Leads Criados</h4>
              <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <BarChart3 className="w-12 h-12 mx-auto mb-2" />
                  <p>Gráfico de leads criados</p>
                  <p className="text-sm">Integração com biblioteca de gráficos</p>
                </div>
              </div>
            </div>
            {/* Conversions Chart */}
            <div>
              <h4 className="text-md font-medium text-gray-700 mb-3">Conversões</h4>
              <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <TrendingUp className="w-12 h-12 mx-auto mb-2" />
                  <p>Gráfico de conversões</p>
                  <p className="text-sm">Integração com biblioteca de gráficos</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </Card>
      {/* Sources Performance */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Performance por Origem</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => toggleSection('sources')}
          >
            {expandedSections.has('sources') ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
        </div>
        {expandedSections.has('sources') && (
          <div className="space-y-4">
            {currentAnalytics.sources.map((source, index) => {
              const originConfig = LEAD_ORIGINS[source.source as keyof typeof LEAD_ORIGINS];
              return (
                <div key={source.source} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-blue-600">{index + 1}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{originConfig?.icon}</span>
                        <span className="font-medium text-gray-900">{originConfig?.label}</span>
                      </div>
                      <p className="text-sm text-gray-600">{source.leads} leads • Score médio: {source.average_score.toFixed(1)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-gray-900">{source.conversions}</span>
                      <span className="text-sm text-gray-600">conversões</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className={cn("text-sm font-medium", getScoreColor(source.conversion_rate))}>
                        {formatPercentage(source.conversion_rate)}
                      </span>
                      <span className="text-xs text-gray-500">taxa</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>
      {/* Performance by User */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Performance por Usuário</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => toggleSection('users')}
          >
            {expandedSections.has('users') ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
        </div>
        {expandedSections.has('users') && (
          <div className="space-y-4">
            {currentAnalytics.performance.by_user.map((user, index) => (
              <div key={user.user.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium text-sm">
                      {user.user.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{user.user.name}</p>
                    <p className="text-sm text-gray-600">{user.leads_assigned} leads atribuídos</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-gray-900">{user.conversions}</span>
                    <span className="text-sm text-gray-600">conversões</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className={cn("text-sm font-medium", getScoreColor(user.conversion_rate))}>
                      {formatPercentage(user.conversion_rate)}
                    </span>
                    <span className="text-xs text-gray-500">taxa</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
      {/* Score Distribution */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Distribuição de Scores</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => toggleSection('scores')}
          >
            {expandedSections.has('scores') ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
        </div>
        {expandedSections.has('scores') && (
          <div className="space-y-3">
            {currentAnalytics.trends.score_distribution.map((range, index) => {
              const total = currentAnalytics.trends.score_distribution.reduce((sum, r) => sum + r.count, 0);
              const percentage = (range.count / total) * 100;
              return (
                <div key={range.range} className="flex items-center gap-3">
                  <div className="w-16 text-sm font-medium text-gray-700">{range.range}</div>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className={cn(
                        "h-2 rounded-full transition-all duration-300",
                        index === 0 && "bg-red-500",
                        index === 1 && "bg-orange-500",
                        index === 2 && "bg-yellow-500",
                        index === 3 && "bg-green-500",
                        index === 4 && "bg-emerald-500"
                      )}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <div className="w-12 text-sm text-gray-600 text-right">{range.count}</div>
                  <div className="w-12 text-sm text-gray-500 text-right">{percentage.toFixed(1)}%</div>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
};
export default ModernLeadAnalytics;
