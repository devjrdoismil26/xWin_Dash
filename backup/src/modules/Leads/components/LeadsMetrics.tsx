// ========================================
// LEADS METRICS COMPONENT
// ========================================
// Componente para exibir métricas de leads
// Máximo: 150 linhas

import React from 'react';
import { TrendingUp, TrendingDown, Users, Target, Star, Activity } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { AnimatedCounter } from '@/components/ui/AdvancedAnimations';
import { ResponsiveGrid } from '@/components/ui/ResponsiveSystem';
import { LeadMetrics } from '../types';

// ========================================
// INTERFACES
// ========================================

interface LeadsMetricsProps {
  metrics: LeadMetrics;
  loading?: boolean;
  onRefresh?: () => void;
  className?: string;
}

// ========================================
// COMPONENTE
// ========================================

export const LeadsMetrics: React.FC<LeadsMetricsProps> = ({
  metrics,
  loading = false,
  onRefresh,
  className = ''
}) => {
  // ========================================
  // HELPER FUNCTIONS
  // ========================================
  
  const getTrendIcon = (value: number) => {
    if (value > 0) return <TrendingUp className="w-4 h-4 text-green-500" />;
    if (value < 0) return <TrendingDown className="w-4 h-4 text-red-500" />;
    return null;
  };

  const getTrendColor = (value: number) => {
    if (value > 0) return 'text-green-600';
    if (value < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const formatPercentage = (value: number) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  // ========================================
  // METRIC CARDS DATA
  // ========================================
  
  const metricCards = [
    {
      title: 'Total de Leads',
      value: metrics.total_leads,
      growth: metrics.leads_growth,
      icon: Users,
      color: 'blue'
    },
    {
      title: 'Leads Convertidos',
      value: metrics.converted_leads,
      growth: metrics.conversion_growth,
      icon: Target,
      color: 'green'
    },
    {
      title: 'Taxa de Conversão',
      value: metrics.conversion_rate,
      growth: metrics.conversion_growth,
      icon: Star,
      color: 'purple',
      suffix: '%'
    },
    {
      title: 'Score Médio',
      value: metrics.average_score,
      growth: metrics.score_growth,
      icon: Activity,
      color: 'orange'
    }
  ];

  // ========================================
  // RENDER
  // ========================================
  
  return (
    <div className={`space-y-4 ${className}`}>
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Métricas de Leads
        </h2>
        {onRefresh && (
          <Button
            onClick={onRefresh}
            variant="secondary"
            size="sm"
            loading={loading}
          >
            Atualizar
          </Button>
        )}
      </div>

      {/* Metrics Grid */}
      <ResponsiveGrid columns={{ default: 2, md: 4 }} gap={4}>
        {metricCards.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <Card key={index} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {metric.title}
                  </p>
                  <div className="mt-2 flex items-baseline">
                    <AnimatedCounter
                      value={metric.value}
                      className="text-2xl font-bold text-gray-900 dark:text-white"
                    />
                    {metric.suffix && (
                      <span className="ml-1 text-sm text-gray-500">
                        {metric.suffix}
                      </span>
                    )}
                  </div>
                  {metric.growth !== undefined && (
                    <div className="mt-2 flex items-center">
                      {getTrendIcon(metric.growth)}
                      <span className={`ml-1 text-sm font-medium ${getTrendColor(metric.growth)}`}>
                        {formatPercentage(metric.growth)}
                      </span>
                      <span className="ml-1 text-xs text-gray-500">
                        vs mês anterior
                      </span>
                    </div>
                  )}
                </div>
                <div className={`p-3 rounded-lg bg-${metric.color}-100 dark:bg-${metric.color}-900/20`}>
                  <Icon className={`w-6 h-6 text-${metric.color}-600 dark:text-${metric.color}-400`} />
                </div>
              </div>
            </Card>
          );
        })}
      </ResponsiveGrid>

      {/* Additional Metrics */}
      <ResponsiveGrid columns={{ default: 1, lg: 2 }} gap={4}>
        
        {/* Leads by Status */}
        <Card className="p-6">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-4">
            Leads por Status
          </h3>
          <div className="space-y-3">
            {Object.entries(metrics.leads_by_status).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                  {status.replace('_', ' ')}
                </span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {count}
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* Leads by Origin */}
        <Card className="p-6">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-4">
            Leads por Origem
          </h3>
          <div className="space-y-3">
            {Object.entries(metrics.leads_by_origin).map(([origin, count]) => (
              <div key={origin} className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                  {origin.replace('_', ' ')}
                </span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {count}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </ResponsiveGrid>
    </div>
  );
};

export default LeadsMetrics;
