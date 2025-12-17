import { useState, useCallback, useEffect, useMemo } from 'react';
import { useMediaLibraryStore } from './useMediaLibraryStore';
import { useAdvancedNotifications } from '@/shared/hooks/useAdvancedNotifications';
import { MediaFile, MediaFolder, MediaStats, MediaAnalyticsData } from '../types';

/**
 * Hook especializado para análise e estatísticas de mídia
 * Gerencia métricas, relatórios e insights sobre o uso da biblioteca de mídia
 */
export const useMediaAnalytics = () => {
  const {
    media,
    folders,
    stats,
    loadStats
  } = useMediaLibraryStore();

  const { showError } = useAdvancedNotifications();

  const [analyticsData, setAnalyticsData] = useState<MediaAnalyticsData | null>(null);

  const [isLoadingAnalytics, setIsLoadingAnalytics] = useState(false);

  const [dateRange, setDateRange] = useState<{
    start: Date;
    end: Date;
  }>({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 dias atrás
    end: new Date()
  });

  // Carregar estatísticas iniciais
  useEffect(() => {
    loadStats();

  }, [loadStats]);

  /**
   * Calcula estatísticas básicas da mídia
   */
  const calculateBasicStats = useCallback((): MediaStats => {
    const totalFiles = media.length;
    const totalImages = media.filter(m => m.type === 'image').length;
    const totalVideos = media.filter(m => m.type === 'video').length;
    const totalDocuments = media.filter(m => m.type === 'document').length;
    const totalAudio = media.filter(m => m.type === 'audio').length;
    const totalFolders = folders.length;
    
    const storageUsed = media.reduce((sum: unknown, file: unknown) => sum + (file.size || 0), 0);

    return {
      totalFiles,
      totalImages,
      totalVideos,
      totalDocuments,
      totalAudio,
      totalFolders,
      storageUsed};

  }, [media, folders]);

  /**
   * Calcula estatísticas por período
   */
  const calculatePeriodStats = useCallback((startDate: Date, endDate: Date) => {
    const periodMedia = media.filter(file => {
      const fileDate = new Date(file.createdAt);

      return fileDate >= startDate && fileDate <= endDate;
    });

    const periodFolders = folders.filter(folder => {
      const folderDate = new Date(folder.createdAt);

      return folderDate >= startDate && folderDate <= endDate;
    });

    return {
      filesCreated: periodMedia.length,
      foldersCreated: periodFolders.length,
      storageAdded: periodMedia.reduce((sum: unknown, file: unknown) => sum + (file.size || 0), 0),
      typesBreakdown: periodMedia.reduce((acc: unknown, file: unknown) => {
        acc[file.type] = (acc[file.type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)};

  }, [media, folders]);

  /**
   * Calcula estatísticas de uso por tipo
   */
  const calculateUsageByType = useCallback(() => {
    const typeStats = media.reduce((acc: unknown, file: unknown) => {
      if (!acc[file.type]) {
        acc[file.type] = {
          count: 0,
          totalSize: 0,
          avgSize: 0,
          largestFile: null,
          smallestFile: null};

      }

      acc[file.type].count++;
      acc[file.type].totalSize += file.size || 0;

      if (!acc[file.type].largestFile || (file.size || 0) > (acc[file.type].largestFile.size || 0)) {
        acc[file.type].largestFile = file;
      }

      if (!acc[file.type].smallestFile || (file.size || 0) < (acc[file.type].smallestFile.size || 0)) {
        acc[file.type].smallestFile = file;
      }

      return acc;
    }, {} as Record<string, any>);

    // Calcular tamanho médio
    Object.keys(typeStats).forEach(type => {
      typeStats[type].avgSize = typeStats[type].totalSize / typeStats[type].count;
    });

    return typeStats;
  }, [media]);

  /**
   * Calcula estatísticas de pastas
   */
  const calculateFolderStats = useCallback(() => {
    const folderStats = folders.map(folder => {
      const folderMedia = media.filter(m => m.folderId === folder.id);

      const subfolders = folders.filter(f => f.parentId === folder.id);

      return {
        id: folder.id,
        name: folder.name,
        fileCount: folderMedia.length,
        totalSize: folderMedia.reduce((sum: unknown, file: unknown) => sum + (file.size || 0), 0),
        subfolderCount: subfolders.length,
        createdAt: folder.createdAt,
        updatedAt: folder.updatedAt};

    });

    return folderStats.sort((a: unknown, b: unknown) => b.fileCount - a.fileCount);

  }, [media, folders]);

  /**
   * Calcula tendências de crescimento
   */
  const calculateGrowthTrends = useCallback(() => {
    const now = new Date();

    const periods = [
      { name: 'Última semana', days: 7 },
      { name: 'Último mês', days: 30 },
      { name: 'Últimos 3 meses', days: 90 },
      { name: 'Último ano', days: 365 }
    ];

    return periods.map(period => {
      const startDate = new Date(now.getTime() - period.days * 24 * 60 * 60 * 1000);

      const periodStats = calculatePeriodStats(startDate, now);

      return {
        period: period.name,
        filesCreated: periodStats.filesCreated,
        foldersCreated: periodStats.foldersCreated,
        storageAdded: periodStats.storageAdded,
        avgFilesPerDay: periodStats.filesCreated / period.days};

    });

  }, [calculatePeriodStats]);

  /**
   * Gera relatório de uso
   */
  const generateUsageReport = useCallback(async () => {
    setIsLoadingAnalytics(true);

    try {
      const basicStats = calculateBasicStats();

      const periodStats = calculatePeriodStats(dateRange.start, dateRange.end);

      const usageByType = calculateUsageByType();

      const folderStats = calculateFolderStats();

      const growthTrends = calculateGrowthTrends();

      const report = {
        generatedAt: new Date(),
        dateRange,
        basicStats,
        periodStats,
        usageByType,
        folderStats,
        growthTrends,
        insights: generateInsights(basicStats, periodStats, usageByType, folderStats)};

      setAnalyticsData(report);

      return report;
    } catch (err) {
      showError('Erro ao gerar relatório de uso');

      console.error('Erro ao gerar relatório:', err);

      throw err;
    } finally {
      setIsLoadingAnalytics(false);

    } , [
    dateRange,
    calculateBasicStats,
    calculatePeriodStats,
    calculateUsageByType,
    calculateFolderStats,
    calculateGrowthTrends,
    showError
  ]);

  /**
   * Gera insights baseados nos dados
   */
  const generateInsights = useCallback((
    basicStats: MediaStats,
    periodStats: unknown,
    usageByType: unknown,
    folderStats: string[]
  ) => {
    const insights = [];

    // Insight sobre tipo mais usado
    const mostUsedType = Object.keys(usageByType).reduce((a: unknown, b: unknown) => 
      usageByType[a].count > usageByType[b].count ? a : b);

    insights.push({
      type: 'info',
      title: 'Tipo de mídia mais usado',
      message: `O tipo "${mostUsedType}" representa ${usageByType[mostUsedType].count} arquivos (${Math.round((usageByType[mostUsedType].count / basicStats.totalFiles) * 100)}% do total)`
    });

    // Insight sobre pasta mais populada
    if (folderStats.length > 0) {
      const mostPopulatedFolder = folderStats[0];
      insights.push({
        type: 'info',
        title: 'Pasta mais populada',
        message: `A pasta "${mostPopulatedFolder.name}" contém ${mostPopulatedFolder.fileCount} arquivos`
      });

    }

    // Insight sobre crescimento
    if (periodStats.filesCreated > 0) {
      insights.push({
        type: 'success',
        title: 'Crescimento recente',
        message: `${periodStats.filesCreated} arquivos foram adicionados no período selecionado`
      });

    }

    // Insight sobre uso de armazenamento
    const storageUsedGB = basicStats.storageUsed / (1024 * 1024 * 1024);

    if (storageUsedGB > 1) {
      insights.push({
        type: 'warning',
        title: 'Uso de armazenamento',
        message: `Total de ${storageUsedGB.toFixed(2)} GB utilizados`
      });

    }

    return insights;
  }, []);

  /**
   * Atualiza período de análise
   */
  const updateDateRange = useCallback((start: Date, end: Date) => {
    setDateRange({ start, end });

  }, []);

  /**
   * Exporta dados de análise
   */
  const exportAnalyticsData = useCallback((format: 'json' | 'csv' = 'json') => {
    if (!analyticsData) {
      showError('Nenhum dado de análise disponível');

      return;
    }

    try {
      if (format === 'json') {
        const dataStr = JSON.stringify(analyticsData, null, 2);

        const dataBlob = new Blob([dataStr], { type: 'application/json' });

        const url = URL.createObjectURL(dataBlob);

        const link = document.createElement('a');

        link.href = url;
        link.download = `media-analytics-${new Date().toISOString().split('T')[0]}.json`;
        link.click();

        URL.revokeObjectURL(url);

      } else if (format === 'csv') {
        // Implementar exportação CSV se necessário
        showError('Exportação CSV não implementada ainda');

      } catch (err) {
      showError('Erro ao exportar dados');

      console.error('Erro na exportação:', err);

    } , [analyticsData, showError]);

  // Memoizar estatísticas calculadas
  const memoizedStats = useMemo(() => calculateBasicStats(), [calculateBasicStats]);

  const memoizedUsageByType = useMemo(() => calculateUsageByType(), [calculateUsageByType]);

  const memoizedFolderStats = useMemo(() => calculateFolderStats(), [calculateFolderStats]);

  const memoizedGrowthTrends = useMemo(() => calculateGrowthTrends(), [calculateGrowthTrends]);

  return {
    // Estado
    stats: memoizedStats,
    analyticsData,
    isLoadingAnalytics,
    dateRange,

    // Estatísticas calculadas
    usageByType: memoizedUsageByType,
    folderStats: memoizedFolderStats,
    growthTrends: memoizedGrowthTrends,

    // Ações
    generateUsageReport,
    updateDateRange,
    exportAnalyticsData,

    // Utilitários
    calculateBasicStats,
    calculatePeriodStats,
    calculateUsageByType,
    calculateFolderStats,
    calculateGrowthTrends};
};
