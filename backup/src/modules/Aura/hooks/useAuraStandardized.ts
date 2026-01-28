/**
 * Hook orquestrador do módulo Aura
 * Coordena todos os hooks especializados em uma interface unificada
 * Máximo: 200 linhas
 */
import { useCallback, useEffect } from 'react';
import { useAdvancedNotifications } from '@/hooks/useAdvancedNotifications';
import { useAuraStore } from './useAuraStore';
import { useAuraConnections } from './useAuraConnections';
import { useAuraFlows } from './useAuraFlows';
import { useAuraChats } from './useAuraChats';
import { AuraConnection, AuraFlow, AuraChat, AuraFilters } from '../types';

interface UseAuraReturn {
  // Estado consolidado
  loading: boolean;
  error: string | null;
  
  // Dados principais
  connections: AuraConnection[];
  flows: AuraFlow[];
  chats: AuraChat[];
  
  // Ações principais
  loadConnections: (filters?: AuraFilters) => Promise<void>;
  createConnection: (data: any) => Promise<AuraConnection>;
  updateConnection: (id: string, data: any) => Promise<AuraConnection>;
  deleteConnection: (id: string) => Promise<void>;
  
  // Hooks especializados
  connections: ReturnType<typeof useAuraConnections>;
  flows: ReturnType<typeof useAuraFlows>;
  chats: ReturnType<typeof useAuraChats>;
  
  // Utilitários
  clearError: () => void;
  refresh: () => Promise<void>;
}

export const useAura = (): UseAuraReturn => {
  const { showSuccess, showError } = useAdvancedNotifications();
  const store = useAuraStore();
  const connections = useAuraConnections();
  const flows = useAuraFlows();
  const chats = useAuraChats();
  
  // Lógica de orquestração
  const loadConnections = useCallback(async (filters?: AuraFilters) => {
    try {
      await connections.loadConnections(filters);
      showSuccess('Conexões carregadas com sucesso!');
    } catch (error: any) {
      showError('Erro ao carregar conexões', error.message);
    }
  }, [connections, showSuccess, showError]);
  
  const createConnection = useCallback(async (data: any) => {
    try {
      const result = await connections.createConnection(data);
      showSuccess('Conexão criada com sucesso!');
      return result;
    } catch (error: any) {
      showError('Erro ao criar conexão', error.message);
      throw error;
    }
  }, [connections, showSuccess, showError]);
  
  const updateConnection = useCallback(async (id: string, data: any) => {
    try {
      const result = await connections.updateConnection(id, data);
      showSuccess('Conexão atualizada com sucesso!');
      return result;
    } catch (error: any) {
      showError('Erro ao atualizar conexão', error.message);
      throw error;
    }
  }, [connections, showSuccess, showError]);
  
  const deleteConnection = useCallback(async (id: string) => {
    try {
      await connections.deleteConnection(id);
      showSuccess('Conexão excluída com sucesso!');
    } catch (error: any) {
      showError('Erro ao excluir conexão', error.message);
      throw error;
    }
  }, [connections, showSuccess, showError]);
  
  // Inicialização
  useEffect(() => {
    loadConnections();
    flows.loadFlows();
    chats.loadChats();
  }, []);
  
  return {
    loading: store.loading || connections.loading || flows.loading || chats.loading,
    error: store.error || connections.error || flows.error || chats.error,
    connections: store.connections,
    flows: store.flows,
    chats: store.chats,
    loadConnections,
    createConnection,
    updateConnection,
    deleteConnection,
    connections,
    flows,
    chats,
    clearError: () => {
      store.clearError();
      connections.clearError();
      flows.clearError();
      chats.clearError();
    },
    refresh: loadConnections
  };
};