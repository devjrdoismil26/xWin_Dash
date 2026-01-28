// ========================================
// COMPONENTE TESTE DE INTEGRAÇÃO - ANALYTICS
// ========================================
// Componente para testar integrações do módulo Analytics

import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/Card";
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/Progress';
import { cn } from '@/lib/utils';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  RefreshCw, 
  Play, 
  Pause,
  Settings,
  Database,
  Globe,
  Zap,
  BarChart3,
  Users,
  Eye,
  Clock,
  Activity
} from 'lucide-react';

interface IntegrationTest {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'running' | 'passed' | 'failed' | 'warning';
  duration?: number;
  error?: string;
  details?: string;
  icon: React.ComponentType<any>;
  category: 'api' | 'database' | 'external' | 'performance' | 'security';
}

interface AnalyticsIntegrationTestProps {
  onRunTests?: () => void;
  onStopTests?: () => void;
  onConfigureTests?: () => void;
  className?: string;
}

export const AnalyticsIntegrationTest: React.FC<AnalyticsIntegrationTestProps> = ({
  onRunTests,
  onStopTests,
  onConfigureTests,
  className
}) => {
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTest, setCurrentTest] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<IntegrationTest[]>([
    {
      id: 'api-connection',
      name: 'Conexão com API',
      description: 'Testa conectividade com a API de Analytics',
      status: 'pending',
      icon: Globe,
      category: 'api'
    },
    {
      id: 'database-connection',
      name: 'Conexão com Banco de Dados',
      description: 'Verifica conexão com o banco de dados',
      status: 'pending',
      icon: Database,
      category: 'database'
    },
    {
      id: 'google-analytics',
      name: 'Google Analytics',
      description: 'Testa integração com Google Analytics',
      status: 'pending',
      icon: BarChart3,
      category: 'external'
    },
    {
      id: 'facebook-analytics',
      name: 'Facebook Analytics',
      description: 'Verifica conexão com Facebook Analytics',
      status: 'pending',
      icon: Users,
      category: 'external'
    },
    {
      id: 'real-time-websocket',
      name: 'WebSocket Tempo Real',
      description: 'Testa conexão WebSocket para dados em tempo real',
      status: 'pending',
      icon: Zap,
      category: 'api'
    },
    {
      id: 'data-processing',
      name: 'Processamento de Dados',
      description: 'Verifica processamento e transformação de dados',
      status: 'pending',
      icon: Activity,
      category: 'performance'
    },
    {
      id: 'cache-system',
      name: 'Sistema de Cache',
      description: 'Testa funcionamento do sistema de cache',
      status: 'pending',
      icon: Clock,
      category: 'performance'
    },
    {
      id: 'authentication',
      name: 'Autenticação',
      description: 'Verifica sistema de autenticação e autorização',
      status: 'pending',
      icon: Settings,
      category: 'security'
    },
    {
      id: 'export-functionality',
      name: 'Funcionalidade de Exportação',
      description: 'Testa exportação de dados em diferentes formatos',
      status: 'pending',
      icon: Eye,
      category: 'api'
    }
  ]);

  const runTests = async () => {
    setIsRunning(true);
    setProgress(0);
    setCurrentTest(null);

    const totalTests = testResults.length;
    let completedTests = 0;

    for (let i = 0; i < testResults.length; i++) {
      const test = testResults[i];
      setCurrentTest(test.id);
      
      // Simular execução do teste
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
      
      // Simular resultado do teste
      const randomResult = Math.random();
      let status: IntegrationTest['status'];
      let error: string | undefined;
      let details: string | undefined;

      if (randomResult > 0.8) {
        status = 'failed';
        error = 'Falha na conexão';
        details = 'Não foi possível estabelecer conexão com o serviço';
      } else if (randomResult > 0.6) {
        status = 'warning';
        details = 'Teste concluído com avisos';
      } else {
        status = 'passed';
        details = 'Teste executado com sucesso';
      }

      setTestResults(prev => prev.map(t => 
        t.id === test.id 
          ? { ...t, status, error, details, duration: Math.floor(Math.random() * 3000) + 500 }
          : t
      ));

      completedTests++;
      setProgress((completedTests / totalTests) * 100);
    }

    setIsRunning(false);
    setCurrentTest(null);
    onRunTests?.();
  };

  const stopTests = () => {
    setIsRunning(false);
    setCurrentTest(null);
    onStopTests?.();
  };

  const getStatusIcon = (status: IntegrationTest['status']) => {
    switch (status) {
      case 'passed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'running':
        return <RefreshCw className="h-4 w-4 text-blue-600 animate-spin" />;
      default:
        return <div className="h-4 w-4 rounded-full bg-gray-300" />;
    }
  };

  const getStatusColor = (status: IntegrationTest['status']) => {
    switch (status) {
      case 'passed':
        return 'bg-green-50 border-green-200';
      case 'failed':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'running':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getCategoryColor = (category: IntegrationTest['category']) => {
    switch (category) {
      case 'api':
        return 'bg-blue-100 text-blue-800';
      case 'database':
        return 'bg-green-100 text-green-800';
      case 'external':
        return 'bg-purple-100 text-purple-800';
      case 'performance':
        return 'bg-orange-100 text-orange-800';
      case 'security':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryLabel = (category: IntegrationTest['category']) => {
    switch (category) {
      case 'api':
        return 'API';
      case 'database':
        return 'Banco';
      case 'external':
        return 'Externo';
      case 'performance':
        return 'Performance';
      case 'security':
        return 'Segurança';
      default:
        return 'Outro';
    }
  };

  const passedTests = testResults.filter(t => t.status === 'passed').length;
  const failedTests = testResults.filter(t => t.status === 'failed').length;
  const warningTests = testResults.filter(t => t.status === 'warning').length;
  const totalTests = testResults.length;

  return (
    <Card className={cn("", className)}>
      <Card.Header>
        <div className="flex items-center justify-between">
          <Card.Title className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Teste de Integração
          </Card.Title>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={onConfigureTests}
            >
              <Settings className="h-4 w-4 mr-1" />
              Configurar
            </Button>
            {isRunning ? (
              <Button
                size="sm"
                variant="outline"
                onClick={stopTests}
                className="text-red-600 hover:text-red-700"
              >
                <Pause className="h-4 w-4 mr-1" />
                Parar
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={runTests}
                disabled={isRunning}
              >
                <Play className="h-4 w-4 mr-1" />
                Executar Testes
              </Button>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        {isRunning && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Executando testes...</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
            {currentTest && (
              <p className="text-sm text-gray-600">
                Executando: {testResults.find(t => t.id === currentTest)?.name}
              </p>
            )}
          </div>
        )}
      </Card.Header>

      <Card.Content className="space-y-6">
        {/* Resumo dos Resultados */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <CheckCircle className="h-6 w-6 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-900">{passedTests}</div>
            <div className="text-sm text-green-700">Aprovados</div>
          </div>
          
          <div className="text-center p-3 bg-red-50 rounded-lg">
            <XCircle className="h-6 w-6 text-red-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-red-900">{failedTests}</div>
            <div className="text-sm text-red-700">Falharam</div>
          </div>
          
          <div className="text-center p-3 bg-yellow-50 rounded-lg">
            <AlertTriangle className="h-6 w-6 text-yellow-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-yellow-900">{warningTests}</div>
            <div className="text-sm text-yellow-700">Avisos</div>
          </div>
          
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <Activity className="h-6 w-6 text-gray-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{totalTests}</div>
            <div className="text-sm text-gray-700">Total</div>
          </div>
        </div>

        {/* Lista de Testes */}
        <div className="space-y-3">
          {testResults.map((test) => {
            const IconComponent = test.icon;
            return (
              <div
                key={test.id}
                className={cn(
                  "flex items-center justify-between p-4 border rounded-lg transition-colors",
                  getStatusColor(test.status),
                  currentTest === test.id && "ring-2 ring-blue-500"
                )}
              >
                <div className="flex items-center gap-3">
                  <IconComponent className="h-5 w-5 text-gray-600" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium">{test.name}</h3>
                      <Badge className={getCategoryColor(test.category)}>
                        {getCategoryLabel(test.category)}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{test.description}</p>
                    {test.details && (
                      <p className="text-xs text-gray-500 mt-1">{test.details}</p>
                    )}
                    {test.error && (
                      <p className="text-xs text-red-600 mt-1">{test.error}</p>
                    )}
                    {test.duration && (
                      <p className="text-xs text-gray-500 mt-1">
                        Duração: {test.duration}ms
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {getStatusIcon(test.status)}
                </div>
              </div>
            );
          })}
        </div>

        {/* Ações Adicionais */}
        <div className="border-t pt-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Última execução: {new Date().toLocaleString('pt-BR')}
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline">
                <RefreshCw className="h-4 w-4 mr-1" />
                Executar Novamente
              </Button>
              <Button size="sm" variant="outline">
                <Settings className="h-4 w-4 mr-1" />
                Configurações Avançadas
              </Button>
            </div>
          </div>
        </div>
      </Card.Content>
    </Card>
  );
};

export default AnalyticsIntegrationTest;