import React from 'react';
import { Brain, Image, Video, FileText, BarChart3 } from 'lucide-react';
import IntegrationTest, { TestCase } from '@/components/ui/IntegrationTest';
import useAIStore from '../hooks/useAIStore';

const AIIntegrationTest: React.FC = () => {
  const {
    testConnection,
    testTextGeneration,
    testImageGeneration,
    testVideoGeneration,
    testTextAnalysis,
    getTotalGenerations,
    getTotalTextGenerations,
    getTotalImageGenerations,
    getTotalVideoGenerations,
    getTotalChatMessages,
    getTotalAnalyses,
    loading,
    error
  } = useAIStore();

  const tests: TestCase[] = [
    {
      id: 'connection',
      name: 'Teste de Conexão',
      description: 'Verifica conectividade com AI Laboratory',
      icon: Brain,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      action: testConnection
    },
    {
      id: 'text-generation',
      name: 'Geração de Texto',
      description: 'Testa geração de texto com Gemini',
      icon: FileText,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      action: testTextGeneration
    },
    {
      id: 'image-generation',
      name: 'Geração de Imagem',
      description: 'Testa geração de imagens com IA',
      icon: Image,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      action: testImageGeneration
    },
    {
      id: 'video-generation',
      name: 'Geração de Vídeo',
      description: 'Testa geração de vídeos com Veo2',
      icon: Video,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      action: testVideoGeneration
    },
    {
      id: 'text-analysis',
      name: 'Análise de Texto',
      description: 'Testa análise de sentimento e resumo',
      icon: BarChart3,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-200',
      action: testTextAnalysis
    }
  ];

  const statsConfig = {
    stats: [
      {
        label: 'Total Gerações',
        value: getTotalGenerations(),
        color: 'bg-green-50 text-green-600'
      },
      {
        label: 'Chat Messages',
        value: getTotalChatMessages(),
        color: 'bg-blue-50 text-blue-600'
      },
      {
        label: 'Análises',
        value: getTotalAnalyses(),
        color: 'bg-purple-50 text-purple-600'
      }
    ]
  };

  return (
    <IntegrationTest
      moduleName="AI"
      moduleDescription="Verifique a conectividade e funcionalidade dos serviços de IA"
      tests={tests}
      statsConfig={statsConfig}
      loading={loading}
      error={error}
    />
  );
};

export default AIIntegrationTest;
