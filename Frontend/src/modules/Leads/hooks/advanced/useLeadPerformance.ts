// ========================================
// HOOK DE PERFORMANCE DE LEADS
// ========================================
import { useState, useCallback } from 'react';
import { leadsService } from '@/services/leadsService';
import { LeadPerformance, UseLeadPerformanceReturn } from '@/types';
import { getErrorMessage } from '@/utils/errorHelpers';

export const useLeadPerformance = (leadId?: string): UseLeadPerformanceReturn => {
  const [performance, setPerformance] = useState<LeadPerformance[]>([]);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const getPerformance = useCallback(async (leadId: number) => {
    setLoading(true);

    setError(null);

    try {
      const response = await leadsService.getLeadPerformance(leadId);

      if (response.success) {
        const performanceData = (response as any).data;
        setPerformance(prev => {
          const existing = prev.find(p => p.lead_id === leadId);

          if (existing) {
            return prev.map(p => p.lead_id === leadId ? performanceData : p);

          }
          return [...prev, performanceData];
        });

        return performanceData;
      } else {
        setError(response.error || 'Erro ao buscar performance');

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

  const refreshPerformance = useCallback(async () => {
    setLoading(true);

    setError(null);

    try {
      const response = await leadsService.getAllPerformances();

      if (response.success) {
        setPerformance(response.data);

      } else {
        setError(response.error || 'Erro ao carregar performances');

      } catch (err: unknown) {
      const errorMessage = err instanceof Error
        ? getErrorMessage(err)
        : (err as { response?: { data?: { message?: string } })?.response?.data?.message || 'Erro desconhecido';
      setError(errorMessage);

    } finally {
      setLoading(false);

    } , []);

  return {
    performance,
    loading,
    error,
    getPerformance,
    refreshPerformance};
};
