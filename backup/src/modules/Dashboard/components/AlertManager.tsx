import React, { useState, useEffect } from 'react';
import { useDashboardAdvanced } from '../hooks/useDashboardAdvanced';
import { DashboardAlert } from '../types/dashboardTypes';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { 
  Bell,
  AlertTriangle,
  Info,
  CheckCircle,
  XCircle,
  Eye,
  EyeOff
} from 'lucide-react';

interface AlertManagerProps {
  className?: string;
  showUnreadOnly?: boolean;
  maxItems?: number;
}

export const AlertManager: React.FC<AlertManagerProps> = ({
  className = '',
  showUnreadOnly = false,
  maxItems = 10
}) => {
  const {
    alerts,
    alertsLoading,
    alertsError,
    unreadAlertsCount,
    fetchAlerts,
    markAlertAsRead,
    markAllAlertsAsRead
  } = useDashboardAdvanced();

  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'info' | 'warning' | 'error' | 'success'>('all');

  useEffect(() => {
    fetchAlerts();
    
    // Auto-refresh alerts every 30 seconds
    const interval = setInterval(fetchAlerts, 30000);
    return () => clearInterval(interval);
  }, [fetchAlerts]);

  const getAlertIcon = (type: DashboardAlert['type']) => {
    switch (type) {
      case 'info':
        return <Info className="h-5 w-5 text-blue-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const getAlertBadgeColor = (type: DashboardAlert['type']) => {
    switch (type) {
      case 'info':
        return 'blue';
      case 'warning':
        return 'yellow';
      case 'error':
        return 'red';
      case 'success':
        return 'green';
      default:
        return 'gray';
    }
  };

  const getPriorityBadgeColor = (priority: DashboardAlert['priority']) => {
    switch (priority) {
      case 'low':
        return 'gray';
      case 'medium':
        return 'blue';
      case 'high':
        return 'yellow';
      case 'critical':
        return 'red';
      default:
        return 'gray';
    }
  };

  const filteredAlerts = alerts
    .filter(alert => {
      if (filter === 'unread') return !alert.is_read;
      if (filter === 'read') return alert.is_read;
      return true;
    })
    .filter(alert => {
      if (typeFilter === 'all') return true;
      return alert.type === typeFilter;
    })
    .slice(0, maxItems);

  const handleMarkAsRead = async (alertId: string) => {
    await markAlertAsRead(alertId);
  };

  const handleMarkAllAsRead = async () => {
    await markAllAlertsAsRead();
  };

  if (alertsLoading) {
    return (
      <Card className={`p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  if (alertsError) {
    return (
      <Card className={`p-6 ${className}`}>
        <div className="text-center text-red-600">
          <p>Erro ao carregar alertas: {alertsError}</p>
          <Button 
            onClick={fetchAlerts}
            variant="outline"
            size="sm"
            className="mt-2"
          >
            Tentar Novamente
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className={`p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold text-gray-900">
            Alertas do Dashboard
          </h3>
          {unreadAlertsCount > 0 && (
            <Badge variant="error" size="sm">
              {unreadAlertsCount} não lidos
            </Badge>
          )}
        </div>
        
        {unreadAlertsCount > 0 && (
          <Button
            onClick={handleMarkAllAsRead}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Eye className="h-4 w-4" />
            Marcar todos como lidos
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <div className="flex gap-2">
          <Button
            onClick={() => setFilter('all')}
            variant={filter === 'all' ? 'primary' : 'outline'}
            size="sm"
          >
            Todos ({alerts.length})
          </Button>
          <Button
            onClick={() => setFilter('unread')}
            variant={filter === 'unread' ? 'primary' : 'outline'}
            size="sm"
          >
            Não lidos ({alerts.filter(a => !a.is_read).length})
          </Button>
          <Button
            onClick={() => setFilter('read')}
            variant={filter === 'read' ? 'primary' : 'outline'}
            size="sm"
          >
            Lidos ({alerts.filter(a => a.is_read).length})
          </Button>
        </div>

        <div className="flex gap-2">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as any)}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm"
          >
            <option value="all">Todos os tipos</option>
            <option value="info">Informação</option>
            <option value="warning">Aviso</option>
            <option value="error">Erro</option>
            <option value="success">Sucesso</option>
          </select>
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Bell className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p>Nenhum alerta encontrado</p>
            <p className="text-sm">
              {filter === 'unread' 
                ? 'Todos os alertas foram lidos' 
                : 'Não há alertas para exibir'
              }
            </p>
          </div>
        ) : (
          filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-4 border rounded-lg transition-colors ${
                alert.is_read 
                  ? 'border-gray-200 bg-gray-50' 
                  : 'border-blue-200 bg-blue-50'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                  {getAlertIcon(alert.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className={`font-medium ${
                      alert.is_read ? 'text-gray-700' : 'text-gray-900'
                    }`}>
                      {alert.title}
                    </h4>
                    <Badge variant={getAlertBadgeColor(alert.type)} size="sm">
                      {alert.type}
                    </Badge>
                    <Badge variant={getPriorityBadgeColor(alert.priority)} size="sm">
                      {alert.priority}
                    </Badge>
                  </div>
                  
                  <p className={`text-sm mb-3 ${
                    alert.is_read ? 'text-gray-600' : 'text-gray-700'
                  }`}>
                    {alert.message}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>
                        {new Date(alert.created_at).toLocaleString('pt-BR')}
                      </span>
                      {alert.read_at && (
                        <span>
                          Lido em {new Date(alert.read_at).toLocaleString('pt-BR')}
                        </span>
                      )}
                    </div>
                    
                    {!alert.is_read && (
                      <Button
                        onClick={() => handleMarkAsRead(alert.id)}
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1"
                      >
                        <EyeOff className="h-3 w-3" />
                        Marcar como lido
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {filteredAlerts.length >= maxItems && (
        <div className="mt-4 text-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              // Implementar paginação ou modal com todos os alertas
            }}
          >
            Ver todos os alertas
          </Button>
        </div>
      )}
    </Card>
  );
};

export default AlertManager;
