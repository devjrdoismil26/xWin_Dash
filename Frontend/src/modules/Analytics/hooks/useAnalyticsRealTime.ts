/**
 * Hook especializado para analytics em tempo real
 * Gerencia dados em tempo real, WebSocket e polling
 */
import { useCallback, useState, useEffect, useRef } from 'react';
import { getErrorMessage } from '@/utils/errorHelpers';
import { useAnalyticsStore } from './useAnalyticsStore';
import { AnalyticsRealTimeData } from '../types';
import { useAdvancedNotifications } from '@/hooks/useAdvancedNotifications';
import { notify } from '@/lib/utils';

export const useAnalyticsRealTime = () => {
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected' | 'error'>('disconnected');

  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const wsRef = useRef<WebSocket | null>(null);

  const { showSuccess, showError: showErrorNotification } = useAdvancedNotifications();

  const {
    realTimeEnabled,
    realTimeData,
    autoRefresh,
    enableRealTime,
    disableRealTime,
    toggleRealTime,
    enableAutoRefresh,
    disableAutoRefresh,
    toggleAutoRefresh
  } = useAnalyticsStore();

  // Limpar recursos na desmontagem
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);

      }
      if (wsRef.current) {
        wsRef.current.close();

      } ;

  }, []);

  // Conectar WebSocket
  const connectWebSocket = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    setConnectionStatus('connecting');

    try {
      const ws = new WebSocket('ws://localhost:8080/analytics/realtime');

      ws.onopen = () => {
        setConnectionStatus('connected');

        setError(null);

        notify('success', 'Conexão em tempo real estabelecida!');};

      ws.onmessage = (event: unknown) => {
        try {
          const data: AnalyticsRealTimeData = JSON.parse(event.data);

          // Atualizar dados em tempo real no store
          setLastUpdate(new Date());

        } catch (err) {
          console.error('Erro ao processar dados WebSocket:', err);

        } ;

      ws.onclose = () => {
        setConnectionStatus('disconnected');

        if (realTimeEnabled) {
          // Tentar reconectar após 5 segundos
          setTimeout(() => {
            if (realTimeEnabled) {
              connectWebSocket();

            } , 5000);

        } ;

      ws.onerror = (error: unknown) => {
        setConnectionStatus('error');

        setError('Erro na conexão WebSocket');

        console.error('WebSocket error:', error);};

      wsRef.current = ws;
    } catch (err: unknown) {
      setConnectionStatus('error');

      setError('Erro ao conectar WebSocket');

      console.error('Erro ao conectar WebSocket:', err);

    } , [realTimeEnabled]);

  // Desconectar WebSocket
  const disconnectWebSocket = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();

      wsRef.current = null;
    }
    setConnectionStatus('disconnected');

  }, []);

  // Iniciar polling como fallback
  const startPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);

    }

    intervalRef.current = setInterval(async () => {
      try {
        // Simular dados em tempo real
        const mockData: AnalyticsRealTimeData = {
          active_users: Math.floor(Math.random() * 1000) + 100,
          page_views: Math.floor(Math.random() * 5000) + 500,
          top_pages: [
            { page: '/', views: Math.floor(Math.random() * 1000) + 100 },
            { page: '/products', views: Math.floor(Math.random() * 500) + 50 },
            { page: '/about', views: Math.floor(Math.random() * 200) + 20 }
          ],
          top_sources: [
            { source: 'google', users: Math.floor(Math.random() * 200) + 50 },
            { source: 'direct', users: Math.floor(Math.random() * 150) + 30 },
            { source: 'facebook', users: Math.floor(Math.random() * 100) + 20 }
          ],
          top_devices: [
            { device: 'desktop', users: Math.floor(Math.random() * 300) + 100 },
            { device: 'mobile', users: Math.floor(Math.random() * 200) + 80 },
            { device: 'tablet', users: Math.floor(Math.random() * 50) + 10 }
          ],
          last_updated: new Date().toISOString()};

        setLastUpdate(new Date());

        setError(null);

      } catch (err: unknown) {
        setError(getErrorMessage(err));

        console.error('Erro no polling:', err);

      } , 5000);

  }, []);

  // Parar polling
  const stopPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);

      intervalRef.current = null;
    } , []);

  // Habilitar tempo real
  const enableRealTimeWithStatus = useCallback(() => {
    setLoading(true);

    setError(null);

    try {
      enableRealTime();

      // Tentar WebSocket primeiro, fallback para polling
      if (typeof WebSocket !== 'undefined') {
        connectWebSocket();

      } else {
        startPolling();

      }
      
      showSuccess('Analytics em tempo real habilitado!');

    } catch (err: unknown) {
      setError(getErrorMessage(err));

      showErrorNotification('Erro ao habilitar tempo real', getErrorMessage(err));

    } finally {
      setLoading(false);

    } , [enableRealTime, connectWebSocket, startPolling, showSuccess, showErrorNotification]);

  // Desabilitar tempo real
  const disableRealTimeWithStatus = useCallback(() => {
    setLoading(true);

    try {
      disableRealTime();

      disconnectWebSocket();

      stopPolling();

      showSuccess('Analytics em tempo real desabilitado!');

    } catch (err: unknown) {
      setError(getErrorMessage(err));

      showErrorNotification('Erro ao desabilitar tempo real', getErrorMessage(err));

    } finally {
      setLoading(false);

    } , [disableRealTime, disconnectWebSocket, stopPolling]);

  // Alternar tempo real
  const toggleRealTimeWithStatus = useCallback(() => {
    if (realTimeEnabled) {
      disableRealTimeWithStatus();

    } else {
      enableRealTimeWithStatus();

    } , [realTimeEnabled, enableRealTimeWithStatus, disableRealTimeWithStatus]);

  // Habilitar auto refresh
  const enableAutoRefreshWithStatus = useCallback(() => {
    try {
      enableAutoRefresh();

      showSuccess('Auto refresh habilitado!');

    } catch (err: unknown) {
      setError(getErrorMessage(err));

      showErrorNotification('Erro ao habilitar auto refresh', getErrorMessage(err));

    } , [enableAutoRefresh]);

  // Desabilitar auto refresh
  const disableAutoRefreshWithStatus = useCallback(() => {
    try {
      disableAutoRefresh();

      showSuccess('Auto refresh desabilitado!');

    } catch (err: unknown) {
      setError(getErrorMessage(err));

      showErrorNotification('Erro ao desabilitar auto refresh', getErrorMessage(err));

    } , [disableAutoRefresh, showSuccess, showErrorNotification]);

  // Alternar auto refresh
  const toggleAutoRefreshWithStatus = useCallback(() => {
    if (autoRefresh) {
      disableAutoRefreshWithStatus();

    } else {
      enableAutoRefreshWithStatus();

    } , [autoRefresh, enableAutoRefreshWithStatus, disableAutoRefreshWithStatus]);

  // Obter status da conexão
  const getConnectionStatus = useCallback(() => {
    return {
      status: connectionStatus,
      isConnected: connectionStatus === 'connected',
      isConnecting: connectionStatus === 'connecting',
      hasError: connectionStatus === 'error'};

  }, [connectionStatus]);

  // Obter estatísticas de tempo real
  const getRealTimeStats = useCallback(() => {
    if (!realTimeData) return null;
    
    return {
      activeUsers: realTimeData.active_users,
      pageViews: realTimeData.page_views,
      topPage: realTimeData.top_pages[0]?.page || 'N/A',
      topSource: realTimeData.top_sources[0]?.source || 'N/A',
      topDevice: realTimeData.top_devices[0]?.device || 'N/A',
      lastUpdate: lastUpdate};

  }, [realTimeData, lastUpdate]);

  // Verificar se tempo real está ativo
  const isRealTimeActive = useCallback(() => {
    return realTimeEnabled && (
      connectionStatus === 'connected' || 
      intervalRef.current !== null);

  }, [realTimeEnabled, connectionStatus]);

  // Obter tempo desde última atualização
  const getTimeSinceLastUpdate = useCallback(() => {
    if (!lastUpdate) return null;
    
    const now = new Date();

    const diff = now.getTime() - lastUpdate.getTime();

    const seconds = Math.floor(diff / 1000);

    if (seconds < 60) {
      return `${seconds}s atrás`;
    } else if (seconds < 3600) {
      return `${Math.floor(seconds / 60)}m atrás`;
    } else {
      return `${Math.floor(seconds / 3600)}h atrás`;
    } , [lastUpdate]);

  // Reconectar manualmente
  const reconnect = useCallback(() => {
    if (realTimeEnabled) {
      disconnectWebSocket();

      stopPolling();

      setTimeout(() => {
        enableRealTimeWithStatus();

      }, 1000);

    } , [realTimeEnabled, disconnectWebSocket, stopPolling, enableRealTimeWithStatus]);

  return {
    // Estado
    realTimeEnabled,
    realTimeData,
    autoRefresh,
    loading,
    error,
    connectionStatus,
    lastUpdate,
    
    // Ações
    enableRealTime: enableRealTimeWithStatus,
    disableRealTime: disableRealTimeWithStatus,
    toggleRealTime: toggleRealTimeWithStatus,
    enableAutoRefresh: enableAutoRefreshWithStatus,
    disableAutoRefresh: disableAutoRefreshWithStatus,
    toggleAutoRefresh: toggleAutoRefreshWithStatus,
    reconnect,
    
    // Utilitários
    getConnectionStatus,
    getRealTimeStats,
    isRealTimeActive,
    getTimeSinceLastUpdate,
    
    // Controle de erro
    clearError: () => setError(null)};
};
