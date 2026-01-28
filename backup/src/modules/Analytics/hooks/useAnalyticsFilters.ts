/**
 * Hook especializado para filtros do Analytics
 * Gerencia filtros, aplicação e limpeza
 */
import { useCallback, useState, useEffect } from 'react';
import { useAnalyticsStore } from './useAnalyticsStore';
import { AnalyticsFilters, AnalyticsPeriod, AnalyticsReportType } from '../types';
import { useAdvancedNotifications } from '@/hooks/useAdvancedNotifications';

export const useAnalyticsFilters = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [appliedFilters, setAppliedFilters] = useState<AnalyticsFilters | null>(null);
  
  const {
    filters,
    applyFilters,
    clearFilters
  } = useAnalyticsStore();

  // Aplicar filtros
  const applyFiltersWithLoading = useCallback(async (newFilters: AnalyticsFilters) => {
    setLoading(true);
    setError(null);
    
    try {
      await applyFilters(newFilters);
      setAppliedFilters(newFilters);
      notify('success', 'Filtros aplicados com sucesso!');
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao aplicar filtros';
      setError(errorMessage);
      notify('error', errorMessage);
    } finally {
      setLoading(false);
    }
  }, [applyFilters]);

  // Limpar filtros
  const clearFiltersWithLoading = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      clearFilters();
      setAppliedFilters(null);
      notify('success', 'Filtros limpos com sucesso!');
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao limpar filtros';
      setError(errorMessage);
      notify('error', errorMessage);
    } finally {
      setLoading(false);
    }
  }, [clearFilters]);

  // Atualizar período
  const updatePeriod = useCallback(async (period: AnalyticsPeriod) => {
    const newFilters: AnalyticsFilters = {
      ...filters,
      date_range: period
    };
    
    await applyFiltersWithLoading(newFilters);
  }, [filters, applyFiltersWithLoading]);

  // Atualizar tipo de relatório
  const updateReportType = useCallback(async (reportType: AnalyticsReportType) => {
    const newFilters: AnalyticsFilters = {
      ...filters,
      report_type: reportType
    };
    
    await applyFiltersWithLoading(newFilters);
  }, [filters, applyFiltersWithLoading]);

  // Atualizar métricas
  const updateMetrics = useCallback(async (metrics: string[]) => {
    const newFilters: AnalyticsFilters = {
      ...filters,
      metrics
    };
    
    await applyFiltersWithLoading(newFilters);
  }, [filters, applyFiltersWithLoading]);

  // Atualizar dispositivos
  const updateDevices = useCallback(async (devices: string[]) => {
    const newFilters: AnalyticsFilters = {
      ...filters,
      devices
    };
    
    await applyFiltersWithLoading(newFilters);
  }, [filters, applyFiltersWithLoading]);

  // Atualizar fontes de tráfego
  const updateTrafficSources = useCallback(async (sources: string[]) => {
    const newFilters: AnalyticsFilters = {
      ...filters,
      traffic_sources: sources
    };
    
    await applyFiltersWithLoading(newFilters);
  }, [filters, applyFiltersWithLoading]);

  // Atualizar filtros customizados
  const updateCustomFilters = useCallback(async (customFilters: Record<string, any>) => {
    const newFilters: AnalyticsFilters = {
      ...filters,
      custom_filters: customFilters
    };
    
    await applyFiltersWithLoading(newFilters);
  }, [filters, applyFiltersWithLoading]);

  // Definir período customizado
  const setCustomPeriod = useCallback(async (startDate: string, endDate: string) => {
    const newFilters: AnalyticsFilters = {
      ...filters,
      date_range: 'custom',
      start_date: startDate,
      end_date: endDate
    };
    
    await applyFiltersWithLoading(newFilters);
  }, [filters, applyFiltersWithLoading]);

  // Obter período atual
  const getCurrentPeriod = useCallback(() => {
    return filters.date_range;
  }, [filters]);

  // Obter tipo de relatório atual
  const getCurrentReportType = useCallback(() => {
    return filters.report_type;
  }, [filters]);

  // Verificar se filtros foram aplicados
  const hasAppliedFilters = useCallback(() => {
    return appliedFilters !== null;
  }, [appliedFilters]);

  // Verificar se filtros são diferentes dos padrão
  const hasCustomFilters = useCallback(() => {
    const defaultFilters: AnalyticsFilters = {
      date_range: '30days',
      report_type: 'overview'
    };
    
    return JSON.stringify(filters) !== JSON.stringify(defaultFilters);
  }, [filters]);

  // Obter resumo dos filtros
  const getFiltersSummary = useCallback(() => {
    const summary = [];
    
    // Período
    const periodLabels: Record<AnalyticsPeriod, string> = {
      'today': 'Hoje',
      'yesterday': 'Ontem',
      '7days': 'Últimos 7 dias',
      '30days': 'Últimos 30 dias',
      '90days': 'Últimos 90 dias',
      '1year': 'Último ano',
      'custom': 'Período customizado'
    };
    
    summary.push(`Período: ${periodLabels[filters.date_range] || filters.date_range}`);
    
    // Tipo de relatório
    const reportTypeLabels: Record<AnalyticsReportType, string> = {
      'overview': 'Visão Geral',
      'traffic': 'Tráfego',
      'conversions': 'Conversões',
      'audience': 'Audiência',
      'behavior': 'Comportamento',
      'acquisition': 'Aquisição',
      'real_time': 'Tempo Real'
    };
    
    summary.push(`Relatório: ${reportTypeLabels[filters.report_type] || filters.report_type}`);
    
    // Métricas
    if (filters.metrics && filters.metrics.length > 0) {
      summary.push(`Métricas: ${filters.metrics.length} selecionadas`);
    }
    
    // Dispositivos
    if (filters.devices && filters.devices.length > 0) {
      summary.push(`Dispositivos: ${filters.devices.join(', ')}`);
    }
    
    // Fontes de tráfego
    if (filters.traffic_sources && filters.traffic_sources.length > 0) {
      summary.push(`Fontes: ${filters.traffic_sources.join(', ')}`);
    }
    
    return summary;
  }, [filters]);

  // Obter filtros como query string
  const getFiltersAsQuery = useCallback(() => {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          params.append(key, value.join(','));
        } else {
          params.append(key, String(value));
        }
      }
    });
    
    return params.toString();
  }, [filters]);

  // Aplicar filtros de query string
  const applyFiltersFromQuery = useCallback(async (queryString: string) => {
    const params = new URLSearchParams(queryString);
    const newFilters: AnalyticsFilters = {
      date_range: '30days',
      report_type: 'overview'
    };
    
    // Parse dos parâmetros
    for (const [key, value] of params.entries()) {
      switch (key) {
        case 'date_range':
          newFilters.date_range = value as AnalyticsPeriod;
          break;
        case 'report_type':
          newFilters.report_type = value as AnalyticsReportType;
          break;
        case 'start_date':
          newFilters.start_date = value;
          break;
        case 'end_date':
          newFilters.end_date = value;
          break;
        case 'metrics':
          newFilters.metrics = value.split(',');
          break;
        case 'devices':
          newFilters.devices = value.split(',') as any[];
          break;
        case 'traffic_sources':
          newFilters.traffic_sources = value.split(',') as any[];
          break;
        default:
          if (!newFilters.custom_filters) {
            newFilters.custom_filters = {};
          }
          newFilters.custom_filters[key] = value;
      }
    }
    
    await applyFiltersWithLoading(newFilters);
  }, [applyFiltersWithLoading]);

  // Resetar para filtros padrão
  const resetToDefaults = useCallback(async () => {
    const defaultFilters: AnalyticsFilters = {
      date_range: '30days',
      report_type: 'overview'
    };
    
    await applyFiltersWithLoading(defaultFilters);
  }, [applyFiltersWithLoading]);

  return {
    // Estado
    filters,
    appliedFilters,
    loading,
    error,
    
    // Ações
    applyFilters: applyFiltersWithLoading,
    clearFilters: clearFiltersWithLoading,
    updatePeriod,
    updateReportType,
    updateMetrics,
    updateDevices,
    updateTrafficSources,
    updateCustomFilters,
    setCustomPeriod,
    applyFiltersFromQuery,
    resetToDefaults,
    
    // Utilitários
    getCurrentPeriod,
    getCurrentReportType,
    hasAppliedFilters,
    hasCustomFilters,
    getFiltersSummary,
    getFiltersAsQuery,
    
    // Controle de erro
    clearError: () => setError(null)
  };
};
