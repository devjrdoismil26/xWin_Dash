/**
 * Componente AnalyticsHeader - Cabeçalho do Módulo Analytics
 * @module modules/Analytics/components/AnalyticsHeader
 * @description
 * Componente de cabeçalho reutilizável para o módulo Analytics, fornecendo
 * título, subtítulo, ações (refresh, export, share, settings) e indicadores
 * de status (tempo real, auto-refresh, última atualização).
 * @since 1.0.0
 */

import React from 'react';
import { Button } from '@/shared/components/ui/Button';
import { Badge } from '@/shared/components/ui/Badge';
import { cn } from '@/lib/utils';
import { BarChart3, Download, RefreshCw, Settings, Share2, Calendar, Filter, MoreHorizontal, Bell, HelpCircle } from 'lucide-react';

/**
 * Interface AnalyticsHeaderProps - Props do componente AnalyticsHeader
 * @interface AnalyticsHeaderProps
 * @description
 * Interface que define as props do componente AnalyticsHeader.
 * @property {string} [title] - Título do cabeçalho (opcional, padrão: "Analytics Dashboard")
 * @property {string} [subtitle] - Subtítulo do cabeçalho (opcional)
 * @property {string} [lastUpdate] - Data/hora da última atualização (opcional)
 * @property {boolean} [realTimeEnabled] - Se o modo tempo real está habilitado (opcional, padrão: false)
 * @property {boolean} [autoRefresh] - Se o auto-refresh está habilitado (opcional, padrão: false)
 * @property {number} [refreshInterval] - Intervalo de atualização em ms (opcional, padrão: 30000)
 * @property {() => void} [onRefresh] - Callback chamado ao clicar em refresh (opcional)
 * @property {() => void} [onExport] - Callback chamado ao clicar em exportar (opcional)
 * @property {() => void} [onShare] - Callback chamado ao clicar em compartilhar (opcional)
 * @property {() => void} [onSettings] - Callback chamado ao clicar em configurações (opcional)
 * @property {() => void} [onToggleRealTime] - Callback chamado ao alternar tempo real (opcional)
 * @property {() => void} [onToggleAutoRefresh] - Callback chamado ao alternar auto-refresh (opcional)
 * @property {() => void} [onNotifications] - Callback chamado ao clicar em notificações (opcional)
 * @property {() => void} [onHelp] - Callback chamado ao clicar em ajuda (opcional)
 * @property {boolean} [loading] - Se está carregando (opcional, padrão: false)
 * @property {string} [className] - Classes CSS adicionais (opcional)
 */
interface AnalyticsHeaderProps {
  title?: string;
  subtitle?: string;
  lastUpdate?: string;
  realTimeEnabled?: boolean;
  autoRefresh?: boolean;
  refreshInterval?: number;
  onRefresh???: (e: any) => void;
  onExport???: (e: any) => void;
  onShare???: (e: any) => void;
  onSettings???: (e: any) => void;
  onToggleRealTime???: (e: any) => void;
  onToggleAutoRefresh???: (e: any) => void;
  onNotifications???: (e: any) => void;
  onHelp???: (e: any) => void;
  loading?: boolean;
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

/**
 * Componente AnalyticsHeader - Cabeçalho do Módulo Analytics
 * @component
 * @description
 * Componente de cabeçalho reutilizável para o módulo Analytics, fornecendo
 * título, subtítulo, ações (refresh, export, share, settings) e indicadores
 * de status (tempo real, auto-refresh, última atualização).
 *
 * @param {AnalyticsHeaderProps} props - Props do componente
 * @returns {JSX.Element} Cabeçalho do módulo Analytics
 *
 * @example
 * ```tsx
 * <AnalyticsHeader
 *   title="Dashboard de Analytics"
 *   subtitle="Análise completa de dados e métricas"
 *   onRefresh={ handleRefresh }
 *   onExport={ handleExport }
 *   realTimeEnabled={ true }
 *   autoRefresh={ true }
 * / />
 * ```
 */
export const AnalyticsHeader: React.FC<AnalyticsHeaderProps> = ({ title = "Analytics Dashboard",
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

    } ;

  const formatRefreshInterval = (interval: number) => {
    if (interval < 60000) {
      return `${interval / 1000}s`;
    } else if (interval < 3600000) {
      return `${interval / 60000}m`;
    } else {
      return `${interval / 3600000}h`;
    } ;

  return (
        <>
      <div className={cn("flex items-center justify-between py-6", className)  }>
      </div>{/* Título e Informações */}
      <div className=" ">$2</div><div className=" ">$2</div><div className=" ">$2</div><BarChart3 className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          </div>
          
          {/* Badges de Status */}
          <div className="{realTimeEnabled && (">$2</div>
              <Badge variant="default" className="bg-green-100 text-green-800 border-green-200" />
                Tempo Real
              </Badge>
            )}
            {autoRefresh && (
              <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-200" />
                Auto Refresh
              </Badge>
            )}
          </div>

        <div className=" ">$2</div><p>{subtitle}</p>
          
          {lastUpdate && (
            <div className=" ">$2</div><Calendar className="h-3 w-3" />
              <span>{formatLastUpdate(lastUpdate)}</span>
      </div>
    </>
  )}
          
          {autoRefresh && refreshInterval > 0 && (
            <div className=" ">$2</div><RefreshCw className="h-3 w-3" />
              <span>Atualização a cada {formatRefreshInterval(refreshInterval)}</span>
      </div>
    </>
  )}
        </div>

      {/* Ações */}
      <div className="{/* Botão de Ajuda */}">$2</div>
        <Button
          size="sm"
          variant="outline"
          onClick={ onHelp }
          className="hidden sm:flex" />
          <HelpCircle className="h-4 w-4" />
        </Button>

        {/* Botão de Notificações */}
        <Button
          size="sm"
          variant="outline"
          onClick={ onNotifications }
          className="hidden sm:flex" />
          <Bell className="h-4 w-4" />
        </Button>

        {/* Botão de Filtros */}
        <Button
          size="sm"
          variant="outline"
          className="hidden md:flex" />
          <Filter className="h-4 w-4 mr-1" />
          Filtros
        </Button>

        {/* Botão de Tempo Real */}
        <Button
          size="sm"
          variant={ realTimeEnabled ? "default" : "outline" }
          onClick={ onToggleRealTime }
          className={realTimeEnabled ? "bg-green-600 hover:bg-green-700" : "" } />
          {realTimeEnabled ? "Tempo Real Ativo" : "Ativar Tempo Real"}
        </Button>

        {/* Botão de Auto Refresh */}
        <Button
          size="sm"
          variant={ autoRefresh ? "default" : "outline" }
          onClick={ onToggleAutoRefresh }
          className={autoRefresh ? "bg-blue-600 hover:bg-blue-700" : "" } />
          <RefreshCw className={cn("h-4 w-4 mr-1", autoRefresh && "animate-spin")} / />
          Auto Refresh
        </Button>

        {/* Botão de Atualizar */}
        <Button
          size="sm"
          variant="outline"
          onClick={ onRefresh }
          disabled={ loading } />
          <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} / />
        </Button>

        {/* Botão de Exportar */}
        <Button
          size="sm"
          variant="outline"
          onClick={ onExport } />
          <Download className="h-4 w-4 mr-1" />
          Exportar
        </Button>

        {/* Botão de Compartilhar */}
        <Button
          size="sm"
          variant="outline"
          onClick={ onShare }
          className="hidden sm:flex" />
          <Share2 className="h-4 w-4 mr-1" />
          Compartilhar
        </Button>

        {/* Botão de Configurações */}
        <Button
          size="sm"
          variant="outline"
          onClick={ onSettings } />
          <Settings className="h-4 w-4" />
        </Button>

        {/* Menu Mais */}
        <Button
          size="sm"
          variant="outline"
          className="sm:hidden" />
          <MoreHorizontal className="h-4 w-4" /></Button></div>);};

export default AnalyticsHeader;