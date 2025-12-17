/**
 * Componente ConnectionTester - Testador de Conexões de IA
 * @module modules/AI/components/ConnectionTester
 * @description
 * Componente para testar conexões com provedores de IA, exibindo status de conexão,
 * tempo de resposta, erros e resultados de testes para cada provedor.
 * @since 1.0.0
 */
import React, { useState } from 'react';
import Card from '@/shared/components/ui/Card';
import Button from '@/shared/components/ui/Button';
import aiService from '../services/aiService';
import { LoadingSpinner } from '@/shared/components/ui/LoadingStates';

/**
 * Interface ConnectionResult - Resultado de teste de conexão
 * @interface ConnectionResult
 * @description
 * Mapeamento de provedor para resultado de teste de conexão.
 * @property {object} [provider] - Resultado do teste para o provedor
 * @property {boolean} provider.success - Se a conexão foi bem-sucedida
 * @property {string} [provider.error] - Mensagem de erro (opcional)
 * @property {number} [provider.response_time] - Tempo de resposta em ms (opcional)
 */
interface ConnectionResult {
  [provider: string]: {
    success: boolean;
  error?: string;
  response_time?: number; };

}

/**
 * Componente ConnectionTester - Testador de Conexões de IA
 * @component
 * @description
 * Componente que renderiza interface para testar conexões com provedores de IA,
 * exibindo status de conexão, tempo de resposta e erros para cada provedor.
 * 
 * @returns {JSX.Element} Componente de teste de conexões
 * 
 * @example
 * ```tsx
 * <ConnectionTester / />
 * ```
 */
const ConnectionTester: React.FC = React.memo(function ConnectionTester() {
  const [results, setResults] = useState<ConnectionResult>({});

  const [testing, setTesting] = useState(false);

  const testConnections = async () => {
    setTesting(true);

    setResults({});

    try {
      const connectionResults = await aiService.testConnections();

      setResults(connectionResults);

    } catch (error) {
      setResults({
        error: {
          success: false,
          error: 'Falha ao testar conexões'
        } );

    } finally {
      setTesting(false);

    } ;

  const getStatusIcon = (result: Record<string, any>) => {
    if (!result) return '⏳';
    return result.success ? '✅' : '❌';};

  const getStatusText = (result: Record<string, any>) => {
    if (!result) return 'Aguardando teste';
    if (result.success) return 'Conectado com sucesso';
    return `Erro: ${result.error || 'Falha na conexão'}`;};

  const getProviderName = (provider: string) => {
    const names = {
      openai: 'OpenAI',
      claude: 'Anthropic Claude',
      gemini: 'Google Gemini'};

    return names[provider as keyof typeof names] || provider;};

  const getProviderIcon = (provider: string) => {
    switch (provider) {
      case 'openai': return '🤖';
      case 'claude': return '🧠';
      case 'gemini': return '💎';
      default: return '🔮';
    } ;

  return (
        <>
      <Card />
      <Card.Header />
        <Card.Title>🔗 Teste de Conectividade</Card.Title>
        <p className="text-sm text-gray-600" />
          Teste a conectividade com os providers de IA configurados
        </p>
      </Card.Header>
      <Card.Content className="space-y-4" />
        <Button 
          onClick={ testConnections }
          disabled={ testing }
          className="w-full" />
          {testing ? 'Testando Conexões...' : '🔄 Testar Todas as Conexões'}
        </Button>
        {testing && (
          <LoadingSpinner text="Testando conectividade com providers..." / />
        )}
        {Object.keys(results).length > 0 && (
          <div className=" ">$2</div><h3 className="font-medium text-gray-900">Resultados dos Testes:</h3>
            {Object.entries(results).map(([provider, result]) => (
              <div 
                key={ provider }
                className={`flex items-center justify-between p-3 rounded-lg border ${
                  result.success 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-red-50 border-red-200'
                } `}>
           
        </div><div className=" ">$2</div><span className="text-lg">{getProviderIcon(provider)}</span>
                  <div>
           
        </div><div className="font-medium">{getProviderName(provider)}</div>
                    <div className={`text-sm ${
                      result.success ? 'text-green-700' : 'text-red-700'
                    } `}>
           
        </div>{getStatusText(result)}
                    </div>
                    {result.response_time && (
                      <div className="Tempo de resposta: {result.response_time}ms">$2</div>
    </div>
  )}
                  </div>
                <span className="text-xl">{getStatusIcon(result)}</span>
      </div>
    </>
  ))}
            {/* Summary */}
            <div className=" ">$2</div><div className=" ">$2</div><strong>Resumo:</strong> {' '}
                {Object.values(results).filter(r => r.success).length} de {Object.keys(results).length} providers conectados
              </div>
    </div>
  )}
      </Card.Content>
    </Card>);

});

export default ConnectionTester;
