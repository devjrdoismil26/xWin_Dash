import React from 'react';
import { MessageSquare, Zap, BarChart3, Settings, Users } from 'lucide-react';
import IntegrationTest, { TestCase } from '@/shared/components/ui/IntegrationTest';
import { useAura } from '../hooks/useAura';

const AuraIntegrationTest: React.FC = () => {
  const {
    testConnection,
    testFlowExecution,
    testChatFunctionality,
    testAnalyticsGeneration,
    testIntegrationConnectivity,
    connections,
    flows,
    chats,
    loading,
    error
  } = useAura();

  const tests: TestCase[] = [
    {
      id: 'connection',
      name: 'Teste de Conexão',
      description: 'Verifica conectividade com Aura',
      icon: MessageSquare,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      action: testConnection
    },
    {
      id: 'flow-execution',
      name: 'Execução de Fluxos',
      description: 'Testa execução de flows de automação',
      icon: Zap,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      action: testFlowExecution
    },
    {
      id: 'chat-functionality',
      name: 'Funcionalidade de Chat',
      description: 'Testa chat e mensagens WhatsApp',
      icon: MessageSquare,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      action: testChatFunctionality
    },
    {
      id: 'analytics-generation',
      name: 'Geração de Analytics',
      description: 'Testa criação de relatórios',
      icon: BarChart3,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      action: testAnalyticsGeneration
    },
    {
      id: 'integration-connectivity',
      name: 'Conectividade de Integrações',
      description: 'Testa integrações externas',
      icon: Settings,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-200',
      action: testIntegrationConnectivity
    }
  ];

  const statsConfig = {
    stats: [
      {
        label: 'Conexões',
        value: connections.length,
        color: 'bg-green-50 text-green-600'
      },
      {
        label: 'Fluxos Ativos',
        value: (flows || []).filter(f => f.is_active).length,
        color: 'bg-blue-50 text-blue-600'
      },
      {
        label: 'Chats',
        value: chats.length,
        color: 'bg-purple-50 text-purple-600'
      }
    ]};

  return (
            <IntegrationTest
      moduleName="Aura"
      moduleDescription="Verifique a conectividade e funcionalidade do sistema de automação Aura"
      tests={ tests }
      statsConfig={ statsConfig }
      loading={ loading }
      error={ error }
    / />);};

export default AuraIntegrationTest;
