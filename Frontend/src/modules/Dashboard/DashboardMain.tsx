/**
 * @module modules/Dashboard/DashboardMain
 * @description
 * Componente principal do dashboard.
 * 
 * Exibe visão geral das métricas e performance do sistema:
 * - Métricas principais (leads, usuários, projetos, campanhas, receita)
 * - Atividades recentes
 * - Top leads
 * - Projetos recentes
 * - Ações rápidas
 * - Integração com projeto atual (modo normal ou Universe)
 * 
 * @example
 * ```typescript
 * <DashboardMain / />
 * ```
 * 
 * @since 1.0.0
 */

import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/AppLayout';
import { PageTransition } from '@/shared/components/ui/AdvancedAnimations';
import { LoadingSpinner } from '@/shared/components/ui/LoadingStates';
import ErrorState from '@/shared/components/ui/ErrorState';
import { Card } from '@/shared/components/ui/Card';
import { Button } from '@/shared/components/ui/Button'
import { Badge } from '@/shared/components/ui/Badge'
import { RefreshCw, TrendingUp, Users, Target, Activity, BarChart3, Download, Settings, Calendar, Mail, Share2, Zap, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useValidatedGet } from '@/hooks/useValidatedApi';
import { DashboardDataSchema, type DashboardData } from '@/schemas';

/**
 * Props do componente DashboardMain
 *
 * @interface DashboardMainProps
 * @property {Record<string, any>} auth - Dados de autenticação
 * @property {Object} [currentProject] - Projeto atual (opcional)
 */
interface DashboardMainProps {
  auth: unknown;
  currentProject?: {
id: number;
  name: string;
  description: string;
  mode: 'normal' | 'universe';
  modules?: string[];
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; };

}

/**
 * Componente DashboardMain
 *
 * @description
 * Renderiza dashboard principal com métricas, atividades recentes e ações rápidas.
 * Suporta modo normal e Universe, exibe métricas principais e permite refresh e exportação.
 * Agora com integração real ao backend usando validação Zod.
 *
 * @param {DashboardMainProps} props - Props do componente
 * @returns {JSX.Element} Dashboard principal
 */
const DashboardMain: React.FC<DashboardMainProps> = ({ auth, 
  currentProject
   }) => {
  // Hook para buscar dados do dashboard com validação Zod
  const { 
    data, 
    loading, 
    error, 
    fetch: refreshData 
  } = useValidatedGet<DashboardData>(
    '/api/dashboard/data',
    DashboardDataSchema,
    true // autoFetch na montagem);

  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);

    try {
      await refreshData();

    } catch (err) {
      console.error('Erro ao atualizar dashboard:', err);

    } finally {
      setRefreshing(false);

    } ;

  const handleExport = async () => {
    if (!data) return;
    
    try {
      const response = await fetch('/dashboard/api/export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify({
          format: 'pdf',
          include_charts: true,
          include_metrics: true
        })
  });

      if (response.ok) {
        const blob = await (response as any).blob();

        const url = window.URL.createObjectURL(blob);

        const a = document.createElement('a');

        a.href = url;
        a.download = `dashboard-export-${new Date().toISOString().split('T')[0]}.pdf`;
        document.body.appendChild(a);

        a.click();

        window.URL.revokeObjectURL(url);

        document.body.removeChild(a);

      } catch (error) {
      console.error('Error exporting dashboard:', error);

    } ;

  // Preparar métricas para exibição
  const metrics = data ? [
    {
      title: 'Total de Leads',
      value: (data as any).metrics.total_leads.toLocaleString(),
      growth: (data as any).metrics.leads_growth,
      icon: Users,
      color: 'blue',
      trend: (data as any).metrics.leads_growth > 0 ? 'up' : 'down'
    },
    {
      title: 'Taxa de Conversão',
      value: `${data.metrics.conversion_rate}%`,
      growth: (data as any).metrics.conversion_rate,
      icon: Target,
      color: 'green',
      trend: (data as any).metrics.conversion_rate > 10 ? 'up' : 'down'
    },
    {
      title: 'Usuários Ativos',
      value: (data as any).metrics.total_users.toLocaleString(),
      growth: (data as any).metrics.users_growth,
      icon: Activity,
      color: 'purple',
      trend: (data as any).metrics.users_growth > 0 ? 'up' : 'down'
    },
    {
      title: 'Projetos Ativos',
      value: (data as any).metrics.active_projects.toLocaleString(),
      growth: (data as any).metrics.projects_growth,
      icon: BarChart3,
      color: 'orange',
      trend: (data as any).metrics.projects_growth > 0 ? 'up' : 'down'
    }
  ] : [];

  if (loading) { return (
        <>
      <AppLayout auth={auth } />
      <Head title="Dashboard - xWin Dash" / />
        <div className=" ">$2</div><LoadingSpinner size="lg" / /></div></AppLayout>);

  }

  if (error) { return (
        <>
      <AppLayout auth={auth } />
      <Head title="Dashboard - xWin Dash" / />
        <div className=" ">$2</div><ErrorState
            title="Erro ao carregar dashboard"
            description={ typeof error === 'string' ? error : 'Ocorreu um erro ao carregar os dados' }
            onRetry={ handleRefresh }
          / /></div></AppLayout>);

  }

  // Exibir estado vazio enquanto carrega ou se não houver dados
  if (!data) { return (
        <>
      <AppLayout auth={auth } />
      <Head title="Dashboard - xWin Dash" / />
        <div className=" ">$2</div><LoadingSpinner size="lg" / /></div></AppLayout>);

  }

  return (
        <>
      <PageTransition type="fade" duration={ 300 } />
      <AppLayout auth={ auth } />
        <Head title="Dashboard - xWin Dash" / />
        <div className="{/* Header */}">$2</div>
          <div className=" ">$2</div><div className=" ">$2</div><div className=" ">$2</div><div>
           
        </div><div className=" ">$2</div><h1 className="text-3xl font-bold text-slate-900 dark:text-white" />
                      Dashboard
                    </h1>
                    { currentProject && (
                      <Badge 
                        variant="outline" 
                        className={cn(
                          "text-sm",
                          currentProject.mode === 'universe' 
                            ? "border-purple-200 text-purple-700 bg-purple-50 dark:border-purple-800 dark:text-purple-300 dark:bg-purple-900/20"
                            : "border-blue-200 text-blue-700 bg-blue-50 dark:border-blue-800 dark:text-blue-300 dark:bg-blue-900/20"
                        ) } />
                        {currentProject.mode === 'universe' ? (
                          <>
                            <Sparkles className="w-3 h-3 mr-1" />
                            Universe
                          </>
                        ) : (
                          <>
                            <BarChart3 className="w-3 h-3 mr-1" />
                            Normal
                          </>
                        )}
                      </Badge>
                    )}
                  </div>
                  <p className="text-slate-600 dark:text-slate-400" />
                    {currentProject 
                      ? `Visão geral do projeto: ${currentProject.name}`
                      : 'Visão geral das métricas e performance'
                    }
                  </p></div><div className=" ">$2</div><Button
                    variant="outline"
                    onClick={ handleRefresh }
                    disabled={ refreshing }
                    className="backdrop-blur-sm bg-white/10 border-white/20 hover:bg-white/20" />
                    <RefreshCw className={cn("h-4 w-4 mr-2", refreshing && "animate-spin")} / />
                    Atualizar
                  </Button>
                  <Button
                    variant="outline"
                    onClick={ handleExport }
                    className="backdrop-blur-sm bg-white/10 border-white/20 hover:bg-white/20" />
                    <Download className="h-4 w-4 mr-2" />
                    Exportar
                  </Button>
                  <Button
                    variant="outline"
                    className="backdrop-blur-sm bg-white/10 border-white/20 hover:bg-white/20" />
                    <Settings className="h-4 w-4" /></Button></div>
            </div>

          {/* Content */}
          <div className="{/* Metrics Cards */}">$2</div>
            <div className="{(metrics || []).map((metric: unknown, index: unknown) => (">$2</div>
                <Card 
                  key={ index }
                  className={cn(
                    "backdrop-blur-xl bg-white/10 border-white/20 hover:bg-white/20 transition-all duration-300",
                    metric.color === 'blue' && "hover:shadow-blue-500/10",
                    metric.color === 'green' && "hover:shadow-green-500/10",
                    metric.color === 'purple' && "hover:shadow-purple-500/10",
                    metric.color === 'orange' && "hover:shadow-orange-500/10"
                  ) } />
                  <Card.Content className="p-6" />
                    <div className=" ">$2</div><div>
           
        </div><p className="text-sm font-medium text-slate-600 dark:text-slate-300" />
                          {metric.title}
                        </p>
                        <p className="text-3xl font-bold text-slate-900 dark:text-white" />
                          {metric.value}
                        </p>
                        <div className=" ">$2</div><Badge 
                            variant={ metric.trend === 'up' ? 'default' : 'destructive' }
                            className="text-xs" />
                            {metric.growth > 0 ? '+' : ''}{metric.growth}%
                          </Badge></div><div className={cn(
                        "p-3 rounded-lg backdrop-blur-sm",
                        metric.color === 'blue' && "bg-blue-500/20",
                        metric.color === 'green' && "bg-green-500/20",
                        metric.color === 'purple' && "bg-purple-500/20",
                        metric.color === 'orange' && "bg-orange-500/20"
                      )  }>
        </div><metric.icon className={cn(
                          "h-6 w-6",
                          metric.color === 'blue' && "text-blue-600",
                          metric.color === 'green' && "text-green-600",
                          metric.color === 'purple' && "text-purple-600",
                          metric.color === 'orange' && "text-orange-600"
                        )} / /></div></Card.Content>
      </Card>
    </>
  ))}
            </div>

            {/* Main Content Grid */}
            <div className="{/* Recent Activities */}">$2</div>
              <div className=" ">$2</div><Card className="backdrop-blur-xl bg-white/10 border-white/20" />
                  <Card.Header />
                    <Card.Title className="text-slate-900 dark:text-white flex items-center" />
                      <Activity className="h-5 w-5 mr-2" />
                      Atividades Recentes
                    </Card.Title>
                  </Card.Header>
                  <Card.Content />
                    <div className="{(data.recent_activities || []).map((activity: unknown) => (">$2</div>
                        <div 
                          key={ activity.id }
                          className="flex items-start space-x-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
           
        </div><div className=" ">$2</div><div className={cn(
                              "w-8 h-8 rounded-full flex items-center justify-center",
                              activity.type === 'lead' && "bg-blue-500/20 text-blue-600",
                              activity.type === 'project' && "bg-green-500/20 text-green-600",
                              activity.type === 'campaign' && "bg-purple-500/20 text-purple-600",
                              activity.type === 'user' && "bg-orange-500/20 text-orange-600"
                            )  }>
        </div>{activity.type === 'lead' && <Users className="h-4 w-4" />}
                              {activity.type === 'project' && <BarChart3 className="h-4 w-4" />}
                              {activity.type === 'campaign' && <Mail className="h-4 w-4" />}
                              {activity.type === 'user' && <Activity className="h-4 w-4" />}
                            </div>
                          <div className=" ">$2</div><p className="text-sm font-medium text-slate-900 dark:text-white" />
                              {activity.action}
                            </p>
                            <p className="text-sm text-slate-600 dark:text-slate-400" />
                              {activity.description}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-500 mt-1" />
                              {new Date(activity.timestamp).toLocaleString('pt-BR')}
                            </p></div><div className=" ">$2</div><Badge variant="outline" className="text-xs" />
                              {activity.count}
                            </Badge>
      </div>
    </>
  ))}
                    </div>
                  </Card.Content></Card></div>

              {/* Quick Actions */}
              <div>
           
        </div><Card className="backdrop-blur-xl bg-white/10 border-white/20" />
                  <Card.Header />
                    <Card.Title className="text-slate-900 dark:text-white flex items-center" />
                      <Zap className="h-5 w-5 mr-2" />
                      Ações Rápidas
                    </Card.Title>
                  </Card.Header>
                  <Card.Content />
                    <div className=" ">$2</div><Button 
                        variant="outline" 
                        className="w-full justify-start backdrop-blur-sm bg-white/10 border-white/20 hover:bg-white/20" />
                        <Users className="h-4 w-4 mr-2" />
                        Gerenciar Leads
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start backdrop-blur-sm bg-white/10 border-white/20 hover:bg-white/20" />
                        <Mail className="h-4 w-4 mr-2" />
                        Criar Campanha
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start backdrop-blur-sm bg-white/10 border-white/20 hover:bg-white/20" />
                        <BarChart3 className="h-4 w-4 mr-2" />
                        Ver Relatórios
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start backdrop-blur-sm bg-white/10 border-white/20 hover:bg-white/20" />
                        <Calendar className="h-4 w-4 mr-2" />
                        Agendar Post
                      </Button>
                      {currentProject?.mode === 'universe' && (
                        <Button 
                          variant="outline" 
                          className="w-full justify-start backdrop-blur-sm bg-purple-500/20 border-purple-200 text-purple-700 hover:bg-purple-500/30 dark:border-purple-800 dark:text-purple-300" />
                          <Sparkles className="h-4 w-4 mr-2" />
                          Abrir Universe
                        </Button>
                      )}
                    </div>
                  </Card.Content></Card></div></div></AppLayout></PageTransition>);};

export default DashboardMain;