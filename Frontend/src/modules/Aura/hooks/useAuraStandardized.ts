/**
 * @module modules/Aura/hooks/useAuraStandardized
 * @description
 * Hook padronizado e orquestrador do módulo Aura.
 * 
 * Coordena todos os hooks especializados em uma interface unificada:
 * - Integração com useAuraStore, useAuraConnections, useAuraFlows, useAuraChats
 * - Ações principais consolidadas (loadConnections, createConnection, updateConnection, deleteConnection)
 * - Estados de loading e erro consolidados
 * - Funções de utilitários (clearError, refresh)
 * 
 * @example
 * ```typescript
 * import { useAuraStandardized } from './hooks/useAuraStandardized';
 * 
 * const AuraComponent = () => {
 *   const {
 *     loading,
 *     connections,
 *     flows,
 *     chats,
 *     loadConnections,
 *     createConnection,
 *     refresh
 *   } = useAuraStandardized();

 * 
 *   return <div>...</div>;
 *};

 * ```
 * 
 * @since 1.0.0
 */
import { useCallback, useEffect } from 'react';
import { useAdvancedNotifications } from '@/hooks/useAdvancedNotifications';
import { useAuraStore } from './useAuraStore';
import { useAuraConnections } from './useAuraConnections';
import { useAuraFlows } from './useAuraFlows';
import { useAuraChats } from './useAuraChats';
import { AuraConnection, AuraFlow, AuraChat, AuraFilters } from '../types';
import { getErrorMessage } from '@/utils/errorHelpers';

interface UseAuraReturn {
  // Estado consolidado
  loading: boolean;
  error: string | null;
  // Dados principais
  connectionsList: AuraConnection[];
  flowsList: AuraFlow[];
  chatsList: AuraChat[];
  // Ações principais
  loadConnections: (filters?: AuraFilters) => Promise<void>;
  createConnection: (data: Partial<AuraConnection>) => Promise<AuraConnection>;
  updateConnection: (id: string, data: Partial<AuraConnection>) => Promise<AuraConnection>;
  deleteConnection: (id: string) => Promise<void>;
  // Hooks especializados
  connections: ReturnType<typeof useAuraConnections>;
  flows: ReturnType<typeof useAuraFlows>;
  chats: ReturnType<typeof useAuraChats>;
  // Utilitários
  clearError??: (e: any) => void;
  refresh: () => Promise<void>; }

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

    } catch (error: unknown) {
      const errorMessage = error instanceof Error
        ? getErrorMessage(error)
        : (error as { response?: { data?: { message?: string } })?.response?.data?.message || 'Erro desconhecido';
      showError('Erro ao carregar conexões', errorMessage);

    } , [connections, showSuccess, showError]);

  const createConnection = useCallback(async (data: Partial<AuraConnection>) => {
    try {
      const result = await connections.createConnection(data);

      showSuccess('Conexão criada com sucesso!');

      return result;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error
        ? getErrorMessage(error)
        : (error as { response?: { data?: { message?: string } })?.response?.data?.message || 'Erro desconhecido';
      showError('Erro ao criar conexão', errorMessage);

      throw error;
    } , [connections, showSuccess, showError]);

  const updateConnection = useCallback(async (id: string, data: Partial<AuraConnection>) => {
    try {
      const result = await connections.updateConnection(id, data);

      showSuccess('Conexão atualizada com sucesso!');

      return result;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error
        ? getErrorMessage(error)
        : (error as { response?: { data?: { message?: string } })?.response?.data?.message || 'Erro desconhecido';
      showError('Erro ao atualizar conexão', errorMessage);

      throw error;
    } , [connections, showSuccess, showError]);

  const deleteConnection = useCallback(async (id: string) => {
    try {
      await connections.deleteConnection(id);

      showSuccess('Conexão excluída com sucesso!');

    } catch (error: unknown) {
      const errorMessage = error instanceof Error
        ? getErrorMessage(error)
        : (error as { response?: { data?: { message?: string } })?.response?.data?.message || 'Erro desconhecido';
      showError('Erro ao excluir conexão', errorMessage);

      throw error;
    } , [connections, showSuccess, showError]);

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
    refresh: loadConnections};
};
