/**
 * Hook orquestrador principal para o módulo EmailMarketing
 * Coordena todos os hooks especializados
 */

import { useCallback } from 'react';
import { useEmailMarketingCore } from '../EmailMarketingCore/hooks/useEmailMarketingCore';
import { useEmailCampaigns } from '../EmailCampaigns/hooks/useEmailCampaigns';
import { useEmailTemplates } from '../EmailTemplates/hooks/useEmailTemplates';
import { useEmailSegments } from '../EmailSegments/hooks/useEmailSegments';

export interface UseEmailMarketingReturn {
  // Hooks especializados
  core: ReturnType<typeof useEmailMarketingCore>;
  campaigns: ReturnType<typeof useEmailCampaigns>;
  templates: ReturnType<typeof useEmailTemplates>;
  segments: ReturnType<typeof useEmailSegments>;
  
  // Ações orquestradas
  refreshAllData: () => Promise<void>;
  getDashboardData: () => any;
  getSystemHealth: () => any;
  exportAllData: (format?: 'json' | 'csv' | 'xlsx') => Promise<boolean>;
  
  // Estado consolidado
  loading: boolean;
  error: string | null;
  hasData: boolean;
}

export const useEmailMarketing = (): UseEmailMarketingReturn => {
  // Hooks especializados
  const core = useEmailMarketingCore();
  const campaigns = useEmailCampaigns();
  const templates = useEmailTemplates();
  const segments = useEmailSegments();

  // Estado consolidado
  const loading = core.loading || campaigns.loading || templates.loading || segments.loading;
  const error = core.error || campaigns.error || templates.error || segments.error;
  const hasData = !!(core.metrics || campaigns.campaigns.length > 0 || templates.templates.length > 0 || segments.segments.length > 0);

  // Ação para atualizar todos os dados
  const refreshAllData = useCallback(async () => {
    await Promise.all([
      core.refreshData(),
      campaigns.fetchCampaigns(),
      templates.fetchTemplates(),
      segments.fetchSegments()
    ]);
  }, [core.refreshData, campaigns.fetchCampaigns, templates.fetchTemplates, segments.fetchSegments]);

  // Função para obter dados do dashboard
  const getDashboardData = useCallback(() => {
    return {
      metrics: core.metrics,
      stats: core.stats,
      dashboard: core.dashboard,
      campaigns: campaigns.campaigns,
      templates: templates.templates,
      segments: segments.segments,
      summary: {
        totalCampaigns: campaigns.campaigns.length,
        totalTemplates: templates.templates.length,
        totalSegments: segments.segments.length,
        activeCampaigns: campaigns.campaigns.filter(c => c.status === 'active').length,
        activeTemplates: templates.templates.filter(t => t.is_active).length,
        activeSegments: segments.segments.filter(s => s.is_active).length
      }
    };
  }, [core, campaigns, templates, segments]);

  // Função para verificar saúde do sistema
  const getSystemHealth = useCallback(() => {
    return {
      core: !core.error && core.metrics !== null,
      campaigns: !campaigns.error,
      templates: !templates.error,
      segments: !segments.error,
      overall: !error && hasData
    };
  }, [core, campaigns, templates, segments, error, hasData]);

  // Função para exportar todos os dados
  const exportAllData = useCallback(async (format: 'json' | 'csv' | 'xlsx' = 'json'): Promise<boolean> => {
    try {
      const dashboardData = getDashboardData();
      
      // Criar blob com os dados
      let blob: Blob;
      let filename: string;
      
      if (format === 'json') {
        const jsonData = JSON.stringify(dashboardData, null, 2);
        blob = new Blob([jsonData], { type: 'application/json' });
        filename = `email-marketing-export-${new Date().toISOString().split('T')[0]}.json`;
      } else if (format === 'csv') {
        // Converter para CSV (implementação básica)
        const csvData = convertToCSV(dashboardData);
        blob = new Blob([csvData], { type: 'text/csv' });
        filename = `email-marketing-export-${new Date().toISOString().split('T')[0]}.csv`;
      } else {
        // Para xlsx, seria necessário uma biblioteca como xlsx
        const jsonData = JSON.stringify(dashboardData, null, 2);
        blob = new Blob([jsonData], { type: 'application/json' });
        filename = `email-marketing-export-${new Date().toISOString().split('T')[0]}.json`;
      }
      
      // Criar download
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      return true;
    } catch (error) {
      console.error('Error exporting data:', error);
      return false;
    }
  }, [getDashboardData]);

  // Função auxiliar para converter para CSV
  const convertToCSV = (data: any): string => {
    const headers = ['Type', 'Name', 'Status', 'Created At', 'Updated At'];
    const rows = [headers.join(',')];
    
    // Adicionar campanhas
    campaigns.campaigns.forEach(campaign => {
      rows.push([
        'Campaign',
        campaign.name,
        campaign.status,
        campaign.created_at,
        campaign.updated_at
      ].join(','));
    });
    
    // Adicionar templates
    templates.templates.forEach(template => {
      rows.push([
        'Template',
        template.name,
        template.is_active ? 'Active' : 'Inactive',
        template.created_at,
        template.updated_at
      ].join(','));
    });
    
    // Adicionar segmentos
    segments.segments.forEach(segment => {
      rows.push([
        'Segment',
        segment.name,
        segment.is_active ? 'Active' : 'Inactive',
        segment.created_at,
        segment.updated_at
      ].join(','));
    });
    
    return rows.join('\n');
  };

  return {
    // Hooks especializados
    core,
    campaigns,
    templates,
    segments,
    
    // Ações orquestradas
    refreshAllData,
    getDashboardData,
    getSystemHealth,
    exportAllData,
    
    // Estado consolidado
    loading,
    error,
    hasData
  };
};
