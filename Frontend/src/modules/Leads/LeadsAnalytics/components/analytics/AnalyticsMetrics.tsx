// ========================================
// ANALYTICS METRICS - MÉTRICAS E KPIs
// ========================================
import React from 'react';
import { TrendingUp, TrendingDown, Users, Target, Star, Clock, DollarSign, Percent, ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import Card from '@/shared/components/ui/Card';
import Badge from '@/shared/components/ui/Badge';
import { cn } from '@/lib/utils';
import { LeadMetrics } from '@/types';

interface AnalyticsMetricsProps {
  metrics: LeadMetrics | null;
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

const AnalyticsMetrics: React.FC<AnalyticsMetricsProps> = ({ metrics,
  className
   }) => {
  const formatPercentage = (value: number) => `${value.toFixed(1)}%`;
  const formatNumber = (value: number) => value.toLocaleString();

  const getTrendIcon = (value: number) => {
    if (value > 0) return <ArrowUpRight className="w-4 h-4 text-green-600" />;
    if (value < 0) return <ArrowDownRight className="w-4 h-4 text-red-600" />;
    return <Minus className="w-4 h-4 text-gray-400" />;};

  const getTrendColor = (value: number) => {
    if (value > 0) return 'text-green-600';
    if (value < 0) return 'text-red-600';
    return 'text-gray-400';};

  const renderEngagementMetrics = () => {
    const engagementData = [
      { label: 'Taxa de Abertura de Email', value: 23.4, trend: 2.1, icon: <Users className="w-5 h-5" /> },
      { label: 'Taxa de Clique em Email', value: 8.7, trend: -0.5, icon: <Target className="w-5 h-5" /> },
      { label: 'Taxa de Resposta', value: 12.3, trend: 1.8, icon: <Star className="w-5 h-5" /> },
      { label: 'Tempo Médio de Resposta', value: 4.2, trend: -0.3, icon: <Clock className="w-5 h-5" /> }
    ];

    return (
              <div className="{(engagementData || []).map((metric: unknown, index: unknown) => (">$2</div>
          <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
           
        </div><div className=" ">$2</div><div className="{metric.icon}">$2</div>
              </div>
            <div className="{metric.label.includes('Tempo') ? `${metric.value}h` : formatPercentage(metric.value)}">$2</div>
            </div>
            <div className="text-sm text-gray-600 mb-1">{metric.label}</div>
            <div className={cn("flex items-center justify-center gap-1 text-sm", getTrendColor(metric.trend))  }>
        </div>{getTrendIcon(metric.trend)}
              <span>{Math.abs(metric.trend).toFixed(1)}%</span>
      </div>
    </>
  ))}
      </div>);};

  const renderPredictiveAnalytics = () => {
    const predictiveData = [
      { label: 'Alta Probabilidade', value: 23, color: 'bg-red-50 text-red-600', percentage: 18.4 },
      { label: 'Média Probabilidade', value: 45, color: 'bg-yellow-50 text-yellow-600', percentage: 36.0 },
      { label: 'Baixa Probabilidade', value: 57, color: 'bg-green-50 text-green-600', percentage: 45.6 }
    ];

    return (
              <div className=" ">$2</div><div>
           
        </div><h4 className="font-medium text-gray-900 mb-3">Probabilidade de Conversão</h4>
          <div className="{(predictiveData || []).map((item: unknown, index: unknown) => (">$2</div>
              <div key={index} className="text-center p-4 rounded-lg">
           
        </div><div className={cn("text-2xl font-bold mb-1", item.color)  }>
        </div>{item.value}
                </div>
                <div className="text-sm text-gray-600 mb-1">{item.label}</div>
                <div className="text-xs text-gray-500">{formatPercentage(item.percentage)}</div>
            ))}
          </div>
        <div>
           
        </div><h4 className="font-medium text-gray-900 mb-3">Previsão de Conversões</h4>
          <div className=" ">$2</div><div className=" ">$2</div><span className="text-sm text-gray-700">Próximos 30 dias</span>
              <span className="font-semibold text-blue-600">+{Math.floor(Math.random() * 50) + 20} conversões</span></div><div className=" ">$2</div><span className="text-sm text-gray-700">Próximos 90 dias</span>
              <span className="font-semibold text-green-600">+{Math.floor(Math.random() * 150) + 80} conversões</span></div></div>);};

  if (!metrics) { return (
              <div className={cn("text-center py-12 text-gray-500", className)  }>
          Carregando métricas...
        </div>
      </div>);

  }

  return (
        <>
      <div className={className  }>
      </div><div className="{/* Main Metrics */}">$2</div>
        <Card className="p-6" />
          <div className=" ">$2</div><TrendingUp className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Métricas Principais</h3></div><div className=" ">$2</div><div className=" ">$2</div><div className="{formatNumber(metrics.total_leads)}">$2</div>
              </div>
              <div className="text-sm text-gray-600">Total de Leads</div>
              <div className=" ">$2</div><ArrowUpRight className="w-4 h-4" />
                <span>+{formatPercentage(metrics.leads_growth || 12)}</span></div><div className=" ">$2</div><div className="{formatNumber(metrics.converted_leads)}">$2</div>
              </div>
              <div className="text-sm text-gray-600">Conversões</div>
              <div className=" ">$2</div><ArrowUpRight className="w-4 h-4" />
                <span>+{formatPercentage(metrics.conversion_growth || 8)}</span></div><div className=" ">$2</div><div className="{formatPercentage(metrics.conversion_rate)}">$2</div>
              </div>
              <div className="text-sm text-gray-600">Taxa de Conversão</div>
              <div className=" ">$2</div><ArrowUpRight className="w-4 h-4" />
                <span>+{formatPercentage(2.1)}</span></div><div className=" ">$2</div><div className="{metrics.average_score?.toFixed(1) || '0.0'}">$2</div>
              </div>
              <div className="text-sm text-gray-600">Score Médio</div>
              <div className=" ">$2</div><ArrowUpRight className="w-4 h-4" />
                <span>+{formatPercentage(metrics.score_growth || 5)}</span></div></div>
        </Card>

        {/* Engagement Metrics */}
        <Card className="p-6" />
          <div className=" ">$2</div><Users className="w-5 h-5 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-900">Métricas de Engajamento</h3>
          </div>
          {renderEngagementMetrics()}
        </Card>

        {/* Predictive Analytics */}
        <Card className="p-6 lg:col-span-2" />
          <div className=" ">$2</div><Target className="w-5 h-5 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-900">Analytics Preditivos</h3>
          </div>
          {renderPredictiveAnalytics()}
        </Card>
      </div>);};

export default AnalyticsMetrics;