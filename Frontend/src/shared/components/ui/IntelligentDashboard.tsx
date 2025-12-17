import React, { useState, useEffect } from 'react';
import { Card } from './Card';
import { Button } from './Button';
import { BarChart3, TrendingUp, Users, Activity, Settings, RefreshCw } from 'lucide-react';

interface DashboardMetric {
  id: string;
  title: string;
  value: string | number;
  change?: number;
  icon: React.ReactNode;
  color: string;
}

interface IntelligentDashboardProps {
  title?: string;
  metrics?: DashboardMetric[];
  onRefresh?: () => void;
  loading?: boolean;
  className?: string;
}

const defaultMetrics: DashboardMetric[] = [
  {
    id: '1',
    title: 'Total de Leads',
    value: '1,234',
    change: 12.5,
    icon: <Users className="h-6 w-6" />,
    color: 'text-blue-600'
  },
  {
    id: '2',
    title: 'Conversões',
    value: '89',
    change: 8.2,
    icon: <TrendingUp className="h-6 w-6" />,
    color: 'text-green-600'
  },
  {
    id: '3',
    title: 'Taxa de Conversão',
    value: '7.2%',
    change: -2.1,
    icon: <BarChart3 className="h-6 w-6" />,
    color: 'text-purple-600'
  },
  {
    id: '4',
    title: 'Atividade Hoje',
    value: '156',
    change: 15.3,
    icon: <Activity className="h-6 w-6" />,
    color: 'text-orange-600'
  }
];

const MetricCard: React.FC<{ metric: DashboardMetric }> = ({ metric }) => (
  <Card className="p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
          {metric.title}
        </p>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">
          {metric.value}
        </p>
        {metric.change && (
          <p className={`text-sm ${metric.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {metric.change > 0 ? '+' : ''}{metric.change}%
          </p>
        )}
      </div>
      <div className={`p-3 rounded-full bg-gray-100 dark:bg-gray-800 ${metric.color}`}>
        {metric.icon}
      </div>
    </div>
  </Card>
);

const IntelligentDashboard: React.FC<IntelligentDashboardProps> = ({
  title = 'Dashboard Inteligente',
  metrics = defaultMetrics,
  onRefresh,
  loading = false,
  className = ''
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    if (onRefresh) {
      setIsRefreshing(true);
      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
      }
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          {title}
        </h2>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing || loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Configurar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric) => (
          <MetricCard key={metric.id} metric={metric} />
        ))}
      </div>

      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600 dark:text-gray-400">
            Carregando dados...
          </span>
        </div>
      )}
    </div>
  );
};

export default IntelligentDashboard;
