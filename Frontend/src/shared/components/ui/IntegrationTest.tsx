/**
 * Componente IntegrationTest - Teste de Integração
 *
 * @description
 * Componente genérico para testes de integração que consolida todos os arquivos
 * *IntegrationTest.tsx duplicados. Fornece uma interface reutilizável para executar
 * testes de módulos, exibir resultados, status e estatísticas. Suporta execução
 * individual ou em lote de testes.
 *
 * @example
 * ```tsx
 * <IntegrationTest
 *   moduleName="Email Marketing"
 *   moduleDescription="Testes de integração do módulo de email marketing"
 *   tests={ [
 *     {
 *       id: 'test-1',
 *       name: 'Envio de Email',
 *       description: 'Testa envio de email',
 *       icon: Mail,
 *       action: async () => await sendTestEmail()
 *      }
 *   ]}
 * />
 * ```
 *
 * @module components/ui/IntegrationTest
 * @since 1.0.0
 */
import React, { useState } from "react";
import { Play, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { getErrorMessage } from '@/utils/errorHelpers';
import Card from "@/shared/components/ui/Card";
import Button from "@/shared/components/ui/Button";
import Badge from "@/shared/components/ui/Badge";
import { LoadingSpinner } from '@/shared/components/ui/LoadingStates';
import { ErrorState } from '@/shared/components/ui/ErrorState';

/**
 * Caso de teste de integração
 *
 * @description
 * Interface que define um caso de teste individual para execução.
 *
 * @interface TestCase
 * @property {string} id - ID único do teste
 * @property {string} name - Nome do teste
 * @property {string} description - Descrição do teste
 * @property {React.ComponentType<any>} icon - Componente de ícone para o teste
 * @property {string} color - Cor do ícone
 * @property {string} bgColor - Cor de fundo do card
 * @property {string} borderColor - Cor da borda do card
 * @property {() => Promise<{ success: boolean; message: string; data?: string; error?: string }>} action - Função assíncrona que executa o teste
 */
export interface TestCase {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  bgColor: string;
  borderColor: string;
  action: () => Promise<{
    success: boolean;
  message: string;
  data?: string;
  error?: string; }>;
}

/**
 * Resultado de um teste executado
 *
 * @description
 * Interface que define o resultado de um teste após sua execução.
 *
 * @interface TestResult
 * @property {string} test - Nome do teste executado
 * @property {boolean} success - Se o teste foi bem-sucedido
 * @property {string} message - Mensagem de resultado
 * @property {any} [data] - Dados adicionais retornados pelo teste
 * @property {string} [error] - Mensagem de erro se o teste falhou
 */
export interface TestResult {
  /** Nome do teste executado */
  test: string;
  /** Se o teste foi bem-sucedido */
  success: boolean;
  /** Mensagem de resultado */
  message: string;
  /** Dados adicionais retornados pelo teste */
  data?: string;
  /** Mensagem de erro se o teste falhou */
  error?: string; }

/**
 * Props do componente IntegrationTest
 *
 * @description
 * Propriedades que podem ser passadas para o componente IntegrationTest.
 *
 * @interface IntegrationTestProps
 * @property {string} moduleName - Nome do módulo sendo testado
 * @property {string} moduleDescription - Descrição do módulo sendo testado
 * @property {TestCase[]} tests - Array de casos de teste para executar
 * @property { stats: Array<{ label: string; value: number; color: string }> } [statsConfig] - Configuração de estatísticas opcionais
 * @property {boolean} [loading] - Se está em estado de loading inicial
 * @property {string | null} [error] - Mensagem de erro inicial
 */
export interface IntegrationTestProps {
  moduleName: string;
  moduleDescription: string;
  tests: TestCase[];
  statsConfig?: {
stats: Array<{
label: string;
  value: number;
  color: string;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }>;};

  loading?: boolean;
  error?: string | null;
}

/**
 * Componente IntegrationTest
 *
 * @description
 * Renderiza uma interface completa de testes de integração com:
 * - Grid de cards de teste com ícones e descrições
 * - Status visual de cada teste (não testado, executando, sucesso, falhou)
 * - Execução individual ou em lote
 * - Exibição de resultados e erros
 * - Estatísticas de sucesso
 * - Estados de loading e erro
 *
 * @component
 * @param {IntegrationTestProps} props - Props do componente
 * @returns {JSX.Element} Interface completa de testes de integração
 */
const IntegrationTest: React.FC<IntegrationTestProps> = ({ moduleName,
  moduleDescription,
  tests,
  statsConfig,
  loading = false,
  error = null,
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
        error: result.error,};

      setTestResults((prev: unknown) => {
        const filtered = (prev || []).filter((r: unknown) => r.test !== test.name);

        return [...filtered, testResult];
      });

    } catch (error: unknown) {
      const testResult: TestResult = {
        test: test.name,
        success: false,
        message: "Erro inesperado",
        error: getErrorMessage(error),};

      setTestResults((prev: unknown) => {
        const filtered = (prev || []).filter((r: unknown) => r.test !== test.name);

        return [...filtered, testResult];
      });

    } finally {
      setCurrentTest(null);

    } ;

  const runAllTests = async () => {
    setIsRunning(true);

    setTestResults([]);

    for (const test of tests) {
      await runSingleTest(test);

      await new Promise((resolve: unknown) => setTimeout(resolve, 500));

    }

    setIsRunning(false);};

  const getTestResult = (testName: string) => {
    return testResults.find((r: unknown) => r.test === testName);};

  const getStatusIcon = (testName: string) => {
    const result = getTestResult(testName);

    const isRunning =
      currentTest === tests.find((t: unknown) => t.name === testName)?.id;

    if (isRunning) {
      return <Loader2 className="w-4 h-4 animate-spin text-blue-500" />;
    }

    if (!result) {
      return <div className="w-4 h-4 rounded-full bg-gray-300" />;
    }

    return result.success ? (
      <CheckCircle className="w-4 h-4 text-green-500" />
    ) : (
      <XCircle className="w-4 h-4 text-red-500" />);};

  const getStatusBadge = (testName: string) => {
    const result = getTestResult(testName);

    const isRunning =
      currentTest === tests.find((t: unknown) => t.name === testName)?.id;

    if (isRunning) {
      return <Badge variant="secondary">Executando...</Badge>;
    }

    if (!result) {
      return <Badge variant="outline">Não testado</Badge>;
    }

    return result.success ? (
      <Badge variant="success">Sucesso</Badge>
    ) : (
      <Badge variant="destructive">Falhou</Badge>);};

  const successCount = (testResults || []).filter((r: unknown) => r.success).length;
  const totalTests = tests.length;

  return (
            <div className="{/* Header */}">$2</div>
      <div className=" ">$2</div><div>
           
        </div><h2 className="text-2xl font-bold text-gray-900" />
            Teste de Integração {moduleName}
          </h2>
          <p className="text-gray-600">{moduleDescription}</p></div><Button
          onClick={ runAllTests }
          disabled={ isRunning }
          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700" />
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
      <Card className="backdrop-blur-xl bg-white/10 dark:bg-gray-900/10 border border-white/20 dark:border-gray-700/20 hover:bg-white/20 dark:hover:bg-gray-900/20 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10" />
        <Card.Header />
          <Card.Title>Status dos Testes</Card.Title>
        </Card.Header>
        <Card.Content />
          <div className=" ">$2</div><div className=" ">$2</div><div className="{successCount}/{totalTests}">$2</div>
              </div>
              <div className="text-sm text-gray-600">Testes Aprovados</div>

            {/* Stats dinâmicas baseadas no módulo */}
            {statsConfig?.(stats || []).map((stat: unknown, index: unknown) => (
              <div
                key={ index }
                className={`text-center p-4 ${stat.color} rounded-lg`}>
           
        </div><div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
            ))}
          </div>
        </Card.Content>
      </Card>

      {/* Test Cases Grid */}
      <div className="{(tests || []).map((test: unknown) => {">$2</div>
          const Icon = test.icon;
          const result = getTestResult(test.name);

          return (
        <>
      <Card
              key={ test.id }
              className={`${test.bgColor} ${test.borderColor} border-2`} />
      <Card.Content className="p-4" />
                <div className=" ">$2</div><div className=" ">$2</div><div className=" ">$2</div><Icon className={`w-5 h-5 ${test.color} `} / /></div><div>
           
        </div><h3 className="font-semibold text-gray-900" />
                        {test.name}
                      </h3>
                      <p className="text-sm text-gray-600" />
                        {test.description}
                      </p>
                    </div>
                  {getStatusIcon(test.name)}
                </div>

                <div className="{getStatusBadge(test.name)}">$2</div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={ () => runSingleTest(test) }
                    disabled={ currentTest === test.id || isRunning  }>
                    {currentTest === test.id ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <Play className="w-3 h-3" />
                    )}
                  </Button>
                </div>

                {result && (
                  <div className=" ">$2</div><div
                      className={`font-medium ${result.success ? "text-green-700" : "text-red-700"} `}>
           
        </div>{result.message}
                    </div>
                    {result.error && (
                      <div className="text-red-600 mt-1">{result.error}</div>
                    )}
                  </div>
                )}
              </Card.Content>
            </Card>);

        })}
      </div>

      {/* Loading State */}
      {loading && (
        <Card className="backdrop-blur-xl bg-white/10 dark:bg-gray-900/10 border border-white/20 dark:border-gray-700/20" />
          <Card.Content className="p-6 text-center" />
            <LoadingSpinner size="lg" / />
            <p className="text-gray-600 mt-2">Executando teste...</p>
          </Card.Content>
      </Card>
    </>
  )}

      {/* Error State */}
      {error && (
        <ErrorState
          title={`Erro no Sistema ${moduleName}`}
          message={ error }
          action={ <Button onClick={() => window.location.reload()  }>
              Recarregar Página
            </Button>
  } />
      )}
    </div>);};

export default IntegrationTest;
