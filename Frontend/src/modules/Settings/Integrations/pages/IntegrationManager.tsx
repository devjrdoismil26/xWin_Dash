import React, { useState, useEffect } from 'react';
import { apiClient } from '@/services';
import Card from '@/shared/components/ui/Card';
import Button from '@/shared/components/ui/Button';
import Badge from '@/shared/components/ui/Badge';
import Input from '@/shared/components/ui/Input';
import InputLabel from '@/shared/components/ui/InputLabel';
import useToast from '@/shared/components/ui/useToast';
import { useApiConfigurations } from '@/modules/Settings/hooks/useApiConfigurations';
import { Activity, AlertTriangle, CheckCircle, Clock, Database, Globe, RefreshCw, Settings, TrendingUp, Zap, BarChart3, Shield, Timer } from 'lucide-react';
const integrations = [
  {
    id: 'openai',
    name: 'OpenAI',
    description: 'Inteligência Artificial para geração de conteúdo',
    icon: '🤖',
    status: 'connected',
    category: 'ai',
    fields: [
      { key: 'api_key', label: 'API Key', type: 'password', required: true },
      { key: 'model', label: 'Modelo', type: 'select', options: ['gpt-4', 'gpt-3.5-turbo'] },
      { key: 'max_tokens', label: 'Max Tokens', type: 'number' },
    ]
  },
  {
    id: 'claude',
    name: 'Claude (Anthropic)',
    description: 'IA avançada da Anthropic',
    icon: '🧠',
    status: 'disconnected',
    category: 'ai',
    fields: [
      { key: 'api_key', label: 'API Key', type: 'password', required: true },
      { key: 'model', label: 'Modelo', type: 'select', options: ['claude-3-opus', 'claude-3-sonnet', 'claude-3-haiku'] },
      { key: 'max_tokens', label: 'Max Tokens', type: 'number' },
    ]
  },
  {
    id: 'gemini',
    name: 'Google Gemini',
    description: 'IA multimodal do Google',
    icon: '💎',
    status: 'disconnected',
    category: 'ai',
    fields: [
      { key: 'api_key', label: 'API Key', type: 'password', required: true },
      { key: 'model', label: 'Modelo', type: 'select', options: ['gemini-pro', 'gemini-pro-vision'] },
      { key: 'max_tokens', label: 'Max Tokens', type: 'number' },
    ]
  },
  {
    id: 'google_ads',
    name: 'Google Ads',
    description: 'Gerenciamento de campanhas publicitárias',
    icon: '📊',
    status: 'disconnected',
    category: 'ads',
    fields: [
      { key: 'developer_token', label: 'Developer Token', type: 'password', required: true },
      { key: 'client_id', label: 'Client ID', type: 'text', required: true },
      { key: 'client_secret', label: 'Client Secret', type: 'password', required: true },
      { key: 'refresh_token', label: 'Refresh Token', type: 'password', required: true },
      { key: 'customer_id', label: 'Customer ID', type: 'text', required: true },
    ]
  },
  {
    id: 'facebook_ads',
    name: 'Facebook Ads',
    description: 'Campanhas publicitárias do Facebook',
    icon: '📘',
    status: 'disconnected',
    category: 'ads',
    fields: [
      { key: 'app_id', label: 'App ID', type: 'text', required: true },
      { key: 'app_secret', label: 'App Secret', type: 'password', required: true },
      { key: 'access_token', label: 'Access Token', type: 'password', required: true },
      { key: 'ad_account_id', label: 'Ad Account ID', type: 'text', required: true },
    ]
  },
  {
    id: 'instagram_ads',
    name: 'Instagram Ads',
    description: 'Anúncios no Instagram',
    icon: '📸',
    status: 'disconnected',
    category: 'ads',
    fields: [
      { key: 'app_id', label: 'App ID', type: 'text', required: true },
      { key: 'app_secret', label: 'App Secret', type: 'password', required: true },
      { key: 'access_token', label: 'Access Token', type: 'password', required: true },
      { key: 'instagram_account_id', label: 'Instagram Account ID', type: 'text', required: true },
    ]
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp Business',
    description: 'API do WhatsApp para mensagens',
    icon: '💬',
    status: 'disconnected',
    category: 'messaging',
    fields: [
      { key: 'phone_number_id', label: 'Phone Number ID', type: 'text', required: true },
      { key: 'access_token', label: 'Access Token', type: 'password', required: true },
      { key: 'webhook_verify_token', label: 'Webhook Verify Token', type: 'password', required: true },
      { key: 'business_account_id', label: 'Business Account ID', type: 'text', required: true },
    ]
  },
  {
    id: 'twitter',
    name: 'Twitter/X',
    description: 'Integração com Twitter/X',
    icon: '🐦',
    status: 'disconnected',
    category: 'social',
    fields: [
      { key: 'consumer_key', label: 'Consumer Key', type: 'text', required: true },
      { key: 'consumer_secret', label: 'Consumer Secret', type: 'password', required: true },
      { key: 'access_token', label: 'Access Token', type: 'password', required: true },
      { key: 'access_token_secret', label: 'Access Token Secret', type: 'password', required: true },
    ]
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    description: 'Integração com LinkedIn',
    icon: '💼',
    status: 'disconnected',
    category: 'social',
    fields: [
      { key: 'client_id', label: 'Client ID', type: 'text', required: true },
      { key: 'client_secret', label: 'Client Secret', type: 'password', required: true },
      { key: 'access_token', label: 'Access Token', type: 'password', required: true },
    ]
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    description: 'Integração com TikTok',
    icon: '🎵',
    status: 'disconnected',
    category: 'social',
    fields: [
      { key: 'client_key', label: 'Client Key', type: 'text', required: true },
      { key: 'client_secret', label: 'Client Secret', type: 'password', required: true },
      { key: 'access_token', label: 'Access Token', type: 'password', required: true },
    ]
  },
  {
    id: 'email',
    name: 'Email Marketing',
    description: 'Serviços de email marketing',
    icon: '📧',
    status: 'connected',
    category: 'marketing',
    fields: [
      { key: 'provider', label: 'Provedor', type: 'select', options: ['mailgun', 'sendgrid', 'ses'] },
      { key: 'api_key', label: 'API Key', type: 'password', required: true },
      { key: 'domain', label: 'Domínio', type: 'text' },
    ]
  }
];
export default function IntegrationManager() {
  const { toast } = useToast();

  const { configurations, updateConfiguration, testConnection, isLoading } = useApiConfigurations();

  const [activeIntegration, setActiveIntegration] = useState<any>(null);

  const [formData, setFormData] = useState({});

  const [systemStatus, setSystemStatus] = useState<any>(null);

  const [showMonitoring, setShowMonitoring] = useState(false);

  useEffect(() => {
    if (activeIntegration && configurations[activeIntegration.id]) {
      setFormData(configurations[activeIntegration.id]);

    } else if (activeIntegration) {
      const initialData = {} as any;
      activeIntegration.fields.forEach(field => {
        initialData[field.key] = '';
      });

      setFormData(initialData);

    } , [activeIntegration, configurations]);

  const fetchSystemStatus = async () => {
    try {
      const data = await apiClient.get('/external-integrations/status');

      setSystemStatus(data);

    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível carregar o status do sistema.",
        variant: "destructive",
      });

    } ;

  const handleSave = async () => {
    if (!activeIntegration) return;
    try {
      await updateConfiguration(activeIntegration.id, formData);

      toast({
        title: "Configuração salva",
        description: `Configuração do ${activeIntegration.name} salva com sucesso.`,
      });

    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível salvar a configuração.",
        variant: "destructive",
      });

    } ;

  const handleTest = async () => {
    if (!activeIntegration) return;
    try {
      const result = await testConnection(activeIntegration.id);

      toast({
        title: result.success ? "Conexão bem-sucedida" : "Falha na conexão",
        description: result.message,
        variant: result.success ? "default" : "destructive",
      });

    } catch (error) {
      toast({
        title: "Erro no teste",
        description: "Não foi possível testar a conexão.",
        variant: "destructive",
      });

    } ;

  const getStatusBadge = (status: unknown) => {
    const variants = {
      connected: 'default',
      disconnected: 'secondary',
      error: 'destructive'};

    const labels = {
      connected: 'Conectado',
      disconnected: 'Desconectado',
      error: 'Erro'};

    return (
              <Badge variant={ variants[status] } />
        {labels[status]}
      </Badge>);};

  return (
            <div className=" ">$2</div><div className=" ">$2</div><div>
           
        </div><h1 className="text-3xl font-bold tracking-tight">Gerenciador de Integrações</h1>
          <p className="text-muted-foreground" />
            Configure e gerencie integrações com serviços de terceiros
          </p></div><div className=" ">$2</div><Button
            variant="outline"
            onClick={() => {
              setShowMonitoring(!showMonitoring);

              if (!showMonitoring) fetchSystemStatus();

            } >
            <BarChart3 className="h-4 w-4 mr-2" />
            {showMonitoring ? 'Ocultar Monitoramento' : 'Mostrar Monitoramento'}
          </Button>
        </div>

      {/* Dashboard de Monitoramento */}
      {showMonitoring && (
        <div className=" ">$2</div><Card />
            <Card.Header />
              <Card.Title className="flex items-center" />
                <Activity className="h-5 w-5 mr-2" />
                Status do Sistema
              </Card.Title>
            </Card.Header>
            <Card.Content />
              {systemStatus ? (
                <div className=" ">$2</div><div className=" ">$2</div><Shield className="h-8 w-8 text-blue-500" />
                    <div>
           
        </div><p className="text-sm font-medium">Rate Limiter</p>
                      <p className="text-xs text-muted-foreground" />
                        {systemStatus.services?.rate_limiter?.platforms?.length || 0} plataformas
                      </p></div><div className=" ">$2</div><Zap className="h-8 w-8 text-yellow-500" />
                    <div>
           
        </div><p className="text-sm font-medium">Circuit Breaker</p>
                      <p className="text-xs text-muted-foreground" />
                        {Object.keys(systemStatus.services?.circuit_breaker?.circuits || {}).length} circuitos
                      </p></div><div className=" ">$2</div><TrendingUp className="h-8 w-8 text-green-500" />
                    <div>
           
        </div><p className="text-sm font-medium">Analytics</p>
                      <p className="text-xs text-muted-foreground" />
                        {systemStatus.services?.analytics?.supported_platforms?.length || 0} plataformas
                      </p></div><div className=" ">$2</div><Database className="h-8 w-8 text-purple-500" />
                    <div>
           
        </div><p className="text-sm font-medium">Function Calling</p>
                      <p className="text-xs text-muted-foreground" />
                        {systemStatus.services?.function_calling?.available_functions || 0} funções
                      </p></div></div>
              ) : (
                <div className=" ">$2</div><div className=" ">$2</div><RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Carregando status...</p>
      </div>
    </>
  )}
            </Card.Content></Card></div>
      )}

      <div className="{/* Lista de Integrações */}">$2</div>
        <div className=" ">$2</div><Card />
            <Card.Header />
              <Card.Title>Integrações Disponíveis</Card.Title>
            </Card.Header>
            <Card.Content className="space-y-2" />
              {(integrations || []).map((integration: unknown) => (
                <div
                  key={ integration.id }
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    activeIntegration?.id === integration.id
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:bg-muted/50'
                  } `}
                  onClick={ () => setActiveIntegration(integration)  }>
                  <div className=" ">$2</div><div className=" ">$2</div><span className="text-2xl">{integration.icon}</span>
                      <div>
           
        </div><h3 className="font-medium">{integration.name}</h3>
                        <p className="text-sm text-muted-foreground" />
                          {integration.description}
                        </p>
                      </div>
                    {getStatusBadge(integration.status)}
                  </div>
              ))}
            </Card.Content></Card></div>
        {/* Configuração da Integração */}
        <div className="{activeIntegration ? (">$2</div>
            <Card />
              <Card.Header />
                <div className=" ">$2</div><div className=" ">$2</div><span className="text-2xl">{activeIntegration.icon}</span>
                    <div>
           
        </div><Card.Title>{activeIntegration.name}</Card.Title>
                      <Card.Description>{activeIntegration.description}</Card.Description>
                    </div>
                  {getStatusBadge(activeIntegration.status)}
                </div>
              </Card.Header>
              <Card.Content className="space-y-6" />
                <div className="{(activeIntegration.fields || []).map((field: unknown) => (">$2</div>
                    <div key={field.key} className="space-y-2">
           
        </div><InputLabel htmlFor={ field.key } />
                        {field.label}
                        {field.required && <span className="text-red-500 ml-1">*</span>}
                      </InputLabel>
                      {field.type === 'select' ? (
                        <select
                          id={ field.key }
                          value={ formData[field.key] || '' }
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, [field.key]: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                          <option value="">Selecione...</option>
                          {field.options?.map((option: unknown) => (
                            <option key={option} value={ option }>{option}</option>
                          ))}
                        </select>
                      ) : (
                        <Input
                          id={ field.key }
                          type={ field.type }
                          value={ formData[field.key] || '' }
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, [field.key]: e.target.value }))}
                          placeholder={`Digite ${field.label.toLowerCase()}`} />
                      )}
                    </div>
                  ))}
                </div>
                <div className=" ">$2</div><Button
                    variant="outline"
                    onClick={ handleTest }
                    disabled={ isLoading } />
                    Testar Conexão
                  </Button>
                  <Button
                    onClick={ handleSave }
                    disabled={ isLoading } />
                    {isLoading ? 'Salvando...' : 'Salvar Configuração'}
                  </Button></div></Card.Content>
      </Card>
    </>
  ) : (
            <Card />
              <Card.Content className="flex items-center justify-center h-64" />
                <div className=" ">$2</div><div className="text-4xl mb-4">🔧</div>
                  <h3 className="text-lg font-medium mb-2">Selecione uma Integração</h3>
                  <p className="text-muted-foreground" />
                    Escolha uma integração na lista ao lado para configurá-la
                  </p></div></Card.Content>
      </Card>
    </>
  )}
        </div>
    </div>);

}
