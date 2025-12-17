/**
 * Componente de status dos serviços AI
 * @module modules/AI/components/AIServicesStatus
 * @description
 * Componente que exibe o status de todos os provedores de IA conectados,
 * incluindo status de conexão (active, inactive, loading, error), badges
 * de status, ícones visuais e detalhes opcionais de cada provedor.
 * @since 1.0.0
 */
import React from 'react';
import { CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react';
import { Card } from '@/shared/components/ui/Card'
import Badge from '@/shared/components/ui/Badge';
import { LoadingSpinner } from '@/shared/components/ui/LoadingStates';
import { useAI } from '../hooks';
import { AIProvider } from '../types';

interface AIServicesStatusProps {
  className?: string;
  showDetails?: boolean;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

const AIServicesStatus: React.FC<AIServicesStatusProps> = ({ className = '',
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
    } ;

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
    } ;

  const getProviderName = (provider: AIProvider): string => {
    const names: Record<AIProvider, string> = {
      openai: 'OpenAI',
      claude: 'Claude (Anthropic)',
      gemini: 'Google Gemini',
      anthropic: 'Anthropic',
      cohere: 'Cohere'};

    return names[provider] || provider;};

  if (servicesLoading) { return (
        <>
      <Card className={className } />
      <Card.Header />
          <Card.Title>Status dos Serviços</Card.Title>
        </Card.Header>
        <Card.Content />
          <div className=" ">$2</div><LoadingSpinner / /></div></Card.Content>
      </Card>);

  }

  const availableProviders = providers.getAvailableProviders();

  const totalProviders = Object.keys(providers.providers).length;

  return (
        <>
      <Card className={className } />
      <Card.Header />
        <Card.Title>Status dos Serviços</Card.Title>
        <Card.Description />
          {availableProviders.length} de {totalProviders} provedores disponíveis
        </Card.Description>
      </Card.Header>
      <Card.Content />
        <div className="{/* Resumo */}">$2</div>
          <div className=" ">$2</div><div className=" ">$2</div><div className="{availableProviders.length}">$2</div>
              </div>
              <div className="text-sm text-green-600">Ativos</div>
            <div className=" ">$2</div><div className="{totalProviders - availableProviders.length}">$2</div>
              </div>
              <div className="text-sm text-red-600">Inativos</div>
            <div className=" ">$2</div><div className="{totalProviders}">$2</div>
              </div>
              <div className="text-sm text-blue-600">Total</div>
            <div className=" ">$2</div><div className="{Math.round((availableProviders.length / totalProviders) * 100)}%">$2</div>
              </div>
              <div className="text-sm text-purple-600">Disponível</div>
          </div>

          {/* Lista de provedores */}
          {showDetails && (
            <div className=" ">$2</div><h4 className="font-semibold text-gray-900">Provedores</h4>
              {Object.entries(providers.providers).map(([provider, data]) => {
                const providerData = data as { capabilities: string[]; api_key_configured?: boolean};

                const isAvailable = availableProviders.includes(provider as AIProvider);

                const status = isAvailable ? 'active' : 'inactive';
                
                return (
        <>
      <div 
                    key={ provider }
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
      </div><div className="{getStatusIcon(status)}">$2</div>
                      <div>
           
        </div><div className="font-medium">{getProviderName(provider as AIProvider)}</div>
                        <div className="{providerData.capabilities.length} funcionalidades">$2</div>
                        </div></div><div className="{getStatusBadge(status)}">$2</div>
                      {providerData.api_key_configured && (
                        <Badge variant="outline">API Key</Badge>
                      )}
                    </div>);

              })}
            </div>
          )}

          {/* Status dos serviços */}
          {servicesStatus && showDetails && (
            <div className=" ">$2</div><h4 className="font-semibold text-gray-900">Serviços</h4>
              {Object.entries(servicesStatus).map(([service, status]) => {
                const serviceStatus = status as { status: string; name: string; last_check: string; response_time?: number};

                return (
        <>
      <div 
                  key={ service }
                  className="flex items-center justify-between p-3 border rounded-lg">
      </div><div className="{getStatusIcon(serviceStatus.status)}">$2</div>
                    <div>
           
        </div><div className="font-medium">{serviceStatus.name}</div>
                      <div className="Última verificação: {new Date(serviceStatus.last_check).toLocaleTimeString('pt-BR')}">$2</div>
                      </div></div><div className="{getStatusBadge(serviceStatus.status)}">$2</div>
                    {serviceStatus.response_time && (
                      <Badge variant="outline" />
                        {serviceStatus.response_time}ms
                      </Badge>
                    )}
                  </div>);

              })}
            </div>
          )}
        </div>
      </Card.Content>
    </Card>);};

export default AIServicesStatus;
