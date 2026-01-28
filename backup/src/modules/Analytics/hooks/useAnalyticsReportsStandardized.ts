/**
 * Hook especializado para relatórios do módulo Analytics
 * Máximo: 200 linhas
 */
import { useCallback, useState, useEffect } from 'react';
import { useAdvancedNotifications } from '@/hooks/useAdvancedNotifications';
import { AnalyticsService } from '../services/analyticsService';
import { AnalyticsReport, AnalyticsFilters } from '../types';

interface UseAnalyticsReportsReturn {
  // Estado
  reports: AnalyticsReport[];
  currentReport: AnalyticsReport | null;
  loading: boolean;
  error: string | null;
  
  // Ações
  loadReports: (filters?: AnalyticsFilters) => Promise<void>;
  createReport: (data: Partial<AnalyticsReport>) => Promise<AnalyticsReport>;
  updateReport: (id: string, data: Partial<AnalyticsReport>) => Promise<AnalyticsReport>;
  deleteReport: (id: string) => Promise<void>;
  
  // Utilitários
  clearError: () => void;
  refresh: () => Promise<void>;
}

export const useAnalyticsReports = (): UseAnalyticsReportsReturn => {
  const [reports, setReports] = useState<AnalyticsReport[]>([]);
  const [currentReport, setCurrentReport] = useState<AnalyticsReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showSuccess, showError } = useAdvancedNotifications();
  
  const loadReports = useCallback(async (filters?: AnalyticsFilters) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await AnalyticsService.getReports(filters);
      setReports(result.data || []);
      showSuccess('Relatórios carregados com sucesso!');
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao carregar relatórios';
      setError(errorMessage);
      showError('Erro ao carregar relatórios', errorMessage);
    } finally {
      setLoading(false);
    }
  }, [showSuccess, showError]);
  
  const createReport = useCallback(async (data: Partial<AnalyticsReport>) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await AnalyticsService.createReport(data);
      setReports(prev => [result.data, ...prev]);
      showSuccess('Relatório criado com sucesso!');
      return result.data;
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao criar relatório';
      setError(errorMessage);
      showError('Erro ao criar relatório', errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [showSuccess, showError]);
  
  const updateReport = useCallback(async (id: string, data: Partial<AnalyticsReport>) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await AnalyticsService.updateReport(id, data);
      setReports(prev => prev.map(report => report.id === id ? result.data : report));
      showSuccess('Relatório atualizado com sucesso!');
      return result.data;
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao atualizar relatório';
      setError(errorMessage);
      showError('Erro ao atualizar relatório', errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [showSuccess, showError]);
  
  const deleteReport = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      await AnalyticsService.deleteReport(id);
      setReports(prev => prev.filter(report => report.id !== id));
      showSuccess('Relatório excluído com sucesso!');
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao excluir relatório';
      setError(errorMessage);
      showError('Erro ao excluir relatório', errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [showSuccess, showError]);
  
  return {
    reports,
    currentReport,
    loading,
    error,
    loadReports,
    createReport,
    updateReport,
    deleteReport,
    clearError: () => setError(null),
    refresh: loadReports
  };
};