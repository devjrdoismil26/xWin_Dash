// =========================================
// SOCIAL ANALYTICS MANAGER COMPONENT
// =========================================

import React, { useState, useCallback, useMemo } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingStates';
import { PageTransition } from '@/components/ui/AdvancedAnimations';
import { useSocialBufferStore } from '../../hooks';
import { useSocialBufferUI } from '../../hooks/useSocialBufferUI';
import { 
  SocialBufferLoadingSkeleton, 
  SocialBufferErrorState, 
  SocialBufferEmptyState,
  SocialBufferSuccessState 
} from '../ui';

interface AnalyticsData {
  id: string;
  platform: string;
  metric: string;
  value: number;
  date: Date;
  postId?: string;
  campaignId?: string;
  metadata?: Record<string, any>;
}

interface AnalyticsReport {
  id: string;
  name: string;
  description: string;
  dateRange: { start: Date; end: Date };
  platforms: string[];
  metrics: string[];
  filters: Record<string, any>;
  generatedAt: Date;
  data: AnalyticsData[];
}

interface SocialAnalyticsManagerProps {
  className?: string;
  onReportGenerated?: (report: AnalyticsReport) => void;
  onReportUpdated?: (report: AnalyticsReport) => void;
  onReportDeleted?: (reportId: string) => void;
}

const SocialAnalyticsManager: React.FC<SocialAnalyticsManagerProps> = ({
  className = '',
  onReportGenerated,
  onReportUpdated,
  onReportDeleted
}) => {
  const { 
    analyticsData, 
    reports, 
    loading, 
    error, 
    generateReport, 
    updateReport, 
    deleteReport,
    exportReport 
  } = useSocialBufferStore();
  
  const { 
    debouncedSearch, 
    memoizedFilter, 
    handleSearchChange,
    handleFilterChange 
  } = useSocialBufferUI();

  const [selectedReports, setSelectedReports] = useState<string[]>([]);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [editingReport, setEditingReport] = useState<AnalyticsReport | null>(null);
  const [selectedPlatform, setSelectedPlatform] = useState<string>('');
  const [selectedMetric, setSelectedMetric] = useState<string>('');
  const [dateRange, setDateRange] = useState<{ start: Date; end: Date }>({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 dias atrás
    end: new Date()
  });

  // ===== HANDLERS =====

  const handleGenerateReport = useCallback(async (reportConfig: Partial<AnalyticsReport>) => {
    try {
      const newReport = await generateReport(reportConfig);
      onReportGenerated?.(newReport);
      setShowGenerateModal(false);
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
    }
  }, [generateReport, onReportGenerated]);

  const handleUpdateReport = useCallback(async (reportId: string, updates: Partial<AnalyticsReport>) => {
    try {
      const updatedReport = await updateReport(reportId, updates);
      onReportUpdated?.(updatedReport);
      setEditingReport(null);
    } catch (error) {
      console.error('Erro ao atualizar relatório:', error);
    }
  }, [updateReport, onReportUpdated]);

  const handleDeleteReport = useCallback(async (reportId: string) => {
    try {
      await deleteReport(reportId);
      onReportDeleted?.(reportId);
    } catch (error) {
      console.error('Erro ao deletar relatório:', error);
    }
  }, [deleteReport, onReportDeleted]);

  const handleExportReport = useCallback(async (report: AnalyticsReport, format: 'csv' | 'pdf' | 'excel') => {
    try {
      await exportReport(report.id, format);
    } catch (error) {
      console.error('Erro ao exportar relatório:', error);
    }
  }, [exportReport]);

  const handleBulkAction = useCallback(async (action: 'delete' | 'export') => {
    try {
      if (action === 'delete') {
        await Promise.all(selectedReports.map(id => deleteReport(id)));
      } else if (action === 'export') {
        await Promise.all(selectedReports.map(id => {
          const report = reports.find(r => r.id === id);
          if (report) return exportReport(id, 'csv');
        }));
      }
      setSelectedReports([]);
    } catch (error) {
      console.error(`Erro na ação em lote ${action}:`, error);
    }
  }, [selectedReports, deleteReport, exportReport, reports]);

  // ===== MEMOIZED VALUES =====

  const filteredReports = useMemo(() => {
    let filtered = memoizedFilter(reports, debouncedSearch, ['name', 'description']);
    
    if (selectedPlatform) {
      filtered = filtered.filter(report => report.platforms.includes(selectedPlatform));
    }
    
    if (selectedMetric) {
      filtered = filtered.filter(report => report.metrics.includes(selectedMetric));
    }
    
    return filtered;
  }, [reports, memoizedFilter, debouncedSearch, selectedPlatform, selectedMetric]);

  const analyticsStats = useMemo(() => {
    const totalDataPoints = analyticsData.length;
    const totalReports = reports.length;
    const platforms = [...new Set(analyticsData.map(d => d.platform))];
    const metrics = [...new Set(analyticsData.map(d => d.metric))];
    
    const recentData = analyticsData.filter(d => 
      d.date >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    );
    
    return {
      totalDataPoints,
      totalReports,
      platforms: platforms.length,
      metrics: metrics.length,
      recentDataPoints: recentData.length
    };
  }, [analyticsData, reports]);

  const topMetrics = useMemo(() => {
    const metricTotals = analyticsData.reduce((acc, data) => {
      acc[data.metric] = (acc[data.metric] || 0) + data.value;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(metricTotals)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([metric, value]) => ({ metric, value }));
  }, [analyticsData]);

  const platformStats = useMemo(() => {
    const platformTotals = analyticsData.reduce((acc, data) => {
      acc[data.platform] = (acc[data.platform] || 0) + data.value;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(platformTotals)
      .sort(([,a], [,b]) => b - a)
      .map(([platform, value]) => ({ platform, value }));
  }, [analyticsData]);

  const allPlatforms = useMemo(() => {
    return [...new Set(analyticsData.map(d => d.platform))].sort();
  }, [analyticsData]);

  const allMetrics = useMemo(() => {
    return [...new Set(analyticsData.map(d => d.metric))].sort();
  }, [analyticsData]);

  // ===== RENDER STATES =====

  if (loading) {
    return <SocialBufferLoadingSkeleton type="analytics" />;
  }

  if (error) {
    return (
      <SocialBufferErrorState 
        error={error}
        onRetry={() => window.location.reload()}
        title="Erro ao carregar analytics"
      />
    );
  }

  if (reports.length === 0 && analyticsData.length === 0) {
    return (
      <SocialBufferEmptyState
        title="Nenhum dado de analytics encontrado"
        description="Gere seu primeiro relatório para começar a analisar o desempenho"
        actionText="Gerar Relatório"
        onAction={() => setShowGenerateModal(true)}
      />
    );
  }

  return (
    <PageTransition>
      <div className={`social-analytics-manager ${className}`}>
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Gerenciador de Analytics
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Analise o desempenho das suas redes sociais
            </p>
          </div>
          <Button
            onClick={() => setShowGenerateModal(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Gerar Relatório
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <Card className="p-4">
            <div className="text-2xl font-bold text-blue-600">{analyticsStats.totalDataPoints}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Pontos de Dados</div>
          </Card>
          <Card className="p-4">
            <div className="text-2xl font-bold text-green-600">{analyticsStats.totalReports}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Relatórios</div>
          </Card>
          <Card className="p-4">
            <div className="text-2xl font-bold text-purple-600">{analyticsStats.platforms}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Plataformas</div>
          </Card>
          <Card className="p-4">
            <div className="text-2xl font-bold text-orange-600">{analyticsStats.metrics}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Métricas</div>
          </Card>
          <Card className="p-4">
            <div className="text-2xl font-bold text-indigo-600">{analyticsStats.recentDataPoints}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Últimos 7 dias</div>
          </Card>
        </div>

        {/* Top Metrics */}
        {topMetrics.length > 0 && (
          <Card className="p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Métricas Principais
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {topMetrics.map(({ metric, value }) => (
                <div key={metric} className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{value.toLocaleString()}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                    {metric.replace(/([A-Z])/g, ' $1').trim()}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Platform Stats */}
        {platformStats.length > 0 && (
          <Card className="p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Performance por Plataforma
            </h3>
            <div className="space-y-3">
              {platformStats.map(({ platform, value }) => (
                <div key={platform} className="flex items-center justify-between">
                  <span className="font-medium text-gray-900 dark:text-white capitalize">
                    {platform}
                  </span>
                  <div className="flex items-center gap-3">
                    <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ 
                          width: `${(value / Math.max(...platformStats.map(p => p.value))) * 100}%` 
                        }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400 w-16 text-right">
                      {value.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Search and Filters */}
        <Card className="p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Buscar relatórios..."
                onChange={handleSearchChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={selectedPlatform}
                onChange={(e) => setSelectedPlatform(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
              >
                <option value="">Todas as plataformas</option>
                {allPlatforms.map(platform => (
                  <option key={platform} value={platform}>{platform}</option>
                ))}
              </select>
              <select
                value={selectedMetric}
                onChange={(e) => setSelectedMetric(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
              >
                <option value="">Todas as métricas</option>
                {allMetrics.map(metric => (
                  <option key={metric} value={metric}>{metric}</option>
                ))}
              </select>
              <select
                onChange={handleFilterChange}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
              >
                <option value="">Todos os períodos</option>
                <option value="recent">Recentes</option>
                <option value="monthly">Mensais</option>
                <option value="weekly">Semanais</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Bulk Actions */}
        {selectedReports.length > 0 && (
          <Card className="p-4 mb-6 bg-blue-50 dark:bg-blue-900/20">
            <div className="flex items-center justify-between">
              <span className="text-blue-700 dark:text-blue-300">
                {selectedReports.length} relatório(s) selecionado(s)
              </span>
              <div className="flex gap-2">
                <Button
                  onClick={() => handleBulkAction('export')}
                  className="bg-green-600 hover:bg-green-700"
                  size="sm"
                >
                  Exportar CSV
                </Button>
                <Button
                  onClick={() => handleBulkAction('delete')}
                  className="bg-red-600 hover:bg-red-700"
                  size="sm"
                >
                  Deletar
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Reports List */}
        <div className="space-y-4">
          {filteredReports.map((report) => (
            <Card key={report.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <input
                      type="checkbox"
                      checked={selectedReports.includes(report.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedReports(prev => [...prev, report.id]);
                        } else {
                          setSelectedReports(prev => prev.filter(id => id !== report.id));
                        }
                      }}
                      className="rounded border-gray-300"
                    />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {report.name}
                    </h3>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-400 mb-3">
                    {report.description}
                  </p>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-2">
                    <span>Período: {report.dateRange.start.toLocaleDateString()} - {report.dateRange.end.toLocaleDateString()}</span>
                    <span>Plataformas: {report.platforms.join(', ')}</span>
                    <span>Métricas: {report.metrics.length}</span>
                    <span>Dados: {report.data.length} pontos</span>
                  </div>
                  
                  <div className="text-xs text-gray-500">
                    Gerado em: {report.generatedAt.toLocaleString()}
                  </div>
                </div>
                
                <div className="flex gap-2 ml-4">
                  <Button
                    onClick={() => handleExportReport(report, 'csv')}
                    className="bg-green-600 hover:bg-green-700"
                    size="sm"
                  >
                    CSV
                  </Button>
                  <Button
                    onClick={() => handleExportReport(report, 'pdf')}
                    className="bg-red-600 hover:bg-red-700"
                    size="sm"
                  >
                    PDF
                  </Button>
                  <Button
                    onClick={() => setEditingReport(report)}
                    className="bg-blue-600 hover:bg-blue-700"
                    size="sm"
                  >
                    Editar
                  </Button>
                  <Button
                    onClick={() => handleDeleteReport(report.id)}
                    className="bg-red-600 hover:bg-red-700"
                    size="sm"
                  >
                    Deletar
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </PageTransition>
  );
};

export default SocialAnalyticsManager;
