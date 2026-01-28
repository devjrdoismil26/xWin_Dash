// ========================================
// HOOK DE ENGAGEMENT DE LEADS
// ========================================
import { useState, useCallback } from 'react';
import { leadsService } from '../../services/leadsService';
import { LeadEngagement, UseLeadEngagementReturn } from '../../types';

export const useLeadEngagement = (leadId?: string): UseLeadEngagementReturn => {
  const [engagement, setEngagement] = useState<LeadEngagement[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getEngagement = useCallback(async (leadId: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await leadsService.getLeadEngagement(leadId);
      if (response.success) {
        const engagementData = response.data;
        setEngagement(prev => {
          const existing = prev.find(e => e.lead_id === leadId);
          if (existing) {
            return prev.map(e => e.lead_id === leadId ? engagementData : e);
          }
          return [...prev, engagementData];
        });
        return engagementData;
      } else {
        setError(response.error || 'Erro ao buscar engagement');
        return null;
      }
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshEngagement = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await leadsService.getAllEngagements();
      if (response.success) {
        setEngagement(response.data);
      } else {
        setError(response.error || 'Erro ao carregar engagements');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    engagement,
    loading,
    error,
    getEngagement,
    refreshEngagement
  };
};