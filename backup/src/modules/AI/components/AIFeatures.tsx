/**
 * Componente de funcionalidades do módulo AI
 * Exibe grid de funcionalidades disponíveis
 */
import React from 'react';
import { MessageSquare, Image, Video, Code, BarChart3, Settings, Brain, Zap } from 'lucide-react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { ResponsiveGrid } from '@/components/ui/ResponsiveSystem';
import { useAI } from '../hooks';
import { AIComponentProps } from '../types';

interface AIFeaturesProps extends AIComponentProps {
  features?: Array<{
    id: string;
    title: string;
    description: string;
    icon: React.ReactNode;
    href: string;
    color: string;
    count?: number;
    status?: 'available' | 'unavailable' | 'beta';
  }>;
}

const AIFeatures: React.FC<AIFeaturesProps> = ({
  features,
  onAction,
  className = ''
}) => {
  const { generation, providers } = useAI();
  const stats = generation.getStats();
  const availableProviders = providers.getAvailableProviders();

  const defaultFeatures = [
    {
      id: 'text-generation',
      title: 'Geração de Texto',
      description: 'Crie textos inteligentes com os melhores modelos de IA',
      icon: <MessageSquare className="w-8 h-8 text-blue-600" />,
      href: '/ai/text-generation',
      color: 'bg-blue-50 border-blue-200 hover:bg-blue-100',
      count: stats.textGenerations,
      status: 'available' as const
    },
    {
      id: 'image-generation',
      title: 'Geração de Imagem',
      description: 'Crie imagens impressionantes com IA',
      icon: <Image className="w-8 h-8 text-green-600" />,
      href: '/ai/image-generation',
      color: 'bg-green-50 border-green-200 hover:bg-green-100',
      count: stats.imageGenerations,
      status: 'available' as const
    },
    {
      id: 'video-generation',
      title: 'Geração de Vídeo',
      description: 'Crie vídeos com IA (Beta)',
      icon: <Video className="w-8 h-8 text-purple-600" />,
      href: '/ai/video-generation',
      color: 'bg-purple-50 border-purple-200 hover:bg-purple-100',
      count: stats.videoGenerations,
      status: 'beta' as const
    },
    {
      id: 'code-generation',
      title: 'Geração de Código',
      description: 'Gere código em várias linguagens',
      icon: <Code className="w-8 h-8 text-orange-600" />,
      href: '/ai/code-generation',
      color: 'bg-orange-50 border-orange-200 hover:bg-orange-100',
      count: 0,
      status: 'available' as const
    },
    {
      id: 'analytics',
      title: 'Analytics',
      description: 'Analise o desempenho das suas gerações',
      icon: <BarChart3 className="w-8 h-8 text-indigo-600" />,
      href: '/ai/analytics',
      color: 'bg-indigo-50 border-indigo-200 hover:bg-indigo-100',
      count: null,
      status: 'available' as const
    },
    {
      id: 'settings',
      title: 'Configurações',
      description: 'Configure provedores e preferências',
      icon: <Settings className="w-8 h-8 text-gray-600" />,
      href: '/ai/settings',
      color: 'bg-gray-50 border-gray-200 hover:bg-gray-100',
      count: availableProviders.length,
      status: 'available' as const
    },
    {
      id: 'chat',
      title: 'Chat Inteligente',
      description: 'Converse com IA de forma natural',
      icon: <Brain className="w-8 h-8 text-pink-600" />,
      href: '/ai/chat',
      color: 'bg-pink-50 border-pink-200 hover:bg-pink-100',
      count: 0,
      status: 'beta' as const
    },
    {
      id: 'automation',
      title: 'Automação',
      description: 'Automatize tarefas com IA',
      icon: <Zap className="w-8 h-8 text-yellow-600" />,
      href: '/ai/automation',
      color: 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100',
      count: 0,
      status: 'beta' as const
    }
  ];

  const featuresToShow = features || defaultFeatures;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return <Badge variant="success">Disponível</Badge>;
      case 'unavailable':
        return <Badge variant="destructive">Indisponível</Badge>;
      case 'beta':
        return <Badge variant="secondary">Beta</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className={`ai-features ${className}`}>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Funcionalidades Disponíveis
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Explore todas as capacidades da IA disponíveis na plataforma
        </p>
      </div>

      <ResponsiveGrid
        columns={{ xs: 1, sm: 2, lg: 3, xl: 4 }}
        gap={{ xs: '1rem', md: '1.5rem' }}
      >
        {featuresToShow.map((feature) => (
          <Card 
            key={feature.id}
            className={`h-full transition-all duration-200 hover:shadow-lg hover:scale-105 cursor-pointer ${feature.color}`}
            onClick={() => onAction?.('navigate', { href: feature.href })}
          >
            <Card.Content className="p-6 text-center h-full flex flex-col">
              <div className="mb-4 flex justify-center">
                {feature.icon}
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              
              <p className="text-sm text-gray-600 mb-4 flex-grow">
                {feature.description}
              </p>
              
              <div className="flex items-center justify-center gap-2">
                {feature.count !== null && (
                  <Badge variant="outline">
                    {feature.count} {feature.count === 1 ? 'item' : 'itens'}
                  </Badge>
                )}
                {getStatusBadge(feature.status)}
              </div>
            </Card.Content>
          </Card>
        ))}
      </ResponsiveGrid>

      {/* Resumo de funcionalidades */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="text-center p-4">
          <div className="text-2xl font-bold text-green-600">
            {featuresToShow.filter(f => f.status === 'available').length}
          </div>
          <div className="text-sm text-gray-600">Funcionalidades Disponíveis</div>
        </Card>
        
        <Card className="text-center p-4">
          <div className="text-2xl font-bold text-blue-600">
            {featuresToShow.filter(f => f.status === 'beta').length}
          </div>
          <div className="text-sm text-gray-600">Em Beta</div>
        </Card>
        
        <Card className="text-center p-4">
          <div className="text-2xl font-bold text-gray-600">
            {featuresToShow.length}
          </div>
          <div className="text-sm text-gray-600">Total</div>
        </Card>
      </div>
    </div>
  );
};

export default AIFeatures;
