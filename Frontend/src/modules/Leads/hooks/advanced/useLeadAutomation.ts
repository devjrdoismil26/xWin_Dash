// ========================================
// HOOK DE AUTOMAÇÃO DE LEADS
// ========================================
import { useState, useCallback } from 'react';
import { leadsService } from '@/services/leadsService';
import { LeadAutomationFlow, UseLeadAutomationReturn } from '@/types';
import { getErrorMessage } from '@/utils/errorHelpers';

export const useLeadAutomation = (): UseLeadAutomationReturn => {
  const [automations, setAutomations] = useState<LeadAutomationFlow[]>([]);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const createAutomation = useCallback(async (automation: Omit<LeadAutomationFlow, 'id' | 'created_at' | 'updated_at'>) => {
    setLoading(true);

    setError(null);

    try {
      const response = await leadsService.createAutomation(automation);

      if (response.success) {
        const newAutomation = (response as any).data;
        setAutomations(prev => [...prev, newAutomation]);

        return newAutomation;
      } else {
        setError(response.error || 'Erro ao criar automação');

        return null;
      } catch (err: unknown) {
      const errorMessage = err instanceof Error
        ? getErrorMessage(err)
        : (err as { response?: { data?: { message?: string } })?.response?.data?.message || 'Erro desconhecido';
      setError(errorMessage);

      return null;
    } finally {
      setLoading(false);

    } , []);

  const updateAutomation = useCallback(async (id: number, automation: Partial<LeadAutomationFlow>) => {
    setLoading(true);

    setError(null);

    try {
      const response = await leadsService.updateAutomation(id, automation);

      if (response.success) {
        const updatedAutomation = (response as any).data;
        setAutomations(prev => prev.map(a => a.id === id ? updatedAutomation : a));

        return updatedAutomation;
      } else {
        setError(response.error || 'Erro ao atualizar automação');

        return null;
      } catch (err: unknown) {
      const errorMessage = err instanceof Error
        ? getErrorMessage(err)
        : (err as { response?: { data?: { message?: string } })?.response?.data?.message || 'Erro desconhecido';
      setError(errorMessage);

      return null;
    } finally {
      setLoading(false);

    } , []);

  const deleteAutomation = useCallback(async (id: number) => {
    setLoading(true);

    setError(null);

    try {
      const response = await leadsService.deleteAutomation(id);

      if (response.success) {
        setAutomations(prev => prev.filter(a => a.id !== id));

        return true;
      } else {
        setError(response.error || 'Erro ao deletar automação');

        return false;
      } catch (err: unknown) {
      const errorMessage = err instanceof Error
        ? getErrorMessage(err)
        : (err as { response?: { data?: { message?: string } })?.response?.data?.message || 'Erro desconhecido';
      setError(errorMessage);

      return false;
    } finally {
      setLoading(false);

    } , []);

  const getAutomation = useCallback(async (id: number) => {
    setLoading(true);

    setError(null);

    try {
      const response = await leadsService.getAutomation(id);

      if (response.success) {
        return (response as any).data as any;
      } else {
        setError(response.error || 'Erro ao buscar automação');

        return null;
      } catch (err: unknown) {
      const errorMessage = err instanceof Error
        ? getErrorMessage(err)
        : (err as { response?: { data?: { message?: string } })?.response?.data?.message || 'Erro desconhecido';
      setError(errorMessage);

      return null;
    } finally {
      setLoading(false);

    } , []);

  const refreshAutomations = useCallback(async () => {
    setLoading(true);

    setError(null);

    try {
      const response = await leadsService.getAllAutomations();

      if (response.success) {
        setAutomations(response.data);

      } else {
        setError(response.error || 'Erro ao carregar automações');

      } catch (err: unknown) {
      const errorMessage = err instanceof Error
        ? getErrorMessage(err)
        : (err as { response?: { data?: { message?: string } })?.response?.data?.message || 'Erro desconhecido';
      setError(errorMessage);

    } finally {
      setLoading(false);

    } , []);

  return {
    automations,
    loading,
    error,
    createAutomation,
    updateAutomation,
    deleteAutomation,
    getAutomation,
    refreshAutomations};
};
