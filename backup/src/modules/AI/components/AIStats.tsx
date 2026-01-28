/**
 * Componente de estatísticas do módulo AI
 * Exibe métricas principais em cards responsivos
 */
import React from 'react';
import { MessageSquare, Image, Video, DollarSign, Zap, TrendingUp } from 'lucide-react';
import Card from '@/components/ui/Card';
import { AnimatedCounter } from '@/components/ui/AdvancedAnimations';
import { ResponsiveGrid } from '@/components/ui/ResponsiveSystem';
import { useAI } from '../hooks';
import { formatCurrency, formatNumber, formatPercentage } from '../utils';

interface AIStatsProps {
  variant?: 'basic' | 'advanced' | 'revolutionary';
  className?: string;
}

const AIStats: React.FC<AIStatsProps> = ({
  variant = 'basic',
  className = ''
}) => {
  const { generation, analytics } = useAI();
  const stats = generation.getStats();
  const realTimeMetrics = analytics.calculateRealTimeMetrics();

  const getVariantStyles = (baseColor: string) => {
    switch (variant) {
      case 'advanced':
        return `${baseColor}/20 border-${baseColor}/30`;
      case 'revolutionary':
        return `${baseColor}/30 border-${baseColor}/40`;
      default:
        return `${baseColor}/10 border-${baseColor}/20`;
    }
  };

  const statsCards = [
    {
      title: 'Total de Gerações',
      value: stats.totalGenerations,
      icon: <Zap className="w-8 h-8 text-blue-600" />,
      color: 'blue',
      description: 'Gerações realizadas'
    },
    {
      title: 'Textos Gerados',
      value: stats.textGenerations,
      icon: <MessageSquare className="w-8 h-8 text-green-600" />,
      color: 'green',
      description: 'Gerações de texto'
    },
    {
      title: 'Imagens Geradas',
      value: stats.imageGenerations,
      icon: <Image className="w-8 h-8 text-purple-600" />,
      color: 'purple',
      description: 'Gerações de imagem'
    },
    {
      title: 'Vídeos Gerados',
      value: stats.videoGenerations,
      icon: <Video className="w-8 h-8 text-orange-600" />,
      color: 'orange',
      description: 'Gerações de vídeo'
    },
    {
      title: 'Custo Total',
      value: stats.totalCost,
      icon: <DollarSign className="w-8 h-8 text-red-600" />,
      color: 'red',
      description: 'Gasto em gerações',
      format: 'currency'
    },
    {
      title: 'Tokens Totais',
      value: stats.totalTokens,
      icon: <TrendingUp className="w-8 h-8 text-indigo-600" />,
      color: 'indigo',
      description: 'Tokens processados',
      format: 'number'
    }
  ];

  return (
    <div className={`ai-stats ${className}`}>
      <ResponsiveGrid
        columns={{ xs: 1, sm: 2, lg: 3 }}
        gap={{ xs: '1rem', md: '1.5rem' }}
      >
        {statsCards.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <Card.Content className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 bg-${stat.color}-100 rounded-full`}>
                  {stat.icon}
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">
                    {stat.format === 'currency' ? (
                      formatCurrency(stat.value)
                    ) : stat.format === 'number' ? (
                      formatNumber(stat.value)
                    ) : (
                      <AnimatedCounter
                        value={stat.value}
                        duration={2000}
                      />
                    )}
                  </div>
                  <div className="text-sm text-gray-500">{stat.description}</div>
                </div>
              </div>
              <div className="text-sm text-gray-600">{stat.title}</div>
            </Card.Content>
          </Card>
        ))}
      </ResponsiveGrid>

      {/* Métricas em tempo real */}
      {variant !== 'basic' && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Métricas em Tempo Real
          </h3>
          <ResponsiveGrid
            columns={{ xs: 1, sm: 2, lg: 4 }}
            gap={{ xs: '1rem', md: '1.5rem' }}
          >
            <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
              <Card.Content className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">
                  {realTimeMetrics.today.totalGenerations}
                </div>
                <div className="text-sm text-green-600">Hoje</div>
              </Card.Content>
            </Card>
            
            <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
              <Card.Content className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {realTimeMetrics.week.totalGenerations}
                </div>
                <div className="text-sm text-blue-600">Esta Semana</div>
              </Card.Content>
            </Card>
            
            <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
              <Card.Content className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {formatCurrency(realTimeMetrics.week.totalCost)}
                </div>
                <div className="text-sm text-purple-600">Custo Semanal</div>
              </Card.Content>
            </Card>
            
            <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
              <Card.Content className="p-4 text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {formatPercentage(realTimeMetrics.week.avgQuality * 100)}
                </div>
                <div className="text-sm text-orange-600">Qualidade Média</div>
              </Card.Content>
            </Card>
          </ResponsiveGrid>
        </div>
      )}
    </div>
  );
};

export default AIStats;
