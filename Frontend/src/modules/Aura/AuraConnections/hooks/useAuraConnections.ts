/**
 * @module modules/Aura/AuraConnections/hooks/useAuraConnections
 * @description
 * Hook especializado para gerenciamento de conexões do módulo Aura.
 * 
 * Gerencia conexões com provedores (WhatsApp Business, Telegram, Facebook Messenger, etc.):
 * - CRUD de conexões (create, update, delete, fetch)
 * - Controle de conexão (connect, disconnect, test, sync)
 * - Gerenciamento de status (toggle, setPrimary)
 * - Utilitários (getConnectionsByStatus, getConnectionsByProvider, getConnectionStats, getHealthStats)
 * 
 * @example
 * ```typescript
 * import { useAuraConnections } from './hooks/useAuraConnections';
 * 
 * const ConnectionsComponent = () => {
 *   const {
 *     connections,
 *     loading,
 *     fetchConnections,
 *     createConnection,
 *     testConnection,
 *     getConnectionStats
 *   } = useAuraConnections();

 * 
 *   const stats = getConnectionStats();

 *   return <div>Conexões: {stats.total}, Conectadas: {stats.connected}</div>;
 *};

 * ```
 * 
 * @since 1.0.0
 */
import { useCallback, useState, useEffect } from 'react';
import { AuraConnection, ConnectionStatus, ConnectionProvider } from '../types';
import { useAdvancedNotifications } from '@/hooks/useAdvancedNotifications';
import { getErrorMessage } from '@/utils/errorHelpers';
import { notify } from '@/lib/utils';

export const useAuraConnections = () => {
  const [connections, setConnections] = useState<AuraConnection[]>([]);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const [selectedConnection, setSelectedConnection] = useState<AuraConnection | null>(null);

  const { showSuccess, showError } = useAdvancedNotifications();

  // Carregar conexões
  const fetchConnections = useCallback(async () => {
    setLoading(true);

    setError(null);

    try {
      // Simular chamada de API
      const mockConnections: AuraConnection[] = [
        {
          id: '1',
          name: 'WhatsApp Business Principal',
          description: 'Conexão principal do WhatsApp Business',
          provider: 'whatsapp_business',
          type: 'webhook',
          status: 'connected',
          auth_type: 'token',
          config: {
            api_url: 'https://graph.facebook.com/v18.0',
            access_token: 'token_here',
            phone_number: '+5511999999999',
            business_account_id: '123456789'
          },
          webhook_url: 'https://api.example.com/webhook/whatsapp',
          webhook_secret: 'secret_here',
          last_sync: new Date().toISOString(),
          sync_status: 'connected',
          retry_count: 0,
          max_retries: 3,
          health_check_enabled: true,
          health_check_interval: 300,
          last_health_check: new Date().toISOString(),
          health_score: 95,
          metadata: {},
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          created_by: 'user1',
          is_active: true,
          is_primary: true
        }
      ];
      
      setConnections(mockConnections);

      showSuccess('Conexões carregadas com sucesso!');

    } catch (err: unknown) {
      const errorMessage = err instanceof Error
        ? getErrorMessage(err)
        : (err as { response?: { data?: { message?: string } })?.response?.data?.message || 'Erro ao carregar conexões';
      setError(errorMessage);

      showError('Erro ao carregar conexões', errorMessage);

    } finally {
      setLoading(false);

    } , []);

  // Criar conexão
  const createConnection = useCallback(async (connectionData: Partial<AuraConnection>) => {
    setLoading(true);

    setError(null);

    try {
      const newConnection: AuraConnection = {
        id: Date.now().toString(),
        name: connectionData.name || 'Nova Conexão',
        description: connectionData.description || '',
        provider: connectionData.provider || 'whatsapp_business',
        type: connectionData.type || 'webhook',
        status: 'pending',
        auth_type: connectionData.auth_type || 'token',
        config: connectionData.config || {},
        webhook_url: connectionData.webhook_url,
        webhook_secret: connectionData.webhook_secret,
        last_sync: new Date().toISOString(),
        sync_status: 'pending',
        retry_count: 0,
        max_retries: 3,
        health_check_enabled: true,
        health_check_interval: 300,
        health_score: 0,
        metadata: connectionData.metadata || {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        created_by: 'current_user',
        is_active: true,
        is_primary: false};

      setConnections(prev => [newConnection, ...prev]);

      showSuccess('Conexão criada com sucesso!');

      return newConnection;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error
        ? getErrorMessage(err)
        : (err as { response?: { data?: { message?: string } })?.response?.data?.message || 'Erro ao criar conexão';
      setError(errorMessage);

      showError('Erro ao carregar conexões', errorMessage);

      throw err;
    } finally {
      setLoading(false);

    } , []);

  // Atualizar conexão
  const updateConnection = useCallback(async (id: string, connectionData: Partial<AuraConnection>) => {
    setLoading(true);

    setError(null);

    try {
      setConnections(prev => prev.map(connection => 
        connection.id === id 
          ? { ...connection, ...connectionData, updated_at: new Date().toISOString() }
          : connection
      ));

      showSuccess('Conexão atualizada com sucesso!');

    } catch (err: unknown) {
      const errorMessage = err instanceof Error
        ? getErrorMessage(err)
        : (err as { response?: { data?: { message?: string } })?.response?.data?.message || 'Erro ao atualizar conexão';
      setError(errorMessage);

      showError('Erro ao carregar conexões', errorMessage);

      throw err;
    } finally {
      setLoading(false);

    } , []);

  // Excluir conexão
  const deleteConnection = useCallback(async (id: string) => {
    setLoading(true);

    setError(null);

    try {
      setConnections(prev => prev.filter(connection => connection.id !== id));

      showSuccess('Conexão excluída com sucesso!');

    } catch (err: unknown) {
      const errorMessage = err instanceof Error
        ? getErrorMessage(err)
        : (err as { response?: { data?: { message?: string } })?.response?.data?.message || 'Erro ao excluir conexão';
      setError(errorMessage);

      showError('Erro ao carregar conexões', errorMessage);

      throw err;
    } finally {
      setLoading(false);

    } , []);

  // Conectar
  const connect = useCallback(async (id: string) => {
    setLoading(true);

    setError(null);

    try {
      setConnections(prev => prev.map(connection => 
        connection.id === id 
          ? { 
              ...connection, 
              status: 'connecting',
              updated_at: new Date().toISOString()
  }
          : connection
      ));

      // Simular processo de conexão
      setTimeout(() => {
        setConnections(prev => prev.map(connection => 
          connection.id === id 
            ? { 
                ...connection, 
                status: 'connected',
                last_sync: new Date().toISOString(),
                sync_status: 'connected',
                health_score: 95,
                updated_at: new Date().toISOString()
  }
            : connection
        ));

        showSuccess('Conexão estabelecida com sucesso!');

      }, 2000);

    } catch (err: unknown) {
      const errorMessage = err instanceof Error
        ? getErrorMessage(err)
        : (err as { response?: { data?: { message?: string } })?.response?.data?.message || 'Erro ao conectar';
      setError(errorMessage);

      showError('Erro ao carregar conexões', errorMessage);

    } finally {
      setLoading(false);

    } , []);

  // Desconectar
  const disconnect = useCallback(async (id: string) => {
    setLoading(true);

    setError(null);

    try {
      setConnections(prev => prev.map(connection => 
        connection.id === id 
          ? { 
              ...connection, 
              status: 'disconnected',
              sync_status: 'disconnected',
              updated_at: new Date().toISOString()
  }
          : connection
      ));

      notify('success', 'Conexão desconectada com sucesso!');

    } catch (err: unknown) {
      const errorMessage = err instanceof Error
        ? getErrorMessage(err)
        : (err as { response?: { data?: { message?: string } })?.response?.data?.message || 'Erro ao desconectar';
      setError(errorMessage);

      showError('Erro ao carregar conexões', errorMessage);

    } finally {
      setLoading(false);

    } , []);

  // Testar conexão
  const testConnection = useCallback(async (id: string) => {
    setLoading(true);

    setError(null);

    try {
      const connection = connections.find(c => c.id === id);

      if (!connection) return;
      
      // Simular teste de conexão
      setTimeout(() => {
        setConnections(prev => prev.map(conn => 
          conn.id === id 
            ? { 
                ...conn, 
                health_score: Math.floor(Math.random() * 40) + 60, // 60-100
                last_health_check: new Date().toISOString(),
                updated_at: new Date().toISOString()
  }
            : conn
        ));

        showSuccess('Teste de conexão realizado com sucesso!');

      }, 1000);

    } catch (err: unknown) {
      const errorMessage = err instanceof Error
        ? getErrorMessage(err)
        : (err as { response?: { data?: { message?: string } })?.response?.data?.message || 'Erro ao testar conexão';
      setError(errorMessage);

      showError('Erro ao carregar conexões', errorMessage);

    } finally {
      setLoading(false);

    } , [connections]);

  // Sincronizar
  const syncConnection = useCallback(async (id: string) => {
    setLoading(true);

    setError(null);

    try {
      setConnections(prev => prev.map(connection => 
        connection.id === id 
          ? { 
              ...connection, 
              sync_status: 'connecting',
              updated_at: new Date().toISOString()
  }
          : connection
      ));

      // Simular processo de sincronização
      setTimeout(() => {
        setConnections(prev => prev.map(connection => 
          connection.id === id 
            ? { 
                ...connection, 
                sync_status: 'connected',
                last_sync: new Date().toISOString(),
                updated_at: new Date().toISOString()
  }
            : connection
        ));

        showSuccess('Sincronização realizada com sucesso!');

      }, 1500);

    } catch (err: unknown) {
      const errorMessage = err instanceof Error
        ? getErrorMessage(err)
        : (err as { response?: { data?: { message?: string } })?.response?.data?.message || 'Erro ao sincronizar';
      setError(errorMessage);

      showError('Erro ao carregar conexões', errorMessage);

    } finally {
      setLoading(false);

    } , []);

  // Ativar/Desativar conexão
  const toggleConnection = useCallback(async (id: string) => {
    try {
      const connection = connections.find(c => c.id === id);

      if (!connection) return;
      
      const newStatus = connection.is_active ? 'disconnected' : 'connected';
      await updateConnection(id, { 
        is_active: !connection.is_active,
        status: newStatus
      });

    } catch (err: unknown) {
      const errorMessage = err instanceof Error
        ? getErrorMessage(err)
        : (err as { response?: { data?: { message?: string } })?.response?.data?.message || 'Erro ao alterar status da conexão';
      setError(errorMessage);

      showError('Erro ao carregar conexões', errorMessage);

    } , [connections, updateConnection]);

  // Definir como primária
  const setPrimary = useCallback(async (id: string) => {
    try {
      // Remover primária de todas as conexões
      setConnections(prev => prev.map(connection => 
        ({ ...connection, is_primary: false })
      ));

      // Definir nova primária
      await updateConnection(id, { is_primary: true });

      showSuccess('Conexão definida como primária!');

    } catch (err: unknown) {
      const errorMessage = err instanceof Error
        ? getErrorMessage(err)
        : (err as { response?: { data?: { message?: string } })?.response?.data?.message || 'Erro ao definir conexão primária';
      setError(errorMessage);

      showError('Erro ao carregar conexões', errorMessage);

    } , [updateConnection]);

  // Utilitários
  const getConnectionsByStatus = useCallback((status: ConnectionStatus) => {
    return connections.filter(connection => connection.status === status);

  }, [connections]);

  const getConnectionsByProvider = useCallback((provider: ConnectionProvider) => {
    return connections.filter(connection => connection.provider === provider);

  }, [connections]);

  const getActiveConnections = useCallback(() => {
    return connections.filter(connection => connection.is_active);

  }, [connections]);

  const getConnectedConnections = useCallback(() => {
    return connections.filter(connection => connection.status === 'connected');

  }, [connections]);

  const getPrimaryConnection = useCallback(() => {
    return connections.find(connection => connection.is_primary);

  }, [connections]);

  const getConnectionById = useCallback((id: string) => {
    return connections.find(connection => connection.id === id);

  }, [connections]);

  const getConnectionStats = useCallback(() => {
    const total = connections.length;
    const connected = connections.filter(c => c.status === 'connected').length;
    const disconnected = connections.filter(c => c.status === 'disconnected').length;
    const connecting = connections.filter(c => c.status === 'connecting').length;
    const error = connections.filter(c => c.status === 'error').length;
    const active = connections.filter(c => c.is_active).length;
    
    return {
      total,
      connected,
      disconnected,
      connecting,
      error,
      active,
      connectedPercentage: total > 0 ? (connected / total) * 100 : 0};

  }, [connections]);

  const getHealthStats = useCallback(() => {
    const healthy = connections.filter(c => c.health_score >= 80).length;
    const warning = connections.filter(c => c.health_score >= 60 && c.health_score < 80).length;
    const critical = connections.filter(c => c.health_score < 60).length;
    const averageHealth = connections.length > 0 
      ? connections.reduce((sum: unknown, c: unknown) => sum + c.health_score, 0) / connections.length 
      : 0;
    
    return {
      healthy,
      warning,
      critical,
      averageHealth: Math.round(averageHealth)};

  }, [connections]);

  // Inicialização
  useEffect(() => {
    fetchConnections();

  }, [fetchConnections]);

  return {
    // Estado
    connections,
    selectedConnection,
    loading,
    error,
    
    // Ações
    fetchConnections,
    createConnection,
    updateConnection,
    deleteConnection,
    connect,
    disconnect,
    testConnection,
    syncConnection,
    toggleConnection,
    setPrimary,
    setSelectedConnection,
    
    // Utilitários
    getConnectionsByStatus,
    getConnectionsByProvider,
    getActiveConnections,
    getConnectedConnections,
    getPrimaryConnection,
    getConnectionById,
    getConnectionStats,
    getHealthStats,
    
    // Controle de erro
    clearError: () => setError(null)};
};
