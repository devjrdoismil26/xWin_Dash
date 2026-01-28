/**
 * Componente principal do dashboard de Email Marketing
 * Layout principal que orquestra todos os subcomponentes
 */

import React from 'react';
import { Card } from "@/components/ui/Card";
import { LoadingSpinner } from '@/components/ui/LoadingStates';
import { ErrorState } from '@/components/ui/ErrorState';
import { useEmailMarketingCore } from '../hooks/useEmailMarketingCore';
import { EmailMarketingHeader } from './EmailMarketingHeader';
import { EmailMarketingMetrics } from './EmailMarketingMetrics';
import { EmailMarketingActions } from './EmailMarketingActions';
import { EmailMarketingActivity } from './EmailMarketingActivity';
import { cn } from '@/lib/utils';

interface EmailMarketingDashboardProps {
  className?: string;
}

export const EmailMarketingDashboard: React.FC<EmailMarketingDashboardProps> = ({
  className
}) => {
  const {
    metrics,
    stats,
    dashboard,
    loading,
    error,
    refreshData,
    getMetricsSummary,
    getPerformanceMetrics,
    getTrendAnalysis
  } = useEmailMarketingCore();

  if (loading && !metrics) {
    return (
      <div className={cn("flex items-center justify-center h-64", className)}>
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorState
        title="Erro ao carregar dashboard"
        description={error}
        onRetry={refreshData}
        className={className}
      />
    );
  }

  const metricsSummary = getMetricsSummary();
  const performanceMetrics = getPerformanceMetrics();
  const trendAnalysis = getTrendAnalysis();

  return (
    <div className={cn("email-marketing-dashboard space-y-6", className)}>
      {/* Header */}
      <EmailMarketingHeader 
        metrics={metrics}
        onRefresh={refreshData}
        loading={loading}
      />

      {/* Métricas principais */}
      <EmailMarketingMetrics 
        metrics={metrics}
        performanceMetrics={performanceMetrics}
        loading={loading}
      />

      {/* Ações rápidas */}
      <EmailMarketingActions 
        metrics={metrics}
        onRefresh={refreshData}
      />

      {/* Atividades recentes */}
      <EmailMarketingActivity 
        activities={dashboard?.recent_activities || []}
        loading={loading}
      />

      {/* Resumo adicional */}
      {metricsSummary && (
        <Card className="backdrop-blur-xl bg-white/10 border-white/20 hover:bg-white/20 transition-all duration-300">
          <Card.Content className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {metricsSummary.total_campaigns}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  Total de Campanhas
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {metricsSummary.total_subscribers}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  Total de Inscritos
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {metricsSummary.open_rate}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  Taxa de Abertura
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {metricsSummary.click_rate}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  Taxa de Clique
                </div>
              </div>
            </div>
          </Card.Content>
        </Card>
      )}
    </div>
  );
};

export default EmailMarketingDashboard;
