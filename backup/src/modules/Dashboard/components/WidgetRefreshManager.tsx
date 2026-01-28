import React, { useState, useEffect, useCallback } from 'react';
import { useDashboardAdvanced } from '../hooks/useDashboardAdvanced';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { 
  RotateCcw,
  Clock,
  CheckCircle,
  AlertTriangle,
  XCircle
} from 'lucide-react';

interface WidgetRefreshManagerProps {
  widgetId: string;
  refreshInterval?: number; // in seconds
  autoRefresh?: boolean;
  onDataUpdate?: (data: any) => void;
  className?: string;
}

interface RefreshStatus {
  status: 'idle' | 'refreshing' | 'success' | 'error';
  lastRefresh?: Date;
  error?: string;
  nextRefresh?: Date;
}

export const WidgetRefreshManager: React.FC<WidgetRefreshManagerProps> = ({
  widgetId,
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
    } catch (error: any) {
      setRefreshStatus({
        status: 'error',
        lastRefresh: new Date(),
        error: error.message
      });
    }
  }, [widgetId, refreshWidget, widgetLoading, widgetData, onDataUpdate]);

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
        setIntervalId(null);
      };
    } else {
      if (intervalId) {
        clearInterval(intervalId);
        setIntervalId(null);
      }
      setRefreshStatus(prev => ({
        ...prev,
        nextRefresh: undefined
      }));
    }
  }, [autoRefreshEnabled, refreshInterval, handleRefresh, intervalId]);

  // Initial data fetch
  useEffect(() => {
    if (!widgetData[widgetId]) {
      getWidgetData(widgetId);
    }
  }, [widgetId, widgetData, getWidgetData]);

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
    }
  };

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
    }
  };

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
    
    return `${seconds}s`;
  };

  const isLoading = widgetLoading[widgetId] || refreshStatus.status === 'refreshing';

  return (
    <Card className={`p-4 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-medium text-gray-900">Controle de Atualização</h4>
        <Badge variant={getStatusColor()} size="sm" className="flex items-center gap-1">
          {getStatusIcon()}
          {refreshStatus.status === 'refreshing' ? 'Atualizando...' : 
           refreshStatus.status === 'success' ? 'Atualizado' :
           refreshStatus.status === 'error' ? 'Erro' : 'Aguardando'}
        </Badge>
      </div>

      <div className="space-y-3">
        {/* Manual Refresh Button */}
        <Button
          onClick={handleRefresh}
          variant="outline"
          size="sm"
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2"
        >
          <RotateCcw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          {isLoading ? 'Atualizando...' : 'Atualizar Agora'}
        </Button>

        {/* Auto Refresh Toggle */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Atualização automática</span>
          <Button
            onClick={handleToggleAutoRefresh}
            variant={autoRefreshEnabled ? 'primary' : 'outline'}
            size="sm"
          >
            {autoRefreshEnabled ? 'Ativada' : 'Desativada'}
          </Button>
        </div>

        {/* Refresh Settings */}
        {autoRefreshEnabled && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Intervalo:</span>
              <span className="font-medium">{refreshInterval}s</span>
            </div>
            
            {refreshStatus.nextRefresh && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Próxima atualização:</span>
                <span className="font-medium">
                  {formatTimeUntilNextRefresh()}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Last Refresh Info */}
        {refreshStatus.lastRefresh && (
          <div className="pt-3 border-t border-gray-200">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Última atualização:</span>
              <span className="font-medium">
                {refreshStatus.lastRefresh.toLocaleTimeString('pt-BR')}
              </span>
            </div>
          </div>
        )}

        {/* Error Display */}
        {refreshStatus.error && (
          <div className="pt-3 border-t border-gray-200">
            <div className="flex items-start gap-2 text-sm text-red-600">
              <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span>{refreshStatus.error}</span>
            </div>
          </div>
        )}

        {/* Widget Data Info */}
        {widgetData[widgetId] && (
          <div className="pt-3 border-t border-gray-200">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Dados carregados:</span>
              <span className="font-medium">
                {new Date(widgetData[widgetId].last_updated).toLocaleString('pt-BR')}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm mt-1">
              <span className="text-gray-600">Cache expira:</span>
              <span className="font-medium">
                {new Date(widgetData[widgetId].cache_expires_at).toLocaleString('pt-BR')}
              </span>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default WidgetRefreshManager;
