import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/AppLayout';
import { PageTransition } from '@/components/ui/AdvancedAnimations';
import { LoadingSpinner } from '@/components/ui/LoadingStates';
import { ErrorState } from '@/components/ui/ErrorState';
import { Card } from '@/components/ui/Card';
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { 
  RefreshCw, 
  TrendingUp, 
  Users, 
  Target, 
  Activity, 
  BarChart3,
  Download,
  Settings,
  Calendar,
  Mail,
  Share2,
  Zap,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface DashboardData {
  metrics: {
    total_leads: number;
    total_users: number;
    total_projects: number;
    active_projects: number;
    total_campaigns: number;
    total_revenue: number;
    conversion_rate: number;
    leads_growth: number;
    users_growth: number;
    projects_growth: number;
    campaigns_growth: number;
    revenue_growth: number;
  };
  recent_activities: Array<{
    id: string;
    action: string;
    description: string;
    count: number;
    timestamp: string;
    type: 'lead' | 'project' | 'user' | 'campaign' | 'system';
    user_id?: string;
    user_name?: string;
    metadata?: any;
  }>;
  top_leads: Array<{
    id: number;
    name: string;
    email: string;
    score: number;
    status: string;
    source: string;
    created_at: string;
    last_activity_at?: string;
  }>;
  recent_projects: Array<{
    id: number;
    name: string;
    description: string;
    status: string;
    owner_id: number;
    created_at: string;
    updated_at?: string;
    deadline?: string;
    progress?: number;
    owner?: {
      id: number;
      name: string;
      email: string;
    };
  }>;
  stats: {
    leads_by_status: Record<string, number>;
    leads_by_source: Record<string, number>;
    monthly_leads: Record<string, number>;
  };
}

interface DashboardMainProps {
  auth: any;
  currentProject?: {
    id: number;
    name: string;
    description: string;
    mode: 'normal' | 'universe';
    modules?: string[];
  };
  dashboardData?: DashboardData;
  loading?: boolean;
  error?: string;
}

const DashboardMain: React.FC<DashboardMainProps> = ({ 
  auth, 
  currentProject,
  dashboardData,
  loading = false,
  error 
}) => {
  const [refreshing, setRefreshing] = useState(false);

  // Simular dados se não vier do backend
  const data = dashboardData || {
    metrics: {
      total_leads: 1250,
      total_users: 45,
      total_projects: 8,
      active_projects: 6,
      total_campaigns: 12,
      total_revenue: 125000,
      conversion_rate: 15.2,
      leads_growth: 12.5,
      users_growth: 8.3,
      projects_growth: 25.0,
      campaigns_growth: 18.7,
      revenue_growth: 22.1
    },
    recent_activities: [
      {
        id: '1',
        action: 'Novos leads capturados',
        description: '25 novos leads foram capturados hoje',
        count: 25,
        timestamp: new Date().toISOString(),
        type: 'lead'
      },
      {
        id: '2',
        action: 'Projeto atualizado',
        description: 'Projeto "Campanha Q4" foi atualizado',
        count: 1,
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        type: 'project'
      },
      {
        id: '3',
        action: 'Campanha enviada',
        description: 'Email marketing enviado para 500 contatos',
        count: 500,
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        type: 'campaign'
      }
    ],
    top_leads: [],
    recent_projects: [],
    stats: {
      leads_by_status: { 'new': 150, 'qualified': 75, 'converted': 25 },
      leads_by_source: { 'website': 120, 'social': 80, 'email': 50 },
      monthly_leads: { '01': 100, '02': 120, '03': 150 }
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simular refresh
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const handleExport = () => {
    // Implementar exportação
    console.log('Exporting dashboard...');
  };

  const metrics = [
    {
      title: 'Total de Leads',
      value: data.metrics.total_leads.toLocaleString(),
      growth: data.metrics.leads_growth,
      icon: Users,
      color: 'blue',
      trend: data.metrics.leads_growth > 0 ? 'up' : 'down'
    },
    {
      title: 'Taxa de Conversão',
      value: `${data.metrics.conversion_rate}%`,
      growth: data.metrics.conversion_rate,
      icon: Target,
      color: 'green',
      trend: data.metrics.conversion_rate > 10 ? 'up' : 'down'
    },
    {
      title: 'Usuários Ativos',
      value: data.metrics.total_users.toLocaleString(),
      growth: data.metrics.users_growth,
      icon: Activity,
      color: 'purple',
      trend: data.metrics.users_growth > 0 ? 'up' : 'down'
    },
    {
      title: 'Projetos Ativos',
      value: data.metrics.active_projects.toLocaleString(),
      growth: data.metrics.projects_growth,
      icon: BarChart3,
      color: 'orange',
      trend: data.metrics.projects_growth > 0 ? 'up' : 'down'
    }
  ];

  if (loading) {
    return (
      <AppLayout auth={auth}>
        <Head title="Dashboard - xWin Dash" />
        <div className="flex items-center justify-center min-h-screen">
          <LoadingSpinner size="lg" />
        </div>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout auth={auth}>
        <Head title="Dashboard - xWin Dash" />
        <ErrorState
          title="Erro ao carregar dashboard"
          description={error}
          onRetry={handleRefresh}
        />
      </AppLayout>
    );
  }

  return (
    <PageTransition type="fade" duration={300}>
      <AppLayout auth={auth}>
        <Head title="Dashboard - xWin Dash" />
        
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
          {/* Header */}
          <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                      Dashboard
                    </h1>
                    {currentProject && (
                      <Badge 
                        variant="outline" 
                        className={cn(
                          "text-sm",
                          currentProject.mode === 'universe' 
                            ? "border-purple-200 text-purple-700 bg-purple-50 dark:border-purple-800 dark:text-purple-300 dark:bg-purple-900/20"
                            : "border-blue-200 text-blue-700 bg-blue-50 dark:border-blue-800 dark:text-blue-300 dark:bg-blue-900/20"
                        )}
                      >
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
                  <p className="text-slate-600 dark:text-slate-400">
                    {currentProject 
                      ? `Visão geral do projeto: ${currentProject.name}`
                      : 'Visão geral das métricas e performance'
                    }
                  </p>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    onClick={handleRefresh}
                    disabled={refreshing}
                    className="backdrop-blur-sm bg-white/10 border-white/20 hover:bg-white/20"
                  >
                    <RefreshCw className={cn("h-4 w-4 mr-2", refreshing && "animate-spin")} />
                    Atualizar
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleExport}
                    className="backdrop-blur-sm bg-white/10 border-white/20 hover:bg-white/20"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Exportar
                  </Button>
                  <Button
                    variant="outline"
                    className="backdrop-blur-sm bg-white/10 border-white/20 hover:bg-white/20"
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {metrics.map((metric, index) => (
                <Card 
                  key={index}
                  className={cn(
                    "backdrop-blur-xl bg-white/10 border-white/20 hover:bg-white/20 transition-all duration-300",
                    metric.color === 'blue' && "hover:shadow-blue-500/10",
                    metric.color === 'green' && "hover:shadow-green-500/10",
                    metric.color === 'purple' && "hover:shadow-purple-500/10",
                    metric.color === 'orange' && "hover:shadow-orange-500/10"
                  )}
                >
                  <Card.Content className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                          {metric.title}
                        </p>
                        <p className="text-3xl font-bold text-slate-900 dark:text-white">
                          {metric.value}
                        </p>
                        <div className="flex items-center gap-1 mt-1">
                          <Badge 
                            variant={metric.trend === 'up' ? 'default' : 'destructive'}
                            className="text-xs"
                          >
                            {metric.growth > 0 ? '+' : ''}{metric.growth}%
                          </Badge>
                        </div>
                      </div>
                      <div className={cn(
                        "p-3 rounded-lg backdrop-blur-sm",
                        metric.color === 'blue' && "bg-blue-500/20",
                        metric.color === 'green' && "bg-green-500/20",
                        metric.color === 'purple' && "bg-purple-500/20",
                        metric.color === 'orange' && "bg-orange-500/20"
                      )}>
                        <metric.icon className={cn(
                          "h-6 w-6",
                          metric.color === 'blue' && "text-blue-600",
                          metric.color === 'green' && "text-green-600",
                          metric.color === 'purple' && "text-purple-600",
                          metric.color === 'orange' && "text-orange-600"
                        )} />
                      </div>
                    </div>
                  </Card.Content>
                </Card>
              ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Recent Activities */}
              <div className="lg:col-span-2">
                <Card className="backdrop-blur-xl bg-white/10 border-white/20">
                  <Card.Header>
                    <Card.Title className="text-slate-900 dark:text-white flex items-center">
                      <Activity className="h-5 w-5 mr-2" />
                      Atividades Recentes
                    </Card.Title>
                  </Card.Header>
                  <Card.Content>
                    <div className="space-y-4">
                      {data.recent_activities.map((activity) => (
                        <div 
                          key={activity.id}
                          className="flex items-start space-x-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                        >
                          <div className="flex-shrink-0">
                            <div className={cn(
                              "w-8 h-8 rounded-full flex items-center justify-center",
                              activity.type === 'lead' && "bg-blue-500/20 text-blue-600",
                              activity.type === 'project' && "bg-green-500/20 text-green-600",
                              activity.type === 'campaign' && "bg-purple-500/20 text-purple-600",
                              activity.type === 'user' && "bg-orange-500/20 text-orange-600"
                            )}>
                              {activity.type === 'lead' && <Users className="h-4 w-4" />}
                              {activity.type === 'project' && <BarChart3 className="h-4 w-4" />}
                              {activity.type === 'campaign' && <Mail className="h-4 w-4" />}
                              {activity.type === 'user' && <Activity className="h-4 w-4" />}
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-900 dark:text-white">
                              {activity.action}
                            </p>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                              {activity.description}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                              {new Date(activity.timestamp).toLocaleString('pt-BR')}
                            </p>
                          </div>
                          <div className="flex-shrink-0">
                            <Badge variant="outline" className="text-xs">
                              {activity.count}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card.Content>
                </Card>
              </div>

              {/* Quick Actions */}
              <div>
                <Card className="backdrop-blur-xl bg-white/10 border-white/20">
                  <Card.Header>
                    <Card.Title className="text-slate-900 dark:text-white flex items-center">
                      <Zap className="h-5 w-5 mr-2" />
                      Ações Rápidas
                    </Card.Title>
                  </Card.Header>
                  <Card.Content>
                    <div className="space-y-3">
                      <Button 
                        variant="outline" 
                        className="w-full justify-start backdrop-blur-sm bg-white/10 border-white/20 hover:bg-white/20"
                      >
                        <Users className="h-4 w-4 mr-2" />
                        Gerenciar Leads
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start backdrop-blur-sm bg-white/10 border-white/20 hover:bg-white/20"
                      >
                        <Mail className="h-4 w-4 mr-2" />
                        Criar Campanha
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start backdrop-blur-sm bg-white/10 border-white/20 hover:bg-white/20"
                      >
                        <BarChart3 className="h-4 w-4 mr-2" />
                        Ver Relatórios
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start backdrop-blur-sm bg-white/10 border-white/20 hover:bg-white/20"
                      >
                        <Calendar className="h-4 w-4 mr-2" />
                        Agendar Post
                      </Button>
                      {currentProject?.mode === 'universe' && (
                        <Button 
                          variant="outline" 
                          className="w-full justify-start backdrop-blur-sm bg-purple-500/20 border-purple-200 text-purple-700 hover:bg-purple-500/30 dark:border-purple-800 dark:text-purple-300"
                        >
                          <Sparkles className="h-4 w-4 mr-2" />
                          Abrir Universe
                        </Button>
                      )}
                    </div>
                  </Card.Content>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </AppLayout>
    </PageTransition>
  );
};

export default DashboardMain;