/**
 * Advanced ADSTool Dashboard - Módulo ADStool
 * Dashboard de excelência com métricas em tempo real e insights avançados
 */
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  Target, 
  BarChart3,
  Calendar,
  Settings,
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap,
  Eye,
  MousePointer,
  ShoppingCart,
  Percent,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  Download,
  RefreshCw,
  Play,
  Pause,
  Square
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
import BarChart from '@/components/ui/BarChart';
interface CampaignMetrics {
  id: string;
  name: string;
  status: 'active' | 'paused' | 'completed' | 'draft';
  platform: string;
  budget: number;
  spent: number;
  impressions: number;
  clicks: number;
  conversions: number;
  ctr: number;
  cpc: number;
  cpa: number;
  roas: number;
  reach: number;
  frequency: number;
  start_date: string;
  end_date: string;
  objective: string;
}
interface ADSOverviewMetrics {
  total_campaigns: number;
  active_campaigns: number;
  total_budget: number;
  total_spent: number;
  total_impressions: number;
  total_clicks: number;
  total_conversions: number;
  average_ctr: number;
  average_cpc: number;
  average_roas: number;
  budget_utilization: number;
  performance_trend: 'up' | 'down' | 'stable';
  top_performing_platform: string;
}
interface AdvancedADSToolDashboardProps {
  className?: string;
}
const MOCK_OVERVIEW: ADSOverviewMetrics = {
  total_campaigns: 24,
  active_campaigns: 12,
  total_budget: 85000,
  total_spent: 67800,
  total_impressions: 2450000,
  total_clicks: 34500,
  total_conversions: 1250,
  average_ctr: 1.41,
  average_cpc: 1.96,
  average_roas: 4.2,
  budget_utilization: 79.8,
  performance_trend: 'up',
  top_performing_platform: 'google',
};
const MOCK_CAMPAIGNS: CampaignMetrics[] = [
  {
    id: '1',
    name: 'Black Friday 2024 - Eletrônicos',
    status: 'active',
    platform: 'google',
    budget: 15000,
    spent: 12400,
    impressions: 450000,
    clicks: 6800,
    conversions: 284,
    ctr: 1.51,
    cpc: 1.82,
    cpa: 43.66,
    roas: 5.2,
    reach: 380000,
    frequency: 1.18,
    start_date: '2024-11-15',
    end_date: '2024-12-01',
    objective: 'conversions',
  },
  {
    id: '2',
    name: 'Reconhecimento de Marca - Q4',
    status: 'active',
    platform: 'facebook',
    budget: 8500,
    spent: 6200,
    impressions: 890000,
    clicks: 12400,
    conversions: 156,
    ctr: 1.39,
    cpc: 0.50,
    cpa: 39.74,
    roas: 3.8,
    reach: 650000,
    frequency: 1.37,
    start_date: '2024-10-01',
    end_date: '2024-12-31',
    objective: 'awareness',
  },
  // Mais campanhas mockadas...
];
const PLATFORM_COLORS = {
  google: 'bg-blue-500',
  facebook: 'bg-blue-600',
  linkedin: 'bg-blue-700',
  twitter: 'bg-black',
  tiktok: 'bg-pink-500',
};
const PLATFORM_NAMES = {
  google: 'Google Ads',
  facebook: 'Meta Ads',
  linkedin: 'LinkedIn Ads',
  twitter: 'Twitter Ads',
  tiktok: 'TikTok Ads',
};
const AdvancedADSToolDashboard: React.FC<AdvancedADSToolDashboardProps> = ({
  className = '',
}) => {
  const { t } = useT();
  const { showSuccess, showError } = useAdvancedNotifications();
  const { operations, isFetching, isUpdating } = useDataLoadingStates();
  // State
  const [overview, setOverview] = useState<ADSOverviewMetrics>(MOCK_OVERVIEW);
  const [campaigns, setCampaigns] = useState<CampaignMetrics[]>(MOCK_CAMPAIGNS);
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [refreshKey, setRefreshKey] = useState(0);
  // Fetch data
  const fetchDashboardData = useCallback(async () => {
    try {
      await operations.fetch('ads-dashboard', async () => {
        // Simular API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        // Mock data refresh
        setOverview(prev => ({
          ...prev,
          total_spent: prev.total_spent + Math.random() * 1000,
          total_clicks: prev.total_clicks + Math.floor(Math.random() * 100),
        }));
        return true;
      });
    } catch (error) {
      showError('Erro ao carregar dados do dashboard');
    }
  }, [operations, showError]);
  // Filtrar campanhas
  const filteredCampaigns = useMemo(() => {
    return campaigns.filter(campaign => {
      if (selectedPlatform !== 'all' && campaign.platform !== selectedPlatform) {
        return false;
      }
      return true;
    });
  }, [campaigns, selectedPlatform]);
  // Métricas calculadas
  const totalMetrics = useMemo(() => {
    return filteredCampaigns.reduce(
      (acc, campaign) => ({
        spent: acc.spent + campaign.spent,
        impressions: acc.impressions + campaign.impressions,
        clicks: acc.clicks + campaign.clicks,
        conversions: acc.conversions + campaign.conversions,
      }),
      { spent: 0, impressions: 0, clicks: 0, conversions: 0 }
    );
  }, [filteredCampaigns]);
  // Chart data
  const chartData = useMemo(() => {
    const platformData = filteredCampaigns.reduce((acc, campaign) => {
      const platform = PLATFORM_NAMES[campaign.platform as keyof typeof PLATFORM_NAMES];
      if (!acc[platform]) {
        acc[platform] = { spent: 0, conversions: 0, clicks: 0 };
      }
      acc[platform].spent += campaign.spent;
      acc[platform].conversions += campaign.conversions;
      acc[platform].clicks += campaign.clicks;
      return acc;
    }, {} as Record<string, any>);
    return Object.entries(platformData).map(([platform, data]) => ({
      name: platform,
      spent: data.spent,
      conversions: data.conversions,
      clicks: data.clicks,
    }));
  }, [filteredCampaigns]);
  // Actions
  const handleRefresh = useCallback(() => {
    setRefreshKey(prev => prev + 1);
    fetchDashboardData();
    showSuccess('Dashboard atualizado');
  }, [fetchDashboardData, showSuccess]);
  const handleCampaignAction = useCallback(async (campaignId: string, action: 'play' | 'pause' | 'stop') => {
    try {
      await operations.update(`campaign-${action}`, async () => {
        // Simular API call
        await new Promise(resolve => setTimeout(resolve, 500));
        setCampaigns(prev => prev.map(campaign => 
          campaign.id === campaignId 
            ? { 
                ...campaign, 
                status: action === 'play' ? 'active' : action === 'pause' ? 'paused' : 'completed'
              }
            : campaign
        ));
        return true;
      });
      const actionText = action === 'play' ? 'ativada' : action === 'pause' ? 'pausada' : 'finalizada';
      showSuccess(`Campanha ${actionText} com sucesso`);
    } catch (error) {
      showError(`Erro ao ${action === 'play' ? 'ativar' : action === 'pause' ? 'pausar' : 'finalizar'} campanha`);
    }
  }, [operations, showSuccess, showError]);
  // Initial load
  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData, refreshKey]);
  const isLoading = isFetching('ads-dashboard');
  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="backdrop-blur-xl bg-white/10 dark:bg-gray-900/10 border border-white/20 dark:border-gray-700/20 rounded-2xl p-6 shadow-xl shadow-blue-500/10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {t('campaigns.title')}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Gerencie e monitore todas as suas campanhas publicitárias
            </p>
          </div>
        <div className="flex items-center space-x-3">
          <Select
            value={selectedPeriod}
            onValueChange={setSelectedPeriod}
            className="w-32"
          >
            <option value="7d">7 dias</option>
            <option value="30d">30 dias</option>
            <option value="90d">90 dias</option>
            <option value="1y">1 ano</option>
          </Select>
          <Select
            value={selectedPlatform}
            onValueChange={setSelectedPlatform}
            className="w-36"
          >
            <option value="all">Todas Plataformas</option>
            <option value="google">Google Ads</option>
            <option value="facebook">Meta Ads</option>
            <option value="linkedin">LinkedIn Ads</option>
          </Select>
          <Button
            variant="outline"
            onClick={handleRefresh}
            loading={isLoading}
            className={`flex items-center space-x-2 ${ENHANCED_TRANSITIONS.button}`}
          >
            <RefreshCw className="h-4 w-4" />
            <span>Atualizar</span>
          </Button>
          <Button variant="primary" className={`flex items-center space-x-2 ${ENHANCED_TRANSITIONS.button}`}>
            <Target className="h-4 w-4" />
            <span>Nova Campanha</span>
          </Button>
        </div>
        </div>
      </div>
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Gasto */}
        <Card className="p-6 backdrop-blur-xl bg-white/10 dark:bg-gray-900/10 border border-white/20 dark:border-gray-700/20 hover:bg-white/20 dark:hover:bg-gray-900/20 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10">
          {isLoading ? (
            <Skeleton className="h-24" />
          ) : (
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Investido
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  R$ {overview.total_spent.toLocaleString('pt-BR')}
                </p>
                <div className="flex items-center mt-1">
                  <ArrowUpRight className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-600 ml-1">+12.5% vs. período anterior</span>
                </div>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          )}
        </Card>
        {/* Campanhas Ativas */}
        <Card className="p-6 backdrop-blur-xl bg-white/10 dark:bg-gray-900/10 border border-white/20 dark:border-gray-700/20 hover:bg-white/20 dark:hover:bg-gray-900/20 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10">
          {isLoading ? (
            <Skeleton className="h-24" />
          ) : (
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Campanhas Ativas
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {overview.active_campaigns}
                </p>
                <div className="flex items-center mt-1">
                  <span className="text-sm text-gray-600">de {overview.total_campaigns} totais</span>
                </div>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <Target className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          )}
        </Card>
        {/* CTR Médio */}
        <Card className="p-6 backdrop-blur-xl bg-white/10 dark:bg-gray-900/10 border border-white/20 dark:border-gray-700/20 hover:bg-white/20 dark:hover:bg-gray-900/20 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10">
          {isLoading ? (
            <Skeleton className="h-24" />
          ) : (
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  CTR Médio
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {overview.average_ctr.toFixed(2)}%
                </p>
                <div className="flex items-center mt-1">
                  <ArrowUpRight className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-600 ml-1">+0.3% vs. período anterior</span>
                </div>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <MousePointer className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          )}
        </Card>
        {/* ROAS */}
        <Card className="p-6 backdrop-blur-xl bg-white/10 dark:bg-gray-900/10 border border-white/20 dark:border-gray-700/20 hover:bg-white/20 dark:hover:bg-gray-900/20 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10">
          {isLoading ? (
            <Skeleton className="h-24" />
          ) : (
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  ROAS Médio
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {overview.average_roas.toFixed(1)}x
                </p>
                <div className="flex items-center mt-1">
                  <ArrowUpRight className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-600 ml-1">+0.8x vs. período anterior</span>
                </div>
              </div>
              <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-lg">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          )}
        </Card>
      </div>
      {/* Charts and Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance por Plataforma */}
        <Card className="p-6 backdrop-blur-xl bg-white/10 dark:bg-gray-900/10 border border-white/20 dark:border-gray-700/20 hover:bg-white/20 dark:hover:bg-gray-900/20 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Performance por Plataforma</h3>
            <Button variant="ghost" size="sm">
              <Download className="h-4 w-4" />
            </Button>
          </div>
          {isLoading ? (
            <Skeleton className="h-64" />
          ) : (
            <div className="h-64">
              <BarChart
                data={chartData}
                categories={['spent', 'conversions']}
                index="name"
                colors={['blue', 'green']}
                valueFormatter={(value) => 
                  value > 1000 ? `${(value / 1000).toFixed(1)}k` : value.toString()
                }
              />
            </div>
          )}
        </Card>
        {/* Budget Utilization */}
        <Card className="p-6 backdrop-blur-xl bg-white/10 dark:bg-gray-900/10 border border-white/20 dark:border-gray-700/20 hover:bg-white/20 dark:hover:bg-gray-900/20 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Utilização do Orçamento</h3>
            <Badge variant="success">
              {overview.budget_utilization.toFixed(1)}%
            </Badge>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Total Investido</span>
                <span>R$ {overview.total_spent.toLocaleString('pt-BR')}</span>
              </div>
              <Progress 
                value={overview.budget_utilization} 
                className="h-2"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>R$ 0</span>
                <span>R$ {overview.total_budget.toLocaleString('pt-BR')}</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">Impressões</p>
                <p className="text-xl font-bold">{(overview.total_impressions / 1000000).toFixed(1)}M</p>
              </div>
              <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">Conversões</p>
                <p className="text-xl font-bold">{overview.total_conversions.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
      {/* Campaigns Table */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Campanhas Recentes</h3>
          <div className="flex items-center space-x-2">
            <Input
              placeholder="Buscar campanhas..."
              className="w-64"
            />
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4" />
            </Button>
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
                  <th className="text-left py-3 px-4 font-medium">Campanha</th>
                  <th className="text-left py-3 px-4 font-medium">Status</th>
                  <th className="text-left py-3 px-4 font-medium">Plataforma</th>
                  <th className="text-right py-3 px-4 font-medium">Orçamento</th>
                  <th className="text-right py-3 px-4 font-medium">Gasto</th>
                  <th className="text-right py-3 px-4 font-medium">CTR</th>
                  <th className="text-right py-3 px-4 font-medium">ROAS</th>
                  <th className="text-center py-3 px-4 font-medium">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredCampaigns.slice(0, 10).map((campaign) => (
                  <tr key={campaign.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium">{campaign.name}</p>
                        <p className="text-sm text-gray-500">{campaign.objective}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge 
                        variant={
                          campaign.status === 'active' ? 'success' : 
                          campaign.status === 'paused' ? 'warning' : 
                          'default'
                        }
                      >
                        {campaign.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <div 
                          className={`w-3 h-3 rounded-full ${
                            PLATFORM_COLORS[campaign.platform as keyof typeof PLATFORM_COLORS]
                          }`} 
                        />
                        <span>{PLATFORM_NAMES[campaign.platform as keyof typeof PLATFORM_NAMES]}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      R$ {campaign.budget.toLocaleString('pt-BR')}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div>
                        <span>R$ {campaign.spent.toLocaleString('pt-BR')}</span>
                        <div className="text-xs text-gray-500">
                          {((campaign.spent / campaign.budget) * 100).toFixed(1)}%
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className={
                        campaign.ctr > 1.5 ? 'text-green-600' : 
                        campaign.ctr > 1.0 ? 'text-yellow-600' : 'text-red-600'
                      }>
                        {campaign.ctr.toFixed(2)}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className={
                        campaign.roas > 3 ? 'text-green-600' : 
                        campaign.roas > 2 ? 'text-yellow-600' : 'text-red-600'
                      }>
                        {campaign.roas.toFixed(1)}x
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-center space-x-1">
                        {campaign.status === 'active' ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCampaignAction(campaign.id, 'pause')}
                            loading={isUpdating(`campaign-pause`)}
                          >
                            <Pause className="h-4 w-4" />
                          </Button>
                        ) : (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCampaignAction(campaign.id, 'play')}
                            loading={isUpdating(`campaign-play`)}
                          >
                            <Play className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCampaignAction(campaign.id, 'stop')}
                          loading={isUpdating(`campaign-stop`)}
                        >
                          <Square className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};
export default AdvancedADSToolDashboard;
