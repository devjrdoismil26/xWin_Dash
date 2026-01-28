// ========================================
// HOOK DE ATRIBUIÇÃO DE LEADS
// ========================================
import { useState, useCallback } from 'react';
import { leadsService } from '../../services/leadsService';
import { LeadAttribution, UseLeadAttributionReturn } from '../../types';

export const useLeadAttribution = (leadId?: string): UseLeadAttributionReturn => {
  const [attribution, setAttribution] = useState<LeadAttribution[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAttribution = useCallback(async (leadId: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await leadsService.getLeadAttribution(leadId);
      if (response.success) {
        const attributionData = response.data;
        setAttribution(prev => {
          const existing = prev.find(a => a.lead_id === leadId);
          if (existing) {
            return prev.map(a => a.lead_id === leadId ? attributionData : a);
          }
          return [...prev, attributionData];
        });
        return attributionData;
      } else {
        setError(response.error || 'Erro ao buscar atribuição');
        return null;
      }
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshAttribution = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await leadsService.getAllLeadAttributions();
      if (response.success) {
        setAttribution(response.data);
      } else {
        setError(response.error || 'Erro ao carregar atribuições');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    attribution,
    loading,
    error,
    getAttribution,
    refreshAttribution
  };
};