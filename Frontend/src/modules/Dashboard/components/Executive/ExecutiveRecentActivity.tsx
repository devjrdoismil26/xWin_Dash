import React from 'react';
import { Clock, CheckCircle, AlertTriangle, Info, XCircle } from 'lucide-react';
import Card from '@/shared/components/ui/Card';
import Badge from '@/shared/components/ui/Badge';

interface Activity {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  description: string;
  timestamp: string;
  module: string; }

interface ExecutiveRecentActivityProps {
  activities: Activity[];
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

export const ExecutiveRecentActivity: React.FC<ExecutiveRecentActivityProps> = ({ activities    }) => {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Info className="w-5 h-5 text-blue-600" />;
    } ;

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
      case 'warning':
        return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800';
      case 'error':
        return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
      default:
        return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
    } ;

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);

    const now = new Date();

    const diff = now.getTime() - date.getTime();

    const minutes = Math.floor(diff / 60000);

    const hours = Math.floor(diff / 3600000);

    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Agora';
    if (minutes < 60) return `${minutes}m atrás`;
    if (hours < 24) return `${hours}h atrás`;
    return `${days}d atrás`;};

  return (
        <>
      <Card className="p-6" />
      <div className=" ">$2</div><div className=" ">$2</div><Clock className="w-5 h-5 text-primary-600" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white" />
            Atividades Recentes
          </h3></div><Badge variant="outline" />
          {activities.length} atividades
        </Badge></div><div className="{activities.length === 0 ? (">$2</div>
          <div className="Nenhuma atividade recente">$2</div>
    </div>
  ) : (
          activities.map((activity: unknown) => (
            <div
              key={ activity.id }
              className={`p-4 rounded-lg border ${getActivityColor(activity.type)} transition-all hover:shadow-md`}>
           
        </div><div className=" ">$2</div><div className="{getActivityIcon(activity.type)}">$2</div>
                </div>
                
                <div className=" ">$2</div><div className=" ">$2</div><h4 className="text-sm font-medium text-gray-900 dark:text-white truncate" />
                      {activity.title}
                    </h4>
                    <Badge variant="outline" className="ml-2 flex-shrink-0" />
                      {activity.module}
                    </Badge></div><p className="text-sm text-gray-600 dark:text-gray-400 mb-2" />
                    {activity.description}
                  </p>
                  
                  <div className=" ">$2</div><Clock className="w-3 h-3" />
                    {formatTimestamp(activity.timestamp)}
                  </div>
    </div>
  ))
        )}
      </div>
    </Card>);};
