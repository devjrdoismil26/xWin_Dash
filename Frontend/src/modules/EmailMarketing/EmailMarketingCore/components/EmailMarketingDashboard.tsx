/**
 * Componente principal do dashboard de Email Marketing
 * Layout principal que orquestra todos os subcomponentes
 */

import React from 'react';
import { Card } from '@/shared/components/ui/Card';
import { LoadingSpinner } from '@/shared/components/ui/LoadingStates';
import ErrorState from '@/shared/components/ui/ErrorState';
import { useEmailMarketingCore } from '../hooks/useEmailMarketingCore';
import { EmailMarketingHeader } from './EmailMarketingHeader';
import { EmailMarketingMetrics } from './EmailMarketingMetrics';
import { EmailMarketingActions } from './EmailMarketingActions';
import { EmailMarketingActivity } from './EmailMarketingActivity';
import { cn } from '@/lib/utils';

/**
 * Props do componente EmailMarketingDashboard
 *
 * @interface EmailMarketingDashboardProps
 * @property {string} [className] - Classes CSS adicionais
 */
interface EmailMarketingDashboardProps {
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

/**
 * Componente EmailMarketingDashboard
 *
 * @description
 * Renderiza dashboard completo de email marketing com layout responsivo.
 * Integra header, métricas, ações e atividades. Gerencia estados de loading
 * e erro automaticamente.
 *
 * @param {EmailMarketingDashboardProps} props - Props do componente
 * @returns {JSX.Element} Dashboard de email marketing
 */
export const EmailMarketingDashboard: React.FC<EmailMarketingDashboardProps> = ({ className
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

  if (loading && !metrics) { return (
        <>
      <div className={cn("flex items-center justify-center h-64", className)  }>
      </div><LoadingSpinner size="lg" / />
      </div>);

  }

  if (error) {
    return (
              <ErrorState
        title="Erro ao carregar dashboard"
        description={ error }
        onRetry={ refreshData }
        className={className} / />);

  }

  const metricsSummary = getMetricsSummary();

  const performanceMetrics = getPerformanceMetrics();

  const trendAnalysis = getTrendAnalysis();

  return (
        <>
      <div className={cn("email-marketing-dashboard space-y-6", className)  }>
      </div>{/* Header */}
      <EmailMarketingHeader 
        metrics={ metrics }
        onRefresh={ refreshData }
        loading={ loading  }>
          {/* Métricas principais */}
      <EmailMarketingMetrics 
        metrics={ metrics }
        performanceMetrics={ performanceMetrics }
        loading={ loading  }>
          {/* Ações rápidas */}
      <EmailMarketingActions 
        metrics={ metrics }
        onRefresh={ refreshData  }>
          {/* Atividades recentes */}
      <EmailMarketingActivity 
        activities={ dashboard?.recent_activities || [] }
        loading={ loading  }>
          {/* Resumo adicional */}
      {metricsSummary && (
        <Card className="backdrop-blur-xl bg-white/10 border-white/20 hover:bg-white/20 transition-all duration-300" />
          <Card.Content className="p-6" />
            <div className=" ">$2</div><div className=" ">$2</div><div className="{metricsSummary.total_campaigns}">$2</div>
                </div>
                <div className="Total de Campanhas">$2</div>
                </div>
              <div className=" ">$2</div><div className="{metricsSummary.total_subscribers}">$2</div>
                </div>
                <div className="Total de Inscritos">$2</div>
                </div>
              <div className=" ">$2</div><div className="{metricsSummary.open_rate}">$2</div>
                </div>
                <div className="Taxa de Abertura">$2</div>
                </div>
              <div className=" ">$2</div><div className="{metricsSummary.click_rate}">$2</div>
                </div>
                <div className="Taxa de Clique">$2</div>
                </div></div></Card.Content>
      </Card>
    </>
  )}
    </div>);};

export default EmailMarketingDashboard;
