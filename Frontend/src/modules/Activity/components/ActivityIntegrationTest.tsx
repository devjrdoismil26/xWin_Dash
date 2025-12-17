/**
 * Teste de integração do módulo Activity
 *
 * @description
 * Componente para testar integrações e funcionalidades do módulo Activity.
 * Permite executar testes de conexão, recuperação de logs, geração de stats,
 * exportação e conexão em tempo real. Exibe resultados detalhados.
 *
 * @module modules/Activity/components/ActivityIntegrationTest
 * @since 1.0.0
 */

import React, { useState } from 'react';
import { Card } from '@/shared/components/ui/Card';
import { Button } from '@/shared/components/ui/Button';
import { Badge } from '@/shared/components/ui/Badge';
import { LoadingSpinner } from '@/shared/components/ui/LoadingStates';
import { CheckCircle, XCircle, Play, AlertTriangle, Activity, Database, Globe, Download, Zap } from 'lucide-react';
import { useActivityStore } from '../hooks/useActivityStore';
import { getErrorMessage } from '@/utils/errorHelpers';

interface TestResult {
  name: string;
  status: 'pending' | 'running' | 'success' | 'error';
  message?: string;
  duration?: number; }

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
        status: 'running'};

      setTests(prev => [...prev, testResult]);

      try {
        const startTime = Date.now();

        const result = await testDef.test();

        const duration = Date.now() - startTime;

        setTests(prev => (prev || []).map((test: unknown, index: unknown) => 
          index === testIndex 
            ? {
                ...test,
                status: result.success ? 'success' : 'error',
                message: result.success ? 'Teste passou' : result.error,
                duration
              }
            : test
        ));

      } catch (error: unknown) {
        const errorMessage = error instanceof Error
          ? getErrorMessage(error)
          : (error as { response?: { data?: { message?: string } })?.response?.data?.message || 'Erro desconhecido';
        setTests(prev => (prev || []).map((test: unknown, index: unknown) => 
          index === testIndex 
            ? {
                ...test,
                status: 'error',
                message: errorMessage
              }
            : test
        ));

      } setIsRunning(false);};

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
    } ;

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
    } ;

  const successCount = (tests || []).filter(t => t.status === 'success').length;
  const errorCount = (tests || []).filter(t => t.status === 'error').length;
  const totalTests = testDefinitions.length;

  return (
        <>
      <Card className="backdrop-blur-xl bg-white/10 border-white/20 hover:bg-white/20 transition-all duration-300" />
      <Card.Header />
        <Card.Title className="text-gray-900 dark:text-white" />
          Teste de Integração - Activity
        </Card.Title>
        <Card.Description className="text-gray-600 dark:text-gray-300" />
          Verifica a conectividade e funcionalidades do módulo
        </Card.Description>
      </Card.Header>
      <Card.Content />
        <div className="{/* Test Summary */}">$2</div>
          {tests.length > 0 && (
            <div className=" ">$2</div><div className=" ">$2</div><div className="{totalTests}">$2</div>
                </div>
                <div className="Total de Testes">$2</div>
                </div>
              <div className=" ">$2</div><div className="{successCount}">$2</div>
                </div>
                <div className="Sucessos">$2</div>
                </div>
              <div className=" ">$2</div><div className="{errorCount}">$2</div>
                </div>
                <div className="Erros">$2</div>
                </div>
    </div>
  )}

          {/* Run Tests Button */}
          <div className=" ">$2</div><Button
              onClick={ runAllTests }
              disabled={ isRunning || loading }
              className="backdrop-blur-sm bg-blue-500/20 border-blue-500/30 hover:bg-blue-500/30 text-blue-600" />
              <Play className="h-4 w-4 mr-2" />
              {isRunning ? 'Executando Testes...' : 'Executar Todos os Testes'}
            </Button>
          </div>

          {/* Test Results */}
          {tests.length > 0 && (
            <div className=" ">$2</div><h3 className="text-lg font-semibold text-gray-900 dark:text-white" />
                Resultados dos Testes
              </h3>
              {(tests || []).map((test: unknown, index: unknown) => (
                <div
                  key={ index }
                  className="flex items-center justify-between p-4 bg-white/5 rounded-lg backdrop-blur-sm border border-white/20">
           
        </div><div className="{getStatusIcon(test.status)}">$2</div>
                    <div>
           
        </div><div className="{test.name}">$2</div>
                      </div>
                      {test.message && (
                        <div className="{test.message}">$2</div>
    </div>
  )}
                    </div>
                  <div className="{test.duration && (">$2</div>
                      <span className="{test.duration}ms">$2</span>
      </span>
    </>
  )}
                    {getStatusBadge(test.status)}
                  </div>
              ))}
            </div>
          )}

          {/* Test Definitions */}
          <div className=" ">$2</div><h3 className="text-lg font-semibold text-gray-900 dark:text-white" />
              Testes Disponíveis
            </h3>
            {(testDefinitions || []).map((testDef: unknown, index: unknown) => (
              <div
                key={ index }
                className="flex items-center gap-3 p-3 bg-white/5 rounded-lg backdrop-blur-sm">
           
        </div><testDef.icon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                <span className="{testDef.name}">$2</span>
                </span>
      </div>
    </>
  ))}
          </div>
      </Card.Content>
    </Card>);};

export default ActivityIntegrationTest;
