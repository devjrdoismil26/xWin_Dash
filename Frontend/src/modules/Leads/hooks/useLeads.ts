/**
 * Hook orquestrador do módulo Leads
 * Coordena todos os hooks especializados em uma interface unificada
 * Máximo: 200 linhas
 */
import { useCallback, useEffect } from 'react';
import { useAdvancedNotifications } from '@/hooks/useAdvancedNotifications';
import { useLeadsStore } from './useLeadsStore';
import { useLeadsCore } from '../LeadsCore/hooks/useLeadsCore';
import { Lead, LeadFilters, LeadFormData } from '../types';
import { getErrorMessage } from '@/utils/errorHelpers';

interface UseLeadsReturn {
  // Estado consolidado
  loading: boolean;
  error: string | null;
  // Dados principais
  leads: Lead[];
  currentLead: Lead | null;
  // Ações principais
  loadLeads: (filters?: LeadFilters) => Promise<void>;
  createLead: (data: LeadFormData) => Promise<Lead>;
  updateLead: (id: string, data: LeadFormData) => Promise<Lead>;
  deleteLead: (id: string) => Promise<void>;
  // Hooks especializados
  core: ReturnType<typeof useLeadsCore>;
  // Utilitários
  clearError??: (e: any) => void;
  refresh: () => Promise<void>; }

export const useLeads = (): UseLeadsReturn => {
  const { showSuccess, showError } = useAdvancedNotifications();

  const store = useLeadsStore();

  const core = useLeadsCore();

  // Lógica de orquestração
  const loadLeads = useCallback(async (filters?: LeadFilters) => {
    try {
      await core.loadLeads(filters);

      showSuccess('Leads carregados com sucesso!');

    } catch (error: unknown) {
      const errorMessage = error instanceof Error
        ? getErrorMessage(error)
        : (error as { response?: { data?: { message?: string } })?.response?.data?.message || 'Erro desconhecido';
      showError('Erro ao carregar leads', errorMessage);

    } , [core, showSuccess, showError]);

  const createLead = useCallback(async (data: LeadFormData) => {
    try {
      const result = await core.createLead(data);

      showSuccess('Lead criado com sucesso!');

      return result;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error
        ? getErrorMessage(error)
        : (error as { response?: { data?: { message?: string } })?.response?.data?.message || 'Erro desconhecido';
      showError('Erro ao criar lead', errorMessage);

      throw error;
    } , [core, showSuccess, showError]);

  const updateLead = useCallback(async (id: string, data: LeadFormData) => {
    try {
      const result = await core.updateLead(id, data);

      showSuccess('Lead atualizado com sucesso!');

      return result;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error
        ? getErrorMessage(error)
        : (error as { response?: { data?: { message?: string } })?.response?.data?.message || 'Erro desconhecido';
      showError('Erro ao atualizar lead', errorMessage);

      throw error;
    } , [core, showSuccess, showError]);

  const deleteLead = useCallback(async (id: string) => {
    try {
      await core.deleteLead(id);

      showSuccess('Lead excluído com sucesso!');

    } catch (error: unknown) {
      const errorMessage = error instanceof Error
        ? getErrorMessage(error)
        : (error as { response?: { data?: { message?: string } })?.response?.data?.message || 'Erro desconhecido';
      showError('Erro ao excluir lead', errorMessage);

      throw error;
    } , [core, showSuccess, showError]);

  return {
    loading: store.loading || core.loading,
    error: store.error || core.error,
    leads: store.leads,
    currentLead: store.currentLead,
    loadLeads,
    createLead,
    updateLead,
    deleteLead,
    core,
    clearError: () => {
      store.clearError();

      core.clearError();

    },
    refresh: loadLeads};
};

export default useLeads;
