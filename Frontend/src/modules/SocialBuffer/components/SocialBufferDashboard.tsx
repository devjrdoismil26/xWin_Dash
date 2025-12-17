import React, { useState, useEffect } from 'react';
import { BarChart3, Send, Users, Calendar, Hash, Link as Link, Image, TrendingUp, Play, RefreshCw, Settings, Bell, Filter } from 'lucide-react';
import Card from '@/shared/components/ui/Card';
import Button from '@/shared/components/ui/Button';
import { LoadingSpinner, LoadingSkeleton } from '@/shared/components/ui/LoadingStates';
import { AnimatedCounter, PageTransition, Animated } from '@/shared/components/ui/AdvancedAnimations';
import { ResponsiveGrid, ResponsiveContainer, ShowOn } from '@/shared/components/ui/ResponsiveSystem';
import { Progress, CircularProgress } from '@/shared/components/ui/AdvancedProgress';
import { EmptyState } from '@/shared/components/ui/EmptyState';
import ErrorState from '@/shared/components/ui/ErrorState';
import Tooltip from '@/shared/components/ui/Tooltip';
import { useAccountsStore } from '../hooks/useAccountsStore';
import { usePostsStore } from '../hooks/usePostsStore';
import { useSchedulesStore } from '../hooks/useSchedulesStore';
import { useAnalyticsStore } from '../hooks/useAnalyticsStore';

interface SocialBufferDashboardProps {
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

interface DashboardStats {
  totalAccounts: number;
  totalPosts: number;
  totalSchedules: number;
  totalEngagement: number;
  totalReach: number;
  totalImpressions: number;
  averageEngagementRate: number;
  topPerformingPost: unknown; }

const SocialBufferDashboard: React.FC<SocialBufferDashboardProps> = ({ className = ''    }) => {
  const [stats, setStats] = useState<DashboardStats | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  const [refreshing, setRefreshing] = useState(false);

  // Stores
  const { accountsStats, fetchAccountsStats } = useAccountsStore();

  const { postsStats, fetchPostsStats } = usePostsStore();

  const { schedulesStats, fetchSchedulesStats } = useSchedulesStore();

  const { basicMetrics, fetchBasicMetrics } = useAnalyticsStore();

  // Carregar dados iniciais
  useEffect(() => {
    loadDashboardData();

  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      setError(null);

      await Promise.all([
        fetchAccountsStats(),
        fetchPostsStats(),
        fetchSchedulesStats(),
        fetchBasicMetrics()
      ]);

      // Combinar estatísticas
      const combinedStats: DashboardStats = {
        totalAccounts: accountsStats?.total_accounts || 0,
        totalPosts: postsStats?.total_posts || 0,
        totalSchedules: schedulesStats?.total_schedules || 0,
        totalEngagement: basicMetrics?.total_engagement || 0,
        totalReach: basicMetrics?.total_reach || 0,
        totalImpressions: basicMetrics?.total_impressions || 0,
        averageEngagementRate: basicMetrics?.average_engagement_rate || 0,
        topPerformingPost: null // Será implementado posteriormente};

      setStats(combinedStats);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar dados do dashboard');

    } finally {
      setLoading(false);

    } ;

  const handleRefresh = async () => {
    setRefreshing(true);

    await loadDashboardData();

    setRefreshing(false);};

  if (loading) {
    return (
        <>
      <div className={`space-y-6 ${className} `}>
      </div><div className="{[...Array(4)].map((_: unknown, i: unknown) => (">$2</div>
      <LoadingSkeleton key={i} className="h-32" />
    </>
  ))}
        </div>
        <div className=" ">$2</div><LoadingSkeleton className="h-64" />
          <LoadingSkeleton className="h-64" />
        </div>);

  }

  if (error) {
    return (
        <>
      <ErrorState
        title="Erro ao carregar dashboard"
        message={ error }
        action={
    <Button onClick={handleRefresh} variant="outline" />
      <RefreshCw className="w-4 h-4 mr-2" />
            Tentar novamente
          </Button>
  } />);

  }

  if (!stats) {
    return (
        <>
      <EmptyState
        title="Nenhum dado disponível"
        message="Não há dados para exibir no dashboard"
        action={
    <Button onClick={handleRefresh} variant="outline" />
      <RefreshCw className="w-4 h-4 mr-2" />
            Recarregar
          </Button>
  } />);

  }

  const statCards = [
    {
      title: 'Contas Conectadas',
      value: stats.totalAccounts,
      icon: <Users className="w-6 h-6" />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      title: 'Posts Publicados',
      value: stats.totalPosts,
      icon: <Send className="w-6 h-6" />,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      title: 'Agendamentos',
      value: stats.totalSchedules,
      icon: <Calendar className="w-6 h-6" />,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    },
    {
      title: 'Engajamento Total',
      value: stats.totalEngagement,
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200'
    }
  ];

  return (
        <>
      <PageTransition />
      <div className={`space-y-6 ${className} `}>
           
        </div>{/* Header */}
        <div className=" ">$2</div><div>
           
        </div><h1 className="text-2xl font-bold text-gray-900">Dashboard SocialBuffer</h1>
            <p className="text-gray-600">Visão geral das suas métricas e performance</p></div><div className=" ">$2</div><Button
              onClick={ handleRefresh }
              variant="outline"
              size="sm"
              disabled={ refreshing } />
              <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''} `} / />
              Atualizar
            </Button>
            <Button variant="outline" size="sm" />
              <Settings className="w-4 h-4 mr-2" />
              Configurações
            </Button>
          </div>

        {/* Stats Cards */}
        <ResponsiveGrid cols={ default: 4, md: 2, sm: 1 } gap={ 6 } />
          { (statCards || []).map((stat: unknown, index: unknown) => (
            <Animated key={stat.title } />
              <Card className={`p-6 border ${stat.borderColor} ${stat.bgColor}`} />
                <div className=" ">$2</div><div>
           
        </div><p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <AnimatedCounter
                      value={ stat.value }
                      className="text-2xl font-bold text-gray-900"
                    / /></div><div className={`p-3 rounded-lg ${stat.bgColor} ${stat.color}`}>
           
        </div>{stat.icon}
                  </div></Card></Animated>
          ))}
        </ResponsiveGrid>

        {/* Metrics Overview */}
        <div className="{/* Engagement Metrics */}">$2</div>
          <Animated />
            <Card className="p-6" />
              <div className=" ">$2</div><h3 className="text-lg font-semibold text-gray-900">Métricas de Engajamento</h3>
                <Tooltip content="Taxa de engajamento média" />
                  <TrendingUp className="w-5 h-5 text-gray-400" /></Tooltip></div>
              <div className=" ">$2</div><div>
           
        </div><div className=" ">$2</div><span className="text-gray-600">Taxa de Engajamento</span>
                    <span className="font-medium">{stats.averageEngagementRate.toFixed(1)}%</span></div><Progress
                    value={ stats.averageEngagementRate }
                    max={ 100 }
                    className="h-2"
                  / /></div><div className=" ">$2</div><div className=" ">$2</div><AnimatedCounter
                      value={ stats.totalReach }
                      className="text-xl font-bold text-blue-600"
                    / />
                    <p className="text-sm text-gray-600">Alcance</p></div><div className=" ">$2</div><AnimatedCounter
                      value={ stats.totalImpressions }
                      className="text-xl font-bold text-green-600"
                    / />
                    <p className="text-sm text-gray-600">Impressões</p></div></div></Card></Animated>

          {/* Quick Actions */}
          <Animated />
            <Card className="p-6" />
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h3>
              <div className=" ">$2</div><Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2" />
                  <Send className="w-5 h-5" />
                  <span className="text-sm">Novo Post</span></Button><Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2" />
                  <Calendar className="w-5 h-5" />
                  <span className="text-sm">Agendar</span></Button><Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2" />
                  <BarChart3 className="w-5 h-5" />
                  <span className="text-sm">Analytics</span></Button><Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2" />
                  <Users className="w-5 h-5" />
                  <span className="text-sm">Contas</span></Button></div></Card></Animated></div>

        {/* Recent Activity */}
        <Animated />
          <Card className="p-6" />
            <div className=" ">$2</div><h3 className="text-lg font-semibold text-gray-900">Atividade Recente</h3>
              <Button variant="outline" size="sm" />
                <Filter className="w-4 h-4 mr-2" />
                Filtrar
              </Button></div><div className="{[">$2</div>
                { action: 'Post publicado', time: '2 horas atrás', type: 'success' },
                { action: 'Agendamento criado', time: '4 horas atrás', type: 'info' },
                { action: 'Conta conectada', time: '1 dia atrás', type: 'success' },
                { action: 'Relatório gerado', time: '2 dias atrás', type: 'info' }
              ].map((activity: unknown, index: unknown) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
           
        </div><div className=" ">$2</div><div className={`w-2 h-2 rounded-full ${
                      activity.type === 'success' ? 'bg-green-500' : 'bg-blue-500'
                    } `} />
           
        </div><span className="text-sm font-medium">{activity.action}</span></div><span className="text-xs text-gray-500">{activity.time}</span>
      </div>
    </>
  ))}
            </div></Card></Animated></div></PageTransition>);};

export default SocialBufferDashboard;
