// ========================================
// HOOK DE ROI DE LEADS
// ========================================
import { useState, useCallback } from 'react';
import { leadsService } from '@/services/leadsService';
import { LeadROI, UseLeadROIReturn } from '@/types';
import { getErrorMessage } from '@/utils/errorHelpers';

export const useLeadROI = (leadId?: string): UseLeadROIReturn => {
  const [roi, setRoi] = useState<LeadROI[]>([]);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const getROI = useCallback(async (leadId: number) => {
    setLoading(true);

    setError(null);

    try {
      const response = await leadsService.getLeadROI(leadId);

      if (response.success) {
        const roiData = (response as any).data;
        setRoi(prev => {
          const existing = prev.find(r => r.lead_id === leadId);

          if (existing) {
            return prev.map(r => r.lead_id === leadId ? roiData : r);

          }
          return [...prev, roiData];
        });

        return roiData;
      } else {
        setError(response.error || 'Erro ao buscar ROI');

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

  const refreshROI = useCallback(async () => {
    setLoading(true);

    setError(null);

    try {
      const response = await leadsService.getAllROIs();

      if (response.success) {
        setRoi(response.data);

      } else {
        setError(response.error || 'Erro ao carregar ROIs');

      } catch (err: unknown) {
      const errorMessage = err instanceof Error
        ? getErrorMessage(err)
        : (err as { response?: { data?: { message?: string } })?.response?.data?.message || 'Erro desconhecido';
      setError(errorMessage);

    } finally {
      setLoading(false);

    } , []);

  return {
    roi,
    loading,
    error,
    getROI,
    refreshROI};
};
