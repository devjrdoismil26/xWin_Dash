import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '../../../hooks/useTranslation';
import { useFormValidation } from '../../../hooks/useFormValidation';
import { useAdvancedNotifications } from '../../../hooks/useAdvancedNotifications';
import { useLoadingStates } from '../../../hooks/useLoadingStates';
import {
  Workflow, Play, Pause, Square, RotateCcw, Zap, Clock, Calendar,
  Target, Users, Mail, Phone, MessageSquare, Bell, Database,
  Filter, Search, Plus, Edit2, Copy, Trash2, Eye, Settings,
  ArrowRight, ArrowDown, GitBranch, Shuffle, Split, Merge,
  CheckCircle2, XCircle, AlertCircle, Activity, BarChart3,
  TrendingUp, TrendingDown, Repeat, Timer, Cpu, Brain, Robot,
  Globe, Cloud, Server, Code, FileText, Image, Video, Mic,
  Star, Heart, Share2, Download, Upload, Send, Inbox, Outbox,
  UserPlus, UserMinus, ShoppingCart, Package, CreditCard,
  Sparkles, Wand2, Layers, Grid, List, Calendar as Calendar
} from 'lucide-react';
// Design System
import { ENHANCED_TRANSITIONS, VISUAL_EFFECTS } from '@/components/ui/design-tokens';
// Interfaces
interface WorkflowNode {
  id: string;
  type: 'trigger' | 'condition' | 'action' | 'delay' | 'split' | 'merge';
  name: string;
  description: string;
  config: Record<string, any>;
  position: { x: number; y: number };
  connections: string[];
  status?: 'success' | 'error' | 'running' | 'pending';
  executionCount?: number;
  lastExecution?: string;
}
interface Workflow {
  id: string;
  name: string;
  description: string;
  category: string;
  status: 'active' | 'inactive' | 'draft' | 'error';
  trigger: WorkflowTrigger;
  nodes: WorkflowNode[];
  connections: WorkflowConnection[];
  analytics: WorkflowAnalytics;
  settings: WorkflowSettings;
  createdAt: string;
  updatedAt: string;
  lastRun?: string;
  totalRuns: number;
  successRate: number;
}
interface WorkflowTrigger {
  type: 'schedule' | 'webhook' | 'email' | 'user_action' | 'data_change' | 'form_submit';
  config: Record<string, any>;
  conditions?: TriggerCondition[];
}
interface TriggerCondition {
  field: string;
  operator: 'equals' | 'contains' | 'greater' | 'less' | 'exists';
  value: any;
}
interface WorkflowConnection {
  id: string;
  source: string;
  target: string;
  condition?: string;
  label?: string;
}
interface WorkflowAnalytics {
  totalExecutions: number;
  successfulExecutions: number;
  failedExecutions: number;
  averageExecutionTime: number;
  lastExecutionTime: string;
  performanceData: { date: string; executions: number; success: number }[];
  bottlenecks: { nodeId: string; averageTime: number }[];
}
interface WorkflowSettings {
  retryAttempts: number;
  timeout: number;
  concurrency: number;
  errorHandling: 'stop' | 'continue' | 'retry';
  notifications: {
    onSuccess: boolean;
    onFailure: boolean;
    channels: string[];
  };
}
interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  complexity: 'simple' | 'medium' | 'complex';
  estimatedTime: number;
  nodes: Partial<WorkflowNode>[];
  usageCount: number;
  rating: number;
  preview: string;
}
interface WorkflowExecution {
  id: string;
  workflowId: string;
  status: 'running' | 'completed' | 'failed' | 'cancelled';
  startTime: string;
  endTime?: string;
  duration?: number;
  trigger: string;
  stepResults: StepResult[];
  error?: string;
}
interface StepResult {
  nodeId: string;
  status: 'success' | 'error' | 'skipped';
  startTime: string;
  endTime: string;
  duration: number;
  input: any;
  output: any;
  error?: string;
}
const AdvancedWorkflowDashboard: React.FC = () => {
  const { t } = useTranslation();
  const { showNotification, showError, showSuccess } = useAdvancedNotifications();
  const { isLoading, setLoading } = useLoadingStates();
  // Estados principais
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [templates, setTemplates] = useState<WorkflowTemplate[]>([]);
  const [executions, setExecutions] = useState<WorkflowExecution[]>([]);
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'analytics'>('grid');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showBuilder, setShowBuilder] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  // Templates de workflow
  const workflowTemplates: WorkflowTemplate[] = [
    {
      id: '1',
      name: 'Lead Qualification Automation',
      description: 'Automatically score and route new leads based on predefined criteria',
      category: 'Sales',
      complexity: 'medium',
      estimatedTime: 15,
      nodes: [
        { type: 'trigger', name: 'New Lead Created' },
        { type: 'condition', name: 'Check Lead Score' },
        { type: 'action', name: 'Assign to Sales Rep' },
        { type: 'action', name: 'Send Welcome Email' }
      ],
      usageCount: 234,
      rating: 4.8,
      preview: '/workflow-previews/lead-qualification.png'
    },
    {
      id: '2',
      name: 'Customer Onboarding Flow',
      description: 'Complete onboarding sequence for new customers',
      category: 'Customer Success',
      complexity: 'complex',
      estimatedTime: 30,
      nodes: [
        { type: 'trigger', name: 'Customer Signs Up' },
        { type: 'action', name: 'Create Account' },
        { type: 'delay', name: 'Wait 1 Hour' },
        { type: 'action', name: 'Send Welcome Email' },
        { type: 'condition', name: 'Check Activity' }
      ],
      usageCount: 156,
      rating: 4.9,
      preview: '/workflow-previews/customer-onboarding.png'
    },
    {
      id: '3',
      name: 'Content Publishing Pipeline',
      description: 'Automated content review, approval and publishing workflow',
      category: 'Content',
      complexity: 'medium',
      estimatedTime: 20,
      nodes: [
        { type: 'trigger', name: 'Content Submitted' },
        { type: 'action', name: 'Send for Review' },
        { type: 'condition', name: 'Approval Status' },
        { type: 'action', name: 'Publish Content' }
      ],
      usageCount: 89,
      rating: 4.6,
      preview: '/workflow-previews/content-publishing.png'
    }
  ];
  // Dados simulados
  useEffect(() => {
    const loadData = async () => {
      setLoading('workflows', true);
      await new Promise(resolve => setTimeout(resolve, 1500));
      const mockWorkflows: Workflow[] = [
        {
          id: '1',
          name: 'Lead Nurturing Campaign',
          description: 'Automated email sequence for new leads with personalized content based on interests',
          category: 'Marketing',
          status: 'active',
          trigger: {
            type: 'user_action',
            config: {
              action: 'form_submit',
              form: 'newsletter_signup'
            }
          },
          nodes: [
            {
              id: 'trigger1',
              type: 'trigger',
              name: 'Form Submitted',
              description: 'Newsletter signup form',
              config: { form: 'newsletter_signup' },
              position: { x: 100, y: 100 },
              connections: ['condition1'],
              status: 'success',
              executionCount: 156,
              lastExecution: '2024-01-20T14:30:00Z'
            },
            {
              id: 'condition1',
              type: 'condition',
              name: 'Check Lead Score',
              description: 'Verify if lead score > 50',
              config: { field: 'score', operator: 'greater', value: 50 },
              position: { x: 300, y: 100 },
              connections: ['action1', 'action2'],
              status: 'success',
              executionCount: 134,
              lastExecution: '2024-01-20T14:30:00Z'
            },
            {
              id: 'action1',
              type: 'action',
              name: 'Send Welcome Email',
              description: 'High-value lead welcome sequence',
              config: { template: 'welcome_premium', delay: 0 },
              position: { x: 500, y: 50 },
              connections: ['delay1'],
              status: 'success',
              executionCount: 89,
              lastExecution: '2024-01-20T14:30:00Z'
            },
            {
              id: 'action2',
              type: 'action',
              name: 'Send Basic Email',
              description: 'Standard welcome sequence',
              config: { template: 'welcome_basic', delay: 0 },
              position: { x: 500, y: 150 },
              connections: ['delay1'],
              status: 'success',
              executionCount: 45,
              lastExecution: '2024-01-20T14:30:00Z'
            },
            {
              id: 'delay1',
              type: 'delay',
              name: 'Wait 3 Days',
              description: 'Delay before follow-up',
              config: { duration: 3, unit: 'days' },
              position: { x: 700, y: 100 },
              connections: ['action3'],
              status: 'running',
              executionCount: 134,
              lastExecution: '2024-01-20T14:30:00Z'
            }
          ],
          connections: [
            { id: 'c1', source: 'trigger1', target: 'condition1' },
            { id: 'c2', source: 'condition1', target: 'action1', condition: 'score > 50', label: 'High Score' },
            { id: 'c3', source: 'condition1', target: 'action2', condition: 'score <= 50', label: 'Low Score' },
            { id: 'c4', source: 'action1', target: 'delay1' },
            { id: 'c5', source: 'action2', target: 'delay1' }
          ],
          analytics: {
            totalExecutions: 1567,
            successfulExecutions: 1456,
            failedExecutions: 111,
            averageExecutionTime: 45.2,
            lastExecutionTime: '2024-01-20T14:30:00Z',
            performanceData: [
              { date: '2024-01-15', executions: 89, success: 82 },
              { date: '2024-01-16', executions: 95, success: 89 },
              { date: '2024-01-17', executions: 78, success: 74 },
              { date: '2024-01-18', executions: 112, success: 105 },
              { date: '2024-01-19', executions: 134, success: 128 },
              { date: '2024-01-20', executions: 156, success: 145 }
            ],
            bottlenecks: [
              { nodeId: 'condition1', averageTime: 2.3 },
              { nodeId: 'action1', averageTime: 1.8 }
            ]
          },
          settings: {
            retryAttempts: 3,
            timeout: 300,
            concurrency: 10,
            errorHandling: 'retry',
            notifications: {
              onSuccess: false,
              onFailure: true,
              channels: ['email', 'slack']
            }
          },
          createdAt: '2024-01-10T10:00:00Z',
          updatedAt: '2024-01-20T12:00:00Z',
          lastRun: '2024-01-20T14:30:00Z',
          totalRuns: 1567,
          successRate: 92.9
        },
        {
          id: '2',
          name: 'Order Processing Automation',
          description: 'Complete order fulfillment workflow from payment to shipping',
          category: 'E-commerce',
          status: 'active',
          trigger: {
            type: 'webhook',
            config: {
              url: '/webhooks/payment-success',
              method: 'POST'
            }
          },
          nodes: [
            {
              id: 'trigger2',
              type: 'trigger',
              name: 'Payment Received',
              description: 'Payment webhook trigger',
              config: { webhook: 'payment_success' },
              position: { x: 100, y: 100 },
              connections: ['action4'],
              status: 'success',
              executionCount: 89,
              lastExecution: '2024-01-20T13:15:00Z'
            }
          ],
          connections: [],
          analytics: {
            totalExecutions: 892,
            successfulExecutions: 876,
            failedExecutions: 16,
            averageExecutionTime: 23.5,
            lastExecutionTime: '2024-01-20T13:15:00Z',
            performanceData: [],
            bottlenecks: []
          },
          settings: {
            retryAttempts: 5,
            timeout: 600,
            concurrency: 5,
            errorHandling: 'stop',
            notifications: {
              onSuccess: true,
              onFailure: true,
              channels: ['email']
            }
          },
          createdAt: '2024-01-05T08:00:00Z',
          updatedAt: '2024-01-18T16:00:00Z',
          lastRun: '2024-01-20T13:15:00Z',
          totalRuns: 892,
          successRate: 98.2
        }
      ];
      setWorkflows(mockWorkflows);
      setTemplates(workflowTemplates);
      // Mock executions
      setExecutions([
        {
          id: '1',
          workflowId: '1',
          status: 'completed',
          startTime: '2024-01-20T14:30:00Z',
          endTime: '2024-01-20T14:32:15Z',
          duration: 135,
          trigger: 'Form Submitted',
          stepResults: [
            {
              nodeId: 'trigger1',
              status: 'success',
              startTime: '2024-01-20T14:30:00Z',
              endTime: '2024-01-20T14:30:01Z',
              duration: 1,
              input: { email: 'user@example.com', score: 75 },
              output: { leadId: '12345' }
            }
          ]
        }
      ]);
      setLoading('workflows', false);
    };
    loadData();
  }, [setLoading]);
  // Estatísticas agregadas
  const workflowStats = useMemo(() => {
    const totalWorkflows = workflows.length;
    const activeWorkflows = workflows.filter(w => w.status === 'active').length;
    const totalExecutions = workflows.reduce((sum, w) => sum + w.totalRuns, 0);
    const averageSuccessRate = workflows.reduce((sum, w) => sum + w.successRate, 0) / workflows.length;
    return {
      totalWorkflows,
      activeWorkflows,
      totalExecutions,
      averageSuccessRate: Math.round(averageSuccessRate * 10) / 10
    };
  }, [workflows]);
  // Filtros
  const filteredWorkflows = useMemo(() => {
    return workflows.filter(workflow => {
      const matchesCategory = filterCategory === 'all' || workflow.category === filterCategory;
      const matchesStatus = filterStatus === 'all' || workflow.status === filterStatus;
      const matchesSearch = workflow.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          workflow.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesStatus && matchesSearch;
    });
  }, [workflows, filterCategory, filterStatus, searchQuery]);
  // Handlers
  const handleWorkflowAction = useCallback(async (action: string, workflowId: string) => {
    setLoading(action, true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      switch (action) {
        case 'activate':
          setWorkflows(prev => prev.map(w => 
            w.id === workflowId ? { ...w, status: 'active' as const } : w
          ));
          showSuccess('Workflow ativado');
          break;
        case 'pause':
          setWorkflows(prev => prev.map(w => 
            w.id === workflowId ? { ...w, status: 'inactive' as const } : w
          ));
          showSuccess('Workflow pausado');
          break;
        case 'duplicate':
          showSuccess('Workflow duplicado');
          break;
        case 'delete':
          if (window.confirm('Confirma exclusão do workflow?')) {
            setWorkflows(prev => prev.filter(w => w.id !== workflowId));
            showSuccess('Workflow excluído');
          }
          break;
        case 'test':
          showSuccess('Teste do workflow iniciado');
          break;
        default:
          showSuccess('Ação executada com sucesso');
      }
    } catch (error) {
      showError('Erro ao executar ação');
    } finally {
      setLoading(action, false);
    }
  }, [setLoading, showSuccess, showError]);
  const handleUseTemplate = useCallback((template: WorkflowTemplate) => {
    showSuccess(`Template "${template.name}" aplicado! Customize conforme necessário.`);
    setShowBuilder(true);
    setShowTemplates(false);
  }, [showSuccess]);
  const getStatusColor = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
      draft: 'bg-yellow-100 text-yellow-800',
      error: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };
  const getStatusIcon = (status: string) => {
    const icons = {
      active: Play,
      inactive: Pause,
      draft: FileText,
      error: XCircle
    };
    return icons[status] || Pause;
  };
  const getNodeIcon = (type: string) => {
    const icons = {
      trigger: Zap,
      condition: GitBranch,
      action: Settings,
      delay: Clock,
      split: Split,
      merge: Merge
    };
    return icons[type] || Settings;
  };
  const getComplexityColor = (complexity: string) => {
    const colors = {
      simple: 'text-green-600',
      medium: 'text-yellow-600',
      complex: 'text-red-600'
    };
    return colors[complexity] || 'text-gray-600';
  };
  if (isLoading.workflows) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          <span className="text-gray-600">Carregando workflows...</span>
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-6 p-6">
      {/* Header Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-xl p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100">Total Workflows</p>
              <p className="text-3xl font-bold">{workflowStats.totalWorkflows}</p>
              <p className="text-sm text-purple-200 mt-1">
                {workflowStats.activeWorkflows} ativos
              </p>
            </div>
            <Workflow className="h-8 w-8 text-purple-200" />
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="backdrop-blur-xl bg-white/10 dark:bg-gray-900/10 border border-white/20 dark:border-gray-700/20 rounded-xl shadow-xl shadow-blue-500/10 hover:bg-white/20 dark:hover:bg-gray-900/20 transition-all duration-300 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Execuções Totais</p>
              <p className="text-2xl font-bold text-gray-900">
                {workflowStats.totalExecutions.toLocaleString()}
              </p>
              <p className="text-sm text-blue-600 mt-1">Este mês</p>
            </div>
            <Activity className="h-6 w-6 text-blue-600" />
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="backdrop-blur-xl bg-white/10 dark:bg-gray-900/10 border border-white/20 dark:border-gray-700/20 rounded-xl shadow-xl shadow-blue-500/10 hover:bg-white/20 dark:hover:bg-gray-900/20 transition-all duration-300 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Taxa de Sucesso</p>
              <p className="text-2xl font-bold text-gray-900">
                {workflowStats.averageSuccessRate}%
              </p>
              <p className="text-sm text-green-600 mt-1">Média geral</p>
            </div>
            <CheckCircle2 className="h-6 w-6 text-green-600" />
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="backdrop-blur-xl bg-white/10 dark:bg-gray-900/10 border border-white/20 dark:border-gray-700/20 rounded-xl shadow-xl shadow-blue-500/10 hover:bg-white/20 dark:hover:bg-gray-900/20 transition-all duration-300 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Tempo Médio</p>
              <p className="text-2xl font-bold text-gray-900">2.5min</p>
              <p className="text-sm text-purple-600 mt-1">Por execução</p>
            </div>
            <Timer className="h-6 w-6 text-purple-600" />
          </div>
        </motion.div>
      </div>
      {/* Controles */}
      <div className="backdrop-blur-xl bg-white/10 dark:bg-gray-900/10 border border-white/20 dark:border-gray-700/20 rounded-xl shadow-xl shadow-blue-500/10 hover:bg-white/20 dark:hover:bg-gray-900/20 transition-all duration-300 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar workflows..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">Todas Categorias</option>
              <option value="Marketing">Marketing</option>
              <option value="Sales">Vendas</option>
              <option value="E-commerce">E-commerce</option>
              <option value="Customer Success">Customer Success</option>
              <option value="Content">Conteúdo</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">Todos Status</option>
              <option value="active">Ativo</option>
              <option value="inactive">Inativo</option>
              <option value="draft">Rascunho</option>
              <option value="error">Erro</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' 
                  ? 'bg-white shadow-sm text-purple-600' 
                  : 'text-gray-600 hover:text-gray-800'}`}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' 
                  ? 'bg-white shadow-sm text-purple-600' 
                  : 'text-gray-600 hover:text-gray-800'}`}
              >
                <List className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('analytics')}
                className={`p-2 rounded ${viewMode === 'analytics' 
                  ? 'bg-white shadow-sm text-purple-600' 
                  : 'text-gray-600 hover:text-gray-800'}`}
              >
                <BarChart3 className="h-4 w-4" />
              </button>
            </div>
            <button
              onClick={() => setShowTemplates(true)}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 px-3 py-2 border border-gray-300 rounded-lg transition-colors"
            >
              <Layers className="h-4 w-4" />
              <span>Templates</span>
            </button>
            <button
              onClick={() => setShowAIAssistant(!showAIAssistant)}
              className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all"
            >
              <Brain className="h-4 w-4" />
              <span>AI Builder</span>
            </button>
            <button
              onClick={() => setShowBuilder(true)}
              className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Novo Workflow</span>
            </button>
          </div>
        </div>
      </div>
      {/* Workflows Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredWorkflows.map((workflow, index) => {
            const StatusIcon = getStatusIcon(workflow.status);
            return (
              <motion.div
                key={workflow.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
                className="backdrop-blur-xl bg-white/10 dark:bg-gray-900/10 border border-white/20 dark:border-gray-700/20 rounded-xl shadow-xl shadow-blue-500/10 hover:bg-white/20 dark:hover:bg-gray-900/20 transition-all duration-300 overflow-hidden hover:shadow-2xl hover:shadow-blue-500/20"
              >
                {/* Workflow Header */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold text-gray-900 text-lg leading-tight">
                          {workflow.name}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusColor(workflow.status)}`}>
                          <StatusIcon className="h-3 w-3" />
                          <span>{workflow.status}</span>
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                        {workflow.description}
                      </p>
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          {workflow.category}
                        </span>
                        <span className="text-xs text-gray-500">
                          {workflow.nodes.length} etapas
                        </span>
                      </div>
                    </div>
                  </div>
                  {/* Workflow Nodes Preview */}
                  <div className="mb-4">
                    <div className="flex items-center space-x-2 overflow-x-auto pb-2">
                      {workflow.nodes.slice(0, 5).map((node, nodeIndex) => {
                        const NodeIcon = getNodeIcon(node.type);
                        return (
                          <div key={node.id} className="flex items-center space-x-1 flex-shrink-0">
                            <div className={`p-2 rounded-lg ${
                              node.status === 'success' ? 'bg-green-100 text-green-600' :
                              node.status === 'error' ? 'bg-red-100 text-red-600' :
                              node.status === 'running' ? 'bg-blue-100 text-blue-600' :
                              'bg-gray-100 text-gray-600'
                            }`}>
                              <NodeIcon className="h-3 w-3" />
                            </div>
                            {nodeIndex < Math.min(workflow.nodes.length - 1, 4) && (
                              <ArrowRight className="h-3 w-3 text-gray-400" />
                            )}
                          </div>
                        );
                      })}
                      {workflow.nodes.length > 5 && (
                        <span className="text-xs text-gray-500 flex-shrink-0">
                          +{workflow.nodes.length - 5} mais
                        </span>
                      )}
                    </div>
                  </div>
                  {/* Performance Metrics */}
                  <div className="grid grid-cols-3 gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
                    <div className="text-center">
                      <div className="font-semibold text-sm text-gray-900">{workflow.totalRuns}</div>
                      <div className="text-xs text-gray-600">Execuções</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-sm text-gray-900">{workflow.successRate}%</div>
                      <div className="text-xs text-gray-600">Sucesso</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-sm text-gray-900">
                        {workflow.analytics.averageExecutionTime}s
                      </div>
                      <div className="text-xs text-gray-600">Tempo Médio</div>
                    </div>
                  </div>
                  {/* Last Run */}
                  {workflow.lastRun && (
                    <div className="text-xs text-gray-500 mb-4">
                      Última execução: {new Date(workflow.lastRun).toLocaleString()}
                    </div>
                  )}
                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setSelectedWorkflow(workflow)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setShowBuilder(true)}
                        className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleWorkflowAction('duplicate', workflow.id)}
                        className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleWorkflowAction('test', workflow.id)}
                        className="p-2 text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                      >
                        <Zap className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleWorkflowAction('delete', workflow.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    {workflow.status === 'active' ? (
                      <button
                        onClick={() => handleWorkflowAction('pause', workflow.id)}
                        className="flex items-center space-x-1 text-sm bg-orange-100 text-orange-700 px-3 py-1 rounded-lg hover:bg-orange-200 transition-colors"
                      >
                        <Pause className="h-3 w-3" />
                        <span>Pausar</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleWorkflowAction('activate', workflow.id)}
                        className="flex items-center space-x-1 text-sm bg-green-100 text-green-700 px-3 py-1 rounded-lg hover:bg-green-200 transition-colors"
                      >
                        <Play className="h-3 w-3" />
                        <span>Ativar</span>
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
      {/* Templates Modal */}
      <AnimatePresence>
        {showTemplates && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="backdrop-blur-xl bg-white/10 dark:bg-gray-900/10 border border-white/20 dark:border-gray-700/20 rounded-xl shadow-xl shadow-blue-500/10 p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Templates de Workflow</h2>
                <button
                  onClick={() => setShowTemplates(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors"
                >
                  <XCircle className="h-5 w-5" />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {templates.map((template) => (
                  <motion.div
                    key={template.id}
                    whileHover={{ scale: 1.02 }}
                    className="backdrop-blur-xl bg-white/10 dark:bg-gray-900/10 border border-white/20 dark:border-gray-700/20 rounded-lg shadow-xl shadow-blue-500/10 hover:bg-white/20 dark:hover:bg-gray-900/20 transition-all duration-300 overflow-hidden hover:shadow-2xl hover:shadow-blue-500/20 cursor-pointer"
                    onClick={() => handleUseTemplate(template)}
                  >
                    <div className="aspect-video bg-gradient-to-br from-purple-50 to-blue-50 p-4 flex items-center justify-center">
                      <div className="flex items-center space-x-2">
                        {template.nodes.slice(0, 3).map((node, index) => {
                          const NodeIcon = getNodeIcon(node.type || 'action');
                          return (
                            <div key={index} className="flex items-center space-x-1">
                              <div className="p-2 bg-white rounded-lg shadow-sm">
                                <NodeIcon className="h-4 w-4 text-purple-600" />
                              </div>
                              {index < 2 && <ArrowRight className="h-3 w-3 text-gray-400" />}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-900">{template.name}</h3>
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="text-sm text-gray-600">{template.rating}</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {template.description}
                      </p>
                      <div className="flex items-center justify-between text-sm">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                          {template.category}
                        </span>
                        <span className={`font-medium ${getComplexityColor(template.complexity)}`}>
                          {template.complexity}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
                        <span>{template.usageCount} usos</span>
                        <span>{template.estimatedTime} min setup</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* AI Assistant Sidebar */}
      <AnimatePresence>
        {showAIAssistant && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            className="fixed right-0 top-0 h-full w-80 bg-gradient-to-b from-purple-50 to-indigo-50 border-l border-gray-200 p-6 z-40 overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-gray-900 flex items-center space-x-2">
                <Brain className="h-5 w-5 text-purple-600" />
                <span>AI Workflow Builder</span>
              </h3>
              <button
                onClick={() => setShowAIAssistant(false)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
              >
                <XCircle className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="p-4 backdrop-blur-xl bg-white/10 dark:bg-gray-900/10 border border-white/20 dark:border-gray-700/20 rounded-lg shadow-xl shadow-blue-500/10">
                <h4 className="font-medium text-gray-900 mb-2 flex items-center space-x-2">
                  <Sparkles className="h-4 w-4 text-purple-600" />
                  <span>Sugestões Inteligentes</span>
                </h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Adicionar validação de email duplicado</li>
                  <li>• Implementar retry automático em falhas</li>
                  <li>• Criar branch para leads de alta qualidade</li>
                  <li>• Adicionar delay baseado em fuso horário</li>
                </ul>
              </div>
              <div className="p-4 backdrop-blur-xl bg-white/10 dark:bg-gray-900/10 border border-white/20 dark:border-gray-700/20 rounded-lg shadow-xl shadow-blue-500/10">
                <h4 className="font-medium text-gray-900 mb-2">Otimizações Recomendadas</h4>
                <div className="space-y-2">
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="text-sm font-medium text-yellow-800">Performance</div>
                    <div className="text-xs text-yellow-700">
                      Reduzir timeout do nó &quot;Check Lead Score&quot; de 30s para 10s
                    </div>
                  </div>
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="text-sm font-medium text-blue-800">Experiência</div>
                    <div className="text-xs text-blue-700">
                      Adicionar personalização baseada no score do lead
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-4 backdrop-blur-xl bg-white/10 dark:bg-gray-900/10 border border-white/20 dark:border-gray-700/20 rounded-lg shadow-xl shadow-blue-500/10">
                <h4 className="font-medium text-gray-900 mb-2">Criar Workflow com IA</h4>
                <textarea
                  placeholder="Descreva o workflow que você quer criar... Ex: 'Quando um lead se cadastra, verificar o score e enviar email personalizado'"
                  className="w-full p-3 border border-gray-300 rounded-lg text-sm"
                  rows={4}
                />
                <button className="w-full mt-3 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors">
                  Gerar Workflow
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Loading States */}
      {Object.entries(isLoading).some(([key, loading]) => loading && key !== 'workflows') && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 flex items-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
            <span className="text-gray-700">Processando workflow...</span>
          </div>
        </div>
      )}
    </div>
  );
};
export default AdvancedWorkflowDashboard;
