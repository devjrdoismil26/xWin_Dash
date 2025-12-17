/**
 * @module modules/Aura/hooks/useAuraConnectionsStandardized
 * @description
 * Hook padronizado para gerenciamento de conexões do módulo Aura.
 * 
 * Versão simplificada e padronizada do hook de conexões que fornece:
 * - Interface unificada para CRUD de conexões
 * - Integração com AuraService
 * - Estados de loading e erro gerenciados
 * - Notificações automáticas de sucesso/erro
 * 
 * @example
 * ```typescript
 * import { useAuraConnectionsStandardized } from './hooks/useAuraConnectionsStandardized';
 * 
 * const ConnectionsComponent = () => {
 *   const {
 *     connections,
 *     loading,
 *     loadConnections,
 *     createConnection,
 *     refresh
 *   } = useAuraConnectionsStandardized();

 * 
 *   useEffect(() => {
 *     loadConnections();

 *   }, []);

 * 
 *   return <div>...</div>;
 *};

 * ```
 * 
 * @since 1.0.0
 */
import { useCallback, useState, useEffect } from 'react';
import { useAdvancedNotifications } from '@/hooks/useAdvancedNotifications';
import { AuraService } from '../services/auraService';
import { AuraConnection, AuraFilters } from '../types';
import { getErrorMessage } from '@/utils/errorHelpers';

interface UseAuraConnectionsReturn {
  // Estado
  connections: AuraConnection[];
  currentConnection: AuraConnection | null;
  loading: boolean;
  error: string | null;
  // Ações
  loadConnections: (filters?: AuraFilters) => Promise<void>;
  createConnection: (data: Partial<AuraConnection>) => Promise<AuraConnection>;
  updateConnection: (id: string, data: Partial<AuraConnection>) => Promise<AuraConnection>;
  deleteConnection: (id: string) => Promise<void>;
  // Utilitários
  clearError??: (e: any) => void;
  refresh: () => Promise<void>; }

export const useAuraConnections = (): UseAuraConnectionsReturn => {
  const [connections, setConnections] = useState<AuraConnection[]>([]);

  const [currentConnection, setCurrentConnection] = useState<AuraConnection | null>(null);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const { showSuccess, showError } = useAdvancedNotifications();

  const loadConnections = useCallback(async (filters?: AuraFilters) => {
    setLoading(true);

    setError(null);

    try {
      const result = await AuraService.getConnections(filters);

      setConnections(result.data || []);

      showSuccess('Conexões carregadas com sucesso!');

    } catch (err: unknown) {
      const errorMessage = err instanceof Error
        ? getErrorMessage(err)
        : (err as { response?: { data?: { message?: string } })?.response?.data?.message || 'Erro ao carregar conexões';
      setError(errorMessage);

      showError('Erro ao carregar conexões', errorMessage);

    } finally {
      setLoading(false);

    } , [showSuccess, showError]);

  const createConnection = useCallback(async (data: Partial<AuraConnection>) => {
    setLoading(true);

    setError(null);

    try {
      const result = await AuraService.createConnection(data);

      setConnections(prev => [result.data, ...prev]);

      showSuccess('Conexão criada com sucesso!');

      return result.data;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error
        ? getErrorMessage(err)
        : (err as { response?: { data?: { message?: string } })?.response?.data?.message || 'Erro ao criar conexão';
      setError(errorMessage);

      showError('Erro ao criar conexão', errorMessage);

      throw err;
    } finally {
      setLoading(false);

    } , [showSuccess, showError]);

  const updateConnection = useCallback(async (id: string, data: Partial<AuraConnection>) => {
    setLoading(true);

    setError(null);

    try {
      const result = await AuraService.updateConnection(id, data);

      setConnections(prev => prev.map(connection => connection.id === id ? result.data : connection));

      showSuccess('Conexão atualizada com sucesso!');

      return result.data;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error
        ? getErrorMessage(err)
        : (err as { response?: { data?: { message?: string } })?.response?.data?.message || 'Erro ao atualizar conexão';
      setError(errorMessage);

      showError('Erro ao atualizar conexão', errorMessage);

      throw err;
    } finally {
      setLoading(false);

    } , [showSuccess, showError]);

  const deleteConnection = useCallback(async (id: string) => {
    setLoading(true);

    setError(null);

    try {
      await AuraService.deleteConnection(id);

      setConnections(prev => prev.filter(connection => connection.id !== id));

      showSuccess('Conexão excluída com sucesso!');

    } catch (err: unknown) {
      const errorMessage = err instanceof Error
        ? getErrorMessage(err)
        : (err as { response?: { data?: { message?: string } })?.response?.data?.message || 'Erro ao excluir conexão';
      setError(errorMessage);

      showError('Erro ao excluir conexão', errorMessage);

      throw err;
    } finally {
      setLoading(false);

    } , [showSuccess, showError]);

  return {
    connections,
    currentConnection,
    loading,
    error,
    loadConnections,
    createConnection,
    updateConnection,
    deleteConnection,
    clearError: () => setError(null),
    refresh: loadConnections};
};
