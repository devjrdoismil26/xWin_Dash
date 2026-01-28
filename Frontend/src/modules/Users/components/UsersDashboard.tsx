import React, { useState, useEffect } from 'react';
import { 
  Users, 
  UserPlus, 
  Shield, 
  Bell, 
  Settings,
  BarChart3,
  UserCheck,
  UserX,
  Clock,
  TrendingUp,
  Activity,
  Play,
  RefreshCw,
  Filter,
  Search
} from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { LoadingSpinner, LoadingSkeleton } from '@/components/ui/LoadingStates';
import { AnimatedCounter, PageTransition, Animated } from '@/components/ui/AdvancedAnimations';
import { ResponsiveGrid, ResponsiveContainer, ShowOn } from '@/components/ui/ResponsiveSystem';
import { ProgressBar, CircularProgress } from '@/components/ui/AdvancedProgress';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import Tooltip from '@/components/ui/Tooltip';
import { useUserManagement } from '../hooks/useUserManagement';
import { useUserStats } from '../hooks/useUserStats';
import { useUserNotifications } from '../hooks/useUserNotifications';

interface UsersDashboardProps {
  className?: string;
}

interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  suspendedUsers: number;
  newUsersToday: number;
  usersGrowthRate: number;
  averageSessionDuration: number;
  unreadNotifications: number;
  totalActivities: number;
  activitiesToday: number;
}

const UsersDashboard: React.FC<UsersDashboardProps> = ({ className = '' }) => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [activeView, setActiveView] = useState('overview');

  // Hooks
  const { usersStats, fetchUsersStats } = useUserManagement();
  const { generalStats, fetchGeneralStats, realTimeStats, fetchRealTimeStats } = useUserStats();
  const { unreadCount, getUnreadCount } = useUserNotifications();

  // Carregar dados iniciais
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      await Promise.all([
        fetchUsersStats(),
        fetchGeneralStats(),
        fetchRealTimeStats(),
        getUnreadCount('current-user') // Assumindo usuário atual
      ]);

      // Combinar estatísticas
      const combinedStats: DashboardStats = {
        totalUsers: usersStats?.total_users || 0,
        activeUsers: usersStats?.active_users || 0,
        inactiveUsers: usersStats?.inactive_users || 0,
        suspendedUsers: usersStats?.suspended_users || 0,
        newUsersToday: usersStats?.new_users_today || 0,
        usersGrowthRate: usersStats?.users_growth_rate || 0,
        averageSessionDuration: usersStats?.average_session_duration || 0,
        unreadNotifications: unreadCount || 0,
        totalActivities: generalStats?.total_users || 0, // Assumindo que há campo de atividades
        activitiesToday: generalStats?.new_users_today || 0 // Assumindo que há campo de atividades hoje
      };

      setStats(combinedStats);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar dados do dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  if (loading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <LoadingSkeleton key={i} className="h-32" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <LoadingSkeleton className="h-64" />
          <LoadingSkeleton className="h-64" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <ErrorState
        title="Erro ao carregar dashboard"
        message={error}
        action={
          <Button onClick={handleRefresh} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Tentar novamente
          </Button>
        }
      />
    );
  }

  if (!stats) {
    return (
      <EmptyState
        title="Nenhum dado disponível"
        message="Não há dados para exibir no dashboard"
        action={
          <Button onClick={handleRefresh} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Recarregar
          </Button>
        }
      />
    );
  }

  const statCards = [
    {
      title: 'Total de Usuários',
      value: stats.totalUsers,
      icon: <Users className="w-6 h-6" />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      trend: stats.usersGrowthRate > 0 ? 'up' : stats.usersGrowthRate < 0 ? 'down' : 'stable',
      trendValue: Math.abs(stats.usersGrowthRate)
    },
    {
      title: 'Usuários Ativos',
      value: stats.activeUsers,
      icon: <UserCheck className="w-6 h-6" />,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      title: 'Usuários Inativos',
      value: stats.inactiveUsers,
      icon: <UserX className="w-6 h-6" />,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-200'
    },
    {
      title: 'Usuários Suspensos',
      value: stats.suspendedUsers,
      icon: <Shield className="w-6 h-6" />,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200'
    }
  ];

  const quickActions = [
    {
      title: 'Novo Usuário',
      description: 'Criar um novo usuário',
      icon: <UserPlus className="w-5 h-5" />,
      color: 'bg-blue-50 border-blue-200 text-blue-600',
      action: () => console.log('Criar usuário')
    },
    {
      title: 'Gerenciar Roles',
      description: 'Configurar permissões',
      icon: <Shield className="w-5 h-5" />,
      color: 'bg-purple-50 border-purple-200 text-purple-600',
      action: () => console.log('Gerenciar roles')
    },
    {
      title: 'Ver Notificações',
      description: `${stats.unreadNotifications} não lidas`,
      icon: <Bell className="w-5 h-5" />,
      color: 'bg-orange-50 border-orange-200 text-orange-600',
      action: () => console.log('Ver notificações')
    },
    {
      title: 'Relatórios',
      description: 'Gerar relatórios',
      icon: <BarChart3 className="w-5 h-5" />,
      color: 'bg-green-50 border-green-200 text-green-600',
      action: () => console.log('Gerar relatórios')
    }
  ];

  const recentActivity = [
    { action: 'Usuário criado', time: '2 horas atrás', type: 'success' },
    { action: 'Role atribuída', time: '4 horas atrás', type: 'info' },
    { action: 'Usuário suspenso', time: '1 dia atrás', type: 'warning' },
    { action: 'Relatório gerado', time: '2 dias atrás', type: 'info' }
  ];

  return (
    <PageTransition>
      <div className={`space-y-6 ${className}`}>
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard de Usuários</h1>
            <p className="text-gray-600">Visão geral do sistema de usuários</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={handleRefresh}
              variant="outline"
              size="sm"
              disabled={refreshing}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Atualizar
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Configurações
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <ResponsiveGrid cols={{ default: 4, md: 2, sm: 1 }} gap={6}>
          {statCards.map((stat, index) => (
            <Animated key={stat.title} delay={index * 100}>
              <Card className={`p-6 border ${stat.borderColor} ${stat.bgColor}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <AnimatedCounter
                      value={stat.value}
                      className="text-2xl font-bold text-gray-900"
                    />
                    {stat.trend && (
                      <div className={`flex items-center mt-2 text-sm ${
                        stat.trend === 'up' ? 'text-green-600' : 
                        stat.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        <TrendingUp className={`w-4 h-4 mr-1 ${
                          stat.trend === 'down' ? 'rotate-180' : ''
                        }`} />
                        <span>{stat.trendValue.toFixed(1)}% vs período anterior</span>
                      </div>
                    )}
                  </div>
                  <div className={`p-3 rounded-lg ${stat.bgColor} ${stat.color}`}>
                    {stat.icon}
                  </div>
                </div>
              </Card>
            </Animated>
          ))}
        </ResponsiveGrid>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <Animated delay={400}>
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h3>
              <div className="grid grid-cols-2 gap-3">
                {quickActions.map((action, index) => (
                  <Button
                    key={action.title}
                    variant="outline"
                    className={`h-auto p-4 flex flex-col items-center gap-2 ${action.color}`}
                    onClick={action.action}
                  >
                    {action.icon}
                    <div className="text-center">
                      <div className="text-sm font-medium">{action.title}</div>
                      <div className="text-xs opacity-75">{action.description}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </Card>
          </Animated>

          {/* Performance Metrics */}
          <Animated delay={500}>
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Métricas de Performance</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Novos Usuários Hoje</span>
                    <span className="font-medium">{stats.newUsersToday}</span>
                  </div>
                  <ProgressBar
                    value={(stats.newUsersToday / stats.totalUsers) * 100}
                    max={100}
                    className="h-2"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Duração Média de Sessão</span>
                    <span className="font-medium">{stats.averageSessionDuration.toFixed(1)}min</span>
                  </div>
                  <ProgressBar
                    value={Math.min((stats.averageSessionDuration / 60) * 100, 100)}
                    max={100}
                    className="h-2"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="text-center">
                    <AnimatedCounter
                      value={stats.unreadNotifications}
                      className="text-xl font-bold text-orange-600"
                    />
                    <p className="text-sm text-gray-600">Notificações</p>
                  </div>
                  <div className="text-center">
                    <AnimatedCounter
                      value={stats.activitiesToday}
                      className="text-xl font-bold text-blue-600"
                    />
                    <p className="text-sm text-gray-600">Atividades Hoje</p>
                  </div>
                </div>
              </div>
            </Card>
          </Animated>

          {/* Recent Activity */}
          <Animated delay={600}>
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Atividade Recente</h3>
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filtrar
                </Button>
              </div>
              <div className="space-y-3">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${
                        activity.type === 'success' ? 'bg-green-500' : 
                        activity.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                      }`} />
                      <span className="text-sm font-medium">{activity.action}</span>
                    </div>
                    <span className="text-xs text-gray-500">{activity.time}</span>
                  </div>
                ))}
              </div>
            </Card>
          </Animated>
        </div>

        {/* View Toggle */}
        <div className="flex justify-center">
          <div className="flex bg-gray-100 rounded-lg p-1">
            {[
              { id: 'overview', label: 'Visão Geral', icon: <BarChart3 className="w-4 h-4" /> },
              { id: 'users', label: 'Usuários', icon: <Users className="w-4 h-4" /> },
              { id: 'roles', label: 'Roles', icon: <Shield className="w-4 h-4" /> },
              { id: 'activity', label: 'Atividade', icon: <Activity className="w-4 h-4" /> }
            ].map((view) => (
              <Button
                key={view.id}
                variant={activeView === view.id ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveView(view.id)}
                className="flex items-center gap-2"
              >
                {view.icon}
                {view.label}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default UsersDashboard;
