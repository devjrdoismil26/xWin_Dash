/**
 * Componente de Dashboard Avançado
 * Dashboard com funcionalidades avançadas e métricas detalhadas
 */

import React from 'react';
import { Card } from "@/components/ui/Card";
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { LoadingSpinner } from '@/components/ui/LoadingStates';
import { ErrorState } from '@/components/ui/ErrorState';
import { 
  TrendingUp, 
  Users, 
  Target, 
  Activity, 
  BarChart3,
  Settings,
  RefreshCw,
  Download
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AdvancedDashboardProps {
  data?: any;
  loading?: boolean;
  error?: string;
  onRefresh?: () => void;
  onExport?: () => void;
  onSettings?: () => void;
  className?: string;
}

export const AdvancedDashboard: React.FC<AdvancedDashboardProps> = ({
  data,
  loading = false,
  error,
  onRefresh,
  onExport,
  onSettings,
  className
}) => {
  if (loading) {
    return (
      <div className={cn("flex items-center justify-center h-64", className)}>
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorState
        title="Erro ao carregar dashboard avançado"
        description={error}
        onRetry={onRefresh}
        className={className}
      />
    );
  }

  const metrics = [
    {
      title: 'Performance Geral',
      value: '94.2%',
      change: '+2.1%',
      trend: 'up',
      icon: TrendingUp,
      color: 'green'
    },
    {
      title: 'Usuários Ativos',
      value: '1,234',
      change: '+12.5%',
      trend: 'up',
      icon: Users,
      color: 'blue'
    },
    {
      title: 'Taxa de Conversão',
      value: '8.7%',
      change: '+0.3%',
      trend: 'up',
      icon: Target,
      color: 'purple'
    },
    {
      title: 'Atividades',
      value: '456',
      change: '-1.2%',
      trend: 'down',
      icon: Activity,
      color: 'orange'
    }
  ];

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Dashboard Avançado
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Métricas detalhadas e insights avançados
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            className="backdrop-blur-sm bg-white/10 border-white/20 hover:bg-white/20"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onExport}
            className="backdrop-blur-sm bg-white/10 border-white/20 hover:bg-white/20"
          >
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onSettings}
            className="backdrop-blur-sm bg-white/10 border-white/20 hover:bg-white/20"
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <Card 
            key={index}
            className={cn(
              "backdrop-blur-xl bg-white/10 border-white/20 hover:bg-white/20 transition-all duration-300",
              metric.color === 'green' && "hover:shadow-green-500/10",
              metric.color === 'blue' && "hover:shadow-blue-500/10",
              metric.color === 'purple' && "hover:shadow-purple-500/10",
              metric.color === 'orange' && "hover:shadow-orange-500/10"
            )}
          >
            <Card.Content className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    {metric.title}
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {metric.value}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <Badge 
                      variant={metric.trend === 'up' ? 'default' : 'destructive'}
                      className="text-xs"
                    >
                      {metric.change}
                    </Badge>
                  </div>
                </div>
                <div className={cn(
                  "p-3 rounded-lg backdrop-blur-sm",
                  metric.color === 'green' && "bg-green-500/20",
                  metric.color === 'blue' && "bg-blue-500/20",
                  metric.color === 'purple' && "bg-purple-500/20",
                  metric.color === 'orange' && "bg-orange-500/20"
                )}>
                  <metric.icon className={cn(
                    "h-6 w-6",
                    metric.color === 'green' && "text-green-600",
                    metric.color === 'blue' && "text-blue-600",
                    metric.color === 'purple' && "text-purple-600",
                    metric.color === 'orange' && "text-orange-600"
                  )} />
                </div>
              </div>
            </Card.Content>
          </Card>
        ))}
      </div>

      {/* Advanced Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="backdrop-blur-xl bg-white/10 border-white/20 hover:bg-white/20 transition-all duration-300">
          <Card.Header>
            <Card.Title className="text-gray-900 dark:text-white flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              Análise de Tendências
            </Card.Title>
          </Card.Header>
          <Card.Content>
            <div className="text-center py-8">
              <div className="text-gray-500 dark:text-gray-400">
                Gráfico de tendências em desenvolvimento
              </div>
            </div>
          </Card.Content>
        </Card>

        <Card className="backdrop-blur-xl bg-white/10 border-white/20 hover:bg-white/20 transition-all duration-300">
          <Card.Header>
            <Card.Title className="text-gray-900 dark:text-white flex items-center gap-2">
              <Activity className="h-5 w-5 text-green-600" />
              Métricas de Performance
            </Card.Title>
          </Card.Header>
          <Card.Content>
            <div className="text-center py-8">
              <div className="text-gray-500 dark:text-gray-400">
                Métricas de performance em desenvolvimento
              </div>
            </div>
          </Card.Content>
        </Card>
      </div>
    </div>
  );
};

export default AdvancedDashboard;
