// ========================================
// COMPONENTE CABEÇALHO - ANALYTICS
// ========================================
// Componente de cabeçalho para o módulo Analytics

import React from 'react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';
import { 
  BarChart3, 
  Download, 
  RefreshCw, 
  Settings, 
  Share2, 
  Calendar,
  Filter,
  MoreHorizontal,
  Bell,
  HelpCircle
} from 'lucide-react';

interface AnalyticsHeaderProps {
  title?: string;
  subtitle?: string;
  lastUpdate?: string;
  realTimeEnabled?: boolean;
  autoRefresh?: boolean;
  refreshInterval?: number;
  onRefresh?: () => void;
  onExport?: () => void;
  onShare?: () => void;
  onSettings?: () => void;
  onToggleRealTime?: () => void;
  onToggleAutoRefresh?: () => void;
  onNotifications?: () => void;
  onHelp?: () => void;
  loading?: boolean;
  className?: string;
}

export const AnalyticsHeader: React.FC<AnalyticsHeaderProps> = ({
  title = "Analytics Dashboard",
  subtitle = "Análise completa de dados e métricas",
  lastUpdate,
  realTimeEnabled = false,
  autoRefresh = false,
  refreshInterval = 30000,
  onRefresh,
  onExport,
  onShare,
  onSettings,
  onToggleRealTime,
  onToggleAutoRefresh,
  onNotifications,
  onHelp,
  loading = false,
  className
}) => {
  const formatLastUpdate = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return `Atualizado há ${diffInSeconds}s`;
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `Atualizado há ${minutes}m`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `Atualizado há ${hours}h`;
    } else {
      return date.toLocaleDateString('pt-BR');
    }
  };

  const formatRefreshInterval = (interval: number) => {
    if (interval < 60000) {
      return `${interval / 1000}s`;
    } else if (interval < 3600000) {
      return `${interval / 60000}m`;
    } else {
      return `${interval / 3600000}h`;
    }
  };

  return (
    <div className={cn("flex items-center justify-between py-6", className)}>
      {/* Título e Informações */}
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          </div>
          
          {/* Badges de Status */}
          <div className="flex items-center gap-2">
            {realTimeEnabled && (
              <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">
                Tempo Real
              </Badge>
            )}
            {autoRefresh && (
              <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-200">
                Auto Refresh
              </Badge>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-600">
          <p>{subtitle}</p>
          
          {lastUpdate && (
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>{formatLastUpdate(lastUpdate)}</span>
            </div>
          )}
          
          {autoRefresh && refreshInterval > 0 && (
            <div className="flex items-center gap-1">
              <RefreshCw className="h-3 w-3" />
              <span>Atualização a cada {formatRefreshInterval(refreshInterval)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Ações */}
      <div className="flex items-center gap-2">
        {/* Botão de Ajuda */}
        <Button
          size="sm"
          variant="outline"
          onClick={onHelp}
          className="hidden sm:flex"
        >
          <HelpCircle className="h-4 w-4" />
        </Button>

        {/* Botão de Notificações */}
        <Button
          size="sm"
          variant="outline"
          onClick={onNotifications}
          className="hidden sm:flex"
        >
          <Bell className="h-4 w-4" />
        </Button>

        {/* Botão de Filtros */}
        <Button
          size="sm"
          variant="outline"
          className="hidden md:flex"
        >
          <Filter className="h-4 w-4 mr-1" />
          Filtros
        </Button>

        {/* Botão de Tempo Real */}
        <Button
          size="sm"
          variant={realTimeEnabled ? "default" : "outline"}
          onClick={onToggleRealTime}
          className={realTimeEnabled ? "bg-green-600 hover:bg-green-700" : ""}
        >
          {realTimeEnabled ? "Tempo Real Ativo" : "Ativar Tempo Real"}
        </Button>

        {/* Botão de Auto Refresh */}
        <Button
          size="sm"
          variant={autoRefresh ? "default" : "outline"}
          onClick={onToggleAutoRefresh}
          className={autoRefresh ? "bg-blue-600 hover:bg-blue-700" : ""}
        >
          <RefreshCw className={cn("h-4 w-4 mr-1", autoRefresh && "animate-spin")} />
          Auto Refresh
        </Button>

        {/* Botão de Atualizar */}
        <Button
          size="sm"
          variant="outline"
          onClick={onRefresh}
          disabled={loading}
        >
          <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
        </Button>

        {/* Botão de Exportar */}
        <Button
          size="sm"
          variant="outline"
          onClick={onExport}
        >
          <Download className="h-4 w-4 mr-1" />
          Exportar
        </Button>

        {/* Botão de Compartilhar */}
        <Button
          size="sm"
          variant="outline"
          onClick={onShare}
          className="hidden sm:flex"
        >
          <Share2 className="h-4 w-4 mr-1" />
          Compartilhar
        </Button>

        {/* Botão de Configurações */}
        <Button
          size="sm"
          variant="outline"
          onClick={onSettings}
        >
          <Settings className="h-4 w-4" />
        </Button>

        {/* Menu Mais */}
        <Button
          size="sm"
          variant="outline"
          className="sm:hidden"
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default AnalyticsHeader;