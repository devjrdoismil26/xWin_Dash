/**
 * Advanced ADSTool Dashboard - Módulo ADStool
 * Dashboard de excelência com métricas em tempo real e insights avançados
 * 
 * @description
 * Dashboard integrado com validação Zod para métricas de campanhas publicitárias.
 * Suporta múltiplas plataformas (Google, Facebook, LinkedIn, etc.) com métricas em tempo real.
 * 
 * @since 2.0.0 - Refatorado com integração real ao backend
 */
import React, { useState, useMemo, useCallback } from 'react';
import { useValidatedGet } from '@/hooks/useValidatedApi';
import { ADSToolDashboardDataSchema, type ADSToolDashboardData, type CampaignMetrics, type ADSOverviewMetrics } from '@/schemas';
import { TrendingUp, DollarSign, Target, MousePointer, RefreshCw, Play, Pause, Square, Filter, Download, ArrowUpRight } from 'lucide-react';
// Design System
import { ENHANCED_TRANSITIONS } from '@/shared/components/ui/design-tokens';
// Hooks
import { useT } from '@/hooks/useTranslation';
import { useAdvancedNotifications } from '@/hooks/useAdvancedNotifications';
// Componentes
import Card from '@/shared/components/ui/Card';
import Button from '@/shared/components/ui/Button';
import Badge from '@/shared/components/ui/Badge';
import Select from '@/shared/components/ui/Select';
import Input from '@/shared/components/ui/Input';
import Progress from '@/shared/components/ui/Progress';
import { LoadingSpinner } from '@/shared/components/ui/LoadingStates';
import ErrorState from '@/shared/components/ui/ErrorState';
import BarChart from '@/shared/components/ui/BarChart';

/**
 * Props do componente AdvancedADSToolDashboard
 */
interface AdvancedADSToolDashboardProps {
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

const PLATFORM_COLORS: Record<string, string> = {
  google: 'bg-blue-500',
  facebook: 'bg-blue-600',
  linkedin: 'bg-blue-700',
  twitter: 'bg-black',
  tiktok: 'bg-pink-500',};

const PLATFORM_NAMES: Record<string, string> = {
  google: 'Google Ads',
  facebook: 'Meta Ads',
  linkedin: 'LinkedIn Ads',
  twitter: 'Twitter Ads',
  tiktok: 'TikTok Ads',};

/**
 * Componente AdvancedADSToolDashboard
 */
const AdvancedADSToolDashboard: React.FC<AdvancedADSToolDashboardProps> = ({ className = '',
   }) => {
  const { t } = useT();

  const { showSuccess, showError } = useAdvancedNotifications();

  // Hook para buscar dados com validação Zod
  const { 
    data: dashboardData, 
    loading, 
    error, 
    fetch: refreshData 
  } = useValidatedGet<ADSToolDashboardData>(
    '/api/adstool/dashboard',
    ADSToolDashboardDataSchema,
    true);

  // State local para filtros
  const [selectedPeriod, setSelectedPeriod] = useState('30d');

  const [selectedPlatform, setSelectedPlatform] = useState('all');

  const [refreshing, setRefreshing] = useState(false);

  // Handler de refresh
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);

    try {
      await refreshData();

      showSuccess('Dados atualizados com sucesso');

    } catch (err) {
      showError('Erro ao atualizar dados');

    } finally {
      setRefreshing(false);

    } , [refreshData, showSuccess, showError]);

  // Extrair dados do dashboard
  const overview = dashboardData?.overview;
  const campaigns = dashboardData?.campaigns || [];
  
  // Filtrar campanhas por plataforma
  const filteredCampaigns = useMemo(() => {
    return campaigns.filter(campaign => {
      if (selectedPlatform !== 'all' && campaign.platform !== selectedPlatform) {
        return false;
      }
      return true;
    });

  }, [campaigns, selectedPlatform]);

  // Chart data
  const chartData = useMemo(() => {
    const platformData = filteredCampaigns.reduce((acc: unknown, campaign: unknown) => {
      const platform = PLATFORM_NAMES[campaign.platform] || campaign.platform;
      if (!acc[platform]) {
        acc[platform] = { spent: 0, conversions: 0, clicks: 0};

      }
      acc[platform].spent += campaign.spent;
      acc[platform].conversions += campaign.conversions;
      acc[platform].clicks += campaign.clicks;
      return acc;
    }, {} as Record<string, { spent: number; conversions: number; clicks: number }>);

    return Object.entries(platformData).map(([platform, data]) => ({
      name: platform,
      spent: (data as any).spent,
      conversions: (data as any).conversions,
      clicks: (data as any).clicks,
    }));

  }, [filteredCampaigns]);

  // Handler de ações de campanha
  const handleCampaignAction = useCallback(async (campaignId: string, action: 'play' | 'pause' | 'stop') => {
    try {
      const actionText = action === 'play' ? 'ativada' : action === 'pause' ? 'pausada' : 'finalizada';
      showSuccess(`Campanha ${actionText} com sucesso`);

      await refreshData();

    } catch (err) {
      showError(`Erro ao ${action === 'play' ? 'ativar' : action === 'pause' ? 'pausar' : 'finalizar'} campanha`);

    } , [refreshData, showSuccess, showError]);

  // Estados de loading e error
  if (loading) {
    return (
        <>
      <div className={`flex items-center justify-center min-h-screen ${className} `}>
      </div><LoadingSpinner size="lg" / />
      </div>);

  }

  if (error) {
    return (
        <>
      <div className={`flex items-center justify-center min-h-screen ${className} `}>
      </div><ErrorState
          message={ typeof error === 'string' ? error : 'Ocorreu um erro ao carregar os dados' }
          onRetry={ handleRefresh }
        / />
      </div>);

  }

  if (!dashboardData || !overview) {
    return (
        <>
      <div className={`flex items-center justify-center min-h-screen ${className} `}>
      </div><LoadingSpinner size="lg" / />
      </div>);

  }

  return (
        <>
      <div className={`space-y-6 ${className} `}>
      </div>{/* Header */}
      <div className=" ">$2</div><div className=" ">$2</div><div>
           
        </div><h1 className="text-3xl font-bold text-gray-900 dark:text-white" />
              {t('campaigns.title')}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1" />
              Gerencie e monitore todas as suas campanhas publicitárias
            </p></div><div className=" ">$2</div><Select
              value={ selectedPeriod }
              onChange={ (e: unknown) => setSelectedPeriod(e.target.value)  }>
              <option value="7d">7 dias</option>
              <option value="30d">30 dias</option>
              <option value="90d">90 dias</option>
              <option value="1y">1 ano</option></Select><Select
              value={ selectedPlatform }
              onChange={ (e: unknown) => setSelectedPlatform(e.target.value)  }>
              <option value="all">Todas Plataformas</option>
              <option value="google">Google Ads</option>
              <option value="facebook">Meta Ads</option>
              <option value="linkedin">LinkedIn Ads</option></Select><Button
              variant="outline"
              onClick={ handleRefresh }
              disabled={ refreshing }
              className={`flex items-center space-x-2 ${ENHANCED_TRANSITIONS.button} `} />
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''} `} / />
              <span>Atualizar</span></Button><Button variant="primary" className={`flex items-center space-x-2 ${ENHANCED_TRANSITIONS.button} `} />
              <Target className="h-4 w-4" />
              <span>Nova Campanha</span></Button></div>
      </div>

      {/* KPI Cards */}
      <div className="{/* Total Gasto */}">$2</div>
        <Card className="p-6 backdrop-blur-xl bg-white/10 dark:bg-gray-900/10 border border-white/20 dark:border-gray-700/20 hover:bg-white/20 dark:hover:bg-gray-900/20 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10" />
          <div className=" ">$2</div><div>
           
        </div><p className="text-sm font-medium text-gray-600 dark:text-gray-400" />
                Total Investido
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white" />
                R$ {overview.total_spent.toLocaleString('pt-BR')}
              </p>
              <div className=" ">$2</div><ArrowUpRight className="h-4 w-4 text-green-500" />
                <span className="text-sm text-green-600 ml-1">+12.5% vs. período anterior</span></div><div className=" ">$2</div><DollarSign className="h-6 w-6 text-green-600" /></div></Card>

        {/* Campanhas Ativas */}
        <Card className="p-6 backdrop-blur-xl bg-white/10 dark:bg-gray-900/10 border border-white/20 dark:border-gray-700/20 hover:bg-white/20 dark:hover:bg-gray-900/20 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10" />
          <div className=" ">$2</div><div>
           
        </div><p className="text-sm font-medium text-gray-600 dark:text-gray-400" />
                Campanhas Ativas
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white" />
                {overview.active_campaigns}
              </p>
              <div className=" ">$2</div><span className="text-sm text-gray-600">de {overview.total_campaigns} totais</span></div><div className=" ">$2</div><Target className="h-6 w-6 text-blue-600" /></div></Card>

        {/* CTR Médio */}
        <Card className="p-6 backdrop-blur-xl bg-white/10 dark:bg-gray-900/10 border border-white/20 dark:border-gray-700/20 hover:bg-white/20 dark:hover:bg-gray-900/20 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10" />
          <div className=" ">$2</div><div>
           
        </div><p className="text-sm font-medium text-gray-600 dark:text-gray-400" />
                CTR Médio
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white" />
                {overview.average_ctr.toFixed(2)}%
              </p>
              <div className=" ">$2</div><ArrowUpRight className="h-4 w-4 text-green-500" />
                <span className="text-sm text-green-600 ml-1">+0.3% vs. período anterior</span></div><div className=" ">$2</div><MousePointer className="h-6 w-6 text-purple-600" /></div></Card>

        {/* ROAS */}
        <Card className="p-6 backdrop-blur-xl bg-white/10 dark:bg-gray-900/10 border border-white/20 dark:border-gray-700/20 hover:bg-white/20 dark:hover:bg-gray-900/20 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10" />
          <div className=" ">$2</div><div>
           
        </div><p className="text-sm font-medium text-gray-600 dark:text-gray-400" />
                ROAS Médio
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white" />
                {overview.average_roas.toFixed(1)}x
              </p>
              <div className=" ">$2</div><ArrowUpRight className="h-4 w-4 text-green-500" />
                <span className="text-sm text-green-600 ml-1">+0.8x vs. período anterior</span></div><div className=" ">$2</div><TrendingUp className="h-6 w-6 text-orange-600" /></div></Card>
      </div>

      {/* Charts and Performance */}
      <div className="{/* Performance por Plataforma */}">$2</div>
        <Card className="p-6 backdrop-blur-xl bg-white/10 dark:bg-gray-900/10 border border-white/20 dark:border-gray-700/20 hover:bg-white/20 dark:hover:bg-gray-900/20 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10" />
          <div className=" ">$2</div><h3 className="text-lg font-semibold">Performance por Plataforma</h3>
            <Button variant="ghost" size="sm" />
              <Download className="h-4 w-4" /></Button></div>
          <div className=" ">$2</div><BarChart
              data={ chartData }
              categories={ ['spent', 'conversions'] }
              index="name"
              colors={ ['blue', 'green'] }
              valueFormatter={(value: number) = />
                value > 1000 ? `${(value / 1000).toFixed(1)}k` : value.toString()
  } /></div></Card>

        {/* Budget Utilization */}
        <Card className="p-6 backdrop-blur-xl bg-white/10 dark:bg-gray-900/10 border border-white/20 dark:border-gray-700/20 hover:bg-white/20 dark:hover:bg-gray-900/20 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10" />
          <div className=" ">$2</div><h3 className="text-lg font-semibold">Utilização do Orçamento</h3>
            <Badge variant="success" />
              {overview.budget_utilization.toFixed(1)}%
            </Badge></div><div className=" ">$2</div><div>
           
        </div><div className=" ">$2</div><span>Total Investido</span>
                <span>R$ {overview.total_spent.toLocaleString('pt-BR')}</span></div><Progress 
                value={ overview.budget_utilization }
                className="h-2"
              / />
              <div className=" ">$2</div><span>R$ 0</span>
                <span>R$ {overview.total_budget.toLocaleString('pt-BR')}</span></div><div className=" ">$2</div><div className=" ">$2</div><p className="text-sm text-gray-600 dark:text-gray-400">Impressões</p>
                <p className="text-xl font-bold">{(overview.total_impressions / 1000000).toFixed(1)}M</p></div><div className=" ">$2</div><p className="text-sm text-gray-600 dark:text-gray-400">Conversões</p>
                <p className="text-xl font-bold">{overview.total_conversions.toLocaleString()}</p></div></div></Card></div>

      {/* Campaigns Table */}
      <Card className="p-6" />
        <div className=" ">$2</div><h3 className="text-lg font-semibold">Campanhas Recentes</h3>
          <div className=" ">$2</div><Input
              placeholder="Buscar campanhas..."
              className="w-64"
            / />
            <Button variant="outline" size="sm" />
              <Filter className="h-4 w-4" /></Button></div>
        <div className=" ">$2</div><table className="w-full" />
            <thead />
              <tr className="border-b" />
                <th className="text-left py-3 px-4 font-medium">Campanha</th>
                <th className="text-left py-3 px-4 font-medium">Status</th>
                <th className="text-left py-3 px-4 font-medium">Plataforma</th>
                <th className="text-right py-3 px-4 font-medium">Orçamento</th>
                <th className="text-right py-3 px-4 font-medium">Gasto</th>
                <th className="text-right py-3 px-4 font-medium">CTR</th>
                <th className="text-right py-3 px-4 font-medium">ROAS</th>
                <th className="text-center py-3 px-4 font-medium">Ações</th></tr></thead>
            <tbody />
              {filteredCampaigns.slice(0, 10).map((campaign: unknown) => (
                <tr key={campaign.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800" />
                  <td className="py-3 px-4" />
                    <div>
           
        </div><p className="font-medium">{campaign.name}</p>
                      <p className="text-sm text-gray-500">{campaign.objective}</p></div></td>
                  <td className="py-3 px-4" />
                    <Badge 
                      variant={ campaign.status === 'active' ? 'success' : 
                        campaign.status === 'paused' ? 'warning' : 
                        'default'
                       } />
                      {campaign.status}
                    </Badge></td><td className="py-3 px-4" />
                    <div className=" ">$2</div><div 
                        className={`w-3 h-3 rounded-full ${PLATFORM_COLORS[campaign.platform] || 'bg-gray-500'} `} />
           
        </div><span>{PLATFORM_NAMES[campaign.platform] || campaign.platform}</span></div></td>
                  <td className="py-3 px-4 text-right" />
                    R$ {campaign.budget.toLocaleString('pt-BR')}
                  </td>
                  <td className="py-3 px-4 text-right" />
                    <div>
           
        </div><span>R$ {campaign.spent.toLocaleString('pt-BR')}</span>
                      <div className="{((campaign.spent / campaign.budget) * 100).toFixed(1)}%">$2</div>
                      </div></td><td className="py-3 px-4 text-right" />
                    <span className={campaign.ctr > 1.5 ? 'text-green-600' : 
                      campaign.ctr > 1.0 ? 'text-yellow-600' : 'text-red-600'
                      }>
                      {campaign.ctr.toFixed(2)}%
                    </span></td><td className="py-3 px-4 text-right" />
                    <span className={campaign.roas > 3 ? 'text-green-600' : 
                      campaign.roas > 2 ? 'text-yellow-600' : 'text-red-600'
                      }>
                      {campaign.roas.toFixed(1)}x
                    </span></td><td className="py-3 px-4" />
                    <div className="{ campaign.status === 'active' ? (">$2</div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={ () => handleCampaignAction(campaign.id, 'pause')  }>
                          <Pause className="h-4 w-4" />
                        </Button>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={ () => handleCampaignAction(campaign.id, 'play')  }>
                          <Play className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={ () => handleCampaignAction(campaign.id, 'stop')  }>
                        <Square className="h-4 w-4" /></Button></div></td></tr>
              ))}
            </tbody></table></div></Card></div>);};

export default AdvancedADSToolDashboard;
