import React, { useState } from 'react';
import { Play, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { LoadingSpinner } from '@/components/ui/LoadingStates';
import { ErrorState } from '@/components/ui/ErrorState';

export interface TestCase {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  bgColor: string;
  borderColor: string;
  action: () => Promise<{ success: boolean; message: string; data?: any; error?: string; }>;
}

export interface TestResult {
  test: string;
  success: boolean;
  message: string;
  data?: any;
  error?: string;
}

export interface IntegrationTestProps {
  moduleName: string;
  moduleDescription: string;
  tests: TestCase[];
  statsConfig?: {
    stats: Array<{
      label: string;
      value: number;
      color: string;
    }>;
  };
  loading?: boolean;
  error?: string | null;
}

/**
 * Componente genérico para testes de integração
 * Consolida todos os arquivos *IntegrationTest.tsx duplicados
 */
const IntegrationTest: React.FC<IntegrationTestProps> = ({
  moduleName,
  moduleDescription,
  tests,
  statsConfig,
  loading = false,
  error = null
}) => {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [currentTest, setCurrentTest] = useState<string | null>(null);

  const runSingleTest = async (test: TestCase) => {
    setCurrentTest(test.id);
    try {
      const result = await test.action();
      const testResult: TestResult = {
        test: test.name,
        success: result.success,
        message: result.message,
        data: result.data,
        error: result.error
      };

      setTestResults(prev => {
        const filtered = prev.filter(r => r.test !== test.name);
        return [...filtered, testResult];
      });
    } catch (error: any) {
      const testResult: TestResult = {
        test: test.name,
        success: false,
        message: 'Erro inesperado',
        error: error.message
      };

      setTestResults(prev => {
        const filtered = prev.filter(r => r.test !== test.name);
        return [...filtered, testResult];
      });
    } finally {
      setCurrentTest(null);
    }
  };

  const runAllTests = async () => {
    setIsRunning(true);
    setTestResults([]);

    for (const test of tests) {
      await runSingleTest(test);
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    setIsRunning(false);
  };

  const getTestResult = (testName: string) => {
    return testResults.find(r => r.test === testName);
  };

  const getStatusIcon = (testName: string) => {
    const result = getTestResult(testName);
    const isRunning = currentTest === tests.find(t => t.name === testName)?.id;

    if (isRunning) {
      return <Loader2 className="w-4 h-4 animate-spin text-blue-500" />;
    }

    if (!result) {
      return <div className="w-4 h-4 rounded-full bg-gray-300" />;
    }

    return result.success ? 
      <CheckCircle className="w-4 h-4 text-green-500" /> : 
      <XCircle className="w-4 h-4 text-red-500" />;
  };

  const getStatusBadge = (testName: string) => {
    const result = getTestResult(testName);
    const isRunning = currentTest === tests.find(t => t.name === testName)?.id;

    if (isRunning) {
      return <Badge variant="secondary">Executando...</Badge>;
    }

    if (!result) {
      return <Badge variant="outline">Não testado</Badge>;
    }

    return result.success ? 
      <Badge variant="success">Sucesso</Badge> : 
      <Badge variant="destructive">Falhou</Badge>;
  };

  const successCount = testResults.filter(r => r.success).length;
  const totalTests = tests.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Teste de Integração {moduleName}
          </h2>
          <p className="text-gray-600">{moduleDescription}</p>
        </div>
        <Button 
          onClick={runAllTests} 
          disabled={isRunning}
          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
        >
          {isRunning ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Executando Testes...
            </>
          ) : (
            <>
              <Play className="w-4 h-4 mr-2" />
              Executar Todos os Testes
            </>
          )}
        </Button>
      </div>

      {/* Status Overview */}
      <Card className="backdrop-blur-xl bg-white/10 dark:bg-gray-900/10 border border-white/20 dark:border-gray-700/20 hover:bg-white/20 dark:hover:bg-gray-900/20 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10">
        <Card.Header>
          <Card.Title>Status dos Testes</Card.Title>
        </Card.Header>
        <Card.Content>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{successCount}/{totalTests}</div>
              <div className="text-sm text-gray-600">Testes Aprovados</div>
            </div>
            
            {/* Stats dinâmicas baseadas no módulo */}
            {statsConfig?.stats.map((stat, index) => (
              <div key={index} className={`text-center p-4 ${stat.color} rounded-lg`}>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </Card.Content>
      </Card>

      {/* Test Cases Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tests.map((test) => {
          const Icon = test.icon;
          const result = getTestResult(test.name);

          return (
            <Card key={test.id} className={`${test.bgColor} ${test.borderColor} border-2`}>
              <Card.Content className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-white">
                      <Icon className={`w-5 h-5 ${test.color}`} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{test.name}</h3>
                      <p className="text-sm text-gray-600">{test.description}</p>
                    </div>
                  </div>
                  {getStatusIcon(test.name)}
                </div>

                <div className="flex items-center justify-between mb-3">
                  {getStatusBadge(test.name)}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => runSingleTest(test)}
                    disabled={currentTest === test.id || isRunning}
                  >
                    {currentTest === test.id ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <Play className="w-3 h-3" />
                    )}
                  </Button>
                </div>

                {result && (
                  <div className="mt-3 p-2 bg-white rounded text-xs">
                    <div className={`font-medium ${result.success ? 'text-green-700' : 'text-red-700'}`}>
                      {result.message}
                    </div>
                    {result.error && (
                      <div className="text-red-600 mt-1">{result.error}</div>
                    )}
                  </div>
                )}
              </Card.Content>
            </Card>
          );
        })}
      </div>

      {/* Loading State */}
      {loading && (
        <Card className="backdrop-blur-xl bg-white/10 dark:bg-gray-900/10 border border-white/20 dark:border-gray-700/20">
          <Card.Content className="p-6 text-center">
            <LoadingSpinner size="lg" />
            <p className="text-gray-600 mt-2">Executando teste...</p>
          </Card.Content>
        </Card>
      )}

      {/* Error State */}
      {error && (
        <ErrorState 
          title={`Erro no Sistema ${moduleName}`}
          message={error}
          action={
            <Button onClick={() => window.location.reload()}>
              Recarregar Página
            </Button>
          }
        />
      )}
    </div>
  );
};

export default IntegrationTest;
