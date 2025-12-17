/**
 * @module modules/Aura/hooks/useAura
 * @description
 * Hook principal do m?dulo Aura.
 * 
 * Orquestrador que gerencia o estado e a??es principais do m?dulo Aura:
 * - Gerenciamento de conex?es (WhatsApp, Telegram, Instagram, etc.)
 * - Gerenciamento de fluxos (cria??o, atualiza??o, execu??o)
 * - Gerenciamento de chats
 * - Estados de loading e erro separados por funcionalidade
 * - Estat?sticas computadas (connectionsStats, flowsStats, hasActiveConnections)
 * 
 * @example
 * ```typescript
 * import { useAura } from './hooks/useAura';
 * 
 * const MyComponent = () => {
 *   const {
 *     connections,
 *     flows,
 *     chats,
 *     loading,
 *     fetchConnections,
 *     createConnection,
 *     executeFlow
 *   } = useAura();

 * 
 *   useEffect(() => {
 *     fetchConnections();

 *   }, []);

 * 
 *   return <div>...</div>;
 *};

 * ```
 * 
 * @since 1.0.0
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { toast } from 'sonner';
import auraService, { 
  AuraConnection, 
  AuraFlow, 
  AuraChat, 
  AuraResponse 
} from '../services/auraService';

interface UseAuraReturn {
  // Data
  connections: AuraConnection[];
  flows: AuraFlow[];
  chats: AuraChat[];
  // Loading states
  loading: boolean;
  connectionsLoading: boolean;
  flowsLoading: boolean;
  chatsLoading: boolean;
  // Error states
  error: string | null;
  connectionsError: string | null;
  flowsError: string | null;
  chatsError: string | null;
  // Connection actions
  fetchConnections: () => Promise<void>;
  createConnection: (data: Partial<AuraConnection>) => Promise<AuraConnection>;
  updateConnection: (id: string, data: Partial<AuraConnection>) => Promise<AuraConnection>;
  deleteConnection: (id: string) => Promise<void>;
  testConnection: (id: string) => Promise<boolean>;
  connectWhatsApp: (id: string) => Promise<void>;
  disconnectWhatsApp: (id: string) => Promise<void>;
  // Flow actions
  fetchFlows: () => Promise<void>;
  createFlow: (data: Partial<AuraFlow>) => Promise<AuraFlow>;
  updateFlow: (id: string, data: Partial<AuraFlow>) => Promise<AuraFlow>;
  deleteFlow: (id: string) => Promise<void>;
  executeFlow: (id: string, phoneNumber: string, variables?: Record<string, any>) => Promise<void>;
  // Chat actions
  fetchChats: (params?: Record<string, any>) => Promise<void>;
  // State management
  clearError??: (e: any) => void;
  clearAllErrors??: (e: any) => void; }

export const useAura = (): UseAuraReturn => {
  // State
  const [connections, setConnections] = useState<AuraConnection[]>([]);

  const [flows, setFlows] = useState<AuraFlow[]>([]);

  const [chats, setChats] = useState<AuraChat[]>([]);

  // Loading states
  const [loading, setLoading] = useState(false);

  const [connectionsLoading, setConnectionsLoading] = useState(false);

  const [flowsLoading, setFlowsLoading] = useState(false);

  const [chatsLoading, setChatsLoading] = useState(false);

  // Error states
  const [error, setError] = useState<string | null>(null);

  const [connectionsError, setConnectionsError] = useState<string | null>(null);

  const [flowsError, setFlowsError] = useState<string | null>(null);

  const [chatsError, setChatsError] = useState<string | null>(null);

  // Connection actions
  const fetchConnections = useCallback(async () => {
    setConnectionsLoading(true);

    setConnectionsError(null);

    try {
      const result: AuraResponse = await auraService.getConnections();

      if (result.success && result.data) {
        setConnections(Array.isArray(result.data) ? result.data : [result.data]);

      } else {
        throw new Error(result.error || 'Failed to fetch connections');

      } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch connections';
      setConnectionsError(errorMessage);

      toast.error(errorMessage);

    } finally {
      setConnectionsLoading(false);

    } , []);

  const createConnection = useCallback(async (data: Partial<AuraConnection>): Promise<AuraConnection> => {
    setConnectionsLoading(true);

    setConnectionsError(null);

    try {
      const result: AuraResponse = await auraService.createConnection(data);

      if (result.success && result.data) {
        const newConnection = Array.isArray(result.data) ? result.data[0] : result.data;
        setConnections(prev => [...prev, newConnection]);

        toast.success('Connection created successfully!');

        return newConnection;
      }
      throw new Error(result.error || 'Failed to create connection');

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create connection';
      setConnectionsError(errorMessage);

      toast.error(errorMessage);

      throw err;
    } finally {
      setConnectionsLoading(false);

    } , []);

  const updateConnection = useCallback(async (id: string, data: Partial<AuraConnection>): Promise<AuraConnection> => {
    setConnectionsLoading(true);

    setConnectionsError(null);

    try {
      const result: AuraResponse = await auraService.updateConnection(id, data);

      if (result.success && result.data) {
        const updatedConnection = Array.isArray(result.data) ? result.data[0] : result.data;
        setConnections(prev => prev.map(conn => 
          conn.id === id ? updatedConnection : conn
        ));

        toast.success('Connection updated successfully!');

        return updatedConnection;
      }
      throw new Error(result.error || 'Failed to update connection');

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update connection';
      setConnectionsError(errorMessage);

      toast.error(errorMessage);

      throw err;
    } finally {
      setConnectionsLoading(false);

    } , []);

  const deleteConnection = useCallback(async (id: string): Promise<void> => {
    setConnectionsLoading(true);

    setConnectionsError(null);

    try {
      const result: AuraResponse = await auraService.deleteConnection(id);

      if (result.success) {
        setConnections(prev => prev.filter(conn => conn.id !== id));

        toast.success('Connection deleted successfully!');

      } else {
        throw new Error(result.error || 'Failed to delete connection');

      } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete connection';
      setConnectionsError(errorMessage);

      toast.error(errorMessage);

      throw err;
    } finally {
      setConnectionsLoading(false);

    } , []);

  const testConnection = useCallback(async (id: string): Promise<boolean> => {
    setConnectionsLoading(true);

    setConnectionsError(null);

    try {
      const result: AuraResponse = await auraService.testConnection(id);

      const success = result.success;
      
      if (success) {
        toast.success('Connection test successful!');

      } else {
        toast.error('Connection test failed');

      }
      
      return success;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Connection test failed';
      setConnectionsError(errorMessage);

      toast.error(errorMessage);

      return false;
    } finally {
      setConnectionsLoading(false);

    } , []);

  const connectWhatsApp = useCallback(async (id: string): Promise<void> => {
    try {
      const result: AuraResponse = await auraService.connectWhatsApp(id);

      if (result.success) {
        await fetchConnections(); // Refresh connections
        toast.success('Connected to WhatsApp!');

      } else {
        throw new Error(result.error || 'Failed to connect to WhatsApp');

      } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to connect to WhatsApp';
      toast.error(errorMessage);

      throw err;
    } , [fetchConnections]);

  const disconnectWhatsApp = useCallback(async (id: string): Promise<void> => {
    try {
      const result: AuraResponse = await auraService.disconnectWhatsApp(id);

      if (result.success) {
        await fetchConnections(); // Refresh connections
        toast.success('Disconnected from WhatsApp!');

      } else {
        throw new Error(result.error || 'Failed to disconnect from WhatsApp');

      } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to disconnect from WhatsApp';
      toast.error(errorMessage);

      throw err;
    } , [fetchConnections]);

  // Flow actions
  const fetchFlows = useCallback(async () => {
    setFlowsLoading(true);

    setFlowsError(null);

    try {
      const result: AuraResponse = await auraService.getFlows();

      if (result.success && result.data) {
        setFlows(Array.isArray(result.data) ? result.data : [result.data]);

      } else {
        throw new Error(result.error || 'Failed to fetch flows');

      } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch flows';
      setFlowsError(errorMessage);

      toast.error(errorMessage);

    } finally {
      setFlowsLoading(false);

    } , []);

  const createFlow = useCallback(async (data: Partial<AuraFlow>): Promise<AuraFlow> => {
    setFlowsLoading(true);

    setFlowsError(null);

    try {
      const result: AuraResponse = await auraService.createFlow(data);

      if (result.success && result.data) {
        const newFlow = Array.isArray(result.data) ? result.data[0] : result.data;
        setFlows(prev => [...prev, newFlow]);

        toast.success('Flow created successfully!');

        return newFlow;
      }
      throw new Error(result.error || 'Failed to create flow');

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create flow';
      setFlowsError(errorMessage);

      toast.error(errorMessage);

      throw err;
    } finally {
      setFlowsLoading(false);

    } , []);

  const updateFlow = useCallback(async (id: string, data: Partial<AuraFlow>): Promise<AuraFlow> => {
    setFlowsLoading(true);

    setFlowsError(null);

    try {
      const result: AuraResponse = await auraService.updateFlow(id, data);

      if (result.success && result.data) {
        const updatedFlow = Array.isArray(result.data) ? result.data[0] : result.data;
        setFlows(prev => prev.map(flow => 
          flow.id === id ? updatedFlow : flow
        ));

        toast.success('Flow updated successfully!');

        return updatedFlow;
      }
      throw new Error(result.error || 'Failed to update flow');

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update flow';
      setFlowsError(errorMessage);

      toast.error(errorMessage);

      throw err;
    } finally {
      setFlowsLoading(false);

    } , []);

  const deleteFlow = useCallback(async (id: string): Promise<void> => {
    setFlowsLoading(true);

    setFlowsError(null);

    try {
      const result: AuraResponse = await auraService.deleteFlow(id);

      if (result.success) {
        setFlows(prev => prev.filter(flow => flow.id !== id));

        toast.success('Flow deleted successfully!');

      } else {
        throw new Error(result.error || 'Failed to delete flow');

      } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete flow';
      setFlowsError(errorMessage);

      toast.error(errorMessage);

      throw err;
    } finally {
      setFlowsLoading(false);

    } , []);

  const executeFlow = useCallback(async (id: string, phoneNumber: string, variables: Record<string, any> = {}): Promise<void> => {
    setFlowsLoading(true);

    setFlowsError(null);

    try {
      const result: AuraResponse = await auraService.executeFlow(id, phoneNumber, variables);

      if (result.success) {
        toast.success('Flow executed successfully!');

      } else {
        throw new Error(result.error || 'Failed to execute flow');

      } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to execute flow';
      setFlowsError(errorMessage);

      toast.error(errorMessage);

      throw err;
    } finally {
      setFlowsLoading(false);

    } , []);

  // Chat actions
  const fetchChats = useCallback(async (params: Record<string, any> = {}) => {
    setChatsLoading(true);

    setChatsError(null);

    try {
      const result: AuraResponse = await auraService.getChats(params);

      if (result.success && result.data) {
        setChats(Array.isArray(result.data) ? result.data : [result.data]);

      } else {
        throw new Error(result.error || 'Failed to fetch chats');

      } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch chats';
      setChatsError(errorMessage);

      toast.error(errorMessage);

    } finally {
      setChatsLoading(false);

    } , []);

  // State management
  const clearError = useCallback(() => {
    setError(null);

  }, []);

  const clearAllErrors = useCallback(() => {
    setError(null);

    setConnectionsError(null);

    setFlowsError(null);

    setChatsError(null);

  }, []);

  // Initialize data on mount
  useEffect(() => {
    fetchConnections();

    fetchFlows();

    fetchChats();

  }, [fetchConnections, fetchFlows, fetchChats]);

  // Memoizar dados computados para performance
  const connectionsStats = useMemo(() => {
    if (!connections.length) return { total: 0, active: 0, inactive: 0};

    return connections.reduce((acc: unknown, connection: unknown) => {
      acc.total++;
      if (connection.status === 'connected') acc.active++;
      else acc.inactive++;
      return acc;
    }, { total: 0, active: 0, inactive: 0 });

  }, [connections]);

  const flowsStats = useMemo(() => {
    if (!flows.length) return { total: 0, active: 0, inactive: 0};

    return flows.reduce((acc: unknown, flow: unknown) => {
      acc.total++;
      if (flow.status === 'active') acc.active++;
      else acc.inactive++;
      return acc;
    }, { total: 0, active: 0, inactive: 0 });

  }, [flows]);

  const hasActiveConnections = useMemo(() => {
    return connections.some(connection => connection.status === 'connected');

  }, [connections]);

  return {
    // Data
    connections,
    flows,
    chats,
    
    // Computed stats
    connectionsStats,
    flowsStats,
    hasActiveConnections,
    
    // Loading states
    loading,
    connectionsLoading,
    flowsLoading,
    chatsLoading,
    
    // Error states
    error,
    connectionsError,
    flowsError,
    chatsError,
    
    // Connection actions
    fetchConnections,
    createConnection,
    updateConnection,
    deleteConnection,
    testConnection,
    connectWhatsApp,
    disconnectWhatsApp,
    
    // Flow actions
    fetchFlows,
    createFlow,
    updateFlow,
    deleteFlow,
    executeFlow,
    
    // Chat actions
    fetchChats,
    
    // State management
    clearError,
    clearAllErrors};
};

export default useAura;
