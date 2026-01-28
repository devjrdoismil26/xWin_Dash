import React, { useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Input from '@/components/ui/Input';
import InputLabel from '@/components/ui/InputLabel';
import { Select } from '@/components/ui/select';
import { ConnectionManagerProps, AuraConnection, AuraPlatform } from '../types/auraTypes';
import { toast } from 'sonner';
const ConnectionManager: React.FC<ConnectionManagerProps> = ({ 
  connections, 
  loading = false, 
  error, 
  onConnectionCreate, 
  onConnectionUpdate, 
  onConnectionDelete, 
  onConnectionTest 
}) => {
  const [selectedConnection, setSelectedConnection] = useState<AuraConnection | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const platformOptions = [
    { value: 'whatsapp', label: 'WhatsApp' },
    { value: 'telegram', label: 'Telegram' },
    { value: 'instagram', label: 'Instagram' },
    { value: 'facebook', label: 'Facebook' },
    { value: 'website', label: 'Website' },
    { value: 'email', label: 'Email' }
  ];
  const getPlatformColor = (platform: AuraPlatform): string => {
    const colors = {
      whatsapp: 'bg-green-100 text-green-800',
      telegram: 'bg-blue-100 text-blue-800',
      instagram: 'bg-pink-100 text-pink-800',
      facebook: 'bg-blue-100 text-blue-800',
      website: 'bg-gray-100 text-gray-800',
      email: 'bg-purple-100 text-purple-800'
    };
    return colors[platform] || 'bg-gray-100 text-gray-800';
  };
  const getPlatformIcon = (platform: AuraPlatform): string => {
    const icons = {
      whatsapp: '📱',
      telegram: '✈️',
      instagram: '📷',
      facebook: '👥',
      website: '🌐',
      email: '📧'
    };
    return icons[platform] || '🔧';
  };
  const getStatusColor = (status: string): string => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
      error: 'bg-red-100 text-red-800',
      pending: 'bg-yellow-100 text-yellow-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };
  const handleTestConnection = async (connection: AuraConnection) => {
    setIsTesting(true);
    try {
      await onConnectionTest?.(connection.id);
      toast.success('Teste de conexão realizado com sucesso!');
    } catch (error) {
      toast.error('Falha no teste de conexão');
    } finally {
      setIsTesting(false);
    }
  };
  const handleToggleConnection = async (connection: AuraConnection) => {
    try {
      const updatedConnection = {
        ...connection,
        status: connection.status === 'active' ? 'inactive' : 'active'
      };
      await onConnectionUpdate?.(updatedConnection);
      toast.success(`Conexão ${updatedConnection.status === 'active' ? 'ativada' : 'desativada'} com sucesso!`);
    } catch (error) {
      toast.error('Erro ao atualizar conexão');
    }
  };
  const handleDeleteConnection = async (connection: AuraConnection) => {
    if (window.confirm(`Tem certeza que deseja excluir a conexão ${connection.name}?`)) {
      try {
        await onConnectionDelete?.(connection.id);
        toast.success('Conexão excluída com sucesso!');
      } catch (error) {
        toast.error('Erro ao excluir conexão');
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
          <Card.Title>Gerenciador de Conexões</Card.Title>
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
          <Card.Title>Gerenciador de Conexões</Card.Title>
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
          <Card.Title>Gerenciador de Conexões</Card.Title>
          <Button onClick={() => onConnectionCreate?.()}>
            Nova Conexão
          </Button>
        </div>
      </Card.Header>
      <Card.Content className="space-y-4">
        {connections.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-2">🔌</div>
            <p>Nenhuma conexão configurada</p>
            <p className="text-sm">Crie uma nova conexão para começar</p>
          </div>
        ) : (
          <div className="space-y-3">
            {connections.map((connection) => (
              <div 
                key={connection.id} 
                className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">
                      {getPlatformIcon(connection.platform)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-gray-900">
                          {connection.name}
                        </h4>
                        <Badge className={getPlatformColor(connection.platform)}>
                          {platformOptions.find(p => p.value === connection.platform)?.label}
                        </Badge>
                        <Badge className={getStatusColor(connection.status)}>
                          {connection.status}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-500">
                        Última sincronização: {formatLastSync(connection.last_sync)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleTestConnection(connection)}
                      loading={isTesting}
                      disabled={isTesting}
                    >
                      Testar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleConnection(connection)}
                    >
                      {connection.status === 'active' ? 'Desativar' : 'Ativar'}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteConnection(connection)}
                      className="text-red-600 hover:text-red-700"
                    >
                      Excluir
                    </Button>
                  </div>
                </div>
                {/* Configurações (ocultas por padrão) */}
                <div className="mt-3 pt-3 border-t text-xs text-gray-500">
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(connection.config).map(([key, value]) => (
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
        {/* Estatísticas */}
        <div className="grid grid-cols-4 gap-4 pt-4 border-t">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {connections.length}
            </div>
            <div className="text-sm text-gray-500">Total</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {connections.filter(c => c.status === 'active').length}
            </div>
            <div className="text-sm text-gray-500">Ativas</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">
              {connections.filter(c => c.status === 'error').length}
            </div>
            <div className="text-sm text-gray-500">Com Erro</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-600">
              {connections.filter(c => c.status === 'inactive').length}
            </div>
            <div className="text-sm text-gray-500">Inativas</div>
          </div>
        </div>
      </Card.Content>
    </Card>
  );
};
export default ConnectionManager;
