/**
 * Email Marketing Dashboard Simplificado
 * 
 * @description
 * Dashboard simplificado de email marketing com integração real ao backend.
 * Substitui o AdvancedEmailMarketingDashboard com código mais limpo e mantível.
 * 
 * @module modules/EmailMarketing/components/EmailMarketingDashboardSimple
 * @since 2.0.0
 */

import React, { useState } from 'react';
import { useValidatedGet } from '@/hooks/useValidatedApi';
import { EmailMarketingDashboardDataSchema, type EmailMarketingDashboardData, type EmailMetrics, type Campaign } from '@/schemas';
import { Mail, Send, Users, TrendingUp, Eye, MousePointer, DollarSign, Target, RefreshCw, Plus, Calendar } from 'lucide-react';

// Components
import Card from '@/shared/components/ui/Card';
import Button from '@/shared/components/ui/Button';
import Badge from '@/shared/components/ui/Badge';
import { LoadingSpinner } from '@/shared/components/ui/LoadingStates';
import ErrorState from '@/shared/components/ui/ErrorState';
import Progress from '@/shared/components/ui/Progress';

interface EmailMarketingDashboardSimpleProps {
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

/**
 * Formata número como moeda
 */
const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);};

/**
 * Formata número com separadores
 */
const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('pt-BR').format(value);};

/**
 * Formata porcentagem
 */
const formatPercent = (value: number): string => {
  return `${value.toFixed(1)}%`;};

/**
 * Retorna cor do badge baseado no status
 */
const getStatusColor = (status: Campaign['status']): 'success' | 'secondary' | 'warning' | 'destructive' => {
  switch (status) {
    case 'sent':
      return 'success';
    case 'sending':
      return 'warning';
    case 'scheduled':
      return 'secondary';
    case 'draft':
      return 'secondary';
    case 'paused':
      return 'destructive';
    default:
      return 'secondary';
  } ;

/**
 * Card de métrica individual
 */
const MetricCard: React.FC<{
  title: string;
  value: string;
  change?: number;
  icon: React.ReactNode;
  color?: string;
}> = ({ title, value, change, icon, color = 'blue'    }) => (
  <Card className="p-6" />
    <div className=" ">$2</div><div className={`p-3 bg-${color} -100 dark:bg-${color}-900/20 rounded-lg`}>
           
        </div>{icon}
      </div>
      {change !== undefined && (
        <div className={`flex items-center text-sm ${change >= 0 ? 'text-green-600' : 'text-red-600'} `}>
          <TrendingUp className={`w-4 h-4 mr-1 ${change < 0 ? 'rotate-180' : ''} `}>
          {formatPercent(Math.abs(change))}
        </div>
      )}
    </div>
    <p className="text-sm text-gray-600 dark:text-gray-400">{title}</p>
    <p className="text-2xl font-bold mt-1">{value}</p>
  </Card>);

/**
 * Componente principal do dashboard
 */
export const EmailMarketingDashboardSimple: React.FC<EmailMarketingDashboardSimpleProps> = ({ className = '',
   }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('30d');

  // Hook para buscar dados do dashboard
  const {
    data: dashboardData,
    loading,
    error,
    fetch: refreshData,
  } = useValidatedGet<EmailMarketingDashboardData>(
    `/api/email-marketing/dashboard?period=${selectedPeriod}`,
    EmailMarketingDashboardDataSchema,
    true // autoFetch);

  // Loading state
  if (loading) {
    return (
              <div className=" ">$2</div><LoadingSpinner size="lg" / />
      </div>);

  }

  // Error state
  if (error || !dashboardData) {
    return (
              <div className=" ">$2</div><ErrorState
          title="Erro ao carregar dashboard"
          description={ typeof error === 'string' ? error : 'Não foi possível carregar os dados' }
          onRetry={ refreshData }
        / />
      </div>);

  }

  const { metrics, campaigns, templates, automations, performance_data } = dashboardData;

  return (
        <>
      <div className={`space-y-6 ${className} `}>
      </div>{/* Header */}
      <div className=" ">$2</div><div>
           
        </div><h1 className="text-3xl font-bold text-gray-900 dark:text-white" />
            Email Marketing
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1" />
            Gerencie suas campanhas e acompanhe resultados
          </p></div><div className=" ">$2</div><Button variant="outline" onClick={ refreshData } />
            <RefreshCw className="w-4 h-4 mr-2" />
            Atualizar
          </Button>
          <Button />
            <Plus className="w-4 h-4 mr-2" />
            Nova Campanha
          </Button>
        </div>

      {/* Métricas principais */}
      <div className=" ">$2</div><MetricCard
          title="Total de Campanhas"
          value={ formatNumber(metrics.total_campaigns) }
          icon={ <Mail className="w-6 h-6 text-blue-600" /> }
          color="blue" />
        <MetricCard
          title="Total Enviado"
          value={ formatNumber(metrics.total_sent) }
          icon={ <Send className="w-6 h-6 text-green-600" /> }
          color="green" />
        <MetricCard
          title="Assinantes"
          value={ formatNumber(metrics.total_subscribers) }
          change={ metrics.list_growth_rate }
          icon={ <Users className="w-6 h-6 text-purple-600" /> }
          color="purple" />
        <MetricCard
          title="Receita Gerada"
          value={ formatCurrency(metrics.revenue_generated) }
          icon={ <DollarSign className="w-6 h-6 text-yellow-600" /> }
          color="yellow" />
      </div>

      {/* Performance Cards */}
      <div className=" ">$2</div><Card className="p-6" />
          <div className=" ">$2</div><span className="text-sm text-gray-600 dark:text-gray-400">Taxa de Abertura</span>
            <Eye className="w-4 h-4 text-gray-400" /></div><div className="text-2xl font-bold mb-2">{formatPercent(metrics.open_rate)}</div>
          <Progress value={metrics.open_rate} className="h-2" /></Card><Card className="p-6" />
          <div className=" ">$2</div><span className="text-sm text-gray-600 dark:text-gray-400">Taxa de Clique</span>
            <MousePointer className="w-4 h-4 text-gray-400" /></div><div className="text-2xl font-bold mb-2">{formatPercent(metrics.click_rate)}</div>
          <Progress value={metrics.click_rate} className="h-2" /></Card><Card className="p-6" />
          <div className=" ">$2</div><span className="text-sm text-gray-600 dark:text-gray-400">Taxa de Conversão</span>
            <Target className="w-4 h-4 text-gray-400" /></div><div className="text-2xl font-bold mb-2">{formatPercent(metrics.conversion_rate)}</div>
          <Progress value={metrics.conversion_rate} className="h-2" /></Card><Card className="p-6" />
          <div className=" ">$2</div><span className="text-sm text-gray-600 dark:text-gray-400">ROI</span>
            <TrendingUp className="w-4 h-4 text-gray-400" /></div><div className="text-2xl font-bold mb-2">{formatPercent(metrics.roi)}</div>
          <Progress value={Math.min(metrics.roi, 100)} className="h-2" /></Card></div>

      {/* Campanhas Recentes */}
      <Card />
        <div className=" ">$2</div><h2 className="text-xl font-semibold">Campanhas Recentes</h2></div><div className=" ">$2</div><div className="{campaigns.slice(0, 5).map((campaign: unknown) => (">$2</div>
              <div
                key={ campaign.id }
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors">
           
        </div><div className=" ">$2</div><div className=" ">$2</div><h3 className="font-medium text-gray-900 dark:text-white" />
                      {campaign.name}
                    </h3>
                    <Badge variant={ getStatusColor(campaign.status) } />
                      {campaign.status}
                    </Badge></div><p className="text-sm text-gray-600 dark:text-gray-400 mt-1" />
                    {campaign.subject}
                  </p></div><div className=" ">$2</div><div className=" ">$2</div><p className="text-gray-600 dark:text-gray-400">Enviados</p>
                    <p className="font-semibold">{formatNumber(campaign.sent_count)}</p></div><div className=" ">$2</div><p className="text-gray-600 dark:text-gray-400">Abertura</p>
                    <p className="font-semibold">{formatPercent(campaign.open_rate)}</p></div><div className=" ">$2</div><p className="text-gray-600 dark:text-gray-400">Cliques</p>
                    <p className="font-semibold">{formatPercent(campaign.click_rate)}</p></div><div className=" ">$2</div><p className="text-gray-600 dark:text-gray-400">Receita</p>
                    <p className="font-semibold">{formatCurrency(campaign.revenue)}</p></div></div>
            ))}
          </div>
      </Card>

      {/* Automações Ativas */}
      <div className=" ">$2</div><Card />
          <div className=" ">$2</div><h2 className="text-xl font-semibold">Automações Ativas</h2></div><div className=" ">$2</div><div className="{automations.slice(0, 3).map((automation: unknown) => (">$2</div>
                <div
                  key={ automation.id }
                  className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
           
        </div><div className=" ">$2</div><h3 className="font-medium">{automation.name}</h3>
                    <Badge variant={ automation.status === 'active' ? 'success' : 'secondary' } />
                      {automation.status}
                    </Badge></div><div className=" ">$2</div><div>
           
        </div><p className="text-gray-600 dark:text-gray-400">Inscritos</p>
                      <p className="font-semibold">{formatNumber(automation.subscribers)}</p></div><div>
           
        </div><p className="text-gray-600 dark:text-gray-400">Conclusão</p>
                      <p className="font-semibold">{formatPercent(automation.completion_rate)}</p></div><div>
           
        </div><p className="text-gray-600 dark:text-gray-400">Receita</p>
                      <p className="font-semibold">{formatCurrency(automation.revenue_generated)}</p></div></div>
              ))}
            </div></Card><Card />
          <div className=" ">$2</div><h2 className="text-xl font-semibold">Templates Populares</h2></div><div className=" ">$2</div><div className="{templates.slice(0, 3).map((template: unknown) => (">$2</div>
                <div
                  key={ template.id }
                  className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
           
        </div><div className=" ">$2</div><h3 className="font-medium">{template.name}</h3>
                    {template.ai_optimized && (
                      <Badge variant="secondary">AI Otimizado</Badge>
                    )}
                  </div>
                  <div className=" ">$2</div><div>
           
        </div><p className="text-gray-600 dark:text-gray-400">Usos</p>
                      <p className="font-semibold">{formatNumber(template.usage_count)}</p></div><div>
           
        </div><p className="text-gray-600 dark:text-gray-400">Performance</p>
                      <p className="font-semibold">{formatPercent(template.performance_score)}</p></div><div>
           
        </div><p className="text-gray-600 dark:text-gray-400">Categoria</p>
                      <p className="font-semibold">{template.category}</p></div></div>
              ))}
            </div></Card></div>

      {/* Scores e Qualidade */}
      <div className=" ">$2</div><Card className="p-6" />
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3" />
            Deliverability Score
          </h3>
          <div className="{formatPercent(metrics.deliverability_score)}">$2</div>
          </div>
          <Progress value={metrics.deliverability_score} className="h-2" />
          <p className="text-xs text-gray-500 mt-2">Excelente taxa de entrega</p></Card><Card className="p-6" />
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3" />
            Engagement Score
          </h3>
          <div className="{formatPercent(metrics.engagement_score)}">$2</div>
          </div>
          <Progress value={metrics.engagement_score} className="h-2" />
          <p className="text-xs text-gray-500 mt-2">Boa interação com conteúdo</p></Card><Card className="p-6" />
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3" />
            Spam Score
          </h3>
          <div className="{formatPercent(metrics.spam_score)}">$2</div>
          </div>
          <Progress value={metrics.spam_score} className="h-2" />
          <p className="text-xs text-gray-500 mt-2">Baixo risco de spam</p></Card></div>);};

export default EmailMarketingDashboardSimple;
