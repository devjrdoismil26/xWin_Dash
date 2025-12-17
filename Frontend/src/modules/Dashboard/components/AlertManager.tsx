/**
 * @module modules/Dashboard/components/AlertManager
 * @description
 * Componente gerenciador de alertas do dashboard.
 * 
 * Gerencia alertas do dashboard:
 * - Listagem de alertas (filtros por status e tipo)
 * - Marcar alertas como lidos
 * - Auto-refresh de alertas a cada 30 segundos
 * - Suporte para diferentes tipos de alertas (info, warning, error, success)
 * - Suporte para diferentes prioridades (low, medium, high, critical)
 * 
 * @example
 * ```typescript
 * <AlertManager
 *   showUnreadOnly={ false }
 *   maxItems={ 10 }
 *   className="p-4"
 * / />
 * ```
 * 
 * @since 1.0.0
 */
import React, { useState, useEffect } from 'react';
import { useDashboardAdvanced } from '../hooks/useDashboardAdvanced';
import { DashboardAlert } from '../types/dashboardTypes';
import { Button } from '@/shared/components/ui/Button';
import { Card } from '@/shared/components/ui/Card';
import { Badge } from '@/shared/components/ui/Badge';
import { Bell, AlertTriangle, Info, CheckCircle, XCircle, Eye, EyeOff } from 'lucide-react';

/**
 * Props do gerenciador de alertas
 * @interface AlertManagerProps
 */
interface AlertManagerProps {
  /** Classe CSS adicional */
className?: string;
  /** Mostrar apenas alertas não lidos */
showUnreadOnly?: boolean;
  /** Número máximo de itens a exibir */
maxItems?: number;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

export const AlertManager: React.FC<AlertManagerProps> = ({ className = '',
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
    } ;

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
    } ;

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
    } ;

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
    await markAlertAsRead(alertId);};

  const handleMarkAllAsRead = async () => {
    await markAllAlertsAsRead();};

  if (alertsLoading) {
    return (
        <>
      <Card className={`p-6 ${className} `} />
      <div className=" ">$2</div><div className=" ">$2</div><div className="{[1, 2, 3].map(i => (">$2</div>
      <div key={i} className="h-16 bg-gray-200 rounded">
    </>
  ))}
        </div>
          </div>
      </Card>);

  }

  if (alertsError) {
    return (
        <>
      <Card className={`p-6 ${className} `} />
      <div className=" ">$2</div><p>Erro ao carregar alertas: {alertsError}</p>
          <Button 
            onClick={ fetchAlerts }
            variant="outline"
            size="sm"
            className="mt-2" />
            Tentar Novamente
          </Button></div></Card>);

  }

  return (
        <>
      <Card className={`p-6 ${className} `} />
      <div className=" ">$2</div><div className=" ">$2</div><h3 className="text-lg font-semibold text-gray-900" />
            Alertas do Dashboard
          </h3>
          {unreadAlertsCount > 0 && (
            <Badge variant="error" size="sm" />
              {unreadAlertsCount} não lidos
            </Badge>
          )}
        </div>
        
        {unreadAlertsCount > 0 && (
          <Button
            onClick={ handleMarkAllAsRead }
            variant="outline"
            size="sm"
            className="flex items-center gap-2" />
            <Eye className="h-4 w-4" />
            Marcar todos como lidos
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className=" ">$2</div><div className=" ">$2</div><Button
            onClick={ () => setFilter('all') }
            variant={ filter === 'all' ? 'primary' : 'outline' }
            size="sm"
          >
            Todos ({alerts.length})
          </Button>
          <Button
            onClick={ () => setFilter('unread') }
            variant={ filter === 'unread' ? 'primary' : 'outline' }
            size="sm"
          >
            Não lidos ({(alerts || []).filter(a => !a.is_read).length})
          </Button>
          <Button
            onClick={ () => setFilter('read') }
            variant={ filter === 'read' ? 'primary' : 'outline' }
            size="sm"
          >
            Lidos ({(alerts || []).filter(a => a.is_read).length})
          </Button></div><div className=" ">$2</div><select
            value={ typeFilter }
            onChange={ (e: React.ChangeEvent<HTMLInputElement>) => setTypeFilter(e.target.value as 'all' | 'info' | 'warning' | 'error' | 'success') }
            className="px-3 py-1 border border-gray-300 rounded-md text-sm"
          >
            <option value="all">Todos os tipos</option>
            <option value="info">Informação</option>
            <option value="warning">Aviso</option>
            <option value="error">Erro</option>
            <option value="success">Sucesso</option></select></div>

      {/* Alerts List */}
      <div className="{filteredAlerts.length === 0 ? (">$2</div>
          <div className=" ">$2</div><Bell className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p>Nenhum alerta encontrado</p>
            <p className="text-sm" />
              {filter === 'unread' 
                ? 'Todos os alertas foram lidos' 
                : 'Não há alertas para exibir'
              }
            </p>
      </div>
    </>
  ) : (
          (filteredAlerts || []).map((alert: unknown) => (
            <div
              key={ alert.id }
              className={`p-4 border rounded-lg transition-colors ${
                alert.is_read 
                  ? 'border-gray-200 bg-gray-50' 
                  : 'border-blue-200 bg-blue-50'
              } `}>
           
        </div><div className=" ">$2</div><div className="{getAlertIcon(alert.type)}">$2</div>
                </div>
                
                <div className=" ">$2</div><div className=" ">$2</div><h4 className={`font-medium ${
                      alert.is_read ? 'text-gray-700' : 'text-gray-900'
                    } `} />
                      {alert.title}
                    </h4>
                    <Badge variant={getAlertBadgeColor(alert.type)} size="sm" />
                      {alert.type}
                    </Badge>
                    <Badge variant={getPriorityBadgeColor(alert.priority)} size="sm" />
                      {alert.priority}
                    </Badge></div><p className={`text-sm mb-3 ${
                    alert.is_read ? 'text-gray-600' : 'text-gray-700'
                  } `} />
                    {alert.message}
                  </p>
                  
                  <div className=" ">$2</div><div className=" ">$2</div><span>
           
        </span>{new Date(alert.created_at).toLocaleString('pt-BR')}
                      </span>
                      {alert.read_at && (
                        <span>
          Lido em 
        </span>{new Date(alert.read_at).toLocaleString('pt-BR')}
                        </span>
                      )}
                    </div>
                    
                    {!alert.is_read && (
                      <Button
                        onClick={ () => handleMarkAsRead(alert.id) }
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
  ))
        )}
      </div>

      {filteredAlerts.length >= maxItems && (
        <div className=" ">$2</div><Button
            variant="outline"
            size="sm"
            onClick={() => {
              // Implementar paginação ou modal com todos os alertas
            } >
            Ver todos os alertas
          </Button>
      </div>
    </>
  )}
    </Card>);};

export default AlertManager;
