/**
 * @module modules/Dashboard/components/WidgetRefreshManager
 * @description
 * Componente gerenciador de refresh de widgets.
 * 
 * Gerencia atualização automática e manual de widgets:
 * - Refresh manual e automático
 * - Configuração de intervalo de refresh
 * - Status de refresh (idle, refreshing, success, error)
 * - Indicadores visuais de última atualização
 * 
 * @example
 * ```typescript
 * <WidgetRefreshManager
 *   widgetId="widget-1"
 *   refreshInterval={ 30 }
 *   autoRefresh={ true }
 *   onDataUpdate={ (data: unknown) =>  }
 * />
 * ```
 * 
 * @since 1.0.0
 */
import React, { useState, useEffect, useCallback } from 'react';
import { getErrorMessage } from '@/utils/errorHelpers';
import { useDashboardAdvanced } from '../hooks/useDashboardAdvanced';
import { Button } from '@/shared/components/ui/Button';
import { Card } from '@/shared/components/ui/Card';
import { Badge } from '@/shared/components/ui/Badge';
import { RotateCcw, Clock, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

/**
 * Props do gerenciador de refresh de widgets
 * @interface WidgetRefreshManagerProps
 */
interface WidgetRefreshManagerProps {
  /** ID do widget a gerenciar */
widgetId: string;
  /** Intervalo de refresh em segundos */
refreshInterval?: number;
  /** Habilitar refresh automático */
autoRefresh?: boolean;
  /** Callback quando dados são atualizados */
onDataUpdate??: (e: any) => void;
  /** Classe CSS adicional */
className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

interface RefreshStatus {
  status: 'idle' | 'refreshing' | 'success' | 'error';
  lastRefresh?: Date;
  error?: string;
  nextRefresh?: Date; }

export const WidgetRefreshManager: React.FC<WidgetRefreshManagerProps> = ({ widgetId,
  refreshInterval = 30,
  autoRefresh = true,
  onDataUpdate,
  className = ''
   }) => {
  const {
    widgetData,
    widgetLoading,
    refreshWidget,
    getWidgetData
  } = useDashboardAdvanced();

  const [refreshStatus, setRefreshStatus] = useState<RefreshStatus>({
    status: 'idle'
  });

  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(autoRefresh);

  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

  const handleRefresh = useCallback(async () => {
    setRefreshStatus(prev => ({ ...prev, status: 'refreshing' }));

    try {
      await refreshWidget(widgetId);

      const newData = widgetData[widgetId];
      
      setRefreshStatus({
        status: 'success',
        lastRefresh: new Date()
  });

      onDataUpdate?.(newData);

    } catch (error: unknown) {
      setRefreshStatus({
        status: 'error',
        lastRefresh: new Date(),
        error: getErrorMessage(error)
  });

    } , [widgetId, refreshWidget, widgetLoading, widgetData, onDataUpdate]);

  const handleToggleAutoRefresh = useCallback(() => {
    setAutoRefreshEnabled(prev => !prev);

  }, []);

  // Auto-refresh effect
  useEffect(() => {
    if (autoRefreshEnabled && refreshInterval > 0) {
      const interval = setInterval(() => {
        handleRefresh();

      }, refreshInterval * 1000);

      setIntervalId(interval);

      setRefreshStatus(prev => ({
        ...prev,
        nextRefresh: new Date(Date.now() + refreshInterval * 1000)
  }));

      return () => {
        clearInterval(interval);

        setIntervalId(null);};

    } else {
      if (intervalId) {
        clearInterval(intervalId);

        setIntervalId(null);

      }
      setRefreshStatus(prev => ({
        ...prev,
        nextRefresh: undefined
      }));

    } , [autoRefreshEnabled, refreshInterval, handleRefresh, intervalId]);

  // Initial data fetch
  useEffect(() => {
    if (!widgetData[widgetId]) {
      getWidgetData(widgetId);

    } , [widgetId, widgetData, getWidgetData]);

  const getStatusIcon = () => {
    switch (refreshStatus.status) {
      case 'refreshing':
        return <RotateCcw className="h-4 w-4 animate-spin text-blue-500" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    } ;

  const getStatusColor = () => {
    switch (refreshStatus.status) {
      case 'refreshing':
        return 'blue';
      case 'success':
        return 'green';
      case 'error':
        return 'red';
      default:
        return 'gray';
    } ;

  const formatTimeUntilNextRefresh = () => {
    if (!refreshStatus.nextRefresh) return null;
    
    const now = new Date();

    const diff = refreshStatus.nextRefresh.getTime() - now.getTime();

    if (diff <= 0) return 'Agora';
    
    const seconds = Math.floor(diff / 1000);

    const minutes = Math.floor(seconds / 60);

    if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    }
    
    return `${seconds}s`;};

  const isLoading = widgetLoading[widgetId] || refreshStatus.status === 'refreshing';

  return (
        <>
      <Card className={`p-4 ${className} `} />
      <div className=" ">$2</div><h4 className="font-medium text-gray-900">Controle de Atualização</h4>
        <Badge variant={getStatusColor()} size="sm" className="flex items-center gap-1" />
          {getStatusIcon()}
          {refreshStatus.status === 'refreshing' ? 'Atualizando...' : 
           refreshStatus.status === 'success' ? 'Atualizado' :
           refreshStatus.status === 'error' ? 'Erro' : 'Aguardando'}
        </Badge></div><div className="{/* Manual Refresh Button */}">$2</div>
        <Button
          onClick={ handleRefresh }
          variant="outline"
          size="sm"
          disabled={ isLoading }
          className="w-full flex items-center justify-center gap-2" />
          <RotateCcw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''} `}>
          {isLoading ? 'Atualizando...' : 'Atualizar Agora'}
        </Button>

        {/* Auto Refresh Toggle */}
        <div className=" ">$2</div><span className="text-sm text-gray-600">Atualização automática</span>
          <Button
            onClick={ handleToggleAutoRefresh }
            variant={ autoRefreshEnabled ? 'primary' : 'outline' }
            size="sm" />
            {autoRefreshEnabled ? 'Ativada' : 'Desativada'}
          </Button>
        </div>

        {/* Refresh Settings */}
        {autoRefreshEnabled && (
          <div className=" ">$2</div><div className=" ">$2</div><span className="text-gray-600">Intervalo:</span>
              <span className="font-medium">{refreshInterval}s</span>
            </div>
            
            {refreshStatus.nextRefresh && (
              <div className=" ">$2</div><span className="text-gray-600">Próxima atualização:</span>
                <span className="{formatTimeUntilNextRefresh()}">$2</span>
                </span>
      </div>
    </>
  )}
          </div>
        )}

        {/* Last Refresh Info */}
        {refreshStatus.lastRefresh && (
          <div className=" ">$2</div><div className=" ">$2</div><span className="text-gray-600">Última atualização:</span>
              <span className="{refreshStatus.lastRefresh.toLocaleTimeString('pt-BR')}">$2</span>
              </span>
      </div>
    </>
  )}

        {/* Error Display */}
        {refreshStatus.error && (
          <div className=" ">$2</div><div className=" ">$2</div><AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span>{refreshStatus.error}</span>
      </div>
    </>
  )}

        {/* Widget Data Info */}
        {widgetData[widgetId] && (
          <div className=" ">$2</div><div className=" ">$2</div><span className="text-gray-600">Dados carregados:</span>
              <span className="{new Date(widgetData[widgetId].last_updated).toLocaleString('pt-BR')}">$2</span>
              </span></div><div className=" ">$2</div><span className="text-gray-600">Cache expira:</span>
              <span className="{new Date(widgetData[widgetId].cache_expires_at).toLocaleString('pt-BR')}">$2</span>
              </span>
      </div>
    </>
  )}
      </div>
    </Card>);};

export default WidgetRefreshManager;
