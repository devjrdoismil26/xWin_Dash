// ========================================
// HOOK DE FONTES DE LEADS
// ========================================
import { useState, useCallback } from 'react';
import { leadsService } from '../../services/leadsService';
import { LeadSource } from '../../types';

export const useLeadSources = () => {
  const [sources, setSources] = useState<LeadSource[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getSources = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await leadsService.getLeadSources();
      if (response.success) {
        setSources(response.data);
      } else {
        setError(response.error || 'Erro ao buscar fontes');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const createSource = useCallback(async (source: Omit<LeadSource, 'id'>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await leadsService.createLeadSource(source);
      if (response.success) {
        const newSource = response.data;
        setSources(prev => [...prev, newSource]);
        return newSource;
      } else {
        setError(response.error || 'Erro ao criar fonte');
        return null;
      }
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateSource = useCallback(async (id: number, source: Partial<LeadSource>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await leadsService.updateLeadSource(id, source);
      if (response.success) {
        const updatedSource = response.data;
        setSources(prev => prev.map(s => s.id === id ? updatedSource : s));
        return updatedSource;
      } else {
        setError(response.error || 'Erro ao atualizar fonte');
        return null;
      }
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteSource = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await leadsService.deleteLeadSource(id);
      if (response.success) {
        setSources(prev => prev.filter(s => s.id !== id));
        return true;
      } else {
        setError(response.error || 'Erro ao deletar fonte');
        return false;
      }
    } catch (err: any) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    sources,
    loading,
    error,
    getSources,
    createSource,
    updateSource,
    deleteSource
  };
};