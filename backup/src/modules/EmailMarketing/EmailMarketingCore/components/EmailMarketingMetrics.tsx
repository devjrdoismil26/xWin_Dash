/**
 * Componente de métricas do dashboard de Email Marketing
 * Exibe métricas detalhadas e gráficos
 */

import React from 'react';
import { Card } from "@/components/ui/Card";
import { Badge } from '@/components/ui/Badge';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Mail, 
  Users, 
  Eye, 
  MousePointer,
  DollarSign,
  Target,
  BarChart3,
  PieChart
} from 'lucide-react';
import { EmailMarketingMetrics } from '../types';
import { cn } from '@/lib/utils';

interface EmailMarketingMetricsProps {
  metrics?: EmailMarketingMetrics | null;
  performanceMetrics?: any;
  loading?: boolean;
  className?: string;
}

export const EmailMarketingMetrics: React.FC<EmailMarketingMetricsProps> = ({
  metrics,
  performanceMetrics,
  loading = false,
  className
}) => {
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('pt-BR').format(num);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    }).format(amount);
  };

  const getTrendIcon = (value: number) => {
    if (value > 0) return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (value < 0) return <TrendingDown className="h-4 w-4 text-red-600" />;
    return <Minus className="h-4 w-4 text-gray-600" />;
  };

  const getTrendColor = (value: number) => {
    if (value > 0) return "text-green-600";
    if (value < 0) return "text-red-600";
    return "text-gray-600";
  };

  if (!metrics) {
    return (
      <Card className={cn("backdrop-blur-xl bg-white/10 border-white/20", className)}>
        <Card.Content className="p-8 text-center">
          <div className="text-gray-500 dark:text-gray-400">
            Carregando métricas...
          </div>
        </Card.Content>
      </Card>
    );
  }

  const metricsData = [
    {
      title: 'Emails Enviados',
      value: formatNumber(metrics.emails_delivered),
      growth: metrics.campaigns_growth,
      icon: Mail,
      color: 'blue',
      description: 'Total de emails entregues'
    },
    {
      title: 'Taxa de Abertura',
      value: `${metrics.open_rate.toFixed(1)}%`,
      growth: metrics.leads_growth,
      icon: Eye,
      color: 'green',
      description: 'Percentual de emails abertos'
    },
    {
      title: 'Taxa de Clique',
      value: `${metrics.click_rate.toFixed(1)}%`,
      growth: metrics.users_growth,
      icon: MousePointer,
      color: 'purple',
      description: 'Percentual de cliques em links'
    },
    {
      title: 'Taxa de Conversão',
      value: `${metrics.conversion_rate.toFixed(1)}%`,
      growth: metrics.projects_growth,
      icon: Target,
      color: 'orange',
      description: 'Percentual de conversões'
    },
    {
      title: 'Taxa de Rejeição',
      value: `${metrics.bounce_rate.toFixed(1)}%`,
      growth: -metrics.bounce_rate,
      icon: TrendingDown,
      color: 'red',
      description: 'Percentual de emails rejeitados'
    },
    {
      title: 'Taxa de Descadastro',
      value: `${metrics.unsubscribe_rate.toFixed(1)}%`,
      growth: -metrics.unsubscribe_rate,
      icon: Users,
      color: 'gray',
      description: 'Percentual de descadastros'
    }
  ];

  return (
    <div className={cn("space-y-6", className)}>
      {/* Métricas principais */}
      <Card className="backdrop-blur-xl bg-white/10 border-white/20 hover:bg-white/20 transition-all duration-300">
        <Card.Header>
          <Card.Title className="text-gray-900 dark:text-white flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-blue-600" />
            Métricas de Performance
          </Card.Title>
        </Card.Header>
        <Card.Content>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {metricsData.map((metric, index) => (
              <div
                key={index}
                className={cn(
                  "p-4 rounded-lg backdrop-blur-sm border transition-all duration-300",
                  metric.color === 'blue' && "bg-blue-500/10 border-blue-500/30",
                  metric.color === 'green' && "bg-green-500/10 border-green-500/30",
                  metric.color === 'purple' && "bg-purple-500/10 border-purple-500/30",
                  metric.color === 'orange' && "bg-orange-500/10 border-orange-500/30",
                  metric.color === 'red' && "bg-red-500/10 border-red-500/30",
                  metric.color === 'gray' && "bg-gray-500/10 border-gray-500/30"
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className={cn(
                    "p-2 rounded-lg",
                    metric.color === 'blue' && "bg-blue-500/20",
                    metric.color === 'green' && "bg-green-500/20",
                    metric.color === 'purple' && "bg-purple-500/20",
                    metric.color === 'orange' && "bg-orange-500/20",
                    metric.color === 'red' && "bg-red-500/20",
                    metric.color === 'gray' && "bg-gray-500/20"
                  )}>
                    <metric.icon className={cn(
                      "h-5 w-5",
                      metric.color === 'blue' && "text-blue-600",
                      metric.color === 'green' && "text-green-600",
                      metric.color === 'purple' && "text-purple-600",
                      metric.color === 'orange' && "text-orange-600",
                      metric.color === 'red' && "text-red-600",
                      metric.color === 'gray' && "text-gray-600"
                    )} />
                  </div>
                  <div className="flex items-center gap-1">
                    {getTrendIcon(metric.growth)}
                    <span className={cn("text-sm font-medium", getTrendColor(metric.growth))}>
                      {metric.growth > 0 ? '+' : ''}{metric.growth.toFixed(1)}%
                    </span>
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  {metric.value}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  {metric.title}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {metric.description}
                </div>
              </div>
            ))}
          </div>
        </Card.Content>
      </Card>

      {/* Resumo de receita */}
      <Card className="backdrop-blur-xl bg-white/10 border-white/20 hover:bg-white/20 transition-all duration-300">
        <Card.Header>
          <Card.Title className="text-gray-900 dark:text-white flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-green-600" />
            Resumo Financeiro
          </Card.Title>
        </Card.Header>
        <Card.Content>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {formatCurrency(metrics.revenue_generated)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Receita Total Gerada
              </div>
              <Badge variant="outline" className="mt-2 backdrop-blur-sm bg-white/10 border-white/20">
                {metrics.campaigns_sent} campanhas
              </Badge>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {formatCurrency(metrics.revenue_generated / Math.max(metrics.campaigns_sent, 1))}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Receita por Campanha
              </div>
              <Badge variant="outline" className="mt-2 backdrop-blur-sm bg-white/10 border-white/20">
                ROI: {((metrics.revenue_growth / 100) * 100).toFixed(1)}%
              </Badge>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {formatCurrency(metrics.revenue_generated / Math.max(metrics.emails_delivered, 1))}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Receita por Email
              </div>
              <Badge variant="outline" className="mt-2 backdrop-blur-sm bg-white/10 border-white/20">
                {metrics.conversion_rate.toFixed(1)}% conversão
              </Badge>
            </div>
          </div>
        </Card.Content>
      </Card>

      {/* Métricas de engajamento */}
      <Card className="backdrop-blur-xl bg-white/10 border-white/20 hover:bg-white/20 transition-all duration-300">
        <Card.Header>
          <Card.Title className="text-gray-900 dark:text-white flex items-center gap-2">
            <PieChart className="h-5 w-5 text-purple-600" />
            Métricas de Engajamento
          </Card.Title>
        </Card.Header>
        <Card.Content>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-300">Taxa de Abertura</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {metrics.open_rate.toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(metrics.open_rate, 100)}%` }}
                />
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-300">Taxa de Clique</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {metrics.click_rate.toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(metrics.click_rate, 100)}%` }}
                />
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-300">Taxa de Conversão</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {metrics.conversion_rate.toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(metrics.conversion_rate, 100)}%` }}
                />
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-300">Taxa de Rejeição</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {metrics.bounce_rate.toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-red-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(metrics.bounce_rate, 100)}%` }}
                />
              </div>
            </div>
          </div>
        </Card.Content>
      </Card>
    </div>
  );
};

export default EmailMarketingMetrics;
