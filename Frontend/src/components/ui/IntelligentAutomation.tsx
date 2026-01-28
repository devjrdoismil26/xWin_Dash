/**
 * Intelligent Automation - Sistema de Automação Inteligente
 * Componente para criar, gerenciar e monitorar automações baseadas em IA
 */
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bot,
  Zap,
  Play,
  Pause,
  Square,
  Settings,
  Plus,
  Trash2,
  Edit,
  Eye,
  Clock,
  CheckCircle,
  AlertTriangle,
  Brain,
  Target,
  Activity,
  TrendingUp,
  Users,
  Mail,
  MessageSquare,
  Calendar,
  Filter,
  Search,
  RefreshCw,
  Download,
  Upload
} from 'lucide-react';
import Card from './Card';
import Button from './Button';
import Badge from './Badge';
import Input from './Input';
import Select from './Select';
import { ENHANCED_TRANSITIONS, VISUAL_EFFECTS } from './design-tokens';

export interface AutomationRule {
  id: string;
  name: string;
  description: string;
  trigger: {
    type: 'event' | 'schedule' | 'condition' | 'webhook';
    config: any;
  };
  actions: Array<{
    type: 'email' | 'notification' | 'webhook' | 'data_update' | 'ai_analysis';
    config: any;
  }>;
  conditions?: Array<{
    field: string;
    operator: 'equals' | 'contains' | 'greater_than' | 'less_than';
    value: any;
  }>;
  status: 'active' | 'paused' | 'draft' | 'error';
  lastRun?: string;
  nextRun?: string;
  runCount: number;
  successRate: number;
  createdAt: string;
  updatedAt: string;
  tags?: string[];
  priority: 'low' | 'medium' | 'high' | 'critical';
}

export interface AutomationStats {
  total: number;
  active: number;
  paused: number;
  errors: number;
  totalRuns: number;
  successRate: number;
  avgExecutionTime: number;
  topPerforming: AutomationRule[];
  recentActivity: Array<{
    id: string;
    ruleId: string;
    ruleName: string;
    action: 'created' | 'updated' | 'executed' | 'paused' | 'resumed' | 'error';
    timestamp: string;
    details?: string;
  }>;
}

export interface IntelligentAutomationProps {
  rules?: AutomationRule[];
  stats?: AutomationStats;
  loading?: boolean;
  error?: string;
  onCreateRule?: (rule: Omit<AutomationRule, 'id' | 'createdAt' | 'updatedAt' | 'runCount' | 'successRate'>) => void;
  onUpdateRule?: (id: string, rule: Partial<AutomationRule>) => void;
  onDeleteRule?: (id: string) => void;
  onToggleRule?: (id: string) => void;
  onExecuteRule?: (id: string) => void;
  onRefresh?: () => void;
  className?: string;
}

const IntelligentAutomation: React.FC<IntelligentAutomationProps> = ({
  rules = [],
  stats,
  loading = false,
  error,
  onCreateRule,
  onUpdateRule,
  onDeleteRule,
  onToggleRule,
  onExecuteRule,
  onRefresh,
  className = ''
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'rules' | 'analytics' | 'templates'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedRule, setSelectedRule] = useState<AutomationRule | null>(null);

  // Memoized filtered rules
  const filteredRules = useMemo(() => {
    return rules.filter(rule => {
      const matchesSearch = rule.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           rule.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || rule.status === statusFilter;
      const matchesPriority = priorityFilter === 'all' || rule.priority === priorityFilter;
      
      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [rules, searchTerm, statusFilter, priorityFilter]);

  // Memoized stats calculations
  const automationStats = useMemo(() => {
    if (!stats) {
      return {
        total: rules.length,
        active: rules.filter(r => r.status === 'active').length,
        paused: rules.filter(r => r.status === 'paused').length,
        errors: rules.filter(r => r.status === 'error').length,
        totalRuns: rules.reduce((sum, r) => sum + r.runCount, 0),
        successRate: rules.length > 0 ? rules.reduce((sum, r) => sum + r.successRate, 0) / rules.length : 0
      };
    }
    return stats;
  }, [rules, stats]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Play className="w-4 h-4 text-green-500" />;
      case 'paused': return <Pause className="w-4 h-4 text-yellow-500" />;
      case 'draft': return <Edit className="w-4 h-4 text-blue-500" />;
      case 'error': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default: return <Square className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-50 border-green-200';
      case 'paused': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'draft': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'error': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'destructive';
      case 'high': return 'secondary';
      case 'medium': return 'outline';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  const getTriggerIcon = (type: string) => {
    switch (type) {
      case 'event': return <Activity className="w-4 h-4" />;
      case 'schedule': return <Clock className="w-4 h-4" />;
      case 'condition': return <Filter className="w-4 h-4" />;
      case 'webhook': return <Zap className="w-4 h-4" />;
      default: return <Bot className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR');
  };

  if (loading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-32 bg-gray-200 rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="backdrop-blur-xl bg-white/10 dark:bg-gray-900/10 border border-white/20 dark:border-gray-700/20 rounded-2xl p-6 shadow-xl shadow-blue-500/10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <Bot className="w-8 h-8 text-blue-600" />
              Automação Inteligente
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Gerencie automações baseadas em IA para otimizar seus processos
            </p>
          </div>
          <div className="flex items-center gap-3">
            {onRefresh && (
              <Button
                variant="outline"
                size="sm"
                onClick={onRefresh}
                className={ENHANCED_TRANSITIONS.button}
              >
                <RefreshCw className="w-4 h-4" />
              </Button>
            )}
            {onCreateRule && (
              <Button
                onClick={() => setShowCreateModal(true)}
                className={ENHANCED_TRANSITIONS.button}
              >
                <Plus className="w-4 h-4 mr-2" />
                Nova Automação
              </Button>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {automationStats.total}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {automationStats.active}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Ativas</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {automationStats.paused}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Pausadas</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {automationStats.successRate.toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Taxa de Sucesso</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
        {[
          { id: 'overview', label: 'Visão Geral', icon: <Brain className="w-4 h-4" /> },
          { id: 'rules', label: 'Regras', icon: <Bot className="w-4 h-4" /> },
          { id: 'analytics', label: 'Analytics', icon: <TrendingUp className="w-4 h-4" /> },
          { id: 'templates', label: 'Templates', icon: <Settings className="w-4 h-4" /> }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-white dark:bg-gray-700 text-blue-600 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Recent Activity */}
            {stats?.recentActivity && (
              <Card className="backdrop-blur-xl bg-white/10 dark:bg-gray-900/10 border border-white/20 dark:border-gray-700/20 hover:bg-white/20 dark:hover:bg-gray-900/20 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10">
                <Card.Header>
                  <Card.Title className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-blue-600" />
                    Atividade Recente
                  </Card.Title>
                </Card.Header>
                <Card.Content>
                  <div className="space-y-3">
                    {stats.recentActivity.slice(0, 5).map((activity) => (
                      <div key={activity.id} className="flex items-center gap-3 p-3 rounded-lg bg-white/50 dark:bg-gray-800/50">
                        <div className="flex-shrink-0">
                          {getStatusIcon(activity.action)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-900 dark:text-white">
                              {activity.ruleName}
                            </span>
                            <Badge variant="outline" className="text-xs">
                              {activity.action}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {formatDate(activity.timestamp)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card.Content>
              </Card>
            )}

            {/* Top Performing Rules */}
            {stats?.topPerforming && (
              <Card className="backdrop-blur-xl bg-white/10 dark:bg-gray-900/10 border border-white/20 dark:border-gray-700/20 hover:bg-white/20 dark:hover:bg-gray-900/20 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10">
                <Card.Header>
                  <Card.Title className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-green-600" />
                    Melhores Performances
                  </Card.Title>
                </Card.Header>
                <Card.Content>
                  <div className="space-y-3">
                    {stats.topPerforming.slice(0, 3).map((rule) => (
                      <div key={rule.id} className="flex items-center justify-between p-3 rounded-lg bg-white/50 dark:bg-gray-800/50">
                        <div className="flex items-center gap-3">
                          <div className="flex-shrink-0">
                            {getStatusIcon(rule.status)}
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white">
                              {rule.name}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {rule.runCount} execuções
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-green-600">
                            {rule.successRate.toFixed(1)}%
                          </div>
                          <div className="text-xs text-gray-500">Taxa de sucesso</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card.Content>
              </Card>
            )}
          </motion.div>
        )}

        {activeTab === 'rules' && (
          <motion.div
            key="rules"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Filters */}
            <Card className="backdrop-blur-xl bg-white/10 dark:bg-gray-900/10 border border-white/20 dark:border-gray-700/20">
              <Card.Content className="p-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <Input
                      placeholder="Buscar automações..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <option value="all">Todos os status</option>
                    <option value="active">Ativas</option>
                    <option value="paused">Pausadas</option>
                    <option value="draft">Rascunho</option>
                    <option value="error">Erro</option>
                  </Select>
                  <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                    <option value="all">Todas as prioridades</option>
                    <option value="critical">Crítica</option>
                    <option value="high">Alta</option>
                    <option value="medium">Média</option>
                    <option value="low">Baixa</option>
                  </Select>
                </div>
              </Card.Content>
            </Card>

            {/* Rules List */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AnimatePresence>
                {filteredRules.map((rule, index) => (
                  <motion.div
                    key={rule.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className={`p-6 backdrop-blur-xl bg-white/10 dark:bg-gray-900/10 border border-white/20 dark:border-gray-700/20 hover:bg-white/20 dark:hover:bg-gray-900/20 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 ${getStatusColor(rule.status)}`}>
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(rule.status)}
                          <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                              {rule.name}
                            </h3>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant={getPriorityColor(rule.priority)}>
                                {rule.priority}
                              </Badge>
                              <Badge variant="outline">
                                {rule.trigger.type}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {onToggleRule && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => onToggleRule(rule.id)}
                              className={ENHANCED_TRANSITIONS.button}
                            >
                              {rule.status === 'active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                            </Button>
                          )}
                          {onExecuteRule && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => onExecuteRule(rule.id)}
                              className={ENHANCED_TRANSITIONS.button}
                            >
                              <Zap className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>

                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        {rule.description}
                      </p>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <div className="text-sm text-gray-500">Execuções</div>
                          <div className="text-lg font-semibold text-gray-900 dark:text-white">
                            {rule.runCount}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Taxa de Sucesso</div>
                          <div className="text-lg font-semibold text-green-600">
                            {rule.successRate.toFixed(1)}%
                          </div>
                        </div>
                      </div>

                      {rule.lastRun && (
                        <div className="text-xs text-gray-500 mb-4">
                          Última execução: {formatDate(rule.lastRun)}
                        </div>
                      )}

                      <div className="flex items-center gap-2">
                        {onUpdateRule && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedRule(rule)}
                            className={ENHANCED_TRANSITIONS.button}
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            Editar
                          </Button>
                        )}
                        {onDeleteRule && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onDeleteRule(rule.id)}
                            className={`text-red-600 hover:text-red-700 ${ENHANCED_TRANSITIONS.button}`}
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            Excluir
                          </Button>
                        )}
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {activeTab === 'analytics' && (
          <motion.div
            key="analytics"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <Card className="backdrop-blur-xl bg-white/10 dark:bg-gray-900/10 border border-white/20 dark:border-gray-700/20 hover:bg-white/20 dark:hover:bg-gray-900/20 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10">
              <Card.Header>
                <Card.Title className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  Analytics de Automação
                </Card.Title>
              </Card.Header>
              <Card.Content>
                <div className="text-center py-12">
                  <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Analytics em Desenvolvimento
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Gráficos e análises detalhadas serão implementados na próxima versão
                  </p>
                </div>
              </Card.Content>
            </Card>
          </motion.div>
        )}

        {activeTab === 'templates' && (
          <motion.div
            key="templates"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <Card className="backdrop-blur-xl bg-white/10 dark:bg-gray-900/10 border border-white/20 dark:border-gray-700/20 hover:bg-white/20 dark:hover:bg-gray-900/20 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10">
              <Card.Header>
                <Card.Title className="flex items-center gap-2">
                  <Settings className="w-5 h-5 text-blue-600" />
                  Templates de Automação
                </Card.Title>
              </Card.Header>
              <Card.Content>
                <div className="text-center py-12">
                  <Settings className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Templates em Desenvolvimento
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Templates pré-configurados serão implementados na próxima versão
                  </p>
                </div>
              </Card.Content>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default IntelligentAutomation;
