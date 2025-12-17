/**
 * Estatísticas do módulo Activity
 *
 * @description
 * Componente para exibir métricas e indicadores de performance do módulo Activity.
 * Exibe cards com contadores animados mostrando atividades hoje, total, por usuário
 * e por tipo. Layout responsivo com grid adaptável.
 *
 * @module modules/Activity/components/ActivityStats
 * @since 1.0.0
 */

import React from 'react';
import { useActivity } from '../hooks';
import { Card } from '@/shared/components/ui/Card';
import { AnimatedCounter } from '@/shared/components/ui/AdvancedAnimations';
import { ResponsiveGrid } from '@/shared/components/ui/ResponsiveSystem';
import { Activity, User, AlertTriangle, Globe, TrendingUp, Clock } from 'lucide-react';

/**
 * Props do componente ActivityStats
 *
 * @interface ActivityStatsProps
 * @property {string} [className] - Classes CSS adicionais
 */
interface ActivityStatsProps {
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

/**
 * Componente ActivityStats
 *
 * @description
 * Renderiza grid responsivo de cards com estatísticas de atividades.
 * Exibe loading state com skeletons e dados com contadores animados.
 *
 * @param {ActivityStatsProps} props - Props do componente
 * @returns {JSX.Element} Grid de estatísticas
 */
export const ActivityStats: React.FC<ActivityStatsProps> = ({ className    }) => {
  const { stats, statsLoading } = useActivity();

  if (statsLoading) {
    return (
              <ResponsiveGrid
        columns={ xs: 1, sm: 2, lg: 4 } gap={ xs: '1rem', md: '1.5rem' } className={className } />
        {[...Array(4)].map((_: unknown, index: unknown) => (
          <Card key={index} className="backdrop-blur-xl bg-white/10 border-white/20" />
            <Card.Content className="p-6" />
              <div className=" ">$2</div><div className=" ">$2</div><div className="h-8 bg-gray-300 rounded w-1/2">
           
        </div></Card.Content>
      </Card>
    </>
  ))}
      </ResponsiveGrid>);

  }

  const statsData = [
    {
      title: 'Atividades Hoje',
      value: stats?.today_logs || 0,
      icon: Activity,
      color: 'text-blue-600',
      bgColor: 'bg-blue-500/20'
    },
    {
      title: 'Usuários Ativos',
      value: stats?.active_users || 0,
      icon: User,
      color: 'text-green-600',
      bgColor: 'bg-green-500/20'
    },
    {
      title: 'Erros',
      value: stats?.error_logs || 0,
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-500/20'
    },
    {
      title: 'API Calls',
      value: stats?.api_calls || 0,
      icon: Globe,
      color: 'text-purple-600',
      bgColor: 'bg-purple-500/20'
    }
  ];

  return (
            <ResponsiveGrid
      columns={ xs: 1, sm: 2, lg: 4 } gap={ xs: '1rem', md: '1.5rem' } className={className } />
      {(statsData || []).map((stat: unknown, index: unknown) => (
        <Card 
          key={ index }
          className="backdrop-blur-xl bg-white/10 border-white/20 hover:bg-white/20 transition-all duration-300 hover:shadow-2xl" />
          <Card.Content className="p-6" />
            <div className=" ">$2</div><div>
           
        </div><p className="text-sm font-medium text-gray-600 dark:text-gray-300" />
                  {stat.title}
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white" />
                  <AnimatedCounter
                    value={ stat.value }
                    duration={ 2000 }
                  / /></p></div>
              <div className={`p-3 rounded-lg backdrop-blur-sm ${stat.bgColor} `}>
           
        </div><stat.icon className={`h-6 w-6 ${stat.color} `} / /></div></Card.Content>
      </Card>
    </>
  ))}
    </ResponsiveGrid>);};

export default ActivityStats;
