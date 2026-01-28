import React from 'react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { StatusMonitorProps, AuraConnection, AuraStats } from '../types/auraTypes';
const StatusMonitor: React.FC<StatusMonitorProps> = ({ 
  connections, 
  stats, 
  loading = false, 
  error 
}) => {
  const getConnectionStatus = (connection: AuraConnection) => {
    return {
      label: `${connection.name} (${connection.platform})`,
      ok: connection.status === 'active',
      status: connection.status,
      lastSync: connection.last_sync
    };
  };
  const getStatsItems = () => {
    return [
      {
        label: 'Total de Chats',
        value: stats.total_chats,
        ok: stats.total_chats > 0,
        color: 'blue'
      },
      {
        label: 'Chats Ativos',
        value: stats.active_chats,
        ok: stats.active_chats > 0,
        color: 'green'
      },
      {
        label: 'Total de Mensagens',
        value: stats.total_messages,
        ok: stats.total_messages > 0,
        color: 'purple'
      },
      {
        label: 'Tempo de Resposta Médio',
        value: `${stats.response_time_avg.toFixed(1)}s`,
        ok: stats.response_time_avg < 60,
        color: 'orange'
      },
      {
        label: 'Score de Satisfação',
        value: `${stats.satisfaction_score.toFixed(1)}/5`,
        ok: stats.satisfaction_score >= 4,
        color: 'yellow'
      },
      {
        label: 'Conexões Ativas',
        value: stats.connections_active,
        ok: stats.connections_active > 0,
        color: 'green'
      },
      {
        label: 'Fluxos Ativos',
        value: stats.flows_active,
        ok: stats.flows_active > 0,
        color: 'blue'
      }
    ];
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
          <Card.Title>Monitor de Status</Card.Title>
        </Card.Header>
        <Card.Content className="p-4">
          <div className="animate-pulse space-y-3">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="h-4 bg-gray-200 rounded"></div>
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
          <Card.Title>Monitor de Status</Card.Title>
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
        <Card.Title>Monitor de Status</Card.Title>
      </Card.Header>
      <Card.Content className="space-y-6">
        {/* Estatísticas Gerais */}
        <div>
          <h3 className="font-medium text-gray-900 mb-3">Estatísticas Gerais</h3>
          <div className="grid grid-cols-2 gap-3">
            {getStatsItems().map((item, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{item.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900">{item.value}</span>
                    <div className={`w-2 h-2 rounded-full ${
                      item.ok ? 'bg-green-500' : 'bg-red-500'
                    }`} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Status das Conexões */}
        <div>
          <h3 className="font-medium text-gray-900 mb-3">Status das Conexões</h3>
          <div className="space-y-2">
            {connections.length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                <div className="text-2xl mb-2">🔌</div>
                <p className="text-sm">Nenhuma conexão configurada</p>
              </div>
            ) : (
              connections.map((connection) => {
                const status = getConnectionStatus(connection);
                return (
                  <div key={connection.id} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900">{status.label}</div>
                        <div className="text-sm text-gray-500">
                          Última sincronização: {formatLastSync(status.lastSync)}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant={status.ok ? 'success' : 'destructive'}
                        >
                          {status.status}
                        </Badge>
                        <div className={`w-2 h-2 rounded-full ${
                          status.ok ? 'bg-green-500' : 'bg-red-500'
                        }`} />
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
        {/* Resumo de Saúde */}
        <div className="pt-4 border-t">
          <div className="flex items-center justify-between">
            <span className="font-medium text-gray-900">Status Geral</span>
            <div className="flex items-center gap-2">
              {connections.filter(c => c.status === 'active').length === connections.length && connections.length > 0 ? (
                <>
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-sm text-green-600 font-medium">Tudo OK</span>
                </>
              ) : (
                <>
                  <div className="w-2 h-2 rounded-full bg-yellow-500" />
                  <span className="text-sm text-yellow-600 font-medium">Atenção Necessária</span>
                </>
              )}
            </div>
          </div>
        </div>
      </Card.Content>
    </Card>
  );
};
export default StatusMonitor;
