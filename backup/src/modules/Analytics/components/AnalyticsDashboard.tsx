/**
 * Componente principal do dashboard de Analytics
 * Layout principal com métricas, gráficos e insights
 */
import React from 'react';
import { ResponsiveGrid } from '@/components/ui/ResponsiveSystem';
import { Card } from "@/components/ui/Card";
import { LoadingSpinner } from '@/components/ui/LoadingStates';
import { ErrorState } from '@/components/ui/ErrorState';
import { useAnalytics } from '../hooks';
import { AnalyticsHeader } from './AnalyticsHeader';
import { AnalyticsFilters } from './AnalyticsFilters';
import { AnalyticsMetrics } from './AnalyticsMetrics';
import { AnalyticsCharts } from './AnalyticsCharts';
import { AnalyticsInsights } from './AnalyticsInsights';
import { AnalyticsRealTime } from './AnalyticsRealTime';
import { cn } from '@/lib/utils';

interface AnalyticsDashboardProps {
  className?: string;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ className }) => {
  const { dashboard, loading, error } = useAnalytics();

  if (loading && !dashboard.dashboardData) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorState
        title="Erro ao carregar analytics"
        description={error}
        onRetry={dashboard.loadDashboardData}
      />
    );
  }

  return (
    <div className={cn("analytics-dashboard space-y-6", className)}>
      {/* Cabeçalho */}
      <AnalyticsHeader 
        onRefresh={dashboard.updateDashboard}
        realTimeEnabled={dashboard.realTimeEnabled}
        onToggleRealTime={dashboard.toggleRealTime}
      />

      {/* Filtros */}
      <AnalyticsFilters 
        filters={dashboard.filters}
        onFiltersChange={dashboard.applyFilters}
      />

      {/* Métricas principais */}
      <AnalyticsMetrics 
        data={dashboard.dashboardData?.metrics} 
        loading={loading}
      />

      {/* Gráficos */}
      <AnalyticsCharts 
        data={dashboard.dashboardData?.charts} 
        loading={loading}
      />

      {/* Insights */}
      <AnalyticsInsights 
        insights={dashboard.dashboardData?.insights} 
        loading={loading}
      />

      {/* Dados em tempo real */}
      {dashboard.realTimeEnabled && (
        <AnalyticsRealTime 
          data={dashboard.realTimeData} 
          loading={loading}
        />
      )}
    </div>
  );
};
