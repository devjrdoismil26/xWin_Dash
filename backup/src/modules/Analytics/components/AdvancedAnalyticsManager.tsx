import React, { useState, useEffect } from 'react';
import { useAnalyticsAdvanced } from '../hooks/useAnalyticsAdvanced';
import { AnalyticsFilters, AnalyticsReportFilters, AnalyticsDashboardFilters } from '../types/analyticsTypes';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { 
  BarChart3,
  FileText,
  Eye,
  Plus,
  Pencil,
  Trash2,
  Share,
  Clock,
  Filter,
  Users,
  Target,
  Bell,
  Download,
  Settings,
  Search,
  Filter
} from 'lucide-react';

interface AdvancedAnalyticsManagerProps {
  className?: string;
}

export const AdvancedAnalyticsManager: React.FC<AdvancedAnalyticsManagerProps> = ({
  className = ''
}) => {
  const {
    // Dashboard
    dashboard,
    dashboardLoading,
    dashboardError,
    refreshDashboard,

    // Reports
    reports,
    reportsLoading,
    reportsError,
    reportsPagination,
    fetchReports,
    createReport,
    updateReport,
    deleteReport,
    exportReport,
    scheduleReport,
    shareReport,

    // Metrics
    metrics,
    metricsLoading,
    metricsError,
    fetchMetrics,

    // Insights
    insights,
    insightsLoading,
    insightsError,
    fetchInsights,
    generateInsights,

    // Dashboards
    dashboards,
    currentDashboard,
    dashboardsLoading,
    dashboardsError,
    fetchDashboards,
    createDashboard,
    updateDashboard,
    deleteDashboard,

    // Segments
    segments,
    segmentsLoading,
    segmentsError,
    fetchSegments,
    createSegment,

    // Funnels
    funnels,
    funnelsLoading,
    funnelsError,
    fetchFunnels,
    createFunnel,

    // Cohorts
    cohorts,
    cohortsLoading,
    cohortsError,
    fetchCohorts,
    createCohort,

    // Goals
    goals,
    goalsLoading,
    goalsError,
    fetchGoals,
    createGoal,

    // Alerts
    alerts,
    alertsLoading,
    alertsError,
    fetchAlerts,
    createAlert,

    // Exports
    exports,
    exportsLoading,
    exportsError,
    fetchExports,
    createExport,

    // Integrations
    integrations,
    integrationsLoading,
    integrationsError,
    fetchIntegrations,
    createIntegration,

    // Real-time
    realTimeData,
    realTimeLoading,
    realTimeError,
    fetchRealTimeData,
    startRealTimeUpdates,
    stopRealTimeUpdates,

    // Utility
    refreshAll
  } = useAnalyticsAdvanced();

  const [activeTab, setActiveTab] = useState<'dashboard' | 'reports' | 'dashboards' | 'segments' | 'funnels' | 'cohorts' | 'goals' | 'alerts' | 'exports' | 'integrations'>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<AnalyticsFilters>({
    period: 'last_30_days',
    page: 1,
    per_page: 10
  });
  const [isCreating, setIsCreating] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  const handleSearch = async () => {
    if (searchQuery.trim()) {
      // Implement search functionality
      console.log('Searching for:', searchQuery);
    }
  };

  const handleCreateReport = async () => {
    const reportData = {
      name: 'Novo Relatório',
      type: 'overview',
      filters: filters
    };
    const success = await createReport(reportData);
    if (success) {
      setIsCreating(false);
    }
  };

  const handleCreateDashboard = async () => {
    const dashboardData = {
      name: 'Novo Dashboard',
      description: 'Dashboard personalizado',
      widgets: []
    };
    const success = await createDashboard(dashboardData);
    if (success) {
      setIsCreating(false);
    }
  };

  const handleCreateSegment = async () => {
    const segmentData = {
      name: 'Novo Segmento',
      description: 'Segmento personalizado',
      conditions: []
    };
    const success = await createSegment(segmentData);
    if (success) {
      setIsCreating(false);
    }
  };

  const handleCreateFunnel = async () => {
    const funnelData = {
      name: 'Novo Funnel',
      description: 'Funnel de conversão',
      steps: []
    };
    const success = await createFunnel(funnelData);
    if (success) {
      setIsCreating(false);
    }
  };

  const handleCreateCohort = async () => {
    const cohortData = {
      name: 'Nova Cohort',
      description: 'Análise de retenção',
      cohort_type: 'retention',
      period: 'week',
      metric: 'active_users'
    };
    const success = await createCohort(cohortData);
    if (success) {
      setIsCreating(false);
    }
  };

  const handleCreateGoal = async () => {
    const goalData = {
      name: 'Nova Meta',
      description: 'Meta de conversão',
      type: 'conversion',
      target_value: 1000
    };
    const success = await createGoal(goalData);
    if (success) {
      setIsCreating(false);
    }
  };

  const handleCreateAlert = async () => {
    const alertData = {
      name: 'Novo Alerta',
      description: 'Alerta de performance',
      metric: 'conversion_rate',
      condition: 'less_than',
      threshold: 5
    };
    const success = await createAlert(alertData);
    if (success) {
      setIsCreating(false);
    }
  };

  const handleExportReport = async (reportId: string) => {
    await exportReport(reportId, 'csv');
  };

  const handleScheduleReport = async (reportId: string) => {
    const schedule = {
      frequency: 'weekly',
      time: '09:00',
      recipients: ['admin@example.com'],
      format: 'pdf'
    };
    await scheduleReport(reportId, schedule);
  };

  const handleShareReport = async (reportId: string) => {
    const permissions = {
      view: true,
      export: true,
      schedule: false
    };
    await shareReport(reportId, permissions);
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'active': return 'green';
      case 'inactive': return 'gray';
      case 'pending': return 'yellow';
      case 'error': return 'red';
      default: return 'gray';
    }
  };

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'overview': return 'blue';
      case 'detailed': return 'green';
      case 'custom': return 'purple';
      case 'conversion': return 'orange';
      case 'retention': return 'pink';
      default: return 'gray';
    }
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3, count: dashboard ? 1 : 0 },
    { id: 'reports', label: 'Relatórios', icon: FileText, count: reports.length },
    { id: 'dashboards', label: 'Dashboards', icon: Eye, count: dashboards.length },
    { id: 'segments', label: 'Segmentos', icon: Users, count: segments.length },
    { id: 'funnels', label: 'Funnels', icon: Filter, count: funnels.length },
    { id: 'cohorts', label: 'Cohorts', icon: Users, count: cohorts.length },
    { id: 'goals', label: 'Metas', icon: Target, count: goals.length },
    { id: 'alerts', label: 'Alertas', icon: Bell, count: alerts.length },
    { id: 'exports', label: 'Exportações', icon: Download, count: exports.length },
    { id: 'integrations', label: 'Integrações', icon: Settings, count: integrations.length }
  ];

  if (dashboardLoading || reportsLoading || dashboardsLoading) {
    return (
      <Card className={`p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Gerenciamento Avançado de Analytics
            </h2>
            <p className="text-gray-600 mt-1">
              Dashboards, relatórios, segmentos, funnels e muito mais
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              onClick={refreshAll}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <BarChart3 className="h-4 w-4" />
              Atualizar Tudo
            </Button>
            
            <Button
              onClick={() => setIsCreating(true)}
              variant="primary"
              size="sm"
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Criar Novo
            </Button>
          </div>
        </div>
      </Card>

      {/* Search and Filters */}
      <Card className="p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="flex-1">
            <Input
              placeholder="Buscar em analytics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full"
            />
          </div>
          
          <Button
            onClick={handleSearch}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Search className="h-4 w-4" />
            Buscar
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <select
            value={filters.period || ''}
            onChange={(e) => setFilters(prev => ({ ...prev, period: e.target.value as any }))}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="">Todos os períodos</option>
            <option value="today">Hoje</option>
            <option value="yesterday">Ontem</option>
            <option value="last_7_days">Últimos 7 dias</option>
            <option value="last_30_days">Últimos 30 dias</option>
            <option value="last_90_days">Últimos 90 dias</option>
            <option value="this_month">Este mês</option>
            <option value="last_month">Mês passado</option>
          </select>

          <Button
            onClick={() => setFilters({ period: 'last_30_days', page: 1, per_page: 10 })}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            Limpar Filtros
          </Button>
        </div>
      </Card>

      {/* Tabs */}
      <Card className="p-6">
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-shrink-0 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
                {tab.count > 0 && (
                  <Badge variant="info" size="sm">
                    {tab.count}
                  </Badge>
                )}
              </button>
            );
          })}
        </div>
      </Card>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === 'dashboard' && (
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Dashboard Principal
              </h3>
              <Button
                onClick={refreshDashboard}
                variant="outline"
                size="sm"
                disabled={dashboardLoading}
              >
                {dashboardLoading ? 'Atualizando...' : 'Atualizar'}
              </Button>
            </div>

            {dashboardError ? (
              <div className="text-center text-red-600">
                <p>Erro ao carregar dashboard: {dashboardError}</p>
              </div>
            ) : dashboard ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Visitantes</h4>
                  <div className="text-2xl font-bold text-blue-900">
                    {dashboard.total_visitors.toLocaleString()}
                  </div>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-medium text-green-900 mb-2">Sessões</h4>
                  <div className="text-2xl font-bold text-green-900">
                    {dashboard.total_sessions.toLocaleString()}
                  </div>
                </div>
                
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h4 className="font-medium text-yellow-900 mb-2">Taxa de Rejeição</h4>
                  <div className="text-2xl font-bold text-yellow-900">
                    {dashboard.bounce_rate.toFixed(1)}%
                  </div>
                </div>
                
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-medium text-purple-900 mb-2">Conversão</h4>
                  <div className="text-2xl font-bold text-purple-900">
                    {dashboard.conversion_rate.toFixed(1)}%
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <BarChart3 className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>Nenhum dado de dashboard disponível</p>
              </div>
            )}
          </Card>
        )}

        {activeTab === 'reports' && (
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Relatórios ({reports.length})
              </h3>
              <Button
                onClick={handleCreateReport}
                variant="primary"
                size="sm"
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Novo Relatório
              </Button>
            </div>

            <div className="space-y-3">
              {reports.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p>Nenhum relatório encontrado</p>
                  <p className="text-sm">Crie seu primeiro relatório para começar</p>
                </div>
              ) : (
                reports.map((report) => (
                  <div
                    key={report.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-gray-900">
                          {report.name}
                        </h4>
                        <Badge variant={getTypeBadgeColor(report.type)} size="sm">
                          {report.type}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">
                        Criado em {new Date(report.created_at).toLocaleDateString('pt-BR')}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        onClick={() => handleExportReport(report.id)}
                        variant="outline"
                        size="sm"
                        title="Exportar relatório"
                      >
                        <Download className="h-4 w-4" />
                      </Button>

                      <Button
                        onClick={() => handleScheduleReport(report.id)}
                        variant="outline"
                        size="sm"
                        title="Agendar relatório"
                      >
                        <Clock className="h-4 w-4" />
                      </Button>

                      <Button
                        onClick={() => handleShareReport(report.id)}
                        variant="outline"
                        size="sm"
                        title="Compartilhar relatório"
                      >
                        <Share className="h-4 w-4" />
                      </Button>

                      <Button
                        onClick={() => setEditingItem(report)}
                        variant="outline"
                        size="sm"
                        title="Editar relatório"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>

                      <Button
                        onClick={() => deleteReport(report.id)}
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                        title="Excluir relatório"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        )}

        {activeTab === 'dashboards' && (
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Dashboards ({dashboards.length})
              </h3>
              <Button
                onClick={handleCreateDashboard}
                variant="primary"
                size="sm"
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Novo Dashboard
              </Button>
            </div>

            <div className="space-y-3">
              {dashboards.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Eye className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p>Nenhum dashboard encontrado</p>
                  <p className="text-sm">Crie seu primeiro dashboard para começar</p>
                </div>
              ) : (
                dashboards.map((dashboard) => (
                  <div
                    key={dashboard.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-gray-900">
                          {dashboard.name}
                        </h4>
                        {dashboard.is_default && (
                          <Badge variant="success" size="sm">
                            Padrão
                          </Badge>
                        )}
                      </div>
                      {dashboard.description && (
                        <p className="text-sm text-gray-600 mb-1">
                          {dashboard.description}
                        </p>
                      )}
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>{dashboard.widgets.length} widgets</span>
                        <span>Criado em {new Date(dashboard.created_at).toLocaleDateString('pt-BR')}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        onClick={() => setEditingItem(dashboard)}
                        variant="outline"
                        size="sm"
                        title="Editar dashboard"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>

                      <Button
                        onClick={() => deleteDashboard(dashboard.id)}
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                        title="Excluir dashboard"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        )}

        {activeTab === 'segments' && (
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Segmentos ({segments.length})
              </h3>
              <Button
                onClick={handleCreateSegment}
                variant="primary"
                size="sm"
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Novo Segmento
              </Button>
            </div>

            <div className="space-y-3">
              {segments.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Users className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p>Nenhum segmento encontrado</p>
                  <p className="text-sm">Crie seu primeiro segmento para começar</p>
                </div>
              ) : (
                segments.map((segment) => (
                  <div
                    key={segment.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-gray-900">
                          {segment.name}
                        </h4>
                        <Badge variant={segment.is_active ? 'success' : 'gray'} size="sm">
                          {segment.is_active ? 'Ativo' : 'Inativo'}
                        </Badge>
                      </div>
                      {segment.description && (
                        <p className="text-sm text-gray-600 mb-1">
                          {segment.description}
                        </p>
                      )}
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>{segment.conditions.length} condições</span>
                        <span>Criado em {new Date(segment.created_at).toLocaleDateString('pt-BR')}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        onClick={() => setEditingItem(segment)}
                        variant="outline"
                        size="sm"
                        title="Editar segmento"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>

                      <Button
                        onClick={() => deleteSegment(segment.id)}
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                        title="Excluir segmento"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        )}

        {activeTab === 'funnels' && (
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Funnels ({funnels.length})
              </h3>
              <Button
                onClick={handleCreateFunnel}
                variant="primary"
                size="sm"
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Novo Funnel
              </Button>
            </div>

            <div className="space-y-3">
              {funnels.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Filter className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p>Nenhum funnel encontrado</p>
                  <p className="text-sm">Crie seu primeiro funnel para começar</p>
                </div>
              ) : (
                funnels.map((funnel) => (
                  <div
                    key={funnel.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-gray-900">
                          {funnel.name}
                        </h4>
                        <Badge variant={funnel.is_active ? 'success' : 'gray'} size="sm">
                          {funnel.is_active ? 'Ativo' : 'Inativo'}
                        </Badge>
                      </div>
                      {funnel.description && (
                        <p className="text-sm text-gray-600 mb-1">
                          {funnel.description}
                        </p>
                      )}
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>{funnel.steps.length} etapas</span>
                        <span>Criado em {new Date(funnel.created_at).toLocaleDateString('pt-BR')}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        onClick={() => setEditingItem(funnel)}
                        variant="outline"
                        size="sm"
                        title="Editar funnel"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>

                      <Button
                        onClick={() => deleteFunnel(funnel.id)}
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                        title="Excluir funnel"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        )}

        {activeTab === 'cohorts' && (
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Cohorts ({cohorts.length})
              </h3>
              <Button
                onClick={handleCreateCohort}
                variant="primary"
                size="sm"
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Nova Cohort
              </Button>
            </div>

            <div className="space-y-3">
              {cohorts.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Users className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p>Nenhuma cohort encontrada</p>
                  <p className="text-sm">Crie sua primeira cohort para começar</p>
                </div>
              ) : (
                cohorts.map((cohort) => (
                  <div
                    key={cohort.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-gray-900">
                          {cohort.name}
                        </h4>
                        <Badge variant={getTypeBadgeColor(cohort.cohort_type)} size="sm">
                          {cohort.cohort_type}
                        </Badge>
                        <Badge variant={cohort.is_active ? 'success' : 'gray'} size="sm">
                          {cohort.is_active ? 'Ativo' : 'Inativo'}
                        </Badge>
                      </div>
                      {cohort.description && (
                        <p className="text-sm text-gray-600 mb-1">
                          {cohort.description}
                        </p>
                      )}
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>Período: {cohort.period}</span>
                        <span>Métrica: {cohort.metric}</span>
                        <span>Criado em {new Date(cohort.created_at).toLocaleDateString('pt-BR')}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        onClick={() => setEditingItem(cohort)}
                        variant="outline"
                        size="sm"
                        title="Editar cohort"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>

                      <Button
                        onClick={() => deleteCohort(cohort.id)}
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                        title="Excluir cohort"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        )}

        {activeTab === 'goals' && (
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Metas ({goals.length})
              </h3>
              <Button
                onClick={handleCreateGoal}
                variant="primary"
                size="sm"
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Nova Meta
              </Button>
            </div>

            <div className="space-y-3">
              {goals.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Target className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p>Nenhuma meta encontrada</p>
                  <p className="text-sm">Crie sua primeira meta para começar</p>
                </div>
              ) : (
                goals.map((goal) => (
                  <div
                    key={goal.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-gray-900">
                          {goal.name}
                        </h4>
                        <Badge variant={getTypeBadgeColor(goal.type)} size="sm">
                          {goal.type}
                        </Badge>
                        <Badge variant={goal.is_active ? 'success' : 'gray'} size="sm">
                          {goal.is_active ? 'Ativo' : 'Inativo'}
                        </Badge>
                      </div>
                      {goal.description && (
                        <p className="text-sm text-gray-600 mb-1">
                          {goal.description}
                        </p>
                      )}
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>Meta: {goal.target_value.toLocaleString()}</span>
                        <span>Atual: {goal.current_value.toLocaleString()}</span>
                        <span>Progresso: {((goal.current_value / goal.target_value) * 100).toFixed(1)}%</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        onClick={() => setEditingItem(goal)}
                        variant="outline"
                        size="sm"
                        title="Editar meta"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>

                      <Button
                        onClick={() => deleteGoal(goal.id)}
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                        title="Excluir meta"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        )}

        {activeTab === 'alerts' && (
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Alertas ({alerts.length})
              </h3>
              <Button
                onClick={handleCreateAlert}
                variant="primary"
                size="sm"
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Novo Alerta
              </Button>
            </div>

            <div className="space-y-3">
              {alerts.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Bell className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p>Nenhum alerta encontrado</p>
                  <p className="text-sm">Crie seu primeiro alerta para começar</p>
                </div>
              ) : (
                alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-gray-900">
                          {alert.name}
                        </h4>
                        <Badge variant={alert.is_active ? 'success' : 'gray'} size="sm">
                          {alert.is_active ? 'Ativo' : 'Inativo'}
                        </Badge>
                      </div>
                      {alert.description && (
                        <p className="text-sm text-gray-600 mb-1">
                          {alert.description}
                        </p>
                      )}
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>Métrica: {alert.metric}</span>
                        <span>Condição: {alert.condition}</span>
                        <span>Limite: {alert.threshold}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        onClick={() => setEditingItem(alert)}
                        variant="outline"
                        size="sm"
                        title="Editar alerta"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>

                      <Button
                        onClick={() => deleteAlert(alert.id)}
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                        title="Excluir alerta"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        )}

        {activeTab === 'exports' && (
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Exportações ({exports.length})
              </h3>
              <Button
                onClick={() => createExport({ type: 'data', format: 'csv' })}
                variant="primary"
                size="sm"
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Nova Exportação
              </Button>
            </div>

            <div className="space-y-3">
              {exports.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Download className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p>Nenhuma exportação encontrada</p>
                  <p className="text-sm">Crie sua primeira exportação para começar</p>
                </div>
              ) : (
                exports.map((exportItem) => (
                  <div
                    key={exportItem.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-gray-900">
                          Exportação {exportItem.id}
                        </h4>
                        <Badge variant={getStatusBadgeColor(exportItem.status)} size="sm">
                          {exportItem.status}
                        </Badge>
                        <Badge variant={getTypeBadgeColor(exportItem.type)} size="sm">
                          {exportItem.type}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>Formato: {exportItem.format}</span>
                        <span>Criado em {new Date(exportItem.created_at).toLocaleDateString('pt-BR')}</span>
                        {exportItem.file_size && (
                          <span>Tamanho: {(exportItem.file_size / 1024 / 1024).toFixed(2)} MB</span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {exportItem.status === 'completed' && exportItem.file_url && (
                        <Button
                          onClick={() => downloadExport(exportItem.id)}
                          variant="outline"
                          size="sm"
                          title="Baixar arquivo"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        )}

        {activeTab === 'integrations' && (
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Integrações ({integrations.length})
              </h3>
              <Button
                onClick={() => createIntegration({ name: 'Nova Integração', type: 'google_analytics' })}
                variant="primary"
                size="sm"
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Nova Integração
              </Button>
            </div>

            <div className="space-y-3">
              {integrations.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Settings className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p>Nenhuma integração encontrada</p>
                  <p className="text-sm">Configure sua primeira integração para começar</p>
                </div>
              ) : (
                integrations.map((integration) => (
                  <div
                    key={integration.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-gray-900">
                          {integration.name}
                        </h4>
                        <Badge variant={getTypeBadgeColor(integration.type)} size="sm">
                          {integration.type}
                        </Badge>
                        <Badge variant={integration.is_active ? 'success' : 'gray'} size="sm">
                          {integration.is_active ? 'Ativo' : 'Inativo'}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>Criado em {new Date(integration.created_at).toLocaleDateString('pt-BR')}</span>
                        {integration.last_sync && (
                          <span>Última sincronização: {new Date(integration.last_sync).toLocaleDateString('pt-BR')}</span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        onClick={() => testIntegration(integration.id)}
                        variant="outline"
                        size="sm"
                        title="Testar integração"
                      >
                        Testar
                      </Button>

                      <Button
                        onClick={() => setEditingItem(integration)}
                        variant="outline"
                        size="sm"
                        title="Editar integração"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>

                      <Button
                        onClick={() => deleteIntegration(integration.id)}
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                        title="Excluir integração"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdvancedAnalyticsManager;
