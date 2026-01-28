import React, { useState, useEffect } from 'react';
import { 
  Users, 
  UserPlus, 
  UserCheck, 
  UserX, 
  Shield, 
  TrendingUp, 
  TrendingDown,
  Activity,
  Clock,
  MapPin,
  Smartphone,
  Monitor,
  Globe,
  Calendar,
  BarChart3,
  PieChart,
  RefreshCw
} from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { LoadingSpinner, LoadingSkeleton } from '@/components/ui/LoadingStates';
import { AnimatedCounter, Animated } from '@/components/ui/AdvancedAnimations';
import { ResponsiveGrid, ResponsiveContainer } from '@/components/ui/ResponsiveSystem';
import { ProgressBar, CircularProgress } from '@/components/ui/AdvancedProgress';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import Tooltip from '@/components/ui/Tooltip';
import { useUserStats } from '../hooks/useUserStats';

interface UsersStatsProps {
  className?: string;
  showDetails?: boolean;
  refreshInterval?: number;
}

interface StatCard {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  borderColor: string;
  trend?: {
    value: number;
    direction: 'up' | 'down' | 'stable';
  };
  format?: 'number' | 'percentage' | 'duration';
}

const UsersStats: React.FC<UsersStatsProps> = ({ 
  className = '', 
  showDetails = true,
  refreshInterval = 300000 // 5 minutos
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Hooks
  const { 
    generalStats, 
    growthStats, 
    activityStats, 
    roleStats,
    locationStats,
    deviceStats,
    timeStats,
    realTimeStats,
    fetchGeneralStats,
    fetchGrowthStats,
    fetchActivityStats,
    fetchRoleStats,
    fetchLocationStats,
    fetchDeviceStats,
    fetchTimeStats,
    fetchRealTimeStats
  } = useUserStats();

  // Carregar dados iniciais
  useEffect(() => {
    loadStatsData();
  }, []);

  // Auto-refresh
  useEffect(() => {
    if (refreshInterval > 0) {
      const interval = setInterval(loadStatsData, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [refreshInterval]);

  const loadStatsData = async () => {
    try {
      setLoading(true);
      setError(null);

      await Promise.all([
        fetchGeneralStats(),
        fetchGrowthStats(),
        fetchActivityStats(),
        fetchRoleStats(),
        fetchLocationStats(),
        fetchDeviceStats(),
        fetchTimeStats(),
        fetchRealTimeStats()
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar estatísticas');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadStatsData();
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
        {showDetails && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <LoadingSkeleton className="h-64" />
            <LoadingSkeleton className="h-64" />
          </div>
        )}
      </div>
    );
  }

  if (error) {
    return (
      <ErrorState
        title="Erro ao carregar estatísticas"
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

  // Preparar dados dos cards principais
  const mainStats: StatCard[] = [
    {
      title: 'Total de Usuários',
      value: generalStats?.total_users || 0,
      icon: <Users className="w-6 h-6" />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      trend: growthStats?.users_growth_rate ? {
        value: Math.abs(growthStats.users_growth_rate),
        direction: growthStats.users_growth_rate > 0 ? 'up' : 'down'
      } : undefined
    },
    {
      title: 'Usuários Ativos',
      value: generalStats?.active_users || 0,
      icon: <UserCheck className="w-6 h-6" />,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      trend: growthStats?.active_users_growth_rate ? {
        value: Math.abs(growthStats.active_users_growth_rate),
        direction: growthStats.active_users_growth_rate > 0 ? 'up' : 'down'
      } : undefined
    },
    {
      title: 'Novos Hoje',
      value: generalStats?.new_users_today || 0,
      icon: <UserPlus className="w-6 h-6" />,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    },
    {
      title: 'Usuários Online',
      value: realTimeStats?.online_users || 0,
      icon: <Activity className="w-6 h-6" />,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200'
    }
  ];

  const formatValue = (value: number, format?: string): string => {
    switch (format) {
      case 'percentage':
        return `${value.toFixed(1)}%`;
      case 'duration':
        return `${value.toFixed(1)}min`;
      default:
        return value.toLocaleString();
    }
  };

  const getTrendIcon = (direction: 'up' | 'down' | 'stable') => {
    switch (direction) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      default:
        return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Estatísticas de Usuários</h2>
          <p className="text-gray-600">Métricas detalhadas do sistema de usuários</p>
        </div>
        <Button
          onClick={handleRefresh}
          variant="outline"
          size="sm"
          disabled={refreshing}
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          Atualizar
        </Button>
      </div>

      {/* Main Stats Cards */}
      <ResponsiveGrid cols={{ default: 4, md: 2, sm: 1 }} gap={6}>
        {mainStats.map((stat, index) => (
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
                    <div className="flex items-center mt-2 text-sm">
                      {getTrendIcon(stat.trend.direction)}
                      <span className={`ml-1 ${
                        stat.trend.direction === 'up' ? 'text-green-600' : 
                        stat.trend.direction === 'down' ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        {formatValue(stat.trend.value, 'percentage')} vs período anterior
                      </span>
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

      {showDetails && (
        <>
          {/* Detailed Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Role Distribution */}
            <Animated delay={400}>
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Distribuição por Roles</h3>
                  <Shield className="w-5 h-5 text-gray-400" />
                </div>
                <div className="space-y-3">
                  {roleStats?.role_distribution?.slice(0, 5).map((role, index) => (
                    <div key={role.role_name} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-blue-500" />
                        <span className="text-sm font-medium">{role.role_name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">{role.user_count}</span>
                        <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-blue-500 transition-all duration-500"
                            style={{ 
                              width: `${(role.user_count / (roleStats?.total_users || 1)) * 100}%` 
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </Animated>

            {/* Device Stats */}
            <Animated delay={500}>
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Dispositivos</h3>
                  <Smartphone className="w-5 h-5 text-gray-400" />
                </div>
                <div className="space-y-4">
                  {deviceStats?.device_distribution?.map((device, index) => (
                    <div key={device.device_type} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {device.device_type === 'mobile' ? (
                          <Smartphone className="w-4 h-4 text-gray-600" />
                        ) : device.device_type === 'desktop' ? (
                          <Monitor className="w-4 h-4 text-gray-600" />
                        ) : (
                          <Globe className="w-4 h-4 text-gray-600" />
                        )}
                        <span className="text-sm font-medium capitalize">{device.device_type}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">{device.user_count}</span>
                        <span className="text-xs text-gray-500">
                          ({formatValue(device.percentage, 'percentage')})
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </Animated>
          </div>

          {/* Activity and Time Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Activity Stats */}
            <Animated delay={600}>
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Atividade</h3>
                  <Activity className="w-5 h-5 text-gray-400" />
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Sessões Ativas</span>
                    <AnimatedCounter
                      value={activityStats?.active_sessions || 0}
                      className="text-lg font-bold text-blue-600"
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Duração Média</span>
                    <span className="text-lg font-bold text-green-600">
                      {formatValue(activityStats?.average_session_duration || 0, 'duration')}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Páginas por Sessão</span>
                    <span className="text-lg font-bold text-purple-600">
                      {(activityStats?.average_pages_per_session || 0).toFixed(1)}
                    </span>
                  </div>
                </div>
              </Card>
            </Animated>

            {/* Time Stats */}
            <Animated delay={700}>
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Horários de Pico</h3>
                  <Clock className="w-5 h-5 text-gray-400" />
                </div>
                <div className="space-y-3">
                  {timeStats?.peak_hours?.slice(0, 3).map((hour, index) => (
                    <div key={hour.hour} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Clock className="w-4 h-4 text-gray-600" />
                        <span className="text-sm font-medium">{hour.hour}:00</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">{hour.user_count}</span>
                        <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-orange-500 transition-all duration-500"
                            style={{ 
                              width: `${(hour.user_count / (timeStats?.peak_hours?.[0]?.user_count || 1)) * 100}%` 
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </Animated>
          </div>
        </>
      )}
    </div>
  );
};

export default UsersStats;
