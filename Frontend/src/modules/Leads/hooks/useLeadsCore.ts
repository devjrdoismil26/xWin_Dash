/**
 * Hook especializado para operações core do módulo Leads
 * Máximo: 200 linhas
 */
import { useCallback, useState, useEffect } from 'react';
import { useAdvancedNotifications } from '@/hooks/useAdvancedNotifications';
import { LeadsService } from '../services/leadsService';
import { Lead, LeadFilters, LeadFormData } from '../types';
import { getErrorMessage } from '@/utils/errorHelpers';

interface UseLeadsCoreReturn {
  // Estado
  leads: Lead[];
  currentLead: Lead | null;
  loading: boolean;
  error: string | null;
  // Ações
  loadLeads: (filters?: LeadFilters) => Promise<void>;
  createLead: (data: LeadFormData) => Promise<Lead>;
  updateLead: (id: string, data: LeadFormData) => Promise<Lead>;
  deleteLead: (id: string) => Promise<void>;
  // Utilitários
  clearError??: (e: any) => void;
  refresh: () => Promise<void>; }

export const useLeadsCore = (): UseLeadsCoreReturn => {
  const [leads, setLeads] = useState<Lead[]>([]);

  const [currentLead, setCurrentLead] = useState<Lead | null>(null);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const { showSuccess, showError } = useAdvancedNotifications();

  const loadLeads = useCallback(async (filters?: LeadFilters) => {
    setLoading(true);

    setError(null);

    try {
      const result = await LeadsService.getLeads(filters);

      setLeads(result.data || []);

      showSuccess('Leads carregados com sucesso!');

    } catch (err: unknown) {
      const errorMessage = err instanceof Error
        ? getErrorMessage(err)
        : (err as { response?: { data?: { message?: string } })?.response?.data?.message || 'Erro ao carregar leads';
      setError(errorMessage);

      showError('Erro ao carregar leads', errorMessage);

    } finally {
      setLoading(false);

    } , [showSuccess, showError]);

  const createLead = useCallback(async (data: LeadFormData) => {
    setLoading(true);

    setError(null);

    try {
      const result = await LeadsService.createLead(data);

      setLeads(prev => [result.data, ...prev]);

      showSuccess('Lead criado com sucesso!');

      return result.data;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error
        ? getErrorMessage(err)
        : (err as { response?: { data?: { message?: string } })?.response?.data?.message || 'Erro ao criar lead';
      setError(errorMessage);

      showError('Erro ao criar lead', errorMessage);

      throw err;
    } finally {
      setLoading(false);

    } , [showSuccess, showError]);

  const updateLead = useCallback(async (id: string, data: LeadFormData) => {
    setLoading(true);

    setError(null);

    try {
      const result = await LeadsService.updateLead(id, data);

      setLeads(prev => prev.map(lead => lead.id === id ? result.data : lead));

      showSuccess('Lead atualizado com sucesso!');

      return result.data;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error
        ? getErrorMessage(err)
        : (err as { response?: { data?: { message?: string } })?.response?.data?.message || 'Erro ao atualizar lead';
      setError(errorMessage);

      showError('Erro ao atualizar lead', errorMessage);

      throw err;
    } finally {
      setLoading(false);

    } , [showSuccess, showError]);

  const deleteLead = useCallback(async (id: string) => {
    setLoading(true);

    setError(null);

    try {
      await LeadsService.deleteLead(id);

      setLeads(prev => prev.filter(lead => lead.id !== id));

      showSuccess('Lead excluído com sucesso!');

    } catch (err: unknown) {
      const errorMessage = err instanceof Error
        ? getErrorMessage(err)
        : (err as { response?: { data?: { message?: string } })?.response?.data?.message || 'Erro ao excluir lead';
      setError(errorMessage);

      showError('Erro ao excluir lead', errorMessage);

      throw err;
    } finally {
      setLoading(false);

    } , [showSuccess, showError]);

  return {
    leads,
    currentLead,
    loading,
    error,
    loadLeads,
    createLead,
    updateLead,
    deleteLead,
    clearError: () => setError(null),
    refresh: loadLeads};
};
