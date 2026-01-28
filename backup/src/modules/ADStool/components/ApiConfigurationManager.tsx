import React, { useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Input from '@/components/ui/Input';
import InputLabel from '@/components/ui/InputLabel';
import { Select } from '@/components/ui/select';
import { AdsApiConfigurationManagerProps, AdsIntegration } from '../types';
import { toast } from 'sonner';
const ApiConfigurationManager: React.FC<AdsApiConfigurationManagerProps> = ({ 
  integrations, 
  loading = false, 
  error, 
  onIntegrationCreate, 
  onIntegrationUpdate, 
  onIntegrationDelete 
}) => {
  const [selectedPlatform, setSelectedPlatform] = useState<AdsPlatform>('google_ads');
  const [isCreating, setIsCreating] = useState(false);
  const platformOptions = [
    { value: 'google_ads', label: 'Google Ads' },
    { value: 'facebook_ads', label: 'Facebook Ads' },
    { value: 'linkedin_ads', label: 'LinkedIn Ads' },
    { value: 'twitter_ads', label: 'Twitter Ads' },
    { value: 'tiktok_ads', label: 'TikTok Ads' }
  ];
  const getPlatformColor = (platform: AdsPlatform): string => {
    const colors = {
      google_ads: 'bg-blue-100 text-blue-800',
      facebook_ads: 'bg-blue-100 text-blue-800',
      linkedin_ads: 'bg-blue-100 text-blue-800',
      twitter_ads: 'bg-gray-100 text-gray-800',
      tiktok_ads: 'bg-pink-100 text-pink-800'
    };
    return colors[platform] || 'bg-gray-100 text-gray-800';
  };
  const getPlatformIcon = (platform: AdsPlatform): string => {
    const icons = {
      google_ads: '🔵',
      facebook_ads: '📘',
      linkedin_ads: '💼',
      twitter_ads: '🐦',
      tiktok_ads: '🎵'
    };
    return icons[platform] || '🔧';
  };
  const handleCreateIntegration = async () => {
    setIsCreating(true);
    try {
      // Simular criação de integração
      await new Promise(resolve => setTimeout(resolve, 1000));
      onIntegrationCreate?.();
      toast.success('Integração criada com sucesso!');
    } catch (error) {
      toast.error('Erro ao criar integração');
    } finally {
      setIsCreating(false);
    }
  };
  const handleToggleIntegration = async (integration: AdsIntegration) => {
    try {
      const updatedIntegration = {
        ...integration,
        is_active: !integration.is_active
      };
      onIntegrationUpdate?.(updatedIntegration);
      toast.success(`Integração ${updatedIntegration.is_active ? 'ativada' : 'desativada'} com sucesso!`);
    } catch (error) {
      toast.error('Erro ao atualizar integração');
    }
  };
  const handleDeleteIntegration = async (integration: AdsIntegration) => {
    if (window.confirm(`Tem certeza que deseja excluir a integração ${integration.name}?`)) {
      try {
        onIntegrationDelete?.(integration.id);
        toast.success('Integração excluída com sucesso!');
      } catch (error) {
        toast.error('Erro ao excluir integração');
      }
    }
  };
  const formatLastSync = (lastSync?: string): string => {
    if (!lastSync) return 'Nunca';
    const date = new Date(lastSync);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    if (diffInMinutes < 1) return 'Agora';
    if (diffInMinutes < 60) return `${diffInMinutes}min atrás`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h atrás`;
    return date.toLocaleDateString('pt-BR');
  };
  if (loading) {
    return (
      <Card>
        <Card.Header>
          <Card.Title>Gerenciador de Integrações</Card.Title>
        </Card.Header>
        <Card.Content className="p-4">
          <div className="animate-pulse space-y-4">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </Card.Content>
      </Card>
    );
  }
  if (error) {
    return (
      <Card>
        <Card.Header>
          <Card.Title>Gerenciador de Integrações</Card.Title>
        </Card.Header>
        <Card.Content className="p-4 text-center text-red-500">
          Erro: {error}
        </Card.Content>
      </Card>
    );
  }
  return (
    <Card>
      <Card.Header>
        <div className="flex items-center justify-between">
          <Card.Title>Gerenciador de Integrações</Card.Title>
          <Button onClick={handleCreateIntegration} loading={isCreating}>
            Nova Integração
          </Button>
        </div>
      </Card.Header>
      <Card.Content className="space-y-6">
        {/* Criar Nova Integração */}
        <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg">
          <h3 className="font-medium text-gray-900 mb-4">Criar Nova Integração</h3>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <InputLabel>Plataforma</InputLabel>
              <Select
                value={selectedPlatform}
                onChange={(value) => setSelectedPlatform(value as AdsPlatform)}
                options={platformOptions}
              />
            </div>
            <div className="flex items-end">
              <Button 
                onClick={handleCreateIntegration} 
                loading={isCreating}
                disabled={isCreating}
              >
                Criar
              </Button>
            </div>
          </div>
        </div>
        {/* Lista de Integrações */}
        <div className="space-y-4">
          <h3 className="font-medium text-gray-900">Integrações Configuradas</h3>
          {integrations.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-2">🔧</div>
              <p>Nenhuma integração configurada</p>
              <p className="text-sm">Crie uma nova integração para começar</p>
            </div>
          ) : (
            <div className="space-y-3">
              {integrations.map((integration) => (
                <div 
                  key={integration.id} 
                  className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">
                        {getPlatformIcon(integration.platform)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-gray-900">
                            {integration.name}
                          </h4>
                          <Badge className={getPlatformColor(integration.platform)}>
                            {platformOptions.find(p => p.value === integration.platform)?.label}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-500">
                          Última sincronização: {formatLastSync(integration.last_sync)}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={integration.is_active ? 'success' : 'secondary'}>
                        {integration.is_active ? 'Ativo' : 'Inativo'}
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleIntegration(integration)}
                      >
                        {integration.is_active ? 'Desativar' : 'Ativar'}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteIntegration(integration)}
                        className="text-red-600 hover:text-red-700"
                      >
                        Excluir
                      </Button>
                    </div>
                  </div>
                  {/* Configurações da API (ocultas por padrão) */}
                  <div className="mt-3 pt-3 border-t text-xs text-gray-500">
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(integration.api_config).map(([key, value]) => (
                        <div key={key}>
                          <span className="font-medium">{key}:</span>{' '}
                          <span className="font-mono">
                            {value ? (typeof value === 'string' && value.length > 20 
                              ? `${value.substring(0, 20)}...` 
                              : String(value)) 
                              : 'Não configurado'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        {/* Estatísticas */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {integrations.length}
            </div>
            <div className="text-sm text-gray-500">Total</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {integrations.filter(i => i.is_active).length}
            </div>
            <div className="text-sm text-gray-500">Ativas</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-600">
              {integrations.filter(i => !i.is_active).length}
            </div>
            <div className="text-sm text-gray-500">Inativas</div>
          </div>
        </div>
      </Card.Content>
    </Card>
  );
};
export default ApiConfigurationManager;
