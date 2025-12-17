// ========================================
// HOOK DE DUPLICATAS E MERGE DE LEADS
// ========================================
import { useState, useCallback } from 'react';
import { leadsService } from '@/services/leadsService';
import { LeadDuplicate, LeadMerge } from '@/types';
import { getErrorMessage } from '@/utils/errorHelpers';

export const useLeadDuplicates = () => {
  const [duplicates, setDuplicates] = useState<LeadDuplicate[]>([]);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const findDuplicates = useCallback(async () => {
    setLoading(true);

    setError(null);

    try {
      const response = await leadsService.findDuplicates();

      if (response.success) {
        setDuplicates(response.data as LeadDuplicate[]);

      } else {
        setError(response.error || 'Erro ao buscar duplicatas');

      } catch (err: unknown) {
      const errorMessage = err instanceof Error
        ? getErrorMessage(err)
        : (err as { response?: { data?: { message?: string } })?.response?.data?.message || 'Erro desconhecido';
      setError(errorMessage);

    } finally {
      setLoading(false);

    } , []);

  const mergeLeads = useCallback(async (primaryLeadId: number, secondaryLeadId: number, mergeData: Record<string, any>) => {
    setLoading(true);

    setError(null);

    try {
      const response = await leadsService.mergeLeads(primaryLeadId, secondaryLeadId, mergeData);

      if (response.success) {
        // Remove as duplicatas da lista após merge bem-sucedido
        setDuplicates(prev => prev.filter(d => 
          d.lead_id !== primaryLeadId && d.duplicate_lead_id !== secondaryLeadId
        ));

        return (response as any).data as any;
      } else {
        setError(response.error || 'Erro ao fazer merge dos leads');

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

  const ignoreDuplicate = useCallback(async (duplicateId: number) => {
    setLoading(true);

    setError(null);

    try {
      const response = await leadsService.ignoreDuplicate(duplicateId);

      if (response.success) {
        setDuplicates(prev => prev.filter(d => d.lead_id !== duplicateId));

        return true;
      } else {
        setError(response.error || 'Erro ao ignorar duplicata');

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

  return {
    duplicates,
    loading,
    error,
    findDuplicates,
    mergeLeads,
    ignoreDuplicate};
};
