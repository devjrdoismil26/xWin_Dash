/**
 * Componente de teste de integração do módulo Activity
 * Testa funcionalidades e conectividade
 */

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { LoadingSpinner } from '@/components/ui/LoadingStates';
import { 
  CheckCircle, 
  XCircle, 
  Play, 
  AlertTriangle,
  Activity,
  Database,
  Globe,
  Download,
  Zap
} from 'lucide-react';
import { useActivityStore } from '../hooks/useActivityStore';

interface TestResult {
  name: string;
  status: 'pending' | 'running' | 'success' | 'error';
  message?: string;
  duration?: number;
}

export const ActivityIntegrationTest: React.FC = () => {
  const [tests, setTests] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const {
    testConnection,
    testLogsRetrieval,
    testStatsGeneration,
    testExportFunctionality,
    testRealTimeConnection,
    loading
  } = useActivityStore();

  const testDefinitions = [
    {
      name: 'Conexão com API',
      icon: Globe,
      test: testConnection
    },
    {
      name: 'Recuperação de Logs',
      icon: Database,
      test: testLogsRetrieval
    },
    {
      name: 'Geração de Estatísticas',
      icon: Activity,
      test: testStatsGeneration
    },
    {
      name: 'Funcionalidade de Exportação',
      icon: Download,
      test: testExportFunctionality
    },
    {
      name: 'Conexão em Tempo Real',
      icon: Zap,
      test: testRealTimeConnection
    }
  ];

  const runAllTests = async () => {
    setIsRunning(true);
    setTests([]);

    for (const testDef of testDefinitions) {
      const testIndex = tests.length;
      const testResult: TestResult = {
        name: testDef.name,
        status: 'running'
      };

      setTests(prev => [...prev, testResult]);

      try {
        const startTime = Date.now();
        const result = await testDef.test();
        const duration = Date.now() - startTime;

        setTests(prev => prev.map((test, index) => 
          index === testIndex 
            ? {
                ...test,
                status: result.success ? 'success' : 'error',
                message: result.success ? 'Teste passou' : result.error,
                duration
              }
            : test
        ));
      } catch (error: any) {
        setTests(prev => prev.map((test, index) => 
          index === testIndex 
            ? {
                ...test,
                status: 'error',
                message: error.message || 'Erro desconhecido'
              }
            : test
        ));
      }
    }

    setIsRunning(false);
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'pending':
        return <AlertTriangle className="h-4 w-4 text-gray-400" />;
      case 'running':
        return <LoadingSpinner size="sm" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getStatusBadge = (status: TestResult['status']) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary">Pendente</Badge>;
      case 'running':
        return <Badge variant="secondary">Executando</Badge>;
      case 'success':
        return <Badge variant="success">Sucesso</Badge>;
      case 'error':
        return <Badge variant="destructive">Erro</Badge>;
    }
  };

  const successCount = tests.filter(t => t.status === 'success').length;
  const errorCount = tests.filter(t => t.status === 'error').length;
  const totalTests = testDefinitions.length;

  return (
    <Card className="backdrop-blur-xl bg-white/10 border-white/20 hover:bg-white/20 transition-all duration-300">
      <Card.Header>
        <Card.Title className="text-gray-900 dark:text-white">
          Teste de Integração - Activity
        </Card.Title>
        <Card.Description className="text-gray-600 dark:text-gray-300">
          Verifica a conectividade e funcionalidades do módulo
        </Card.Description>
      </Card.Header>
      <Card.Content>
        <div className="space-y-6">
          {/* Test Summary */}
          {tests.length > 0 && (
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-white/10 rounded-lg backdrop-blur-sm">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {totalTests}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  Total de Testes
                </div>
              </div>
              <div className="text-center p-4 bg-green-500/20 rounded-lg backdrop-blur-sm">
                <div className="text-2xl font-bold text-green-600">
                  {successCount}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  Sucessos
                </div>
              </div>
              <div className="text-center p-4 bg-red-500/20 rounded-lg backdrop-blur-sm">
                <div className="text-2xl font-bold text-red-600">
                  {errorCount}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  Erros
                </div>
              </div>
            </div>
          )}

          {/* Run Tests Button */}
          <div className="flex justify-center">
            <Button
              onClick={runAllTests}
              disabled={isRunning || loading}
              className="backdrop-blur-sm bg-blue-500/20 border-blue-500/30 hover:bg-blue-500/30 text-blue-600"
            >
              <Play className="h-4 w-4 mr-2" />
              {isRunning ? 'Executando Testes...' : 'Executar Todos os Testes'}
            </Button>
          </div>

          {/* Test Results */}
          {tests.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Resultados dos Testes
              </h3>
              {tests.map((test, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-white/5 rounded-lg backdrop-blur-sm border border-white/10"
                >
                  <div className="flex items-center gap-3">
                    {getStatusIcon(test.status)}
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {test.name}
                      </div>
                      {test.message && (
                        <div className="text-sm text-gray-600 dark:text-gray-300">
                          {test.message}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {test.duration && (
                      <span className="text-sm text-gray-500">
                        {test.duration}ms
                      </span>
                    )}
                    {getStatusBadge(test.status)}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Test Definitions */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Testes Disponíveis
            </h3>
            {testDefinitions.map((testDef, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 bg-white/5 rounded-lg backdrop-blur-sm"
              >
                <testDef.icon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                <span className="text-gray-900 dark:text-white">
                  {testDef.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </Card.Content>
    </Card>
  );
};

export default ActivityIntegrationTest;
