import React, { useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import aiService from '../services/aiService';
import { LoadingSpinner } from '@/components/ui/LoadingStates';
interface ConnectionResult {
  [provider: string]: {
    success: boolean;
    error?: string;
    response_time?: number;
  };
}
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
        }
      });
    } finally {
      setTesting(false);
    }
  };
  const getStatusIcon = (result: any) => {
    if (!result) return '⏳';
    return result.success ? '✅' : '❌';
  };
  const getStatusText = (result: any) => {
    if (!result) return 'Aguardando teste';
    if (result.success) return 'Conectado com sucesso';
    return `Erro: ${result.error || 'Falha na conexão'}`;
  };
  const getProviderName = (provider: string) => {
    const names = {
      openai: 'OpenAI',
      claude: 'Anthropic Claude',
      gemini: 'Google Gemini'
    };
    return names[provider as keyof typeof names] || provider;
  };
  const getProviderIcon = (provider: string) => {
    switch (provider) {
      case 'openai': return '🤖';
      case 'claude': return '🧠';
      case 'gemini': return '💎';
      default: return '🔮';
    }
  };
  return (
    <Card>
      <Card.Header>
        <Card.Title>🔗 Teste de Conectividade</Card.Title>
        <p className="text-sm text-gray-600">
          Teste a conectividade com os providers de IA configurados
        </p>
      </Card.Header>
      <Card.Content className="space-y-4">
        <Button 
          onClick={testConnections} 
          disabled={testing}
          className="w-full"
        >
          {testing ? 'Testando Conexões...' : '🔄 Testar Todas as Conexões'}
        </Button>
        {testing && (
          <LoadingSpinner text="Testando conectividade com providers..." />
        )}
        {Object.keys(results).length > 0 && (
          <div className="space-y-3">
            <h3 className="font-medium text-gray-900">Resultados dos Testes:</h3>
            {Object.entries(results).map(([provider, result]) => (
              <div 
                key={provider} 
                className={`flex items-center justify-between p-3 rounded-lg border ${
                  result.success 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-red-50 border-red-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{getProviderIcon(provider)}</span>
                  <div>
                    <div className="font-medium">{getProviderName(provider)}</div>
                    <div className={`text-sm ${
                      result.success ? 'text-green-700' : 'text-red-700'
                    }`}>
                      {getStatusText(result)}
                    </div>
                    {result.response_time && (
                      <div className="text-xs text-gray-500">
                        Tempo de resposta: {result.response_time}ms
                      </div>
                    )}
                  </div>
                </div>
                <span className="text-xl">{getStatusIcon(result)}</span>
              </div>
            ))}
            {/* Summary */}
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600">
                <strong>Resumo:</strong> {' '}
                {Object.values(results).filter(r => r.success).length} de {Object.keys(results).length} providers conectados
              </div>
            </div>
          </div>
        )}
      </Card.Content>
    </Card>
  );
});
export default ConnectionTester;
