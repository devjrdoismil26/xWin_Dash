import React, { useState, useEffect } from 'react';
import Card from '@/shared/components/ui/Card';
import Button from '@/shared/components/ui/Button';
import { LoadingSpinner } from '@/shared/components/ui/LoadingStates';
import { EmptyStates } from '@/shared/components/ui/EmptyState';
import { useAI } from '@/modules/AI/hooks/useAI';
import UnifiedGenerationInterface from './UnifiedGenerationInterface';
import ConnectionTester from './ConnectionTester';
import NotificationContainer from '@/shared/components/ui/NotificationContainer';
interface MetricsCardsProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: string;
  color?: string;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }
const MetricCard: React.FC<MetricsCardsProps> = ({ title, value, subtitle, icon, color = 'blue'    }) => (
  <Card />
    <Card.Content className="p-4" />
      <div className=" ">$2</div><div>
           
        </div><p className="text-sm text-gray-600">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
        {icon && (
          <div className={`text-2xl p-2 rounded-lg bg-${color} -100 text-${color}-600`}>
           
        </div>{icon}
          </div>
        )}
      </div>
    </Card.Content>
  </Card>);

const ProvidersStatus: React.FC<{ providers: Record<string, any> }> = ({ providers }) => {
  const getProviderIcon = (key: string) => {
    switch (key) {
      case 'openai': return '🤖';
      case 'claude': return '🧠';
      case 'gemini': return '💎';
      default: return '🔮';
    } ;

  const getProviderStatus = (provider: Record<string, any>) => {
    // Check if provider has models and capabilities
    const hasModels = provider.models && provider.models.length > 0;
    const hasCapabilities = provider.capabilities && provider.capabilities.length > 0;
    return hasModels && hasCapabilities;};

  return (
        <>
      <Card />
      <Card.Header />
        <Card.Title>Status dos Providers de IA</Card.Title>
        <p className="text-sm text-gray-600">Providers configurados e disponíveis</p>
      </Card.Header>
      <Card.Content />
        <div className="{Object.entries(providers).map(([key, provider]: [string, Record">$2</div><string, any>]) => {
            const isActive = getProviderStatus(provider);

            return (
        <>
      <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
      </div><div className=" ">$2</div><span className="text-xl">{getProviderIcon(key)}</span>
                  <div>
           
        </div><div className="font-medium">{provider.name}</div>
                    <div className="{provider.models?.length || 0} modelos • {provider.capabilities?.length || 0} capacidades">$2</div>
                    </div>
                    <div className="{provider.strengths?.slice(0, 2).join(', ')}">$2</div>
                    </div></div><div className={`w-3 h-3 rounded-full ${isActive ? 'bg-green-500' : 'bg-yellow-500'} `} 
                     title={ isActive ? 'Ativo' : 'Configuração incompleta' } />
           
        </div></div>);

          })}
        </div>
        {Object.keys(providers).length === 0 && (
          <div className=" ">$2</div><div className="text-4xl mb-2">🔧</div>
            <p className="font-medium">Nenhum provider configurado</p>
            <p className="text-sm">Configure suas chaves de API para começar</p>
      </div>
    </>
  )}
      </Card.Content>
    </Card>);};

const RecentGenerations: React.FC<{ history: Record<string, any>[] }> = ({ history }) => (
  <Card />
    <Card.Header />
      <Card.Title>Gerações Recentes</Card.Title>
    </Card.Header>
    <Card.Content />
      {history.length === 0 ? (
        <EmptyStates.NoHistory / />
      ) : (
        <div className="{history.slice(0, 5).map((item: unknown, index: unknown) => (">$2</div>
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
           
        </div><div className=" ">$2</div><div className="font-medium truncate">{item.prompt?.substring(0, 50)}...</div>
                <div className="text-sm text-gray-500">{item.provider} • {item.tokens_used} tokens</div>
              <div className="{new Date(item.created_at).toLocaleDateString()}">$2</div>
    </div>
  ))}
        </div>
      )}
    </Card.Content>
  </Card>);

const EnhancedAnalyticsDashboard: React.FC<{ data?: Record<string, any> }> = React.memo(function EnhancedAnalyticsDashboard({ data = {} as any }) {
  const { providers, stats, history, loadStats, loadHistory, loading } = useAI();

  const [activeTab, setActiveTab] = useState<'dashboard' | 'generate' | 'settings'>('dashboard');

  useEffect(() => {
    loadStats();

    loadHistory({ per_page: 10 });

  }, [loadStats, loadHistory]);

  if (loading && !stats && !history.length) {
    return <LoadingSpinner text="Carregando dashboard de IA..." />;
  }
  return (
            <div className="{/* Navigation Tabs */}">$2</div>
      <div className=" ">$2</div><Button
          variant={ activeTab === 'dashboard' ? 'default' : 'ghost' }
          onClick={ () => setActiveTab('dashboard') }
          className="flex-1"
        >
          📊 Dashboard
        </Button>
        <Button
          variant={ activeTab === 'generate' ? 'default' : 'ghost' }
          onClick={ () => setActiveTab('generate') }
          className="flex-1"
        >
          ✨ Gerar Conteúdo
        </Button>
        <Button
          variant={ activeTab === 'settings' ? 'default' : 'ghost' }
          onClick={ () => setActiveTab('settings') }
          className="flex-1"
        >
          ⚙️ Configurações
        </Button>
      </div>
      {activeTab === 'dashboard' ? (
        <>
          {/* Metrics Cards */}
          <div className=" ">$2</div><MetricCard 
              title="Total de Gerações" 
              value={ stats?.total_generations?.toLocaleString('pt-BR') || 0 }
              subtitle="Desde o início"
              icon="🚀"
              color="blue"
            / />
            <MetricCard 
              title="Tokens Usados" 
              value={ stats?.total_tokens?.toLocaleString('pt-BR') || 0 }
              subtitle="Total processado"
              icon="🔢"
              color="green"
            / />
            <MetricCard 
              title="Custo Total" 
              value={new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'USD' }).format(stats?.total_cost || 0)}
              subtitle="Investimento em IA"
              icon="💰"
              color="yellow"
            / />
            <MetricCard 
              title="Provider Favorito" 
              value={ stats?.favorite_provider || 'Gemini' }
              subtitle="Mais utilizado"
              icon="⭐"
              color="purple"
            / /></div><div className="{/* Providers Status */}">$2</div>
            <ProvidersStatus providers={ providers  }>
          {/* Recent Generations */}
            <RecentGenerations history={history} / />
          </div>
          {/* Monthly Stats */}
          {stats?.this_month && (
            <Card />
              <Card.Header />
                <Card.Title>Estatísticas do Mês</Card.Title>
              </Card.Header>
              <Card.Content />
                <div className=" ">$2</div><div className=" ">$2</div><div className="text-2xl font-bold text-blue-600">{stats.this_month.generations}</div>
                    <div className="text-sm text-gray-500">Gerações</div>
                  <div className=" ">$2</div><div className="text-2xl font-bold text-green-600">{stats.this_month.tokens.toLocaleString()}</div>
                    <div className="text-sm text-gray-500">Tokens</div>
                  <div className=" ">$2</div><div className="{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'USD' }).format(stats.this_month.cost)}">$2</div>
                    </div>
                    <div className="text-sm text-gray-500">Custo</div></div></Card.Content>
      </Card>
    </>
  )}
        </>
      ) : activeTab === 'generate' ? (
        <UnifiedGenerationInterface / />
      ) : (
        <div className=" ">$2</div><ConnectionTester / />
          <Card />
            <Card.Header />
              <Card.Title>🔑 Configurações de API</Card.Title>
              <p className="text-sm text-gray-600" />
                Configure suas chaves de API para os diferentes providers
              </p>
            </Card.Header>
            <Card.Content />
              <div className=" ">$2</div><div className=" ">$2</div><h4 className="font-medium text-blue-900 mb-2">📝 Como configurar</h4>
                  <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside" />
                    <li>Acesse as Configurações → IA no menu principal</li>
                    <li>Insira suas chaves de API para cada provider</li>
                    <li>Teste a conectividade usando o botão acima</li>
                    <li>Comece a usar a IA para gerar conteúdo!</li></ol></div>
                <div className=" ">$2</div><div className=" ">$2</div><div className="text-2xl mb-2">🤖</div>
                    <h4 className="font-medium">OpenAI</h4>
                    <p className="text-sm text-gray-600">GPT-4, DALL-E, Whisper</p></div><div className=" ">$2</div><div className="text-2xl mb-2">🧠</div>
                    <h4 className="font-medium">Claude</h4>
                    <p className="text-sm text-gray-600">Raciocínio avançado</p></div><div className=" ">$2</div><div className="text-2xl mb-2">💎</div>
                    <h4 className="font-medium">Gemini</h4>
                    <p className="text-sm text-gray-600">Multimodal do Google</p></div></div>
            </Card.Content></Card></div>
      )}
      <NotificationContainer / />
    </div>);

});

export default EnhancedAnalyticsDashboard;
