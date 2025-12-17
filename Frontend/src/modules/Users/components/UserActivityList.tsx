import React, { useEffect } from 'react';
import { Activity, RefreshCw } from 'lucide-react';
import Card from '@/shared/components/ui/Card';
import Button from '@/shared/components/ui/Button';
import { LoadingSpinner } from '@/shared/components/ui/LoadingStates';
import { useUserActivity } from '../hooks/useUserActivity';

interface UserActivityListProps {
  className?: string;
  limit?: number;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

const UserActivityList: React.FC<UserActivityListProps> = ({ className = '',
  limit = 10
   }) => {
  const { activities, loading, error, fetchActivities } = useUserActivity();

  useEffect(() => {
    fetchActivities({ limit });

  }, [limit]);

  if (loading) { return (
        <>
      <Card className={className } />
      <Card.Header />
          <Card.Title className="flex items-center gap-2" />
            <Activity className="h-5 w-5" />
            Atividades Recentes
          </Card.Title>
        </Card.Header>
        <Card.Content className="flex items-center justify-center py-12" />
          <LoadingSpinner / />
        </Card.Content>
      </Card>);

  }

  if (error) { return (
        <>
      <Card className={className } />
      <Card.Content className="p-6" />
          <p className="text-red-600">Erro ao carregar atividades: {error}</p>
        </Card.Content>
      </Card>);

  }

  return (
        <>
      <Card className={className } />
      <Card.Header />
        <div className=" ">$2</div><Card.Title className="flex items-center gap-2" />
            <Activity className="h-5 w-5" />
            Atividades Recentes
          </Card.Title>
          <Button size="sm" variant="ghost" onClick={() => fetchActivities({ limit })}>
            <RefreshCw className="h-4 w-4" /></Button></div>
      </Card.Header>
      <Card.Content />
        <div className="{activities?.length === 0 ? (">$2</div>
            <p className="text-center text-gray-500 py-8">Nenhuma atividade recente</p>
          ) : (
            activities?.map((activity: unknown) => (
              <div key={activity.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
           
        </div><div className=" ">$2</div><p className="text-sm font-medium text-gray-900">{activity.description}</p>
                  <p className="text-xs text-gray-500 mt-1" />
                    {activity.user?.name} • {new Date(activity.created_at).toLocaleString()}
                  </p>
      </div>
    </>
  ))
          )}
        </div>
      </Card.Content>
    </Card>);};

export default UserActivityList;
