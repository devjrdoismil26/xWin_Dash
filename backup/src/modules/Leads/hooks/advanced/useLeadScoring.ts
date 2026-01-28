// ========================================
// HOOK DE SCORING DE LEADS
// ========================================
import { useState, useCallback } from 'react';
import { leadsService } from '../../services/leadsService';
import { LeadScoreRule, UseLeadScoringReturn } from '../../types';

export const useLeadScoring = (): UseLeadScoringReturn => {
  const [scores, setScores] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculateScore = useCallback(async (leadId: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await leadsService.calculateLeadScore(leadId);
      if (response.success) {
        const newScore = response.data;
        setScores(prev => {
          const existing = prev.find(s => s.lead_id === leadId);
          if (existing) {
            return prev.map(s => s.lead_id === leadId ? newScore : s);
          }
          return [...prev, newScore];
        });
        return newScore;
      } else {
        setError(response.error || 'Erro ao calcular score');
        return null;
      }
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateScore = useCallback(async (leadId: number, score: number, reason: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await leadsService.updateLeadScore(leadId, score, reason);
      if (response.success) {
        const updatedScore = response.data;
        setScores(prev => {
          const existing = prev.find(s => s.lead_id === leadId);
          if (existing) {
            return prev.map(s => s.lead_id === leadId ? updatedScore : s);
          }
          return [...prev, updatedScore];
        });
        return true;
      } else {
        setError(response.error || 'Erro ao atualizar score');
        return false;
      }
    } catch (err: any) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const getScore = useCallback(async (leadId: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await leadsService.getLeadScore(leadId);
      if (response.success) {
        const score = response.data;
        setScores(prev => {
          const existing = prev.find(s => s.lead_id === leadId);
          if (existing) {
            return prev.map(s => s.lead_id === leadId ? score : s);
          }
          return [...prev, score];
        });
        return score;
      } else {
        setError(response.error || 'Erro ao buscar score');
        return null;
      }
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshScores = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await leadsService.getAllLeadScores();
      if (response.success) {
        setScores(response.data);
      } else {
        setError(response.error || 'Erro ao carregar scores');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    scores,
    loading,
    error,
    calculateScore,
    updateScore,
    getScore,
    refreshScores
  };
};