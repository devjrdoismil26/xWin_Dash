// ========================================
// INTEGRAÇÃO LEADS + WORKFLOWS
// ========================================
import React, { useState, useCallback, useEffect } from 'react';
import {
  Workflow,
  Zap,
  Play,
  Pause,
  Settings,
  Plus,
  Trash2,
  Edit,
  Eye,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Target,
  Users,
  Mail,
  Phone,
  Calendar,
  Star,
  Activity,
  TrendingUp,
  BarChart3,
  ChevronDown,
  ChevronUp,
  RefreshCw
} from 'lucide-react';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';
import Modal from '@/components/ui/Modal';
import { cn } from '@/lib/utils';
import { Lead, LeadWorkflow, WorkflowTrigger, WorkflowStep } from '../types/leads';
interface LeadWorkflowIntegrationProps {
  lead: Lead;
  workflows: LeadWorkflow[];
  onTriggerWorkflow: (workflowId: number, leadId: number) => Promise<boolean>;
  onCreateWorkflow: (data: Partial<LeadWorkflow>) => Promise<LeadWorkflow | null>;
  onUpdateWorkflow: (id: number, data: Partial<LeadWorkflow>) => Promise<LeadWorkflow | null>;
  onDeleteWorkflow: (id: number) => Promise<boolean>;
  onViewWorkflow: (workflow: LeadWorkflow) => void;
  className?: string;
}
interface WorkflowExecution {
  id: string;
  workflowId: number;
  leadId: number;
  status: 'running' | 'completed' | 'failed' | 'paused';
  currentStep: string;
  progress: number;
  startedAt: string;
  completedAt?: string;
  error?: string;
  results?: Record<string, any>;
}
const LeadWorkflowIntegration: React.FC<LeadWorkflowIntegrationProps> = ({
  lead,
  workflows,
  onTriggerWorkflow,
  onCreateWorkflow,
  onUpdateWorkflow,
  onDeleteWorkflow,
  onViewWorkflow,
  className
}) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showWorkflowModal, setShowWorkflowModal] = useState(false);
  const [selectedWorkflow, setSelectedWorkflow] = useState<LeadWorkflow | null>(null);
  const [executions, setExecutions] = useState<WorkflowExecution[]>([]);
  const [expandedWorkflows, setExpandedWorkflows] = useState<Set<number>>(new Set());
  const [isExecuting, setIsExecuting] = useState<Set<number>>(new Set());
  // Mock executions data
  useEffect(() => {
    const mockExecutions: WorkflowExecution[] = [
      {
        id: '1',
        workflowId: 1,
        leadId: lead.id,
        status: 'completed',
        currentStep: 'send_email',
        progress: 100,
        startedAt: new Date(Date.now() - 3600000).toISOString(),
        completedAt: new Date(Date.now() - 3000000).toISOString(),
        results: {
          email_sent: true,
          email_opened: true,
          response_received: false
        }
      },
      {
        id: '2',
        workflowId: 2,
        leadId: lead.id,
        status: 'running',
        currentStep: 'schedule_call',
        progress: 60,
        startedAt: new Date(Date.now() - 1800000).toISOString()
      }
    ];
    setExecutions(mockExecutions);
  }, [lead.id]);
  const toggleWorkflowExpansion = useCallback((workflowId: number) => {
    setExpandedWorkflows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(workflowId)) {
        newSet.delete(workflowId);
      } else {
        newSet.add(workflowId);
      }
      return newSet;
    });
  }, []);
  const handleTriggerWorkflow = useCallback(async (workflow: LeadWorkflow) => {
    setIsExecuting(prev => new Set(prev).add(workflow.id));
    try {
      const success = await onTriggerWorkflow(workflow.id, lead.id);
      if (success) {
        // Add mock execution
        const newExecution: WorkflowExecution = {
          id: Date.now().toString(),
          workflowId: workflow.id,
          leadId: lead.id,
          status: 'running',
          currentStep: workflow.steps[0]?.id || 'start',
          progress: 0,
          startedAt: new Date().toISOString()
        };
        setExecutions(prev => [newExecution, ...prev]);
      }
    } catch (error) {
      console.error('Erro ao executar workflow de lead:', error);
    } finally {
      setIsExecuting(prev => {
        const newSet = new Set(prev);
        newSet.delete(workflow.id);
        return newSet;
      });
    }
  }, [lead.id, onTriggerWorkflow]);
  const handleCreateWorkflow = useCallback(async (data: Partial<LeadWorkflow>) => {
    const workflow = await onCreateWorkflow(data);
    if (workflow) {
      setShowCreateModal(false);
    }
  }, [onCreateWorkflow]);
  const handleViewWorkflow = useCallback((workflow: LeadWorkflow) => {
    setSelectedWorkflow(workflow);
    setShowWorkflowModal(true);
  }, []);
  const getWorkflowStatusColor = useCallback((status: string) => {
    switch (status) {
      case 'running': return 'bg-blue-100 text-blue-700';
      case 'completed': return 'bg-green-100 text-green-700';
      case 'failed': return 'bg-red-100 text-red-700';
      case 'paused': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  }, []);
  const getWorkflowStatusIcon = useCallback((status: string) => {
    switch (status) {
      case 'running': return <Play className="w-3 h-3" />;
      case 'completed': return <CheckCircle className="w-3 h-3" />;
      case 'failed': return <AlertCircle className="w-3 h-3" />;
      case 'paused': return <Pause className="w-3 h-3" />;
      default: return <Clock className="w-3 h-3" />;
    }
  }, []);
  const getStepIcon = useCallback((stepType: string) => {
    switch (stepType) {
      case 'email': return <Mail className="w-4 h-4" />;
      case 'task': return <CheckCircle className="w-4 h-4" />;
      case 'score_update': return <Star className="w-4 h-4" />;
      case 'status_update': return <Target className="w-4 h-4" />;
      case 'tag_add': return <Users className="w-4 h-4" />;
      case 'webhook': return <Zap className="w-4 h-4" />;
      case 'delay': return <Clock className="w-4 h-4" />;
      case 'condition': return <Activity className="w-4 h-4" />;
      default: return <Workflow className="w-4 h-4" />;
    }
  }, []);
  const getStepColor = useCallback((stepType: string) => {
    switch (stepType) {
      case 'email': return 'text-blue-600 bg-blue-50';
      case 'task': return 'text-green-600 bg-green-50';
      case 'score_update': return 'text-yellow-600 bg-yellow-50';
      case 'status_update': return 'text-purple-600 bg-purple-50';
      case 'tag_add': return 'text-indigo-600 bg-indigo-50';
      case 'webhook': return 'text-orange-600 bg-orange-50';
      case 'delay': return 'text-gray-600 bg-gray-50';
      case 'condition': return 'text-pink-600 bg-pink-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  }, []);
  const formatDate = useCallback((dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR');
  }, []);
  const getExecutionForWorkflow = useCallback((workflowId: number) => {
    return executions.find(exec => exec.workflowId === workflowId);
  }, [executions]);
  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Workflows de Lead</h3>
          <p className="text-sm text-gray-600">
            Automatize ações baseadas no comportamento do lead
          </p>
        </div>
        <Button
          size="sm"
          onClick={() => setShowCreateModal(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Workflow
        </Button>
      </div>
      {/* Active Executions */}
      {executions.filter(exec => exec.status === 'running').length > 0 && (
        <Card className="p-4">
          <h4 className="font-medium text-gray-900 mb-3">Execuções Ativas</h4>
          <div className="space-y-3">
            {executions
              .filter(exec => exec.status === 'running')
              .map((execution) => {
                const workflow = workflows.find(w => w.id === execution.workflowId);
                return (
                  <div key={execution.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Workflow className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{workflow?.name}</p>
                        <p className="text-sm text-gray-600">
                          Etapa: {execution.currentStep} • {execution.progress}% concluído
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${execution.progress}%` }}
                        />
                      </div>
                      <Badge className="bg-blue-100 text-blue-700">
                        <Play className="w-3 h-3 mr-1" />
                        Executando
                      </Badge>
                    </div>
                  </div>
                );
              })}
          </div>
        </Card>
      )}
      {/* Workflows List */}
      <div className="space-y-4">
        {workflows.map((workflow) => {
          const execution = getExecutionForWorkflow(workflow.id);
          const isExpanded = expandedWorkflows.has(workflow.id);
          const isExecuting = isExecuting.has(workflow.id);
          return (
            <Card key={workflow.id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <Workflow className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{workflow.name}</h4>
                    <p className="text-sm text-gray-600">{workflow.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge
                        variant="secondary"
                        className={cn("text-xs", workflow.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700")}
                      >
                        {workflow.is_active ? 'Ativo' : 'Inativo'}
                      </Badge>
                      {execution && (
                        <Badge
                          variant="secondary"
                          className={cn("text-xs", getWorkflowStatusColor(execution.status))}
                        >
                          {getWorkflowStatusIcon(execution.status)}
                          <span className="ml-1 capitalize">{execution.status}</span>
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewWorkflow(workflow)}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleWorkflowExpansion(workflow.id)}
                  >
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleTriggerWorkflow(workflow)}
                    disabled={isExecuting || !workflow.is_active}
                    loading={isExecuting}
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    Executar
                  </Button>
                </div>
              </div>
              {/* Expanded Workflow Details */}
              {isExpanded && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="space-y-4">
                    {/* Workflow Steps */}
                    <div>
                      <h5 className="font-medium text-gray-900 mb-3">Etapas do Workflow</h5>
                      <div className="space-y-2">
                        {workflow.steps.map((step, index) => (
                          <div key={step.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-medium text-blue-600">
                              {index + 1}
                            </div>
                            <div className={cn("p-2 rounded-lg", getStepColor(step.type))}>
                              {getStepIcon(step.type)}
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-gray-900">{step.name}</p>
                              <p className="text-sm text-gray-600">{step.type}</p>
                            </div>
                            {execution && execution.currentStep === step.id && (
                              <Badge className="bg-blue-100 text-blue-700">
                                <Activity className="w-3 h-3 mr-1" />
                                Atual
                              </Badge>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                    {/* Execution History */}
                    {execution && (
                      <div>
                        <h5 className="font-medium text-gray-900 mb-3">Histórico de Execução</h5>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
                              {getWorkflowStatusIcon(execution.status)}
                              <div>
                                <p className="font-medium text-gray-900">
                                  Execução iniciada em {formatDate(execution.startedAt)}
                                </p>
                                <p className="text-sm text-gray-600">
                                  Progresso: {execution.progress}% • Etapa: {execution.currentStep}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-gray-600">
                                {execution.completedAt ? `Concluído em ${formatDate(execution.completedAt)}` : 'Em execução'}
                              </p>
                              {execution.error && (
                                <p className="text-sm text-red-600">{execution.error}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    {/* Workflow Actions */}
                    <div className="flex items-center gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onUpdateWorkflow(workflow.id, { is_active: !workflow.is_active })}
                      >
                        {workflow.is_active ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                        {workflow.is_active ? 'Pausar' : 'Ativar'}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onViewWorkflow(workflow)}
                      >
                        <Settings className="w-4 h-4 mr-2" />
                        Configurar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onDeleteWorkflow(workflow.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Remover
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>
      {/* Empty State */}
      {workflows.length === 0 && (
        <Card className="p-12">
          <div className="text-center">
            <Workflow className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhum workflow configurado</h3>
            <p className="text-gray-600 mb-6">
              Crie workflows para automatizar ações baseadas no comportamento do lead
            </p>
            <Button onClick={() => setShowCreateModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Criar Primeiro Workflow
            </Button>
          </div>
        </Card>
      )}
      {/* Create Workflow Modal */}
      {showCreateModal && (
        <Modal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          title="Criar Workflow para Lead"
          size="lg"
        >
          <div className="p-6">
            <div className="text-center">
              <Workflow className="w-16 h-16 text-blue-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Criar Novo Workflow</h3>
              <p className="text-gray-600 mb-6">
                Configure um workflow personalizado para automatizar ações com este lead
              </p>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Nome do workflow"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <textarea
                  placeholder="Descrição do workflow"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowCreateModal(false)}
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={() => handleCreateWorkflow({
                      name: 'Novo Workflow',
                      description: 'Workflow personalizado',
                      trigger: { type: 'manual' },
                      steps: [],
                      is_active: true
                    })}
                  >
                    Criar Workflow
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}
      {/* Workflow Details Modal */}
      {showWorkflowModal && selectedWorkflow && (
        <Modal
          isOpen={showWorkflowModal}
          onClose={() => {
            setShowWorkflowModal(false);
            setSelectedWorkflow(null);
          }}
          title={selectedWorkflow.name}
          size="xl"
        >
          <div className="p-6">
            <div className="space-y-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Descrição</h4>
                <p className="text-gray-600">{selectedWorkflow.description}</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Etapas do Workflow</h4>
                <div className="space-y-3">
                  {selectedWorkflow.steps.map((step, index) => (
                    <div key={step.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-medium text-blue-600">
                        {index + 1}
                      </div>
                      <div className={cn("p-2 rounded-lg", getStepColor(step.type))}>
                        {getStepIcon(step.type)}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{step.name}</p>
                        <p className="text-sm text-gray-600">{step.type}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowWorkflowModal(false);
                    setSelectedWorkflow(null);
                  }}
                >
                  Fechar
                </Button>
                <Button
                  onClick={() => handleTriggerWorkflow(selectedWorkflow)}
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Executar Workflow
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
export default LeadWorkflowIntegration;
