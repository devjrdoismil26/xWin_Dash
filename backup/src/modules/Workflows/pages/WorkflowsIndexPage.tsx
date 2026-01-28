import React, { useEffect, useState } from 'react';
import { 
  Play, 
  Pause, 
  Square, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  BarChart3, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Copy,
  Trash2,
  Edit,
  Eye,
  Download,
  Upload,
  Settings,
  Zap,
  Workflow,
  Activity,
  TrendingUp,
  Users,
  Calendar,
  Target,
  Bot,
  Globe,
  MessageSquare,
  Database,
  Smartphone,
  Mail,
  Code,
  GitBranch,
  Timer,
  Brain,
  BarChart,
  PieChart,
  LineChart,
  RefreshCw,
  Star,
  Bookmark,
  Share2,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  LayoutGrid,
  List,
  SortAsc,
  SortDesc
} from 'lucide-react';
import { Card } from "@/components/ui/Card";
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Badge from '@/components/ui/Badge';
import Modal, { ModalHeader, ModalBody, ModalFooter } from '@/components/ui/Modal';
import { LoadingSpinner, LoadingSkeleton, TableLoadingSkeleton } from '@/components/ui/LoadingStates';
import { AnimatedCounter, PageTransition, Animated } from '@/components/ui/AdvancedAnimations';
import { ResponsiveGrid, ResponsiveContainer, ShowOn } from '@/components/ui/ResponsiveSystem';
import { ProgressBar, CircularProgress, OperationProgress } from '@/components/ui/AdvancedProgress';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import Tooltip from '@/components/ui/Tooltip';
import AdvancedWorkflowDashboard from '../components/AdvancedWorkflowDashboard';
import WorkflowIntegrationTest from '../components/WorkflowIntegrationTest';
import { useWorkflows } from '../hooks/useWorkflows';
import { workflowService } from '../services/workflowService';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
const WorkflowsIndexPage: React.FC = () => {
  const [useAdvancedDashboard, setUseAdvancedDashboard] = useState(false);
  const [showIntegrationTest, setShowIntegrationTest] = useState(false);
  const [activeView, setActiveView] = useState('overview');
  const {
    workflows,
    loading,
    error,
    filters,
    pagination,
    getWorkflowStatistics,
    fetchWorkflows,
    createWorkflow,
    deleteWorkflow,
    executeWorkflow,
    toggleWorkflowActive,
    setFilters,
    setPagination,
    clearError
  } = useWorkflows();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newWorkflowName, setNewWorkflowName] = useState('');
  const [newWorkflowDescription, setNewWorkflowDescription] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'name' | 'created' | 'updated' | 'status'>('updated');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  // Load initial data
  useEffect(() => {
    fetchWorkflows();
  }, []);
  // Handle search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setFilters({ search: searchTerm });
      fetchWorkflows();
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);
  // Handle status filter
  useEffect(() => {
    setFilters({ status: statusFilter });
    fetchWorkflows();
  }, [statusFilter]);
  const handleCreateWorkflow = async () => {
    if (!newWorkflowName.trim()) {
      toast.error('Nome do workflow é obrigatório');
      return;
    }
    try {
      const result = await createWorkflow({
        name: newWorkflowName,
        description: newWorkflowDescription,
        status: 'draft'
      });
      if (result.success) {
        setShowCreateModal(false);
        setNewWorkflowName('');
        setNewWorkflowDescription('');
        toast.success('Workflow criado com sucesso!');
      }
    } catch (error) {
      toast.error('Erro ao criar workflow');
    }
  };
  const handleDeleteWorkflow = async (workflowId: string) => {
    if (confirm('Tem certeza que deseja excluir este workflow?')) {
      try {
        await deleteWorkflow(workflowId);
        toast.success('Workflow excluído com sucesso!');
      } catch (error) {
        toast.error('Erro ao excluir workflow');
      }
    }
  };
  const handleExecuteWorkflow = async (workflowId: string) => {
    try {
      await executeWorkflow(workflowId);
      toast.success('Workflow executado com sucesso!');
    } catch (error) {
      toast.error('Erro ao executar workflow');
    }
  };
  const handleToggleActive = async (workflowId: string) => {
    try {
      await toggleWorkflowActive(workflowId);
      toast.success('Status do workflow atualizado!');
    } catch (error) {
      toast.error('Erro ao atualizar status do workflow');
    }
  };
  const handleDuplicateWorkflow = async (workflowId: string) => {
    try {
      const workflow = workflows.find(w => w.id === workflowId);
      if (workflow) {
        await createWorkflow({
          name: `${workflow.name} (Cópia)`,
          description: workflow.description,
          status: 'draft'
        });
        toast.success('Workflow duplicado com sucesso!');
      }
    } catch (error) {
      toast.error('Erro ao duplicar workflow');
    }
  };
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { color: 'gray', icon: Edit, label: 'Rascunho' },
      active: { color: 'green', icon: CheckCircle, label: 'Ativo' },
      paused: { color: 'yellow', icon: Pause, label: 'Pausado' },
      archived: { color: 'red', icon: XCircle, label: 'Arquivado' }
    };
    const config = statusConfig[status] || statusConfig.draft;
    const Icon = config.icon;
    return (
      <Badge variant="secondary" className={cn(
        "flex items-center gap-1",
        config.color === 'green' && "bg-green-100 text-green-800",
        config.color === 'yellow' && "bg-yellow-100 text-yellow-800",
        config.color === 'red' && "bg-red-100 text-red-800",
        config.color === 'gray' && "bg-gray-100 text-gray-800"
      )}>
        <Icon size={12} />
        {config.label}
      </Badge>
    );
  };
  const getWorkflowIcon = (workflow: any) => {
    // Lógica para determinar o ícone baseado no tipo de workflow
    if (workflow.name?.toLowerCase().includes('email')) return Mail;
    if (workflow.name?.toLowerCase().includes('whatsapp')) return MessageSquare;
    if (workflow.name?.toLowerCase().includes('ai') || workflow.name?.toLowerCase().includes('bot')) return Bot;
    if (workflow.name?.toLowerCase().includes('api')) return Code;
    if (workflow.name?.toLowerCase().includes('data')) return Database;
    if (workflow.name?.toLowerCase().includes('social')) return Globe;
    if (workflow.name?.toLowerCase().includes('analytics')) return BarChart;
    return Workflow;
  };
  const workflowCategories = [
    { id: 'all', label: 'Todos', icon: LayoutGrid },
    { id: 'automation', label: 'Automação', icon: Zap },
    { id: 'communication', label: 'Comunicação', icon: MessageSquare },
    { id: 'analytics', label: 'Analytics', icon: BarChart },
    { id: 'ai', label: 'IA', icon: Bot },
    { id: 'integration', label: 'Integração', icon: Code }
  ];
  const statistics = getWorkflowStatistics();
  if (loading && workflows.length === 0) {
    return (
      <div className="py-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }
  // Renderizar teste de integração se selecionado
  if (showIntegrationTest) {
    return (
      <PageTransition type="fade" duration={500}>
        <div className="py-6 space-y-6">
          <div className="mb-6">
            <Button 
              variant="outline" 
              onClick={() => setShowIntegrationTest(false)}
              className="mb-4"
            >
              ← Voltar ao Dashboard
            </Button>
          </div>
          <WorkflowIntegrationTest />
        </div>
      </PageTransition>
    );
  }
  // Renderizar dashboard avançado se selecionado
  if (useAdvancedDashboard) {
    return (
      <PageTransition type="fade" duration={500}>
        <div className="py-6 space-y-6">
          <div className="mb-6">
            <Button 
              variant="outline" 
              onClick={() => setUseAdvancedDashboard(false)}
              className="mb-4"
            >
              ← Voltar ao Dashboard Básico
            </Button>
          </div>
          <AdvancedWorkflowDashboard 
            workflows={workflows}
            loading={loading}
            error={error}
            onViewChange={setActiveView}
            activeView={activeView}
          />
        </div>
      </PageTransition>
    );
  }
  return (
    <PageTransition type="fade" duration={500}>
      <div className="py-6 space-y-6">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-8">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative">
          <div className="flex items-center justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <Workflow className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Workflows</h1>
                  <p className="text-gray-600">Automatize seus processos de negócio com workflows visuais</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Tooltip content="Acessar dashboard avançado com IA">
                  <Button
                    onClick={() => setUseAdvancedDashboard(true)}
                    className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                  >
                    <Brain size={16} />
                    Dashboard IA
                  </Button>
                </Tooltip>
                <Tooltip content="Testar integração completa do módulo">
                  <Button
                    onClick={() => setShowIntegrationTest(true)}
                    className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white"
                  >
                    <Settings size={16} />
                    Teste de Integração
                  </Button>
                </Tooltip>
                <Button 
                  onClick={() => setShowCreateModal(true)}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
                >
                  <Plus size={16} />
                  Criar Workflow
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <Download size={16} />
                  Importar
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <Settings size={16} />
                  Configurações
                </Button>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="w-32 h-32 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full opacity-20"></div>
            </div>
          </div>
        </div>
      </div>
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <Card.Content className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Workflows</p>
                <p className="text-3xl font-bold text-gray-900">{statistics.totalWorkflows}</p>
                <p className="text-xs text-gray-500 mt-1">+12% este mês</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-xl">
                <Workflow className="h-8 w-8 text-blue-600" />
              </div>
            </div>
          </Card.Content>
        </Card>
        <Card className="hover:shadow-lg transition-shadow">
          <Card.Content className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ativos</p>
                <p className="text-3xl font-bold text-green-600">{statistics.activeWorkflows}</p>
                <p className="text-xs text-gray-500 mt-1">Executando agora</p>
              </div>
              <div className="p-3 bg-green-100 rounded-xl">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </div>
          </Card.Content>
        </Card>
        <Card className="hover:shadow-lg transition-shadow">
          <Card.Content className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Execuções</p>
                <p className="text-3xl font-bold text-blue-600">{statistics.runningExecutions}</p>
                <p className="text-xs text-gray-500 mt-1">Em andamento</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-xl">
                <Activity className="h-8 w-8 text-blue-600" />
              </div>
            </div>
          </Card.Content>
        </Card>
        <Card className="hover:shadow-lg transition-shadow">
          <Card.Content className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Taxa de Sucesso</p>
                <p className="text-3xl font-bold text-green-600">
                  {statistics.totalExecutions > 0 
                    ? Math.round((statistics.completedExecutions / statistics.totalExecutions) * 100)
                    : 0}%
                </p>
                <p className="text-xs text-gray-500 mt-1">Últimos 30 dias</p>
              </div>
              <div className="p-3 bg-green-100 rounded-xl">
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
            </div>
          </Card.Content>
        </Card>
      </div>
      {/* Categories */}
      <div className="flex flex-wrap gap-2">
        {workflowCategories.map((category) => {
          const Icon = category.icon;
          return (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
              className="flex items-center gap-2"
            >
              <Icon size={16} />
              {category.label}
            </Button>
          );
        })}
      </div>
      {/* Filters and Search */}
      <Card>
        <Card.Content className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <Input
                  placeholder="Buscar workflows..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Todos os Status</option>
                <option value="draft">Rascunho</option>
                <option value="active">Ativo</option>
                <option value="paused">Pausado</option>
                <option value="archived">Arquivado</option>
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="updated">Última Atualização</option>
                <option value="created">Data de Criação</option>
                <option value="name">Nome</option>
                <option value="status">Status</option>
              </select>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="flex items-center gap-2"
              >
                {sortOrder === 'asc' ? <SortAsc size={16} /> : <SortDesc size={16} />}
              </Button>
              <div className="flex border border-gray-300 rounded-lg">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-r-none"
                >
                  <LayoutGrid size={16} />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-l-none"
                >
                  <List size={16} />
                </Button>
              </div>
              <Button
                variant="outline"
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className="flex items-center gap-2"
              >
                <Filter size={16} />
                Filtros
                {showAdvancedFilters ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </Button>
            </div>
          </div>
          {/* Advanced Filters */}
          {showAdvancedFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Data de Criação
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Qualquer data</option>
                    <option value="today">Hoje</option>
                    <option value="week">Esta semana</option>
                    <option value="month">Este mês</option>
                    <option value="year">Este ano</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Workflow
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Todos os tipos</option>
                    <option value="automation">Automação</option>
                    <option value="communication">Comunicação</option>
                    <option value="analytics">Analytics</option>
                    <option value="ai">IA</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Execuções
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Qualquer quantidade</option>
                    <option value="0">Nunca executado</option>
                    <option value="1-10">1-10 execuções</option>
                    <option value="10-100">10-100 execuções</option>
                    <option value="100+">100+ execuções</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </Card.Content>
      </Card>
      {/* Error Display */}
      {error && (
        <Card>
          <Card.Content className="p-4">
            <div className="flex items-center gap-2 text-red-600">
              <AlertCircle size={16} />
              <span>{error}</span>
              <Button variant="ghost" size="sm" onClick={clearError}>
                Dismiss
              </Button>
            </div>
          </Card.Content>
        </Card>
      )}
      {/* Workflows Display */}
      <Card>
        <Card.Header>
          <div className="flex items-center justify-between">
            <div>
              <Card.Title>Workflows ({workflows.length})</Card.Title>
              <Card.Description>
                Gerencie e execute seus workflows de automação
              </Card.Description>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <RefreshCw size={16} />
              </Button>
              <Button variant="outline" size="sm">
                <Download size={16} />
              </Button>
            </div>
          </div>
        </Card.Header>
        <Card.Content className="p-0">
          {workflows.length === 0 ? (
            <div className="p-12 text-center">
              <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Workflow className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum workflow encontrado</h3>
              <p className="text-gray-500 mb-6">
                Comece criando seu primeiro workflow de automação
              </p>
              <div className="flex justify-center gap-3">
                <Button onClick={() => setShowCreateModal(true)}>
                  <Plus size={16} className="mr-2" />
                  Criar Workflow
                </Button>
                <Button variant="outline">
                  <Upload size={16} className="mr-2" />
                  Importar
                </Button>
              </div>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {workflows.map((workflow) => {
                  const WorkflowIcon = getWorkflowIcon(workflow);
                  return (
                    <Card key={workflow.id} className="hover:shadow-lg transition-all duration-200 group cursor-pointer">
                      <Card.Content className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="p-3 bg-blue-100 rounded-xl group-hover:bg-blue-200 transition-colors">
                            <WorkflowIcon className="h-6 w-6 text-blue-600" />
                          </div>
                          <div className="flex items-center gap-1">
                            {getStatusBadge(workflow.status)}
                          </div>
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                          {workflow.name}
                        </h3>
                        <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                          {workflow.description || 'Sem descrição'}
                        </p>
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Calendar size={12} />
                            <span>Criado em {new Date(workflow.created_at).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Clock size={12} />
                            <span>Atualizado em {new Date(workflow.updated_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleExecuteWorkflow(workflow.id)}
                              disabled={workflow.status !== 'active'}
                              className="h-8 w-8 p-0"
                            >
                              <Play size={14} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleToggleActive(workflow.id)}
                              className="h-8 w-8 p-0"
                            >
                              {workflow.status === 'active' ? <Pause size={14} /> : <Play size={14} />}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDuplicateWorkflow(workflow.id)}
                              className="h-8 w-8 p-0"
                            >
                              <Copy size={14} />
                            </Button>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteWorkflow(workflow.id)}
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </Card.Content>
                    </Card>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {workflows.map((workflow) => {
                const WorkflowIcon = getWorkflowIcon(workflow);
                return (
                  <div key={workflow.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <WorkflowIcon className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="font-medium text-gray-900">
                              {workflow.name}
                            </h3>
                            {getStatusBadge(workflow.status)}
                          </div>
                          <p className="text-sm text-gray-500 mb-2">
                            {workflow.description || 'Sem descrição'}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <Calendar size={12} />
                              Criado em {new Date(workflow.created_at).toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock size={12} />
                              Atualizado em {new Date(workflow.updated_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleExecuteWorkflow(workflow.id)}
                          disabled={workflow.status !== 'active'}
                        >
                          <Play size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleActive(workflow.id)}
                        >
                          {workflow.status === 'active' ? <Pause size={16} /> : <Play size={16} />}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDuplicateWorkflow(workflow.id)}
                        >
                          <Copy size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteWorkflow(workflow.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 size={16} />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MoreVertical size={16} />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card.Content>
      </Card>
      {/* Create Workflow Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        size="lg"
      >
        <ModalHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Plus className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Criar Novo Workflow</h3>
              <p className="text-sm text-gray-500">
                Configure seu novo workflow de automação
              </p>
            </div>
          </div>
        </ModalHeader>
        <ModalBody>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome do Workflow *
              </label>
              <Input
                value={newWorkflowName}
                onChange={(e) => setNewWorkflowName(e.target.value)}
                placeholder="Ex: Automação de Email Marketing"
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descrição
              </label>
              <textarea
                value={newWorkflowDescription}
                onChange={(e) => setNewWorkflowDescription(e.target.value)}
                placeholder="Descreva o que este workflow faz..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={4}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categoria
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="automation">Automação</option>
                  <option value="communication">Comunicação</option>
                  <option value="analytics">Analytics</option>
                  <option value="ai">IA</option>
                  <option value="integration">Integração</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status Inicial
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="draft">Rascunho</option>
                  <option value="active">Ativo</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <Input
                placeholder="Ex: email, marketing, automação"
                className="w-full"
              />
              <p className="text-xs text-gray-500 mt-1">
                Separe as tags por vírgula
              </p>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setShowCreateModal(false)}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleCreateWorkflow}
              disabled={!newWorkflowName.trim()}
              className="flex items-center gap-2"
            >
              <Plus size={16} />
              Criar Workflow
            </Button>
          </div>
        </ModalFooter>
      </Modal>
    </div>
    </PageTransition>
  );
};
export default WorkflowsIndexPage;
