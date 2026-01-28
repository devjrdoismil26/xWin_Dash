import React from 'react';
import Card from '@/components/ui/Card';
import { RecentActivitiesProps } from '../types';
const RecentActivities: React.FC<RecentActivitiesProps> = ({ activities, loading, error }) => {
  if (loading) {
    return (
      <Card>
        <Card.Header>
          <Card.Title>Atividades Recentes</Card.Title>
        </Card.Header>
        <Card.Content className="p-4">
          <div className="animate-pulse space-y-3">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="flex space-x-3">
                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-2 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </Card.Content>
      </Card>
    );
  }
  if (error) {
    return (
      <Card>
        <Card.Header>
          <Card.Title>Atividades Recentes</Card.Title>
        </Card.Header>
        <Card.Content className="p-4 text-red-500">
          Erro: {error}
        </Card.Content>
      </Card>
    );
  }
  if (!activities || activities.length === 0) {
    return (
      <Card>
        <Card.Header>
          <Card.Title>Atividades Recentes</Card.Title>
        </Card.Header>
        <Card.Content className="p-4">
          <div className="text-center text-gray-500">Nenhuma atividade recente</div>
        </Card.Content>
      </Card>
    );
  }
  const getActivityIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'lead': return '👤';
      case 'conversion': return '✅';
      case 'campaign': return '📧';
      case 'workflow': return '⚡';
      case 'analytics': return '📊';
      default: return '📝';
    }
  };
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    if (diffInMinutes < 1) return 'Agora';
    if (diffInMinutes < 60) return `${diffInMinutes}min atrás`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h atrás`;
    return date.toLocaleDateString('pt-BR');
  };
  return (
    <Card>
      <Card.Header>
        <Card.Title>Atividades Recentes</Card.Title>
      </Card.Header>
      <Card.Content className="p-4">
        <div className="space-y-3">
          {activities.map((activity) => (
            <div key={activity.id} className="flex space-x-3 p-3 hover:bg-gray-50 rounded">
              <div className="text-2xl">{getActivityIcon(activity.type)}</div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900">
                  {activity.description}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {formatTimestamp(activity.timestamp)}
                  {activity.user && ` • ${activity.user}`}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card.Content>
    </Card>
  );
};
export default RecentActivities;
