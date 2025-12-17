/**
 * @module StatusMonitor
 * @description Componente para monitorar o status de conexões e estatísticas do Aura.
 * 
 * Este componente exibe um dashboard de monitoramento com estatísticas gerais
 * (chats, mensagens, tempo de resposta, satisfação) e status das conexões.
 * Inclui indicadores visuais de saúde do sistema e formatação de datas.
 * 
 * @example
 * ```tsx
 * <StatusMonitor
 *   connections={ connections }
 *   stats={ stats }
 *   loading={ false }
 *   error={ null }
 * / />
 * ```
 * 
 * @since 1.0.0
 */

import React from 'react';
import Card from '@/shared/components/ui/Card';
import Badge from '@/shared/components/ui/Badge';
import { StatusMonitorProps, AuraConnection, AuraStats } from '../types/auraTypes';

/**
 * Componente para monitorar status de conexões e estatísticas
 * 
 * @param {StatusMonitorProps} props - Propriedades do componente
 * @returns {JSX.Element} Componente renderizado
 */
const StatusMonitor: React.FC<StatusMonitorProps> = ({ connections, 
  stats, 
  loading = false, 
  error 
   }) => {
  const getConnectionStatus = (connection: AuraConnection) => {
    return {
      label: `${connection.name} (${connection.platform})`,
      ok: connection.status === 'active',
      status: connection.status,
      lastSync: connection.last_sync};
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
    ];};

  /**
   * Formata a data da última sincronização para exibição amigável
   * 
   * @param {string} [lastSync] - Data da última sincronização (ISO string)
   * @returns {string} Data formatada (ex: "Agora", "5min atrás", "2h atrás", "DD/MM/YYYY")
   */
  const formatLastSync = (lastSync?: string): string => {
    if (!lastSync) return 'Nunca';
    const date = new Date(lastSync);

    const now = new Date();

    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Agora';
    if (diffInMinutes < 60) return `${diffInMinutes}min atrás`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h atrás`;
    return date.toLocaleDateString('pt-BR');};

  if (loading) {
    return (
        <>
      <Card />
      <Card.Header />
          <Card.Title>Monitor de Status</Card.Title>
        </Card.Header>
        <Card.Content className="p-4" />
          <div className="{[...Array(5)].map((_: unknown, index: unknown) => (">$2</div>
      <div key={index} className="h-4 bg-gray-200 rounded">
    </>
  ))}
        </div>
          </div>
        </Card.Content>
      </Card>);

  }
  if (error) {
    return (
        <>
      <Card />
      <Card.Header />
          <Card.Title>Monitor de Status</Card.Title>
        </Card.Header>
        <Card.Content className="p-4 text-center text-red-500" />
          Erro: {error}
        </Card.Content>
      </Card>);

  }
  return (
        <>
      <Card />
      <Card.Header />
        <Card.Title>Monitor de Status</Card.Title>
      </Card.Header>
      <Card.Content className="space-y-6" />
        {/* Estatísticas Gerais */}
        <div>
           
        </div><h3 className="font-medium text-gray-900 mb-3">Estatísticas Gerais</h3>
          <div className="{getStatsItems().map((item: unknown, index: unknown) => (">$2</div>
              <div key={index} className="p-3 bg-gray-50 rounded-lg">
           
        </div><div className=" ">$2</div><span className="text-sm text-gray-600">{item.label}</span>
                  <div className=" ">$2</div><span className="font-medium text-gray-900">{item.value}</span>
                    <div className={`w-2 h-2 rounded-full ${
                      item.ok ? 'bg-green-500' : 'bg-red-500'
                    } `} / />
           
        </div></div>
            ))}
          </div>
        {/* Status das Conexões */}
        <div>
           
        </div><h3 className="font-medium text-gray-900 mb-3">Status das Conexões</h3>
          <div className="{connections.length === 0 ? (">$2</div>
              <div className=" ">$2</div><div className="text-2xl mb-2">🔌</div>
                <p className="text-sm">Nenhuma conexão configurada</p>
      </div>
    </>
  ) : (
              (connections || []).map((connection: unknown) => {
                const status = getConnectionStatus(connection);

                return (
        <>
      <div key={connection.id} className="p-3 border rounded-lg">
      </div><div className=" ">$2</div><div>
           
        </div><div className="font-medium text-gray-900">{status.label}</div>
                        <div className="Última sincronização: {formatLastSync(status.lastSync)}">$2</div>
                        </div>
                      <div className=" ">$2</div><Badge 
                          variant={ status.ok ? 'success' : 'destructive' } />
                          {status.status}
                        </Badge>
                        <div className={`w-2 h-2 rounded-full ${
                          status.ok ? 'bg-green-500' : 'bg-red-500'
                        } `} / />
           
        </div></div>);

              })
            )}
          </div>
        {/* Resumo de Saúde */}
        <div className=" ">$2</div><div className=" ">$2</div><span className="font-medium text-gray-900">Status Geral</span>
            <div className="{(connections || []).filter(c => c.status === 'active').length === connections.length && connections.length > 0 ? (">$2</div>
                <>
                  <div className="w-2 h-2 rounded-full bg-green-500">
           
        </div><span className="text-sm text-green-600 font-medium">Tudo OK</span>
      </>
    </>
  ) : (
                <>
                  <div className="w-2 h-2 rounded-full bg-yellow-500">
           
        </div><span className="text-sm text-yellow-600 font-medium">Atenção Necessária</span>
      </>
    </>
  )}
            </div></div></Card.Content>
    </Card>);};

export default StatusMonitor;
