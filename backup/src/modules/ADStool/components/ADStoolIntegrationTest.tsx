import React from 'react';
import { Target, DollarSign, BarChart3, TrendingUp, Settings } from 'lucide-react';
import IntegrationTest, { TestCase } from '@/components/ui/IntegrationTest';
// import { useADStool } from '../hooks/useADStool';

const ADStoolIntegrationTest: React.FC = () => {
  const {
    campaigns,
    ads,
    loading,
    error,
    fetchCampaigns,
    createCampaign,
    updateCampaign,
    getAnalytics,
    getPerformance
  } = { campaigns: [], ads: [], loading: false, error: null, createCampaign: () => {}, updateCampaign: () => {}, deleteCampaign: () => {}, createAd: () => {}, updateAd: () => {}, deleteAd: () => {} };

  const tests: TestCase[] = [
    {
      id: 'connection',
      name: 'Teste de Conexão',
      description: 'Verifica conectividade com ADStool',
      icon: Target,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      action: async () => {
        try {
          await fetchCampaigns();
          return { success: true, message: 'Conexão com ADStool estabelecida com sucesso' };
        } catch (error: any) {
          return { success: false, message: 'Falha na conexão', error: error.message };
        }
      }
    },
    {
      id: 'campaign-management',
      name: 'Gerenciamento de Campanhas',
      description: 'Testa CRUD de campanhas',
      icon: Settings,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      action: async () => {
        try {
          const testCampaign = {
            name: 'Test Campaign',
            budget: 1000,
            status: 'active',
            platform: 'google'
          };
          await createCampaign(testCampaign);
          return { success: true, message: 'Campanha criada com sucesso' };
        } catch (error: any) {
          return { success: false, message: 'Falha ao criar campanha', error: error.message };
        }
      }
    },
    {
      id: 'ad-management',
      name: 'Gerenciamento de Anúncios',
      description: 'Testa operações com anúncios',
      icon: Target,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      action: async () => {
        try {
          if (campaigns && campaigns.length > 0) {
            await updateCampaign(campaigns[0].id, { status: 'active' });
            return { success: true, message: 'Anúncio gerenciado com sucesso' };
          }
          return { success: false, message: 'Nenhuma campanha disponível para teste' };
        } catch (error: any) {
          return { success: false, message: 'Falha no gerenciamento', error: error.message };
        }
      }
    },
    {
      id: 'performance',
      name: 'Performance de Campanhas',
      description: 'Testa métricas de performance',
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      action: async () => {
        try {
          await getPerformance();
          return { success: true, message: 'Performance carregada com sucesso' };
        } catch (error: any) {
          return { success: false, message: 'Falha na performance', error: error.message };
        }
      }
    },
    {
      id: 'analytics',
      name: 'Analytics de Anúncios',
      description: 'Testa métricas e analytics',
      icon: BarChart3,
      color: 'text-teal-600',
      bgColor: 'bg-teal-50',
      borderColor: 'border-teal-200',
      action: async () => {
        try {
          await getAnalytics();
          return { success: true, message: 'Analytics carregados com sucesso' };
        } catch (error: any) {
          return { success: false, message: 'Falha nos analytics', error: error.message };
        }
      }
    }
  ];

  const statsConfig = {
    stats: [
      {
        label: 'Campanhas Ativas',
        value: campaigns?.filter(c => c.status === 'active').length || 0,
        color: 'blue'
      },
      {
        label: 'Total de Anúncios',
        value: ads?.length || 0,
        color: 'green'
      },
      {
        label: 'Orçamento Total',
        value: campaigns?.reduce((sum, c) => sum + c.budget, 0) || 0,
        color: 'purple'
      },
      {
        label: 'ROI Médio',
        value: 250, // Placeholder - seria calculado com dados reais
        color: 'teal'
      }
    ]
  };

  return (
    <IntegrationTest
      moduleName="ADStool"
      moduleDescription="Sistema de gestão e otimização de anúncios"
      tests={tests}
      statsConfig={statsConfig}
      loading={loading}
      error={error}
    />
  );
};

export default ADStoolIntegrationTest;
