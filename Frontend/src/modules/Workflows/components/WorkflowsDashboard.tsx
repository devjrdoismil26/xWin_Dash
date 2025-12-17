import React, { useState, useEffect } from 'react';
import { BarChart3, Activity, TrendingUp, Zap, RefreshCw, Settings, LayoutGrid, List, Filter, Search, Plus } from 'lucide-react';
import { Card } from '@/shared/components/ui/Card';
import Button from '@/shared/components/ui/Button';
import { LoadingSpinner } from '@/shared/components/ui/LoadingStates';
import { PageTransition, Animated } from '@/shared/components/ui/AdvancedAnimations';
import { ResponsiveContainer, ShowOn } from '@/shared/components/ui/ResponsiveSystem';
import ErrorState from '@/shared/components/ui/ErrorState';
import { useWorkflowsStore } from '../hooks/useWorkflowsStore';
import { useExecutionsStore } from '../hooks/useExecutionsStore';
import { useMetricsStore } from '../hooks/useMetricsStore';
import { useFiltersStore } from '../hooks/useFiltersStore';
import WorkflowsStats from './WorkflowsStats';
import WorkflowsFilters from './WorkflowsFilters';
import WorkflowsList from './WorkflowsList';
import WorkflowsGrid from './WorkflowsGrid';
import WorkflowsActions from './WorkflowsActions';
import WorkflowsCreateModal from './WorkflowsCreateModal';
import { cn } from '@/lib/utils';

// Interface para props do dashboard
interface WorkflowsDashboardProps {
  className?: string;
  showAdvancedFeatures?: boolean;
  defaultView?: 'grid' | 'list';
  autoRefresh?: boolean;
  refreshInterval?: number;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

/**
 * Dashboard principal para workflows
 * Integra todos os subcomponentes e gerencia o estado global
 */
const WorkflowsDashboard: React.FC<WorkflowsDashboardProps> = ({ className,
  showAdvancedFeatures = true,
  defaultView = 'grid',
  autoRefresh = false,
  refreshInterval = 30000
   }) => {
  // Estados locais
  const [viewMode, setViewMode] = useState<'grid' | 'list'>(defaultView);

  const [showCreateModal, setShowCreateModal] = useState(false);

  const [showFilters, setShowFilters] = useState(false);

  const [isRefreshing, setIsRefreshing] = useState(false);

  // Stores
  const {
    workflows,
    loading: workflowsLoading,
    error: workflowsError,
    pagination,
    selection,
    fetchWorkflows,
    refreshWorkflows,
    clearError: clearWorkflowsError
  } = useWorkflowsStore();

  const {
    executions,
    loading: executionsLoading,
    error: executionsError,
    fetchExecutions,
    clearError: clearExecutionsError
  } = useExecutionsStore();

  const {
    executionStats,
    systemMetrics,
    loading: metricsLoading,
    error: metricsError,
    fetchExecutionStats,
    fetchSystemMetrics,
    clearError: clearMetricsError
  } = useMetricsStore();

  const {
    workflowFilters,
    setWorkflowFilters,
    clearWorkflowFilters
  } = useFiltersStore();

  // Auto refresh
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(async () => {
      setIsRefreshing(true);

      try {
        await Promise.all([
          refreshWorkflows(),
          fetchExecutions(),
          fetchExecutionStats(),
          fetchSystemMetrics()
        ]);

      } catch (error) {
        console.error('Erro no auto refresh:', error);

      } finally {
        setIsRefreshing(false);

      } , refreshInterval);

    return () => clearInterval(interval);

  }, [autoRefresh, refreshInterval, refreshWorkflows, fetchExecutions, fetchExecutionStats, fetchSystemMetrics]);

  // Carregar dados iniciais
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        await Promise.all([
          fetchWorkflows(),
          fetchExecutions(),
          fetchExecutionStats(),
          fetchSystemMetrics()
        ]);

      } catch (error) {
        console.error('Erro ao carregar dados iniciais:', error);

      } ;

    loadInitialData();

  }, [fetchWorkflows, fetchExecutions, fetchExecutionStats, fetchSystemMetrics]);

  // Handlers
  const handleRefresh = async () => {
    setIsRefreshing(true);

    try {
      await Promise.all([
        refreshWorkflows(),
        fetchExecutions(),
        fetchExecutionStats(),
        fetchSystemMetrics()
      ]);

    } catch (error) {
      console.error('Erro ao atualizar:', error);

    } finally {
      setIsRefreshing(false);

    } ;

  const handleCreateWorkflow = () => {
    setShowCreateModal(true);};

  const handleFiltersChange = (newFilters: Record<string, any>) => {
    setWorkflowFilters(newFilters);};

  const handleClearFilters = () => {
    clearWorkflowFilters();};

  const handleViewModeChange = (mode: 'grid' | 'list') => {
    setViewMode(mode);};

  // Estados de loading e erro
  const isLoading = workflowsLoading || executionsLoading || metricsLoading;
  const hasError = workflowsError || executionsError || metricsError;

  // Limpar erros
  const clearAllErrors = () => {
    clearWorkflowsError();

    clearExecutionsError();

    clearMetricsError();};

  if (hasError) {
    return (
              <ErrorState
        title="Erro ao carregar dashboard"
        message={ workflowsError || executionsError || metricsError || 'Erro desconhecido' }
        onRetry={ handleRefresh }
        onClear={ clearAllErrors }
        className={className} / />);

  }

  return (
        <>
      <PageTransition />
      <div className={cn('space-y-6', className)  }>
        </div>{/* Header do Dashboard */}
        <div className=" ">$2</div><div>
           
        </div><h1 className="text-3xl font-bold tracking-tight">Workflows</h1>
            <p className="text-muted-foreground" />
              Gerencie e monitore seus workflows de automação
            </p></div><div className="{/* Botão de Refresh */}">$2</div>
            <Button
              variant="outline"
              size="sm"
              onClick={ handleRefresh }
              disabled={ isRefreshing }
              className="gap-2" />
              <RefreshCw className={cn('h-4 w-4', isRefreshing && 'animate-spin')} / />
              Atualizar
            </Button>

            {/* Toggle de Filtros */}
            <Button
              variant="outline"
              size="sm"
              onClick={ () => setShowFilters(!showFilters) }
              className="gap-2"
            >
              <Filter className="h-4 w-4" />
              Filtros
            </Button>

            {/* Toggle de Visualização */}
            <div className=" ">$2</div><Button
                variant={ viewMode === 'grid' ? 'default' : 'ghost' }
                size="sm"
                onClick={ () => handleViewModeChange('grid') }
                className="rounded-r-none"
              >
                <LayoutGrid className="h-4 w-4" /></Button><Button
                variant={ viewMode === 'list' ? 'default' : 'ghost' }
                size="sm"
                onClick={ () => handleViewModeChange('list') }
                className="rounded-l-none"
              >
                <List className="h-4 w-4" /></Button></div>

            {/* Botão de Criar */}
            <Button onClick={handleCreateWorkflow} className="gap-2" />
              <Plus className="h-4 w-4" />
              Novo Workflow
            </Button>
          </div>

        {/* Filtros */}
        <Animated}
          className="overflow-hidden" />
          <WorkflowsFilters
            filters={ workflowFilters }
            onFiltersChange={ handleFiltersChange }
            onClearFilters={ handleClearFilters }
            className="mb-6"
          / />
        </Animated>

        {/* Estatísticas */}
        <ShowOn breakpoint="md" />
          <WorkflowsStats
            stats={ executionStats }
            systemMetrics={ systemMetrics }
            loading={ metricsLoading }
            className="mb-6"
          / />
        </ShowOn>

        {/* Ações em Lote */}
        {selection.selectedIds.size > 0 && (
          <WorkflowsActions
            selectedCount={ selection.selectedIds.size }
            onClearSelection={() => {/* Implementar */} className="mb-4" />
        )}

        {/* Conteúdo Principal */}
        <ResponsiveContainer />
          {isLoading ? (
            <div className=" ">$2</div><LoadingSpinner size="lg" / />
            </div>
          ) : (
            <>
              {viewMode === 'grid' ? (
                <WorkflowsGrid
                  workflows={ workflows }
                  loading={ workflowsLoading }
                  pagination={ pagination }
                  selection={ selection }
                  onWorkflowSelect={(id: unknown) => {/* Implementar */} onWorkflowAction={(id: unknown, action: unknown) => {/* Implementar */} onPageChange={(page: unknown) => {/* Implementar */} />
              ) : (
                <WorkflowsList
                  workflows={ workflows }
                  loading={ workflowsLoading }
                  pagination={ pagination }
                  selection={ selection }
                  onWorkflowSelect={(id: unknown) => {/* Implementar */} onWorkflowAction={(id: unknown, action: unknown) => {/* Implementar */} onPageChange={(page: unknown) => {/* Implementar */} />
              )}
            </>
          )}
        </ResponsiveContainer>

        {/* Modal de Criação */}
        <WorkflowsCreateModal
          isOpen={ showCreateModal }
          onClose={ () => setShowCreateModal(false) }
          onSuccess={() => {
            setShowCreateModal(false);

            handleRefresh();

          } />

        {/* Features Avançadas */}
        {showAdvancedFeatures && (
          <div className=" ">$2</div><div className=" ">$2</div><Settings className="h-4 w-4" />
              <span className="text-sm font-medium">Features Avançadas</span></div><p className="text-sm text-muted-foreground" />
              testes de integração estão disponíveis.
            </p>
      </div>
    </>
  )}
      </div>
    </PageTransition>);};

export default WorkflowsDashboard;
