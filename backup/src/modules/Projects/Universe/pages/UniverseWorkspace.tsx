import React, { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import { 
  Sparkles, 
  ArrowLeft, 
  Save, 
  Play, 
  Pause, 
  Settings, 
  BarChart3, 
  Brain, 
  Zap, 
  LayoutGrid,
  Layers,
  Monitor,
  Activity,
  AlertCircle,
  CheckCircle,
  Clock,
  Users,
  Target,
  TrendingUp,
  Eye,
  Maximize2,
  Minimize2,
  RefreshCw,
  Download,
  Upload,
  Share2,
  MessageSquare,
  Bell,
  Search,
  Filter,
  Plus,
  Workflow,
  Database,
  Globe,
  Shield
} from 'lucide-react';
import AppLayout from '@/layouts/AppLayout';
import { Card } from "@/components/ui/Card";
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Progress from '@/components/ui/Progress';
import SimpleSelect from '@/components/ui/SimpleSelect';
// Importar o componente Universe principal
import Universe from '../index';
const UniverseWorkspace = ({ 
  project = null, 
  projectData = null, 
  isCreating = false,
  blocks = [],
  flows = [],
  connections = [],
  metrics = {}
}) => {
  const [activeTab, setActiveTab] = useState('canvas');
  const [isRunning, setIsRunning] = useState(false);
  const [systemStatus, setSystemStatus] = useState('idle');
  const [showDashboard, setShowDashboard] = useState(false);
  const [notifications, setNotifications] = useState([]);
  // Dados do projeto (criando ou existente)
  const currentProject = project || {
    name: projectData?.name || 'Novo Universe Project',
    description: projectData?.description || '',
    type: 'universe',
    status: 'draft',
    selectedBlocks: projectData?.selectedBlocks || [],
    aiLevel: projectData?.aiLevel || 'balanced'
  };
  const currentMetrics = metrics || {
    total_blocks: projectData?.selectedBlocks?.length || 0,
    active_flows: 0,
    total_executions: 0,
    success_rate: 0,
    ai_suggestions: 0,
    automations_running: 0
  };
  // Simular dados em tempo real
  useEffect(() => {
    const interval = setInterval(() => {
      if (isRunning) {
        setNotifications(prev => {
          const newNotification = {
            id: Date.now(),
            type: 'info',
            message: 'Bloco processado com sucesso',
            timestamp: new Date().toLocaleTimeString()
          };
          return [newNotification, ...prev.slice(0, 4)];
        });
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [isRunning]);
  const handleStartStop = () => {
    setIsRunning(!isRunning);
    setSystemStatus(isRunning ? 'idle' : 'running');
  };
  const handleSaveProject = async () => {
    // Implementar salvamento do projeto
  };
  const handleExportProject = () => {
    // Implementar exportação
  };
  const getStatusColor = (status) => {
    const colors = {
      'idle': 'bg-gray-100 text-gray-800',
      'running': 'bg-green-100 text-green-800',
      'error': 'bg-red-100 text-red-800',
      'warning': 'bg-yellow-100 text-yellow-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };
  const getStatusIcon = (status) => {
    const icons = {
      'idle': <Pause className="h-4 w-4" />,
      'running': <Play className="h-4 w-4" />,
      'error': <AlertCircle className="h-4 w-4" />,
      'warning': <AlertCircle className="h-4 w-4" />
    };
    return icons[status] || <Pause className="h-4 w-4" />;
  };
  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Head title={`${currentProject.name} - Universe Workspace`} />
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => router.visit('/projects')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">{currentProject.name}</h1>
                <p className="text-sm text-gray-600">{currentProject.description}</p>
              </div>
            </div>
            <Badge variant="primary" className="bg-gradient-to-r from-purple-500 to-pink-500">
              <Sparkles className="h-3 w-3 mr-1" />
              Universe
            </Badge>
          </div>
          <div className="flex items-center gap-3">
            {/* Status do Sistema */}
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={getStatusColor(systemStatus)}>
                {getStatusIcon(systemStatus)}
                {systemStatus}
              </Badge>
            </div>
            {/* Controles */}
            <Button
              variant={isRunning ? "destructive" : "success"}
              onClick={handleStartStop}
              className="flex items-center gap-2"
            >
              {isRunning ? (
                <>
                  <Pause className="h-4 w-4" />
                  Pausar
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" />
                  Executar
                </>
              )}
            </Button>
            <Button variant="outline" onClick={handleSaveProject}>
              <Save className="h-4 w-4 mr-2" />
              Salvar
            </Button>
            <SimpleSelect defaultValue="actions">
              <option value="actions" disabled>Ações</option>
              <option value="export">Exportar</option>
              <option value="duplicate">Duplicar</option>
              <option value="share">Compartilhar</option>
              <option value="settings">Configurações</option>
            </SimpleSelect>
          </div>
        </div>
      </div>
      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 px-6">
        <div className="flex items-center gap-6">
          <button
            onClick={() => setActiveTab('canvas')}
            className={`py-3 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'canvas'
                ? 'border-purple-500 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <LayoutGrid className="h-4 w-4 inline mr-2" />
            Canvas
          </button>
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`py-3 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'dashboard'
                ? 'border-purple-500 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <BarChart3 className="h-4 w-4 inline mr-2" />
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('flows')}
            className={`py-3 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'flows'
                ? 'border-purple-500 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Workflow className="h-4 w-4 inline mr-2" />
            Fluxos
          </button>
          <button
            onClick={() => setActiveTab('ai')}
            className={`py-3 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'ai'
                ? 'border-purple-500 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Brain className="h-4 w-4 inline mr-2" />
            IA Assistant
          </button>
          <button
            onClick={() => setActiveTab('monitoring')}
            className={`py-3 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'monitoring'
                ? 'border-purple-500 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Monitor className="h-4 w-4 inline mr-2" />
            Monitoramento
          </button>
        </div>
      </div>
      {/* Content */}
      <div className="flex-1 flex">
        {/* Main Content */}
        <div className="flex-1">
          {activeTab === 'canvas' && (
            <div className="h-full">
              <Universe />
            </div>
          )}
          {activeTab === 'dashboard' && (
            <div className="p-6 space-y-6">
              {/* Métricas do Projeto */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <Card.Content className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Blocos Ativos</p>
                        <p className="text-3xl font-bold text-gray-900">{currentMetrics.total_blocks}</p>
                      </div>
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <LayoutGrid className="h-6 w-6 text-blue-600" />
                      </div>
                    </div>
                  </Card.Content>
                </Card>
                <Card>
                  <Card.Content className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Fluxos Ativos</p>
                        <p className="text-3xl font-bold text-gray-900">{currentMetrics.active_flows}</p>
                      </div>
                      <div className="p-3 bg-green-50 rounded-lg">
                        <Workflow className="h-6 w-6 text-green-600" />
                      </div>
                    </div>
                  </Card.Content>
                </Card>
                <Card>
                  <Card.Content className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Execuções</p>
                        <p className="text-3xl font-bold text-gray-900">{currentMetrics.total_executions}</p>
                      </div>
                      <div className="p-3 bg-purple-50 rounded-lg">
                        <Activity className="h-6 w-6 text-purple-600" />
                      </div>
                    </div>
                  </Card.Content>
                </Card>
                <Card>
                  <Card.Content className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Taxa de Sucesso</p>
                        <p className="text-3xl font-bold text-gray-900">{currentMetrics.success_rate}%</p>
                      </div>
                      <div className="p-3 bg-orange-50 rounded-lg">
                        <Target className="h-6 w-6 text-orange-600" />
                      </div>
                    </div>
                  </Card.Content>
                </Card>
              </div>
              {/* Gráficos e Analytics */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <Card.Header>
                    <Card.Title>Performance dos Blocos</Card.Title>
                    <Card.Description>Desempenho em tempo real</Card.Description>
                  </Card.Header>
                  <Card.Content>
                    <div className="h-64 flex items-center justify-center text-gray-500">
                      <div className="text-center">
                        <BarChart3 className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                        <p>Gráfico de performance será exibido aqui</p>
                      </div>
                    </div>
                  </Card.Content>
                </Card>
                <Card>
                  <Card.Header>
                    <Card.Title>Atividade da IA</Card.Title>
                    <Card.Description>Sugestões e automações</Card.Description>
                  </Card.Header>
                  <Card.Content>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Sugestões geradas</span>
                        <span className="font-medium">{currentMetrics.ai_suggestions}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Automações ativas</span>
                        <span className="font-medium">{currentMetrics.automations_running}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Nível de IA</span>
                        <Badge variant="outline">{currentProject.aiLevel}</Badge>
                      </div>
                    </div>
                  </Card.Content>
                </Card>
              </div>
            </div>
          )}
          {activeTab === 'flows' && (
            <div className="p-6">
              <Card>
                <Card.Header>
                  <Card.Title>Fluxos de Automação</Card.Title>
                  <Card.Description>Gerencie os fluxos entre blocos</Card.Description>
                </Card.Header>
                <Card.Content>
                  <div className="text-center py-12 text-gray-500">
                    <Workflow className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-medium mb-2">Nenhum fluxo configurado</h3>
                    <p className="mb-4">Conecte blocos no canvas para criar fluxos automáticos</p>
                    <Button onClick={() => setActiveTab('canvas')}>
                      <LayoutGrid className="h-4 w-4 mr-2" />
                      Ir para Canvas
                    </Button>
                  </div>
                </Card.Content>
              </Card>
            </div>
          )}
          {activeTab === 'ai' && (
            <div className="p-6">
              <Card>
                <Card.Header>
                  <Card.Title>IA Assistant</Card.Title>
                  <Card.Description>Assistente inteligente para seu projeto</Card.Description>
                </Card.Header>
                <Card.Content>
                  <div className="text-center py-12 text-gray-500">
                    <Brain className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-medium mb-2">IA Assistant</h3>
                    <p className="mb-4">Chat inteligente será implementado aqui</p>
                    <Button disabled>
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Em breve
                    </Button>
                  </div>
                </Card.Content>
              </Card>
            </div>
          )}
          {activeTab === 'monitoring' && (
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <Card>
                    <Card.Header>
                      <Card.Title>Log de Atividades</Card.Title>
                      <Card.Description>Monitoramento em tempo real</Card.Description>
                    </Card.Header>
                    <Card.Content>
                      <div className="space-y-3 max-h-96 overflow-y-auto">
                        {notifications.length > 0 ? (
                          notifications.map((notification) => (
                            <div key={notification.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              <div className="flex-1">
                                <p className="text-sm font-medium">{notification.message}</p>
                                <p className="text-xs text-gray-500">{notification.timestamp}</p>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-8 text-gray-500">
                            <Activity className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                            <p>Nenhuma atividade registrada</p>
                            <p className="text-xs">Execute o projeto para ver logs</p>
                          </div>
                        )}
                      </div>
                    </Card.Content>
                  </Card>
                </div>
                <div>
                  <Card>
                    <Card.Header>
                      <Card.Title>Status do Sistema</Card.Title>
                    </Card.Header>
                    <Card.Content>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Status</span>
                          <Badge className={getStatusColor(systemStatus)}>
                            {getStatusIcon(systemStatus)}
                            {systemStatus}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Uptime</span>
                          <span className="text-sm font-medium">00:00:00</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">CPU</span>
                          <span className="text-sm font-medium">12%</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Memória</span>
                          <span className="text-sm font-medium">256 MB</span>
                        </div>
                      </div>
                    </Card.Content>
                  </Card>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default UniverseWorkspace;
