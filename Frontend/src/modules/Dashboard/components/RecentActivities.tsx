/**
 * @module modules/Dashboard/components/RecentActivities
 * @description
 * Componente de atividades recentes.
 * 
 * Exibe lista de atividades recentes do sistema:
 * - Atividades de leads, conversões, campanhas, workflows, analytics
 * - Informações de usuário e timestamp
 * - Ícones por tipo de atividade
 * 
 * @example
 * ```typescript
 * <RecentActivities
 *   activities={ [
 *     {
 *       id: '1',
 *       type: 'lead',
 *       description: 'Novo lead criado',
 *       timestamp: '2024-01-01T10:00:00Z',
 *       user_name: 'João'
 *      }
 *   ]}
 *   loading={ false }
 * / />
 * ```
 * 
 * @since 1.0.0
 */
import React from 'react';
import Card from '@/shared/components/ui/Card';
import { RecentActivitiesProps } from '../types';

/**
 * Componente de atividades recentes
 * @param {RecentActivitiesProps} props - Props do componente
 * @returns {JSX.Element} Lista de atividades recentes
 */
const RecentActivities: React.FC<RecentActivitiesProps> = ({ activities, loading, error    }) => {
  if (loading) {
    return (
        <>
      <Card />
      <Card.Header />
          <Card.Title>Atividades Recentes</Card.Title>
        </Card.Header>
        <Card.Content className="p-4" />
          <div className="{[...Array(5)].map((_: unknown, index: unknown) => (">$2</div>
              <div key={index} className="flex space-x-3">
           
        </div><div className=" ">$2</div><div className=" ">$2</div><div className=" ">$2</div><div className="h-2 bg-gray-200 rounded w-1/2">
           
        </div></div>
            ))}
          </div>
        </Card.Content>
      </Card>);

  }
  if (error) {
    return (
        <>
      <Card />
      <Card.Header />
          <Card.Title>Atividades Recentes</Card.Title>
        </Card.Header>
        <Card.Content className="p-4 text-red-500" />
          Erro: {error}
        </Card.Content>
      </Card>);

  }
  if (!activities || activities.length === 0) {
    return (
        <>
      <Card />
      <Card.Header />
          <Card.Title>Atividades Recentes</Card.Title>
        </Card.Header>
        <Card.Content className="p-4" />
          <div className="text-center text-gray-500">Nenhuma atividade recente</div>
        </Card.Content>
      </Card>);

  }
  const getActivityIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'lead': return '👤';
      case 'conversion': return '✅';
      case 'campaign': return '📧';
      case 'workflow': return '⚡';
      case 'analytics': return '📊';
      default: return '📝';
    } ;

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);

    const now = new Date();

    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Agora';
    if (diffInMinutes < 60) return `${diffInMinutes}min atrás`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h atrás`;
    return date.toLocaleDateString('pt-BR');};

  return (
        <>
      <Card />
      <Card.Header />
        <Card.Title>Atividades Recentes</Card.Title>
      </Card.Header>
      <Card.Content className="p-4" />
        <div className="{(activities || []).map((activity: unknown) => (">$2</div>
            <div key={activity.id} className="flex space-x-3 p-3 hover:bg-gray-50 rounded">
           
        </div><div className="text-2xl">{getActivityIcon(activity.type)}</div>
              <div className=" ">$2</div><div className="{activity.description}">$2</div>
                </div>
                <div className="{formatTimestamp(activity.timestamp)}">$2</div>
                  {activity.user && ` • ${activity.user}`}
                </div>
    </div>
  ))}
        </div>
      </Card.Content>
    </Card>);};

export default RecentActivities;
