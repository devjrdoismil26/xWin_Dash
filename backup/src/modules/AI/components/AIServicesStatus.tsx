/**
 * Componente de status dos serviços AI
 * Exibe o status de todos os provedores conectados
 */
import React from 'react';
import { CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react';
import { Card } from "@/components/ui/Card"
import Badge from '@/components/ui/Badge';
import { LoadingSpinner } from '@/components/ui/LoadingStates';
import { useAI } from '../hooks';
import { AIProvider } from '../types';

interface AIServicesStatusProps {
  className?: string;
  showDetails?: boolean;
}

const AIServicesStatus: React.FC<AIServicesStatusProps> = ({
  className = '',
  showDetails = true
}) => {
  const { providers, servicesStatus, servicesLoading } = useAI();

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'inactive':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'loading':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'error':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return <Badge variant="success">Ativo</Badge>;
      case 'inactive':
        return <Badge variant="destructive">Inativo</Badge>;
      case 'loading':
        return <Badge variant="secondary">Carregando</Badge>;
      case 'error':
        return <Badge variant="destructive">Erro</Badge>;
      default:
        return <Badge variant="secondary">Desconhecido</Badge>;
    }
  };

  const getProviderName = (provider: AIProvider): string => {
    const names: Record<AIProvider, string> = {
      openai: 'OpenAI',
      claude: 'Claude (Anthropic)',
      gemini: 'Google Gemini',
      anthropic: 'Anthropic',
      cohere: 'Cohere'
    };
    return names[provider] || provider;
  };

  if (servicesLoading) {
    return (
      <Card className={className}>
        <Card.Header>
          <Card.Title>Status dos Serviços</Card.Title>
        </Card.Header>
        <Card.Content>
          <div className="flex justify-center items-center h-32">
            <LoadingSpinner />
          </div>
        </Card.Content>
      </Card>
    );
  }

  const availableProviders = providers.getAvailableProviders();
  const totalProviders = Object.keys(providers.providers).length;

  return (
    <Card className={className}>
      <Card.Header>
        <Card.Title>Status dos Serviços</Card.Title>
        <Card.Description>
          {availableProviders.length} de {totalProviders} provedores disponíveis
        </Card.Description>
      </Card.Header>
      <Card.Content>
        <div className="space-y-4">
          {/* Resumo */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {availableProviders.length}
              </div>
              <div className="text-sm text-green-600">Ativos</div>
            </div>
            <div className="text-center p-3 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">
                {totalProviders - availableProviders.length}
              </div>
              <div className="text-sm text-red-600">Inativos</div>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {totalProviders}
              </div>
              <div className="text-sm text-blue-600">Total</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {Math.round((availableProviders.length / totalProviders) * 100)}%
              </div>
              <div className="text-sm text-purple-600">Disponível</div>
            </div>
          </div>

          {/* Lista de provedores */}
          {showDetails && (
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900">Provedores</h4>
              {Object.entries(providers.providers).map(([provider, data]) => {
                const isAvailable = availableProviders.includes(provider as AIProvider);
                const status = isAvailable ? 'active' : 'inactive';
                
                return (
                  <div 
                    key={provider}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {getStatusIcon(status)}
                      <div>
                        <div className="font-medium">{getProviderName(provider as AIProvider)}</div>
                        <div className="text-sm text-gray-500">
                          {data.capabilities.length} funcionalidades
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(status)}
                      {data.api_key_configured && (
                        <Badge variant="outline">API Key</Badge>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Status dos serviços */}
          {servicesStatus && showDetails && (
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900">Serviços</h4>
              {Object.entries(servicesStatus).map(([service, status]) => (
                <div 
                  key={service}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    {getStatusIcon(status.status)}
                    <div>
                      <div className="font-medium">{status.name}</div>
                      <div className="text-sm text-gray-500">
                        Última verificação: {new Date(status.last_check).toLocaleTimeString('pt-BR')}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(status.status)}
                    {status.response_time && (
                      <Badge variant="outline">
                        {status.response_time}ms
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card.Content>
    </Card>
  );
};

export default AIServicesStatus;
