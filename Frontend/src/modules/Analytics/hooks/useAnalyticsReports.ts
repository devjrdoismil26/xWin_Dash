/**
 * Hook especializado para relatórios do Analytics
 * @module modules/Analytics/hooks/useAnalyticsReports
 * @description
 * Hook especializado para gerenciar relatórios do módulo Analytics, incluindo
 * criação, edição, exclusão, exportação, seleção e busca de relatórios.
 * @since 1.0.0
 */

import { useCallback, useState, useEffect } from 'react';
import { getErrorMessage } from '@/utils/errorHelpers';
import { useAnalyticsStore } from './useAnalyticsStore';
import { AnalyticsReport, AnalyticsFilters, AnalyticsExportFormat } from '../types';
import { useAdvancedNotifications } from '@/hooks/useAdvancedNotifications';

/**
 * Hook useAnalyticsReports - Hook de Relatórios de Analytics
 * @function
 * @description
 * Hook especializado para gerenciar relatórios do módulo Analytics, incluindo
 * criação, edição, exclusão, exportação, seleção e busca de relatórios.
 *
 * @returns {object} Objeto com estado, relatórios e ações
 *
 * @example
 * ```typescript
 * const {
 *   reports,
 *   loading,
 *   createReport,
 *   editReport,
 *   exportReportData
 * } = useAnalyticsReports();

 * ```
 */
export const useAnalyticsReports = () => {
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const [selectedReports, setSelectedReports] = useState<string[]>([]);

  const { showSuccess, showError } = useAdvancedNotifications();

  const {
    reports,
    fetchReports,
    generateReport,
    deleteReport,
    exportReport,
    updateReport
  } = useAnalyticsStore();

  // Carregar relatórios na inicialização
  useEffect(() => {
    if (reports.length === 0) {
      loadReports();

    } , []);

  // Carregar relatórios
  const loadReports = useCallback(async () => {
    setLoading(true);

    setError(null);

    try {
      await fetchReports();

      showSuccess('Relatórios carregados com sucesso!');

    } catch (err: unknown) {
      const errorMessage = getErrorMessage(err) || 'Erro ao carregar relatórios';
      setError(errorMessage);

      showError('Erro ao carregar relatórios', errorMessage);

    } finally {
      setLoading(false);

    } , [fetchReports, showSuccess, showError]);

  // Criar novo relatório
  const createReport = useCallback(async (reportData: Partial<AnalyticsReport>) => {
    setLoading(true);

    setError(null);

    try {
      const newReport = await generateReport({
        name: reportData.name || `Relatório ${new Date().toLocaleDateString('pt-BR')}`,
        type: reportData.type || 'overview',
        description: reportData.description || '',
        filters: reportData.filters || {
          date_range: '30days',
          report_type: 'overview'
        },
        data: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        created_by: 'current_user',
        is_public: reportData.is_public || false
      });

      showSuccess('Relatório criado com sucesso!');

      return newReport;
    } catch (err: unknown) {
      const errorMessage = getErrorMessage(err) || 'Erro ao criar relatório';
      setError(errorMessage);

      showError('Erro ao criar relatório', errorMessage);

      throw err;
    } finally {
      setLoading(false);

    } , [generateReport, showSuccess, showError]);

  // Editar relatório
  const editReport = useCallback(async (id: string, reportData: Partial<AnalyticsReport>) => {
    setLoading(true);

    setError(null);

    try {
      const updatedReport = await updateReport(id, {
        ...reportData,
        updated_at: new Date().toISOString()
  });

      showSuccess('Relatório atualizado com sucesso!');

      return updatedReport;
    } catch (err: unknown) {
      const errorMessage = getErrorMessage(err) || 'Erro ao atualizar relatório';
      setError(errorMessage);

      showError('Erro ao atualizar relatório', errorMessage);

      throw err;
    } finally {
      setLoading(false);

    } , [updateReport, showSuccess, showError]);

  // Excluir relatório
  const removeReport = useCallback(async (id: string) => {
    setLoading(true);

    setError(null);

    try {
      await deleteReport(id);

      setSelectedReports(prev => prev.filter(reportId => reportId !== id));

      showSuccess('Relatório excluído com sucesso!');

    } catch (err: unknown) {
      const errorMessage = getErrorMessage(err) || 'Erro ao excluir relatório';
      setError(errorMessage);

      showError('Erro ao excluir relatório', errorMessage);

      throw err;
    } finally {
      setLoading(false);

    } , [deleteReport, showSuccess, showError]);

  // Excluir múltiplos relatórios
  const removeMultipleReports = useCallback(async (ids: string[]) => {
    setLoading(true);

    setError(null);

    try {
      await Promise.all(ids.map(id => deleteReport(id)));

      setSelectedReports([]);

      showSuccess(`${ids.length} relatórios excluídos com sucesso!`);

    } catch (err: unknown) {
      const errorMessage = getErrorMessage(err);

      setError(errorMessage);

      showError('Erro ao excluir relatórios', errorMessage);

      throw err;
    } finally {
      setLoading(false);

    } , [deleteReport, showSuccess, showError]);

  // Exportar relatório
  const exportReportData = useCallback(async (id: string, format: AnalyticsExportFormat = 'csv') => {
    setLoading(true);

    setError(null);

    try {
      const blob = await exportReport(id, format);

      // Criar link de download
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');

      link.href = url;
      link.download = `relatorio-${id}.${format}`;
      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);

      URL.revokeObjectURL(url);

      showSuccess('Relatório exportado com sucesso!');

    } catch (err: unknown) {
      const errorMessage = getErrorMessage(err) || 'Erro ao exportar relatório';
      setError(errorMessage);

      showError('Erro ao exportar relatório', errorMessage);

      throw err;
    } finally {
      setLoading(false);

    } , [exportReport, showSuccess, showError]);

  // Exportar múltiplos relatórios
  const exportMultipleReports = useCallback(async (ids: string[], format: AnalyticsExportFormat = 'csv') => {
    setLoading(true);

    setError(null);

    try {
      const blobs = await Promise.all(ids.map(id => exportReport(id, format)));

      // Criar arquivo ZIP com múltiplos relatórios
      // Implementação simplificada - em produção usar uma biblioteca como JSZip
      blobs.forEach((blob: unknown, index: unknown) => {
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');

        link.href = url;
        link.download = `relatorios-${ids[index]}.${format}`;
        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);

        URL.revokeObjectURL(url);

      });

      showSuccess(`${ids.length} relatórios exportados com sucesso!`);

    } catch (err: unknown) {
      const errorMessage = getErrorMessage(err);

      setError(errorMessage);

      showError('Erro ao exportar relatórios', errorMessage);

      throw err;
    } finally {
      setLoading(false);

    } , [exportReport, showSuccess, showError]);

  // Selecionar relatório
  const selectReport = useCallback((id: string) => {
    setSelectedReports(prev => 
      prev.includes(id) 
        ? prev.filter(reportId => reportId !== id)
        : [...prev, id]);

  }, []);

  // Selecionar todos os relatórios
  const selectAllReports = useCallback(() => {
    setSelectedReports(reports.map(report => report.id));

  }, [reports]);

  // Desmarcar todos os relatórios
  const deselectAllReports = useCallback(() => {
    setSelectedReports([]);

  }, []);

  // Obter relatórios por tipo
  const getReportsByType = useCallback((type: string) => {
    return reports.filter(report => report.type === type);

  }, [reports]);

  // Obter relatórios públicos
  const getPublicReports = useCallback(() => {
    return reports.filter(report => report.is_public);

  }, [reports]);

  // Obter relatórios do usuário atual
  const getUserReports = useCallback(() => {
    return reports.filter(report => report.created_by === 'current_user');

  }, [reports]);

  // Obter relatórios recentes
  const getRecentReports = useCallback((limit: number = 5) => {
    return reports
      .sort((a: unknown, b: unknown) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
      .slice(0, limit);

  }, [reports]);

  // Buscar relatórios
  const searchReports = useCallback((query: string) => {
    const lowercaseQuery = query.toLowerCase();

    return reports.filter(report => 
      report.name.toLowerCase().includes(lowercaseQuery) ||
      report.description?.toLowerCase().includes(lowercaseQuery) ||
      report.type.toLowerCase().includes(lowercaseQuery));

  }, [reports]);

  // Obter estatísticas dos relatórios
  const getReportsStats = useCallback(() => {
    const total = reports.length;
    const publicReports = reports.filter(r => r.is_public).length;
    const userReports = reports.filter(r => r.created_by === 'current_user').length;
    
    const typeStats = reports.reduce((acc: unknown, report: unknown) => {
      acc[report.type] = (acc[report.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const recentReports = reports.filter(report => {
      const reportDate = new Date(report.updated_at);

      const weekAgo = new Date();

      weekAgo.setDate(weekAgo.getDate() - 7);

      return reportDate > weekAgo;
    }).length;
    
    return {
      total,
      public: publicReports,
      user: userReports,
      recent: recentReports,
      typeStats};

  }, [reports]);

  // Verificar se relatório está selecionado
  const isReportSelected = useCallback((id: string) => {
    return selectedReports.includes(id);

  }, [selectedReports]);

  // Obter relatórios selecionados
  const getSelectedReports = useCallback(() => {
    return reports.filter(report => selectedReports.includes(report.id));

  }, [reports, selectedReports]);

  // Duplicar relatório
  const duplicateReport = useCallback(async (id: string) => {
    const originalReport = reports.find(r => r.id === id);

    if (!originalReport) return;
    
    const duplicatedReport: Partial<AnalyticsReport> = {
      ...originalReport,
      name: `${originalReport.name} (Cópia)`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_public: false};

    delete (duplicatedReport as any).id;
    
    return await createReport(duplicatedReport);

  }, [reports, createReport]);

  return {
    // Estado
    reports,
    selectedReports,
    loading,
    error,
    
    // Ações
    loadReports,
    createReport,
    editReport,
    removeReport,
    removeMultipleReports,
    exportReportData,
    exportMultipleReports,
    selectReport,
    selectAllReports,
    deselectAllReports,
    duplicateReport,
    
    // Utilitários
    getReportsByType,
    getPublicReports,
    getUserReports,
    getRecentReports,
    searchReports,
    getReportsStats,
    isReportSelected,
    getSelectedReports,
    
    // Controle de erro
    clearError: () => setError(null)};
};
