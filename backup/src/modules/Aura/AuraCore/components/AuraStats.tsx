/**
 * Componente de estatísticas do AuraCore
 * Exibe métricas principais do sistema
 */
import React from 'react';
import { ResponsiveGrid } from '@/components/ui/ResponsiveSystem';
import { Card } from "@/components/ui/Card";
import { Badge } from '@/components/ui/Badge';
import { AnimatedCounter } from '@/components/ui/AdvancedAnimations';
import { TrendingUp, TrendingDown, Minus, Activity, Zap, MessageSquare, Users } from 'lucide-react';
import { AuraStats as AuraStatsType } from '../types';
import { cn } from '@/lib/utils';

interface AuraStatsProps {
  stats?: AuraStatsType | null;
  loading?: boolean;
  error?: string | null;
  onRefresh?: () => void;
  className?: string;
}

export const AuraStats: React.FC<AuraStatsProps> = ({
  stats,
  loading = false,
  error = null,
  onRefresh,
  className
}) => {
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up':
        return 'text-green-600 dark:text-green-400';
      case 'down':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  const formatValue = (value: number, unit: string) => {
    if (unit === 'percentage') {
      return `${value.toFixed(1)}%`;
    }
    if (unit === 'time') {
      const minutes = Math.floor(value / 60);
      const seconds = Math.floor(value % 60);
      return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
    return new Intl.NumberFormat('pt-BR').format(value);
  };

  if (loading && !stats) {
    return (
      <div className={cn("space-y-4", className)}>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Estatísticas do Sistema
        </h2>
        <ResponsiveGrid cols={{ sm: 1, md: 2, lg: 4 }} gap={4}>
          {Array.from({ length: 4 }).map((_, index) => (
            <Card key={index} className="animate-pulse">
              <Card.Content className="p-6">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
              </Card.Content>
            </Card>
          ))}
        </ResponsiveGrid>
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn("space-y-4", className)}>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Estatísticas do Sistema
        </h2>
        <Card>
          <Card.Content className="p-6 text-center">
            <p className="text-red-500 dark:text-red-400">
              Erro ao carregar estatísticas: {error}
            </p>
            {onRefresh && (
              <button
                onClick={onRefresh}
                className="mt-2 text-blue-500 hover:text-blue-600"
              >
                Tentar novamente
              </button>
            )}
          </Card.Content>
        </Card>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className={cn("space-y-4", className)}>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Estatísticas do Sistema
        </h2>
        <Card>
          <Card.Content className="p-6 text-center">
            <p className="text-gray-500 dark:text-gray-400">
              Nenhuma estatística disponível
            </p>
          </Card.Content>
        </Card>
      </div>
    );
  }

  const mainStats = [
    {
      id: 'connections',
      name: 'Conexões Ativas',
      value: stats.total_connections,
      unit: 'number',
      icon: <Users className="h-5 w-5" />,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20'
    },
    {
      id: 'flows',
      name: 'Fluxos Ativos',
      value: stats.active_flows,
      unit: 'number',
      icon: <Zap className="h-5 w-5" />,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20'
    },
    {
      id: 'messages',
      name: 'Mensagens Enviadas',
      value: stats.messages_sent,
      unit: 'number',
      icon: <MessageSquare className="h-5 w-5" />,
      color: 'text-green-500',
      bgColor: 'bg-green-50 dark:bg-green-900/20'
    },
    {
      id: 'response_time',
      name: 'Tempo de Resposta',
      value: stats.response_time,
      unit: 'time',
      icon: <Activity className="h-5 w-5" />,
      color: 'text-orange-500',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20'
    }
  ];

  return (
    <div className={cn("space-y-4", className)}>
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
        Estatísticas do Sistema
      </h2>
      
      <ResponsiveGrid cols={{ sm: 1, md: 2, lg: 4 }} gap={4}>
        {mainStats.map((stat) => (
          <Card key={stat.id} className="hover:shadow-md transition-shadow">
            <Card.Content className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className={cn("p-2 rounded-lg", stat.bgColor)}>
                  <div className={stat.color}>
                    {stat.icon}
                  </div>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {stat.unit === 'time' ? 'ms' : 'total'}
                </Badge>
              </div>
              
              <div className="mb-2">
                <AnimatedCounter
                  value={stat.value}
                  className="text-2xl font-bold text-gray-900 dark:text-white"
                />
                <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">
                  {stat.unit === 'time' ? 'ms' : ''}
                </span>
              </div>
              
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {stat.name}
              </p>
            </Card.Content>
          </Card>
        ))}
      </ResponsiveGrid>

      {/* Métricas detalhadas */}
      {stats.metrics && stats.metrics.length > 0 && (
        <div className="mt-6">
          <h3 className="text-md font-medium text-gray-900 dark:text-white mb-4">
            Métricas Detalhadas
          </h3>
          <ResponsiveGrid cols={{ sm: 1, md: 2, lg: 3 }} gap={4}>
            {stats.metrics.map((metric) => (
              <Card key={metric.id} className="hover:shadow-md transition-shadow">
                <Card.Content className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {metric.name}
                    </span>
                    {getTrendIcon(metric.trend)}
                  </div>
                  
                  <div className="mb-2">
                    <AnimatedCounter
                      value={metric.value}
                      className="text-xl font-bold text-gray-900 dark:text-white"
                    />
                    <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">
                      {metric.unit}
                    </span>
                  </div>
                  
                  {metric.change_percentage !== undefined && (
                    <div className="flex items-center space-x-1">
                      <span className={cn("text-sm font-medium", getTrendColor(metric.trend))}>
                        {metric.change_percentage > 0 ? '+' : ''}{metric.change_percentage.toFixed(1)}%
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        vs período anterior
                      </span>
                    </div>
                  )}
                  
                  {metric.description && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      {metric.description}
                    </p>
                  )}
                </Card.Content>
              </Card>
            ))}
          </ResponsiveGrid>
        </div>
      )}
    </div>
  );
};
