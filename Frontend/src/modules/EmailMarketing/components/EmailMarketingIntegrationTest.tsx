import React from 'react';
import { Mail, Users, FileText, BarChart3, Target } from 'lucide-react';
import IntegrationTest, { TestCase } from '@/components/ui/IntegrationTest';
import { useEmailCampaigns } from '../hooks/useEmailCampaigns';

const EmailMarketingIntegrationTest: React.FC = () => {
  const {
    testConnection,
    testCampaignCreation,
    testSegmentationEngine,
    testTemplateProcessing,
    testAnalyticsGeneration,
    campaigns,
    segments,
    templates,
    loading,
    error
  } = useEmailCampaigns();

  const tests: TestCase[] = [
    {
      id: 'connection',
      name: 'Teste de Conexão',
      description: 'Verifica conectividade com EmailMarketing',
      icon: Mail,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      action: testConnection
    },
    {
      id: 'campaign-creation',
      name: 'Criação de Campanhas',
      description: 'Testa criação de campanhas de email',
      icon: Target,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      action: testCampaignCreation
    },
    {
      id: 'segmentation-engine',
      name: 'Engine de Segmentação',
      description: 'Testa segmentação de audiência',
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      action: testSegmentationEngine
    },
    {
      id: 'template-processing',
      name: 'Processamento de Templates',
      description: 'Testa processamento de templates',
      icon: FileText,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      action: testTemplateProcessing
    },
    {
      id: 'analytics-generation',
      name: 'Geração de Analytics',
      description: 'Testa criação de relatórios',
      icon: BarChart3,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-200',
      action: testAnalyticsGeneration
    }
  ];

  const statsConfig = {
    stats: [
      {
        label: 'Campanhas',
        value: campaigns.length,
        color: 'bg-green-50 text-green-600'
      },
      {
        label: 'Segmentos',
        value: segments.length,
        color: 'bg-blue-50 text-blue-600'
      },
      {
        label: 'Templates',
        value: templates.length,
        color: 'bg-purple-50 text-purple-600'
      }
    ]
  };

  return (
    <IntegrationTest
      moduleName="EmailMarketing"
      moduleDescription="Verifique a conectividade e funcionalidade do sistema de email marketing"
      tests={tests}
      statsConfig={statsConfig}
      loading={loading}
      error={error}
    />
  );
};

export default EmailMarketingIntegrationTest;
