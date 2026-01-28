// ========================================
// HOOK DE HEALTH SCORE DE LEADS
// ========================================
import { useState, useCallback } from 'react';
import { leadsService } from '../../services/leadsService';
import { LeadHealthScore, UseLeadHealthReturn } from '../../types';

export const useLeadHealth = (leadId?: string): UseLeadHealthReturn => {
  const [healthScores, setHealthScores] = useState<LeadHealthScore[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getHealthScore = useCallback(async (leadId: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await leadsService.getLeadHealthScore(leadId);
      if (response.success) {
        const healthScore = response.data;
        setHealthScores(prev => {
          const existing = prev.find(h => h.lead_id === leadId);
          if (existing) {
            return prev.map(h => h.lead_id === leadId ? healthScore : h);
          }
          return [...prev, healthScore];
        });
        return healthScore;
      } else {
        setError(response.error || 'Erro ao buscar health score');
        return null;
      }
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshHealthScores = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await leadsService.getAllHealthScores();
      if (response.success) {
        setHealthScores(response.data);
      } else {
        setError(response.error || 'Erro ao carregar health scores');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    healthScores,
    loading,
    error,
    getHealthScore,
    refreshHealthScores
  };
};