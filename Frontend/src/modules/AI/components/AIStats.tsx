/**
 * Componente de estatísticas do módulo AI
 * @module modules/AI/components/AIStats
 * @description
 * Componente que exibe métricas principais do módulo AI em cards responsivos,
 * incluindo total de gerações, textos gerados, imagens geradas, custos,
 * tempo médio e outras métricas de performance, com suporte a múltiplas
 * variantes (basic, advanced, revolutionary) e animações.
 * @since 1.0.0
 */
import React from 'react';
import { MessageSquare, Image, Video, DollarSign, Zap, TrendingUp } from 'lucide-react';
import Card from '@/shared/components/ui/Card';
import { AnimatedCounter } from '@/shared/components/ui/AdvancedAnimations';
import { ResponsiveGrid } from '@/shared/components/ui/ResponsiveSystem';
import { useAI } from '../hooks';
import { formatCurrency, formatNumber, formatPercentage } from '../utils';

interface AIStatsProps {
  variant?: 'basic' | 'advanced' | 'revolutionary';
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

const AIStats: React.FC<AIStatsProps> = ({ variant = 'basic',
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
    } ;

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
        <>
      <div className={`ai-stats ${className} `}>
      </div><ResponsiveGrid
        columns={ xs: 1, sm: 2, lg: 3 } gap={ xs: '1rem', md: '1.5rem' } />
        {(statsCards || []).map((stat: unknown, index: unknown) => (
          <Card key={index} className="hover:shadow-lg transition-shadow" />
            <Card.Content className="p-6" />
              <div className=" ">$2</div><div className={`p-3 bg-${stat.color} -100 rounded-full`}>
           
        </div>{stat.icon}
                </div>
                <div className=" ">$2</div><div className="{stat.format === 'currency' ? (">$2</div>
                      formatCurrency(stat.value)
                    ) : stat.format === 'number' ? (
                      formatNumber(stat.value)
                    ) : (
                      <AnimatedCounter
                        value={ stat.value }
                        duration={ 2000 }
                      / />
                    )}
                  </div>
                  <div className="text-sm text-gray-500">{stat.description}</div></div><div className="text-sm text-gray-600">{stat.title}</div>
            </Card.Content>
      </Card>
    </>
  ))}
      </ResponsiveGrid>

      {/* Métricas em tempo real */}
      {variant !== 'basic' && (
        <div className=" ">$2</div><h3 className="text-lg font-semibold text-gray-900 mb-4" />
            Métricas em Tempo Real
          </h3>
          <ResponsiveGrid
            columns={ xs: 1, sm: 2, lg: 4 } gap={ xs: '1rem', md: '1.5rem' } />
            <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200" />
              <Card.Content className="p-4 text-center" />
                <div className="{realTimeMetrics.today.totalGenerations}">$2</div>
                </div>
                <div className="text-sm text-green-600">Hoje</div>
              </Card.Content></Card><Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200" />
              <Card.Content className="p-4 text-center" />
                <div className="{realTimeMetrics.week.totalGenerations}">$2</div>
                </div>
                <div className="text-sm text-blue-600">Esta Semana</div>
              </Card.Content></Card><Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200" />
              <Card.Content className="p-4 text-center" />
                <div className="{formatCurrency(realTimeMetrics.week.totalCost)}">$2</div>
                </div>
                <div className="text-sm text-purple-600">Custo Semanal</div>
              </Card.Content></Card><Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200" />
              <Card.Content className="p-4 text-center" />
                <div className="{formatPercentage(realTimeMetrics.week.avgQuality * 100)}">$2</div>
                </div>
                <div className="text-sm text-orange-600">Qualidade Média</div>
              </Card.Content></Card></ResponsiveGrid>
      </div>
    </>
  )}
    </div>);};

export default AIStats;
