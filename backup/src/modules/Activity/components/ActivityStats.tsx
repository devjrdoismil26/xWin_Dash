/**
 * Componente de estatísticas do módulo Activity
 * Exibe métricas e indicadores de performance
 */

import React from 'react';
import { useActivity } from '../hooks';
import { Card } from '@/components/ui/Card';
import { AnimatedCounter } from '@/components/ui/AdvancedAnimations';
import { ResponsiveGrid } from '@/components/ui/ResponsiveSystem';
import { 
  Activity, 
  User, 
  AlertTriangle, 
  Globe,
  TrendingUp,
  Clock
} from 'lucide-react';

interface ActivityStatsProps {
  className?: string;
}

export const ActivityStats: React.FC<ActivityStatsProps> = ({ className }) => {
  const { stats, statsLoading } = useActivity();

  if (statsLoading) {
    return (
      <ResponsiveGrid
        columns={{ xs: 1, sm: 2, lg: 4 }}
        gap={{ xs: '1rem', md: '1.5rem' }}
        className={className}
      >
        {[...Array(4)].map((_, index) => (
          <Card key={index} className="backdrop-blur-xl bg-white/10 border-white/20">
            <Card.Content className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-300 rounded w-1/2"></div>
              </div>
            </Card.Content>
          </Card>
        ))}
      </ResponsiveGrid>
    );
  }

  const statsData = [
    {
      title: 'Atividades Hoje',
      value: stats?.today_logs || 0,
      icon: Activity,
      color: 'text-blue-600',
      bgColor: 'bg-blue-500/20'
    },
    {
      title: 'Usuários Ativos',
      value: stats?.active_users || 0,
      icon: User,
      color: 'text-green-600',
      bgColor: 'bg-green-500/20'
    },
    {
      title: 'Erros',
      value: stats?.error_logs || 0,
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-500/20'
    },
    {
      title: 'API Calls',
      value: stats?.api_calls || 0,
      icon: Globe,
      color: 'text-purple-600',
      bgColor: 'bg-purple-500/20'
    }
  ];

  return (
    <ResponsiveGrid
      columns={{ xs: 1, sm: 2, lg: 4 }}
      gap={{ xs: '1rem', md: '1.5rem' }}
      className={className}
    >
      {statsData.map((stat, index) => (
        <Card 
          key={index} 
          className="backdrop-blur-xl bg-white/10 border-white/20 hover:bg-white/20 transition-all duration-300 hover:shadow-2xl"
        >
          <Card.Content className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  {stat.title}
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  <AnimatedCounter
                    value={stat.value}
                    duration={2000}
                  />
                </p>
              </div>
              <div className={`p-3 rounded-lg backdrop-blur-sm ${stat.bgColor}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
          </Card.Content>
        </Card>
      ))}
    </ResponsiveGrid>
  );
};

export default ActivityStats;
