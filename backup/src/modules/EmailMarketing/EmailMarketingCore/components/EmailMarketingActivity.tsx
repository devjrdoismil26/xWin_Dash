/**
 * Componente de atividades recentes do dashboard de Email Marketing
 * Exibe atividades e eventos recentes
 */

import React from 'react';
import { Card } from "@/components/ui/Card";
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { 
  Activity, 
  Mail, 
  Users, 
  FileText, 
  BarChart3,
  Clock,
  CheckCircle,
  AlertCircle,
  Info,
  TrendingUp,
  TrendingDown,
  Eye,
  MousePointer,
  Target
} from 'lucide-react';
import { EmailMarketingActivity } from '../types';
import { cn } from '@/lib/utils';

interface EmailMarketingActivityProps {
  activities: EmailMarketingActivity[];
  loading?: boolean;
  className?: string;
}

export const EmailMarketingActivity: React.FC<EmailMarketingActivityProps> = ({
  activities,
  loading = false,
  className
}) => {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'campaign':
        return <Mail className="h-4 w-4" />;
      case 'template':
        return <FileText className="h-4 w-4" />;
      case 'segment':
        return <Users className="h-4 w-4" />;
      case 'user':
        return <Users className="h-4 w-4" />;
      case 'system':
        return <BarChart3 className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'campaign':
        return 'blue';
      case 'template':
        return 'green';
      case 'segment':
        return 'purple';
      case 'user':
        return 'orange';
      case 'system':
        return 'gray';
      default:
        return 'blue';
    }
  };

  const getActivityStatus = (action: string) => {
    if (action.includes('criado') || action.includes('criada')) {
      return { status: 'success', icon: CheckCircle, color: 'green' };
    }
    if (action.includes('erro') || action.includes('falha')) {
      return { status: 'error', icon: AlertCircle, color: 'red' };
    }
    if (action.includes('atualizado') || action.includes('atualizada')) {
      return { status: 'info', icon: Info, color: 'blue' };
    }
    return { status: 'info', icon: Info, color: 'blue' };
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInSeconds = Math.floor((now.getTime() - time.getTime()) / 1000);

    if (diffInSeconds < 60) return 'agora mesmo';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min atrás`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h atrás`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} dias atrás`;
    
    return time.toLocaleDateString('pt-BR');
  };

  if (loading) {
    return (
      <Card className={cn("backdrop-blur-xl bg-white/10 border-white/20", className)}>
        <Card.Content className="p-8 text-center">
          <div className="text-gray-500 dark:text-gray-400">
            Carregando atividades...
          </div>
        </Card.Content>
      </Card>
    );
  }

  if (!activities || activities.length === 0) {
    return (
      <Card className={cn("backdrop-blur-xl bg-white/10 border-white/20", className)}>
        <Card.Header>
          <Card.Title className="text-gray-900 dark:text-white flex items-center gap-2">
            <Activity className="h-5 w-5 text-blue-600" />
            Atividades Recentes
          </Card.Title>
        </Card.Header>
        <Card.Content className="p-8 text-center">
          <div className="text-gray-500 dark:text-gray-400">
            Nenhuma atividade recente encontrada
          </div>
        </Card.Content>
      </Card>
    );
  }

  return (
    <Card className={cn("backdrop-blur-xl bg-white/10 border-white/20 hover:bg-white/20 transition-all duration-300", className)}>
      <Card.Header>
        <div className="flex items-center justify-between">
          <Card.Title className="text-gray-900 dark:text-white flex items-center gap-2">
            <Activity className="h-5 w-5 text-blue-600" />
            Atividades Recentes
          </Card.Title>
          <Button
            variant="outline"
            size="sm"
            className="backdrop-blur-sm bg-white/10 border-white/20 hover:bg-white/20"
          >
            Ver Todas
          </Button>
        </div>
      </Card.Header>
      <Card.Content>
        <div className="space-y-4">
          {activities.slice(0, 10).map((activity, index) => {
            const activityColor = getActivityColor(activity.type);
            const activityStatus = getActivityStatus(activity.action);
            
            return (
              <div
                key={activity.id}
                className={cn(
                  "flex items-start gap-3 p-3 rounded-lg backdrop-blur-sm border transition-all duration-300",
                  activityColor === 'blue' && "bg-blue-500/10 border-blue-500/30",
                  activityColor === 'green' && "bg-green-500/10 border-green-500/30",
                  activityColor === 'purple' && "bg-purple-500/10 border-purple-500/30",
                  activityColor === 'orange' && "bg-orange-500/10 border-orange-500/30",
                  activityColor === 'gray' && "bg-gray-500/10 border-gray-500/30"
                )}
              >
                <div className={cn(
                  "p-2 rounded-lg",
                  activityColor === 'blue' && "bg-blue-500/20",
                  activityColor === 'green' && "bg-green-500/20",
                  activityColor === 'purple' && "bg-purple-500/20",
                  activityColor === 'orange' && "bg-orange-500/20",
                  activityColor === 'gray' && "bg-gray-500/20"
                )}>
                  {getActivityIcon(activity.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
                      {activity.action}
                    </h4>
                    <Badge 
                      variant="outline" 
                      className={cn(
                        "text-xs backdrop-blur-sm",
                        activityStatus.color === 'green' && "bg-green-500/20 border-green-500/30 text-green-600",
                        activityStatus.color === 'red' && "bg-red-500/20 border-red-500/30 text-red-600",
                        activityStatus.color === 'blue' && "bg-blue-500/20 border-blue-500/30 text-blue-600"
                      )}
                    >
                      {activity.type}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                    {activity.description}
                  </p>
                  
                  <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{formatTimeAgo(activity.timestamp)}</span>
                    </div>
                    {activity.user_name && (
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        <span>{activity.user_name}</span>
                      </div>
                    )}
                    {activity.count && (
                      <div className="flex items-center gap-1">
                        <Target className="h-3 w-3" />
                        <span>{activity.count} itens</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className={cn(
                  "p-1 rounded-full",
                  activityStatus.color === 'green' && "bg-green-500/20",
                  activityStatus.color === 'red' && "bg-red-500/20",
                  activityStatus.color === 'blue' && "bg-blue-500/20"
                )}>
                  <activityStatus.icon className={cn(
                    "h-3 w-3",
                    activityStatus.color === 'green' && "text-green-600",
                    activityStatus.color === 'red' && "text-red-600",
                    activityStatus.color === 'blue' && "text-blue-600"
                  )} />
                </div>
              </div>
            );
          })}
        </div>
        
        {activities.length > 10 && (
          <div className="mt-4 pt-4 border-t border-white/10">
            <Button
              variant="outline"
              className="w-full backdrop-blur-sm bg-white/10 border-white/20 hover:bg-white/20"
            >
              Ver {activities.length - 10} atividades anteriores
            </Button>
          </div>
        )}
      </Card.Content>
    </Card>
  );
};

export default EmailMarketingActivity;
