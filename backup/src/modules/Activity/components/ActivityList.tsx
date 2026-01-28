/**
 * Componente de lista do módulo Activity
 * Exibe lista de atividades com paginação
 */

import React from 'react';
import { ActivityLog } from '../types';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Checkbox } from '@/components/ui/Checkbox';
import { Tooltip } from '@/components/ui/Tooltip';
import { LoadingSpinner } from '@/components/ui/LoadingStates';
import { 
  User, 
  Calendar, 
  Database, 
  Eye,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { 
  getLogType
} from '../utils/activityHelpers';
import { formatLogDescription, formatTimestamp } from '../utils/activityFormatters';
import { ACTIVITY_BADGE_VARIANTS } from '../utils/activityConstants';

interface ActivityListProps {
  logs: ActivityLog[];
  loading: boolean;
  selectedIds: string[];
  onLogSelect: (id: string) => void;
  className?: string;
}

export const ActivityList: React.FC<ActivityListProps> = ({
  logs,
  loading,
  selectedIds,
  onLogSelect,
  className
}) => {
  const getActivityIcon = (logName: string) => {
    const iconName = getLogIcon(logName);
    const iconProps = { className: "h-4 w-4" };
    
    switch (iconName) {
      case 'User':
        return <User {...iconProps} />;
      case 'UserPlus':
        return <CheckCircle {...iconProps} />;
      case 'UserEdit':
        return <CheckCircle {...iconProps} />;
      case 'UserMinus':
        return <AlertTriangle {...iconProps} />;
      case 'Mail':
        return <Activity {...iconProps} />;
      case 'Shield':
        return <AlertTriangle {...iconProps} />;
      case 'Settings':
        return <Activity {...iconProps} />;
      case 'Globe':
        return <Activity {...iconProps} />;
      case 'AlertTriangle':
        return <AlertTriangle {...iconProps} />;
      default:
        return <Activity {...iconProps} />;
    }
  };

  const getActivityColor = (logName: string) => {
    return getLogColor(logName);
  };

  const getActivityText = (logName: string) => {
    const type = getLogType(logName);
    const texts = {
      'login': 'Login',
      'logout': 'Logout',
      'create': 'Criação',
      'update': 'Atualização',
      'delete': 'Exclusão',
      'email': 'Email',
      'security': 'Segurança',
      'settings': 'Configurações',
      'api': 'API',
      'error': 'Erro',
      'activity': 'Atividade'
    };
    return texts[type] || type;
  };

  if (loading) {
    return (
      <Card className={`backdrop-blur-xl bg-white/10 border-white/20 ${className}`}>
        <Card.Content className="p-6">
          <div className="flex items-center justify-center h-32">
            <LoadingSpinner size="lg" />
          </div>
        </Card.Content>
      </Card>
    );
  }

  return (
    <Card className={`backdrop-blur-xl bg-white/10 border-white/20 hover:bg-white/20 transition-all duration-300 ${className}`}>
      <Card.Header>
        <Card.Title className="text-gray-900 dark:text-white">
          Atividades ({logs.length})
        </Card.Title>
        <Card.Description className="text-gray-600 dark:text-gray-300">
          Histórico completo de ações no sistema
        </Card.Description>
      </Card.Header>
      <Card.Content>
        <div className="space-y-4">
          {logs.map((log) => {
            const type = getLogType(log.log_name);
            const color = getActivityColor(log.log_name);
            const isSelected = selectedIds.includes(log.id);
            
            return (
              <div 
                key={log.id}
                className={`flex items-start gap-4 p-4 border border-white/20 rounded-lg hover:shadow-lg transition-all duration-300 backdrop-blur-sm bg-white/5 hover:bg-white/10 ${
                  isSelected ? 'ring-2 ring-blue-500 bg-blue-500/10' : ''
                }`}
              >
                {/* Selection Checkbox */}
                <div className="pt-1">
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => onLogSelect(log.id)}
                    className="backdrop-blur-sm"
                  />
                </div>

                {/* Activity Icon */}
                <div className={`p-2 rounded-lg backdrop-blur-sm ${
                  type === 'error' ? 'bg-red-500/20' :
                  type === 'security' ? 'bg-yellow-500/20' :
                  type === 'create' ? 'bg-green-500/20' :
                  type === 'update' ? 'bg-blue-500/20' :
                  type === 'delete' ? 'bg-red-500/20' :
                  'bg-gray-500/20'
                }`}>
                  {getActivityIcon(log.log_name)}
                </div>

                {/* Activity Content */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {formatLogDescription(log)}
                        </h3>
                        <Badge variant={color as any} size="sm">
                          {getActivityText(log.log_name)}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300">
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {log.causer_type || 'Sistema'}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatTimestamp(log.created_at)}
                        </span>
                        {log.subject_type && (
                          <span className="flex items-center gap-1">
                            <Database className="h-3 w-3" />
                            {log.subject_type.replace('App\\Models\\', '')}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Tooltip content="Ver detalhes da atividade">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="backdrop-blur-sm bg-white/10 hover:bg-white/20"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Tooltip>
                    </div>
                  </div>
                  
                  {/* Properties */}
                  {log.properties && Object.keys(log.properties).length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Detalhes:
                      </p>
                      <div className="bg-white/10 p-3 rounded text-sm backdrop-blur-sm">
                        <pre className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">
                          {JSON.stringify(log.properties, null, 2)}
                        </pre>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card.Content>
    </Card>
  );
};

export default ActivityList;
