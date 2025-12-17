import React from 'react';
import { TrendingUp, TrendingDown, Users, Send, Calendar, Hash, Link as Link, Image, BarChart3, Eye, Heart, MessageCircle, Share2 } from 'lucide-react';
import Card from '@/shared/components/ui/Card';
import { AnimatedCounter, Animated } from '@/shared/components/ui/AdvancedAnimations';
import { Progress, CircularProgress } from '@/shared/components/ui/AdvancedProgress';
import { useAnalyticsStore } from '../hooks/useAnalyticsStore';
import { useAccountsStore } from '../hooks/useAccountsStore';
import { usePostsStore } from '../hooks/usePostsStore';
import { useSchedulesStore } from '../hooks/useSchedulesStore';

interface SocialBufferStatsProps {
  className?: string;
  showDetails?: boolean;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

interface StatCardProps {
  title: string;
  value: number;
  previousValue?: number;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  borderColor: string;
  format?: 'number' | 'percentage' | 'currency';
  delay?: number; }

const StatCard: React.FC<StatCardProps> = ({ title,
  value,
  previousValue,
  icon,
  color,
  bgColor,
  borderColor,
  format = 'number',
  delay = 0
   }) => {
  const getFormattedValue = (val: number) => {
    switch (format) {
      case 'percentage':
        return `${val.toFixed(1)}%`;
      case 'currency':
        return `R$ ${val.toLocaleString('pt-BR')}`;
      default:
        return val.toLocaleString('pt-BR');

    } ;

  const getTrend = () => {
    if (!previousValue) return null;
    const change = ((value - previousValue) / previousValue) * 100;
    return {
      value: Math.abs(change),
      direction: change > 0 ? 'up' : 'down',
      isPositive: change > 0};
};

  const trend = getTrend();

  return (
        <>
      <Animated />
      <Card className={`p-6 border ${borderColor} ${bgColor} hover:shadow-md transition-shadow`} />
        <div className=" ">$2</div><div className=" ">$2</div><p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
            <AnimatedCounter
              value={ value }
              className={`text-2xl font-bold ${color} `}
  >
          {trend && (
              <div className={`flex items-center mt-2 text-sm ${
                trend.isPositive ? 'text-green-600' : 'text-red-600'
              } `}>
           
        </div>{trend.direction === 'up' ? (
                  <TrendingUp className="w-4 h-4 mr-1" />
                ) : (
                  <TrendingDown className="w-4 h-4 mr-1" />
                )}
                <span>{trend.value.toFixed(1)}% vs período anterior</span>
      </div>
    </>
  )}
          </div>
          <div className={`p-3 rounded-lg ${bgColor} ${color}`}>
           
        </div>{icon}
          </div></Card></Animated>);};

const SocialBufferStats: React.FC<SocialBufferStatsProps> = ({ className = '',
  showDetails = true 
   }) => {
  const { basicMetrics, platformMetrics, loading } = useAnalyticsStore();

  const { accountsStats } = useAccountsStore();

  const { postsStats } = usePostsStore();

  const { schedulesStats } = useSchedulesStore();

  if (loading) {
    return (
        <>
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ${className} `}>
      </div>{[...Array(4)].map((_: unknown, i: unknown) => (
          <Card key={i} className="p-6" />
            <div className=" ">$2</div><div className=" ">$2</div><div className=" ">$2</div><div className="h-3 bg-gray-200 rounded w-1/3">
           
        </div></Card>
        ))}
      </div>);

  }

  const mainStats = [
    {
      title: 'Contas Conectadas',
      value: accountsStats?.total_accounts || 0,
      previousValue: accountsStats?.connected_accounts || 0,
      icon: <Users className="w-6 h-6" />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      delay: 0
    },
    {
      title: 'Posts Publicados',
      value: postsStats?.total_posts || 0,
      previousValue: postsStats?.published_posts || 0,
      icon: <Send className="w-6 h-6" />,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      delay: 100
    },
    {
      title: 'Agendamentos Ativos',
      value: schedulesStats?.active_schedules || 0,
      previousValue: schedulesStats?.total_schedules || 0,
      icon: <Calendar className="w-6 h-6" />,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      delay: 200
    },
    {
      title: 'Engajamento Total',
      value: basicMetrics?.total_engagement || 0,
      previousValue: basicMetrics?.total_engagement || 0,
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      delay: 300
    }
  ];

  const engagementStats = [
    {
      title: 'Taxa de Engajamento',
      value: basicMetrics?.average_engagement_rate || 0,
      icon: <BarChart3 className="w-5 h-5" />,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-200',
      format: 'percentage' as const
    },
    {
      title: 'Alcance Total',
      value: basicMetrics?.total_reach || 0,
      icon: <Eye className="w-5 h-5" />,
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-50',
      borderColor: 'border-cyan-200'
    },
    {
      title: 'Impressões',
      value: basicMetrics?.total_impressions || 0,
      icon: <Eye className="w-5 h-5" />,
      color: 'text-teal-600',
      bgColor: 'bg-teal-50',
      borderColor: 'border-teal-200'
    },
    {
      title: 'Cliques',
      value: basicMetrics?.total_clicks || 0,
      icon: <Link className="w-5 h-5" />,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200'
    }
  ];

  const interactionStats = [
    {
      title: 'Curtidas',
      value: basicMetrics?.total_likes || 0,
      icon: <Heart className="w-5 h-5" />,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200'
    },
    {
      title: 'Comentários',
      value: basicMetrics?.total_comments || 0,
      icon: <MessageCircle className="w-5 h-5" />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      title: 'Compartilhamentos',
      value: basicMetrics?.total_shares || 0,
      icon: <Share2 className="w-5 h-5" />,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    }
  ];

  return (
        <>
      <div className={`space-y-6 ${className} `}>
      </div>{/* Main Stats */}
      <div className="{(mainStats || []).map((stat: unknown) => (">$2</div>
      <StatCard key={stat.title} {...stat} / />
    </>
  ))}
      </div>

      {showDetails && (
        <>
          {/* Engagement Stats */}
          <div>
           
        </div><h3 className="text-lg font-semibold text-gray-900 mb-4">Métricas de Engajamento</h3>
            <div className="{(engagementStats || []).map((stat: unknown, index: unknown) => (">$2</div>
      <StatCard
                  key={ stat.title }
                  {...stat}
                / />
    </>
  ))}
            </div>

          {/* Interaction Stats */}
          <div>
           
        </div><h3 className="text-lg font-semibold text-gray-900 mb-4">Interações</h3>
            <div className="{(interactionStats || []).map((stat: unknown, index: unknown) => (">$2</div>
      <StatCard
                  key={ stat.title }
                  {...stat}
                / />
    </>
  ))}
            </div>

          {/* Platform Performance */}
          { platformMetrics && platformMetrics.length > 0 && (
            <div>
           
        </div><h3 className="text-lg font-semibold text-gray-900 mb-4">Performance por Plataforma</h3>
              <div className="{(platformMetrics || []).map((platform: unknown, index: unknown) => (">$2</div>
                  <Animated key={platform.platform } />
                    <Card className="p-4 border border-gray-200" />
                      <div className=" ">$2</div><h4 className="font-medium text-gray-900 capitalize">{platform.platform}</h4>
                        <span className="text-sm text-gray-500">{platform.posts_count} posts</span></div><div className=" ">$2</div><div className=" ">$2</div><span className="text-gray-600">Engajamento</span>
                          <span className="font-medium">{platform.engagement.toLocaleString('pt-BR')}</span></div><div className=" ">$2</div><span className="text-gray-600">Taxa</span>
                          <span className="font-medium">{platform.engagement_rate.toFixed(1)}%</span></div><Progress
                          value={ platform.engagement_rate }
                          max={ 100 }
                          className="h-1"
                        / /></div></Card>
      </Animated>
    </>
  ))}
              </div>
          )}
        </>
      )}
    </div>);};

export default SocialBufferStats;
