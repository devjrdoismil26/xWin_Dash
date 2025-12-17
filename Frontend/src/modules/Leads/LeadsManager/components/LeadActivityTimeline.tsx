import React from 'react';
import Card from '@/shared/components/ui/Card';
import { LeadActivityTimelineProps, LeadActivity } from '../types';
const LeadActivityTimeline: React.FC<LeadActivityTimelineProps> = ({ activities, 
  loading, 
  error 
   }) => {
  if (loading) {
    return (
        <>
      <Card />
      <Card.Header />
          <Card.Title>Timeline de Atividades</Card.Title>
        </Card.Header>
        <Card.Content className="p-4" />
          <div className="{[...Array(3)].map((_: unknown, index: unknown) => (">$2</div>
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
          <Card.Title>Timeline de Atividades</Card.Title>
        </Card.Header>
        <Card.Content className="p-4 text-center text-red-500" />
          Erro: {error}
        </Card.Content>
      </Card>);

  }
  if (!activities || activities.length === 0) {
    return (
        <>
      <Card />
      <Card.Header />
          <Card.Title>Timeline de Atividades</Card.Title>
        </Card.Header>
        <Card.Content className="p-4 text-center text-gray-500" />
          Nenhuma atividade registrada
        </Card.Content>
      </Card>);

  }
  const getActivityIcon = (type: LeadActivity['type']): string => {
    const icons = {
      note: '📝',
      call: '📞',
      email: '📧',
      meeting: '🤝',
      task: '✅',
      status_change: '🔄'};

    return icons[type] || '📝';};

  const getActivityColor = (type: LeadActivity['type']): string => {
    const colors = {
      note: 'bg-blue-100 text-blue-800',
      call: 'bg-green-100 text-green-800',
      email: 'bg-purple-100 text-purple-800',
      meeting: 'bg-orange-100 text-orange-800',
      task: 'bg-yellow-100 text-yellow-800',
      status_change: 'bg-gray-100 text-gray-800'};

    return colors[type] || 'bg-gray-100 text-gray-800';};

  const getActivityLabel = (type: LeadActivity['type']): string => {
    const labels = {
      note: 'Nota',
      call: 'Ligação',
      email: 'Email',
      meeting: 'Reunião',
      task: 'Tarefa',
      status_change: 'Mudança de Status'};

    return labels[type] || type;};

  const formatTimestamp = (timestamp: string): string => {
    const date = new Date(timestamp);

    const now = new Date();

    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Agora';
    if (diffInMinutes < 60) return `${diffInMinutes}min atrás`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h atrás`;
    if (diffInMinutes < 10080) return `${Math.floor(diffInMinutes / 1440)}d atrás`;
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });};

  return (
        <>
      <Card />
      <Card.Header />
        <Card.Title>Timeline de Atividades</Card.Title>
      </Card.Header>
      <Card.Content className="p-4" />
        <div className="{(activities || []).map((activity: unknown, index: unknown) => (">$2</div>
            <div key={activity.id} className="flex space-x-3">
           
        </div>{/* Timeline dot */}
              <div className=" ">$2</div><div className="{getActivityIcon(activity.type)}">$2</div>
                </div>
                {index < activities.length - 1 && (
                  <div className=")}">$2</div>
              </div>
              {/* Activity content */}
              <div className=" ">$2</div><div className=" ">$2</div><span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getActivityColor(activity.type)} `}>
           
        </span>{getActivityLabel(activity.type)}
                  </span>
                  <span className="{formatTimestamp(activity.created_at)}">$2</span>
                  </span></div><p className="text-sm text-gray-900 mb-2" />
                  {activity.description}
                </p>
                <div className="Usuário ID: {activity.user_id}">$2</div>
                </div>
    </div>
  ))}
        </div>
      </Card.Content>
    </Card>);};

export default LeadActivityTimeline;
