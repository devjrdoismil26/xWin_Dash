import React, { useState, useEffect } from 'react';
import { apiClient } from '@/services';
import Card from '@/shared/components/ui/Card';
import Input from '@/shared/components/ui/Input';
import InputLabel from '@/shared/components/ui/InputLabel';
import Button from '@/shared/components/ui/Button';
import Badge from '@/shared/components/ui/Badge';
import useToast from '@/shared/components/ui/useToast';
import { useSettings } from '@/modules/Settings/hooks/useSettings';
const AISettings = () => {
  const { toast } = useToast();

  const { settings, updateSetting, isLoading } = useSettings();

  const [formData, setFormData] = useState({
    default_provider: 'openai',
    openai_api_key: '',
    openai_model: 'gpt-4',
    openai_max_tokens: 2000,
    openai_temperature: 0.7,
    gemini_api_key: '',
    gemini_model: 'gemini-1.5-pro',
    gemini_max_tokens: 8192,
    gemini_temperature: 0.7,
    anthropic_api_key: '',
    anthropic_model: 'claude-3-sonnet-20240229',
    anthropic_max_tokens: 2000,
    anthropic_temperature: 0.6,
    content_filtering_enabled: true,
    rate_limit_per_minute: 60,
    cache_enabled: true,
    cache_ttl: 3600
  });

  useEffect(() => {
    if (settings?.ai) {
      setFormData(prev => ({
        ...prev,
        ...settings.ai
      }));

    } , [settings]);

  const handleSubmit = async (e: unknown) => {
    e.preventDefault();

    try {
      await updateSetting('ai', formData);

      toast({
        title: "Configurações de IA salvas",
        description: "As configurações de IA foram atualizadas com sucesso.",
      });

    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível salvar as configurações de IA.",
        variant: "destructive",
      });

    } ;

  const handleInputChange = (field: unknown, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));};

  const testProvider = async (provider: unknown) => {
    try {
      const result = await apiClient.post<{ success: boolean; message: string }>(`/ai/test/${provider}`, {
        api_key: formData[`${provider}_api_key`],
        model: formData[`${provider}_model`]
      });

      toast({
        title: result.success ? "Teste bem-sucedido" : "Teste falhou",
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

  const getProviderStatus = (provider: unknown) => {
    const apiKey = formData[`${provider}_api_key`];
    if (!apiKey) return { status: 'disconnected', label: 'Não configurado'};

    if (apiKey.length < 10) return { status: 'error', label: 'Chave inválida'};

    return { status: 'connected', label: 'Configurado'};
};

  return (
            <div className=" ">$2</div><div>
           
        </div><h1 className="text-3xl font-bold tracking-tight">Configurações de IA</h1>
        <p className="text-muted-foreground" />
          Configure provedores de IA e parâmetros de geração de conteúdo
        </p></div><form onSubmit={handleSubmit} className="space-y-6" />
        {/* Provedor Padrão */}
        <Card />
          <Card.Header />
            <Card.Title>Provedor Padrão</Card.Title>
            <Card.Description />
              Selecione o provedor de IA padrão para a aplicação
            </Card.Description>
          </Card.Header>
          <Card.Content />
            <div className=" ">$2</div><InputLabel htmlFor="default_provider">Provedor</InputLabel>
              <select
                id="default_provider"
                value={ formData.default_provider }
                onChange={ (e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('default_provider', e.target.value) }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="openai">OpenAI</option>
                <option value="gemini">Google Gemini</option>
                <option value="anthropic">Anthropic Claude</option></select></div>
          </Card.Content>
        </Card>
        {/* OpenAI Configuration */}
        <Card />
          <Card.Header />
            <div className=" ">$2</div><div>
           
        </div><Card.Title>OpenAI</Card.Title>
                <Card.Description>Configurações do OpenAI GPT</Card.Description></div><div className=" ">$2</div><Badge variant={ getProviderStatus('openai').status === 'connected' ? 'default' : 'secondary' } />
                  {getProviderStatus('openai').label}
                </Badge>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={ () => testProvider('openai') }
                  disabled={ !formData.openai_api_key  }>
                  Testar
                </Button></div></Card.Header>
          <Card.Content className="space-y-4" />
            <div>
           
        </div><InputLabel htmlFor="openai_api_key">API Key</InputLabel>
              <Input
                id="openai_api_key"
                type="password"
                value={ formData.openai_api_key }
                onChange={ (e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('openai_api_key', e.target.value) }
                placeholder="sk-..." /></div><div className=" ">$2</div><div>
           
        </div><InputLabel htmlFor="openai_model">Modelo</InputLabel>
                <select
                  id="openai_model"
                  value={ formData.openai_model }
                  onChange={ (e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('openai_model', e.target.value) }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="gpt-4">GPT-4</option>
                  <option value="gpt-4-turbo">GPT-4 Turbo</option>
                  <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option></select></div>
              <div>
           
        </div><InputLabel htmlFor="openai_max_tokens">Max Tokens</InputLabel>
                <Input
                  id="openai_max_tokens"
                  type="number"
                  value={ formData.openai_max_tokens }
                  onChange={ (e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('openai_max_tokens', parseInt(e.target.value)) }
                  min="100"
                  max="4000" /></div><div>
           
        </div><InputLabel htmlFor="openai_temperature">Temperature</InputLabel>
                <Input
                  id="openai_temperature"
                  type="number"
                  step="0.1"
                  min="0"
                  max="2"
                  value={ formData.openai_temperature }
                  onChange={ (e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('openai_temperature', parseFloat(e.target.value)) } /></div></Card.Content>
        </Card>
        {/* Gemini Configuration */}
        <Card />
          <Card.Header />
            <div className=" ">$2</div><div>
           
        </div><Card.Title>Google Gemini</Card.Title>
                <Card.Description>Configurações do Google Gemini</Card.Description></div><div className=" ">$2</div><Badge variant={ getProviderStatus('gemini').status === 'connected' ? 'default' : 'secondary' } />
                  {getProviderStatus('gemini').label}
                </Badge>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={ () => testProvider('gemini') }
                  disabled={ !formData.gemini_api_key  }>
                  Testar
                </Button></div></Card.Header>
          <Card.Content className="space-y-4" />
            <div>
           
        </div><InputLabel htmlFor="gemini_api_key">API Key</InputLabel>
              <Input
                id="gemini_api_key"
                type="password"
                value={ formData.gemini_api_key }
                onChange={ (e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('gemini_api_key', e.target.value) }
                placeholder="AIza..." /></div><div className=" ">$2</div><div>
           
        </div><InputLabel htmlFor="gemini_model">Modelo</InputLabel>
                <select
                  id="gemini_model"
                  value={ formData.gemini_model }
                  onChange={ (e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('gemini_model', e.target.value) }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="gemini-1.5-pro">Gemini 1.5 Pro</option>
                  <option value="gemini-1.5-flash">Gemini 1.5 Flash</option>
                  <option value="gemini-pro">Gemini Pro</option></select></div>
              <div>
           
        </div><InputLabel htmlFor="gemini_max_tokens">Max Tokens</InputLabel>
                <Input
                  id="gemini_max_tokens"
                  type="number"
                  value={ formData.gemini_max_tokens }
                  onChange={ (e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('gemini_max_tokens', parseInt(e.target.value)) }
                  min="100"
                  max="8192" /></div><div>
           
        </div><InputLabel htmlFor="gemini_temperature">Temperature</InputLabel>
                <Input
                  id="gemini_temperature"
                  type="number"
                  step="0.1"
                  min="0"
                  max="2"
                  value={ formData.gemini_temperature }
                  onChange={ (e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('gemini_temperature', parseFloat(e.target.value)) } /></div></Card.Content>
        </Card>
        {/* Configurações Avançadas */}
        <Card />
          <Card.Header />
            <Card.Title>Configurações Avançadas</Card.Title>
            <Card.Description />
              Configurações de segurança, cache e rate limiting
            </Card.Description>
          </Card.Header>
          <Card.Content className="space-y-6" />
            <div className=" ">$2</div><div className=" ">$2</div><div className=" ">$2</div><input
                    type="checkbox"
                    id="content_filtering_enabled"
                    checked={ formData.content_filtering_enabled }
                    onChange={ (e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('content_filtering_enabled', e.target.checked) }
                    className="rounded border-gray-300" />
                  <InputLabel htmlFor="content_filtering_enabled">Filtro de Conteúdo</InputLabel></div><div className=" ">$2</div><input
                    type="checkbox"
                    id="cache_enabled"
                    checked={ formData.cache_enabled }
                    onChange={ (e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('cache_enabled', e.target.checked) }
                    className="rounded border-gray-300" />
                  <InputLabel htmlFor="cache_enabled">Cache Habilitado</InputLabel></div><div className=" ">$2</div><div>
           
        </div><InputLabel htmlFor="rate_limit_per_minute">Rate Limit (req/min)</InputLabel>
                  <Input
                    id="rate_limit_per_minute"
                    type="number"
                    value={ formData.rate_limit_per_minute }
                    onChange={ (e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('rate_limit_per_minute', parseInt(e.target.value)) }
                    min="10"
                    max="1000" /></div><div>
           
        </div><InputLabel htmlFor="cache_ttl">Cache TTL (segundos)</InputLabel>
                  <Input
                    id="cache_ttl"
                    type="number"
                    value={ formData.cache_ttl }
                    onChange={ (e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('cache_ttl', parseInt(e.target.value)) }
                    min="60"
                    max="86400" /></div></div>
          </Card.Content></Card><div className=" ">$2</div><Button type="submit" disabled={ isLoading } />
            {isLoading ? 'Salvando...' : 'Salvar Configurações'}
          </Button></div></form>
    </div>);};

export default AISettings;
