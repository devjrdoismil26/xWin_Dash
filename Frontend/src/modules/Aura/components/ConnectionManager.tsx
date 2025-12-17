/**
 * @module ConnectionManager
 * @description Componente para gerenciar conexões do Aura (WhatsApp, Telegram, Instagram, etc.).
 * 
 * Este componente permite visualizar, criar, atualizar, deletar e testar conexões
 * de diferentes plataformas. Exibe estatísticas de conexões e permite ativar/desativar
 * conexões individualmente. Inclui formatação de datas e cores de status personalizadas.
 * 
 * @example
 * ```tsx
 * <ConnectionManager
 *   connections={ connections }
 *   loading={ false }
 *   onConnectionCreate={ () =>  }
 *   onConnectionUpdate={ (conn: unknown) =>  }
 *   onConnectionDelete={ (id: unknown) =>  }
 *   onConnectionTest={ (id: unknown) =>  }
 * />
 * ```
 * 
 * @since 1.0.0
 */

import React, { useState } from 'react';
import Card from '@/shared/components/ui/Card';
import Button from '@/shared/components/ui/Button';
import Badge from '@/shared/components/ui/Badge';
import Input from '@/shared/components/ui/Input';
import InputLabel from '@/shared/components/ui/InputLabel';
import Select from '@/shared/components/ui/Select';
import { ConnectionManagerProps, AuraConnection, AuraPlatform } from '../types/auraTypes';
import { toast } from 'sonner';

/**
 * Componente para gerenciar conexões do Aura
 * 
 * @param {ConnectionManagerProps} props - Propriedades do componente
 * @returns {JSX.Element} Componente renderizado
 */
const ConnectionManager: React.FC<ConnectionManagerProps> = ({ connections, 
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
  /**
   * Retorna a cor CSS para o badge da plataforma
   * 
   * @param {AuraPlatform} platform - Plataforma da conexão
   * @returns {string} Classes CSS para cores do badge
   */
  const getPlatformColor = (platform: AuraPlatform): string => {
    const colors = {
      whatsapp: 'bg-green-100 text-green-800',
      telegram: 'bg-blue-100 text-blue-800',
      instagram: 'bg-pink-100 text-pink-800',
      facebook: 'bg-blue-100 text-blue-800',
      website: 'bg-gray-100 text-gray-800',
      email: 'bg-purple-100 text-purple-800'};

    return colors[platform] || 'bg-gray-100 text-gray-800';};

  /**
   * Retorna o ícone emoji para a plataforma
   * 
   * @param {AuraPlatform} platform - Plataforma da conexão
   * @returns {string} Emoji do ícone da plataforma
   */
  const getPlatformIcon = (platform: AuraPlatform): string => {
    const icons = {
      whatsapp: '📱',
      telegram: '✈️',
      instagram: '📷',
      facebook: '👥',
      website: '🌐',
      email: '📧'};

    return icons[platform] || '🔧';};

  /**
   * Retorna a cor CSS para o badge de status
   * 
   * @param {string} status - Status da conexão (active, inactive, error, pending)
   * @returns {string} Classes CSS para cores do badge
   */
  const getStatusColor = (status: string): string => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
      error: 'bg-red-100 text-red-800',
      pending: 'bg-yellow-100 text-yellow-800'};

    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';};

  /**
   * Testa uma conexão específica
   * 
   * @async
   * @param {AuraConnection} connection - Conexão a ser testada
   */
  const handleTestConnection = async (connection: AuraConnection) => {
    setIsTesting(true);

    try {
      await onConnectionTest?.(connection.id);

      toast.success('Teste de conexão realizado com sucesso!');

    } catch (error) {
      toast.error('Falha no teste de conexão');

    } finally {
      setIsTesting(false);

    } ;

  const handleToggleConnection = async (connection: AuraConnection) => {
    try {
      const updatedConnection = {
        ...connection,
        status: connection.status === 'active' ? 'inactive' : 'active'};

      await onConnectionUpdate?.(updatedConnection);

      toast.success(`Conexão ${updatedConnection.status === 'active' ? 'ativada' : 'desativada'} com sucesso!`);

    } catch (error) {
      toast.error('Erro ao atualizar conexão');

    } ;

  /**
   * Deleta uma conexão após confirmação
   * 
   * @async
   * @param {AuraConnection} connection - Conexão a ser deletada
   */
  const handleDeleteConnection = async (connection: AuraConnection) => {
    if (window.confirm(`Tem certeza que deseja excluir a conexão ${connection.name}?`)) {
      try {
        await onConnectionDelete?.(connection.id);

        toast.success('Conexão excluída com sucesso!');

      } catch (error) {
        toast.error('Erro ao excluir conexão');

      } };

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
          <Card.Title>Gerenciador de Conexões</Card.Title>
        </Card.Header>
        <Card.Content className="p-4" />
          <div className="{[...Array(3)].map((_: unknown, index: unknown) => (">$2</div>
      <div key={index} className="h-16 bg-gray-200 rounded">
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
          <Card.Title>Gerenciador de Conexões</Card.Title>
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
        <div className=" ">$2</div><Card.Title>Gerenciador de Conexões</Card.Title>
          <Button onClick={ () => onConnectionCreate?.()  }>
            Nova Conexão
          </Button></div></Card.Header>
      <Card.Content className="space-y-6" />
        {connections.length === 0 ? (
          <div className=" ">$2</div><div className="text-4xl mb-2">🔌</div>
            <p>Nenhuma conexão configurada</p>
            <p className="text-sm">Crie uma nova conexão para começar</p>
      </div>
    </>
  ) : (
          <div className="{(connections || []).map((connection: unknown) => (">$2</div>
              <div 
                key={ connection.id }
                className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
           
        </div><div className=" ">$2</div><div className=" ">$2</div><div className="{getPlatformIcon(connection.platform)}">$2</div>
                    </div>
                    <div>
           
        </div><div className=" ">$2</div><h4 className="font-medium text-gray-900" />
                          {connection.name}
                        </h4>
                        <Badge className={getPlatformColor(connection.platform) } />
                          {platformOptions.find(p => p.value === connection.platform)?.label}
                        </Badge>
                        <Badge className={getStatusColor(connection.status) } />
                          {connection.status}
                        </Badge></div><div className="Última sincronização: {formatLastSync(connection.last_sync)}">$2</div>
                      </div></div><div className=" ">$2</div><Button
                      variant="outline"
                      size="sm"
                      onClick={ () => handleTestConnection(connection) }
                      loading={ isTesting }
                      disabled={ isTesting  }>
                      Testar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={ () => handleToggleConnection(connection)  }>
                      {connection.status === 'active' ? 'Desativar' : 'Ativar'}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={ () => handleDeleteConnection(connection) }
                      className="text-red-600 hover:text-red-700"
                    >
                      Excluir
                    </Button>
                  </div>
                {/* Configurações (ocultas por padrão) */}
                <div className=" ">$2</div><div className="{ Object.entries(connection.config).map(([key, value]) => (">$2</div>
                      <div key={ key  }>
        </div><span className="font-medium">{key}:</span>{' '}
                        <span className="{value ? (typeof value === 'string' && value.length > 20 ">$2</span>
                            ? `${value.substring(0, 20)}...` 
                            : String(value)) 
                            : 'Não configurado'}
                        </span>
      </div>
    </>
  ))}
                  </div>
    </div>
  ))}
          </div>
        )}
        {/* Estatísticas */}
        <div className=" ">$2</div><div className=" ">$2</div><div className="{connections.length}">$2</div>
            </div>
            <div className="text-sm text-gray-500">Total</div>
          <div className=" ">$2</div><div className="{(connections || []).filter(c => c.status === 'active').length}">$2</div>
            </div>
            <div className="text-sm text-gray-500">Ativas</div>
          <div className=" ">$2</div><div className="{(connections || []).filter(c => c.status === 'error').length}">$2</div>
            </div>
            <div className="text-sm text-gray-500">Com Erro</div>
          <div className=" ">$2</div><div className="{(connections || []).filter(c => c.status === 'inactive').length}">$2</div>
            </div>
            <div className="text-sm text-gray-500">Inativas</div></div></Card.Content>
    </Card>);};

export default ConnectionManager;
