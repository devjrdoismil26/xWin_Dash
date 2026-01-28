/**
 * 🚀 PyLab Integration Page
 * 
 * Página principal para integração com PyLab
 * Integra todas as capacidades do PyLab no aiLaboratory
 */

import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/AppLayout';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import PyLabIntegration from '../components/PyLabIntegration';
import { usePyLabIntegration } from '../hooks/usePyLabIntegration';
import { 
  Brain, 
  Zap, 
  Activity, 
  TrendingUp, 
  Users, 
  Target,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Settings,
  BarChart3,
  Image,
  Video,
  Code,
  FileText
} from 'lucide-react';
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

interface PyLabIntegrationPageProps {
  auth?: { user?: { id: string; name: string; email: string; }; };
  initialData?: Record<string, unknown>;
}

const PyLabIntegrationPage: React.FC<PyLabIntegrationPageProps> = ({ 
  auth, 
  initialData 
}) => {
  const {
    connection,
    capabilities,
    systemStatus,
    generationTasks,
    isGenerating,
    lastError,
    checkConnection,
    refreshSystemStatus,
    refreshCapabilities,
    clearError
  } = usePyLabIntegration();

  const [activeTab, setActiveTab] = useState('overview');

  // ============================================================================
  // EFFECTS
  // ============================================================================

  useEffect(() => {
    // Verificar conexão inicial
    checkConnection();
  }, [checkConnection]);

  useEffect(() => {
    // Auto-refresh status a cada 30 segundos quando conectado
    if (connection.status === 'connected') {
      const interval = setInterval(() => {
        refreshSystemStatus();
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [connection.status, refreshSystemStatus]);

  // ============================================================================
  // RENDER HELPERS
  // ============================================================================

  const renderConnectionAlert = () => {
    if (connection.status === 'connected') {
      return (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-800">PyLab Conectado</AlertTitle>
          <AlertDescription className="text-green-700">
            Laboratório de IA avançada está operacional e pronto para uso.
          </AlertDescription>
        </Alert>
      );
    }

    if (connection.status === 'error') {
      return (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erro de Conexão</AlertTitle>
          <AlertDescription>
            Não foi possível conectar com o PyLab. {connection.error}
            <Button
              size="sm"
              variant="outline"
              onClick={checkConnection}
              className="ml-2"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Tentar Novamente
            </Button>
          </AlertDescription>
        </Alert>
      );
    }

    if (connection.status === 'connecting') {
      return (
        <Alert className="border-yellow-200 bg-yellow-50">
          <RefreshCw className="h-4 w-4 text-yellow-600 animate-spin" />
          <AlertTitle className="text-yellow-800">Conectando...</AlertTitle>
          <AlertDescription className="text-yellow-700">
            Estabelecendo conexão com o PyLab...
          </AlertDescription>
        </Alert>
      );
    }

    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>PyLab Desconectado</AlertTitle>
        <AlertDescription>
          O PyLab não está disponível. Verifique se o serviço está rodando.
          <Button
            size="sm"
            variant="outline"
            onClick={checkConnection}
            className="ml-2"
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            Conectar
          </Button>
        </AlertDescription>
      </Alert>
    );
  };

  const renderOverview = () => {
    return (
      <div className="space-y-6">
        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <Card.Content className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Status</p>
                  <p className="text-2xl font-bold">
                    {connection.status === 'connected' ? 'Online' : 'Offline'}
                  </p>
                </div>
                <div className={cn(
                  'p-3 rounded-full',
                  connection.status === 'connected' ? 'bg-green-100' : 'bg-red-100'
                )}>
                  {connection.status === 'connected' ? (
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  ) : (
                    <AlertCircle className="h-6 w-6 text-red-600" />
                  )}
                </div>
              </div>
            </Card.Content>
          </Card>

          <Card>
            <Card.Content className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Tasks Ativas</p>
                  <p className="text-2xl font-bold">
                    {systemStatus?.active_tasks || 0}
                  </p>
                </div>
                <div className="p-3 rounded-full bg-blue-100">
                  <Activity className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </Card.Content>
          </Card>

          <Card>
            <Card.Content className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Gerações</p>
                  <p className="text-2xl font-bold">
                    {systemStatus?.total_generations || 0}
                  </p>
                </div>
                <div className="p-3 rounded-full bg-purple-100">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </Card.Content>
          </Card>

          <Card>
            <Card.Content className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Fila</p>
                  <p className="text-2xl font-bold">
                    {systemStatus?.queue_size || 0}
                  </p>
                </div>
                <div className="p-3 rounded-full bg-orange-100">
                  <Users className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </Card.Content>
          </Card>
        </div>

        {/* Capabilities */}
        {capabilities && (
          <Card>
            <Card.Header>
              <Card.Title className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-500" />
                Capacidades do PyLab
              </Card.Title>
              <Card.Description>
                Funcionalidades disponíveis no laboratório de IA
              </Card.Description>
            </Card.Header>
            <Card.Content>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Media Generation */}
                <div className="space-y-2">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Image className="h-4 w-4" />
                    Geração de Mídia
                  </h4>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge variant={capabilities.media_generation.image_generation ? 'default' : 'secondary'}>
                        {capabilities.media_generation.image_generation ? '✅' : '❌'} Imagens
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={capabilities.media_generation.video_generation ? 'default' : 'secondary'}>
                        {capabilities.media_generation.video_generation ? '✅' : '❌'} Vídeos
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* AI Analysis */}
                <div className="space-y-2">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Brain className="h-4 w-4" />
                    Análise de IA
                  </h4>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge variant={capabilities.ai_analysis.text_analysis ? 'default' : 'secondary'}>
                        {capabilities.ai_analysis.text_analysis ? '✅' : '❌'} Texto
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={capabilities.ai_analysis.image_analysis ? 'default' : 'secondary'}>
                        {capabilities.ai_analysis.image_analysis ? '✅' : '❌'} Imagem
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={capabilities.ai_analysis.code_generation ? 'default' : 'secondary'}>
                        {capabilities.ai_analysis.code_generation ? '✅' : '❌'} Código
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Business Intelligence */}
                <div className="space-y-2">
                  <h4 className="font-semibold flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    Business Intelligence
                  </h4>
                  <div className="flex items-center gap-2">
                    <Badge variant={capabilities.ai_analysis.business_intelligence ? 'default' : 'secondary'}>
                      {capabilities.ai_analysis.business_intelligence ? '✅' : '❌'} BI Avançado
                    </Badge>
                  </div>
                </div>
              </div>
            </Card.Content>
          </Card>
        )}

        {/* Recent Tasks */}
        {generationTasks.length > 0 && (
          <Card>
            <Card.Header>
              <Card.Title className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-blue-500" />
                Tarefas Recentes
              </Card.Title>
              <Card.Description>
                Últimas gerações e análises realizadas
              </Card.Description>
            </Card.Header>
            <Card.Content>
              <div className="space-y-3">
                {generationTasks.slice(0, 5).map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {task.type === 'image' && <Image className="h-4 w-4 text-blue-500" />}
                      {task.type === 'video' && <Video className="h-4 w-4 text-purple-500" />}
                      {task.type === 'text' && <FileText className="h-4 w-4 text-green-500" />}
                      {task.type === 'code' && <Code className="h-4 w-4 text-orange-500" />}
                      <div>
                        <p className="font-medium">{task.id}</p>
                        <p className="text-sm text-gray-500">
                          {task.startTime.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <Badge variant={
                      task.status === 'completed' ? 'default' :
                      task.status === 'failed' ? 'destructive' :
                      task.status === 'processing' ? 'secondary' : 'outline'
                    }>
                      {task.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card.Content>
          </Card>
        )}
      </div>
    );
  };

  const renderSystemStatus = () => {
    if (!systemStatus) {
      return (
        <div className="text-center py-8">
          <RefreshCw className="h-8 w-8 text-gray-400 mx-auto mb-4 animate-spin" />
          <p className="text-gray-500">Carregando status do sistema...</p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* System Resources */}
        <Card>
          <Card.Header>
            <Card.Title className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Recursos do Sistema
            </Card.Title>
          </Card.Header>
          <Card.Content>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">CPU e Memória</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>CPU</span>
                    <span className="font-mono">{systemStatus.system_resources.cpu_usage}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>RAM</span>
                    <span className="font-mono">{systemStatus.system_resources.memory_usage}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>RAM Disponível</span>
                    <span className="font-mono">{systemStatus.system_resources.memory_available}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">GPU</h4>
                {Object.keys(systemStatus.system_resources.gpu_info).length > 0 ? (
                  <div className="space-y-2">
                    {Object.entries(systemStatus.system_resources.gpu_info).map(([key, gpu]) => (
                      <div key={key} className="border rounded p-2">
                        <div className="font-medium">{gpu.name}</div>
                        <div className="text-sm text-gray-600">
                          {gpu.memory_used} / {gpu.memory_total}
                        </div>
                        <div className="text-sm text-gray-600">
                          Utilização: {gpu.utilization}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">Nenhuma GPU disponível</p>
                )}
              </div>
            </div>
          </Card.Content>
        </Card>

        {/* Available Models */}
        <Card>
          <Card.Header>
            <Card.Title className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Modelos Disponíveis
            </Card.Title>
          </Card.Header>
          <Card.Content>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {systemStatus.available_models.map((model, index) => (
                <div key={index} className="border rounded p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">{model.name}</h4>
                    <Badge variant={model.loaded ? 'default' : 'secondary'}>
                      {model.loaded ? 'Carregado' : 'Não Carregado'}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{model.description}</p>
                  <div className="text-xs text-gray-500">
                    <div>Tipo: {model.type}</div>
                    <div>Versão: {model.version}</div>
                    <div>Memória: {model.memory_usage}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card.Content>
        </Card>

        {/* System Info */}
        <Card>
          <Card.Header>
            <Card.Title className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Informações do Sistema
            </Card.Title>
          </Card.Header>
          <Card.Content>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Serviço</h4>
                <div className="space-y-1 text-sm">
                  <div>Nome: {systemStatus.service_name}</div>
                  <div>Versão: {systemStatus.version}</div>
                  <div>Uptime: {systemStatus.uptime}</div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Estatísticas</h4>
                <div className="space-y-1 text-sm">
                  <div>Total de Gerações: {systemStatus.total_generations}</div>
                  <div>Tasks Ativas: {systemStatus.active_tasks}</div>
                  <div>Tamanho da Fila: {systemStatus.queue_size}</div>
                </div>
              </div>
            </div>
          </Card.Content>
        </Card>
      </div>
    );
  };

  // ============================================================================
  // MAIN RENDER
  // ============================================================================

  return (
    <AppLayout
      title="PyLab Integration"
      subtitle="Laboratório de IA Avançada"
      showProjectSelector={true}
      showSidebar={false}
      breadcrumbs={[
        { label: 'AI Laboratory', href: '/ai' },
        { label: 'PyLab Integration', href: '/ai/pylab' }
      ]}
      showBreadcrumbs={true}
    >
      <Head title="PyLab Integration - AI Laboratory" />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Brain className="h-8 w-8 text-purple-500" />
              PyLab Integration
            </h1>
            <p className="text-gray-600 mt-1">
              Laboratório de IA avançada integrado ao aiLaboratory
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={refreshSystemStatus}
              disabled={connection.status !== 'connected'}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Atualizar
            </Button>
            <Button
              variant="outline"
              onClick={refreshCapabilities}
              disabled={connection.status !== 'connected'}
            >
              <Settings className="h-4 w-4 mr-2" />
              Capacidades
            </Button>
          </div>
        </div>

        {/* Connection Alert */}
        {renderConnectionAlert()}

        {/* Error Alert */}
        {lastError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erro</AlertTitle>
            <AlertDescription>
              {lastError}
              <Button
                size="sm"
                variant="outline"
                onClick={clearError}
                className="ml-2"
              >
                Fechar
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="integration">Integração</TabsTrigger>
            <TabsTrigger value="status">Status</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {renderOverview()}
          </TabsContent>

          <TabsContent value="integration" className="space-y-6">
            <PyLabIntegration
              onGenerationComplete={(result) => {
                console.log('Geração concluída:', result);
              }}
              onAnalysisComplete={(result) => {
                console.log('Análise concluída:', result);
              }}
            />
          </TabsContent>

          <TabsContent value="status" className="space-y-6">
            {renderSystemStatus()}
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default PyLabIntegrationPage;
