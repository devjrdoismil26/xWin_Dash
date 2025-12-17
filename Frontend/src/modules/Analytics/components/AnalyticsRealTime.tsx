/**
 * Analytics em Tempo Real
 *
 * @description
 * Componente para exibir métricas de analytics em tempo real usando WebSocket.
 * Atualiza dados automaticamente e exibe status de conexão.
 * Inclui métricas de usuários ativos, page views, sessões e top páginas.
 *
 * @module modules/Analytics/components/AnalyticsRealTime
 * @since 1.0.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Card } from '@/shared/components/ui/Card';
import { Badge } from '@/shared/components/ui/Badge';
import { Button } from '@/shared/components/ui/Button';
import { cn } from '@/lib/utils';
import { Activity, Users, Eye, MousePointer, Clock, Wifi, WifiOff, RefreshCw, Settings, Zap } from 'lucide-react';

interface RealTimeMetric {
  id: string;
  name: string;
  value: number;
  change: number;
  trend: 'up' | 'down' | 'stable';
  unit: string;
  color: string;
  icon: string; }

interface RealTimeData {
  activeUsers: number;
  pageViews: number;
  sessions: number;
  bounceRate: number;
  avgSessionDuration: number;
  topPages: Array<{
    path: string;
  views: number;
  users: number; }>;
  trafficSources: Array<{
    source: string;
    users: number;
    percentage: number;
  }>;
  devices: Array<{
    device: string;
    users: number;
    percentage: number;
  }>;
  locations: Array<{
    country: string;
    users: number;
    percentage: number;
  }>;
  lastUpdate: string;
}

interface AnalyticsRealTimeProps {
  data?: RealTimeData;
  loading?: boolean;
  error?: string | null;
  enabled?: boolean;
  refreshInterval?: number;
  onToggle???: (e: any) => void;
  onRefresh???: (e: any) => void;
  onConfigure???: (e: any) => void;
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

export const AnalyticsRealTime: React.FC<AnalyticsRealTimeProps> = ({ data,
  loading = false,
  error = null,
  enabled = false,
  refreshInterval = 30000,
  onToggle,
  onRefresh,
  onConfigure,
  className
   }) => {
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'connecting'>('disconnected');

  const [lastUpdateTime, setLastUpdateTime] = useState<Date | null>(null);

  const [autoRefresh, setAutoRefresh] = useState(true);

  // Mock data para demonstração
  const mockData: RealTimeData = {
    activeUsers: 127,
    pageViews: 2847,
    sessions: 892,
    bounceRate: 42.3,
    avgSessionDuration: 180,
    topPages: [
      { path: '/dashboard', views: 1247, users: 89 },
      { path: '/products', views: 892, users: 67 },
      { path: '/analytics', views: 456, users: 34 },
      { path: '/settings', views: 252, users: 23 }
    ],
    trafficSources: [
      { source: 'Direct', users: 45, percentage: 35.4 },
      { source: 'Google', users: 38, percentage: 29.9 },
      { source: 'Social', users: 28, percentage: 22.0 },
      { source: 'Email', users: 16, percentage: 12.6 }
    ],
    devices: [
      { device: 'Monitor', users: 67, percentage: 52.8 },
      { device: 'Mobile', users: 45, percentage: 35.4 },
      { device: 'Tablet', users: 15, percentage: 11.8 }
    ],
    locations: [
      { country: 'Brazil', users: 89, percentage: 70.1 },
      { country: 'United States', users: 23, percentage: 18.1 },
      { country: 'Argentina', users: 15, percentage: 11.8 }
    ],
    lastUpdate: new Date().toISOString()};

  const realTimeData = data || mockData;

  const metrics: RealTimeMetric[] = [
    {
      id: 'active-users',
      name: 'Usuários Ativos',
      value: realTimeData.activeUsers,
      change: 12.5,
      trend: 'up',
      unit: 'usuários',
      color: 'blue',
      icon: 'Users'
    },
    {
      id: 'page-views',
      name: 'Visualizações',
      value: realTimeData.pageViews,
      change: 8.3,
      trend: 'up',
      unit: 'views',
      color: 'green',
      icon: 'Eye'
    },
    {
      id: 'sessions',
      name: 'Sessões',
      value: realTimeData.sessions,
      change: -2.1,
      trend: 'down',
      unit: 'sessões',
      color: 'purple',
      icon: 'Activity'
    },
    {
      id: 'bounce-rate',
      name: 'Taxa de Rejeição',
      value: realTimeData.bounceRate,
      change: -5.2,
      trend: 'down',
      unit: '%',
      color: 'orange',
      icon: 'MousePointer'
    }
  ];

  const getIcon = (iconName: string) => {
    const icons: Record<string, React.ComponentType> = {
      Users,
      Eye,
      Activity,
      MousePointer,
      Clock};

    return icons[iconName] || Activity;};

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <span className="text-green-600">↗</span>;
      case 'down':
        return <span className="text-red-600">↘</span>;
      default:
        return <span className="text-gray-600">→</span>;
    } ;

  const getTrendColor = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    } ;

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);

    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;};

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;};

  // Simular conexão WebSocket
  useEffect(() => {
    if (enabled) {
      setConnectionStatus('connecting');

      const connectTimeout = setTimeout(() => {
        setConnectionStatus('connected');

        setLastUpdateTime(new Date());

      }, 1000);

      return () => clearTimeout(connectTimeout);

    } else {
      setConnectionStatus('disconnected');

    } , [enabled]);

  // Auto-refresh
  useEffect(() => {
    if (enabled && autoRefresh && refreshInterval > 0) {
      const interval = setInterval(() => {
        onRefresh?.();

        setLastUpdateTime(new Date());

      }, refreshInterval);

      return () => clearInterval(interval);

    } , [enabled, autoRefresh, refreshInterval, onRefresh]);

  if (loading) { return (
        <>
      <Card className={cn("", className) } />
      <Card.Header />
          <Card.Title className="flex items-center gap-2" />
            <Activity className="h-5 w-5" />
            Tempo Real
          </Card.Title>
        </Card.Header>
        <Card.Content />
          <div className=" ">$2</div><RefreshCw className="h-6 w-6 animate-spin text-blue-600" />
            <span className="ml-2">Conectando...</span></div></Card.Content>
      </Card>);

  }

  if (error) { return (
        <>
      <Card className={cn("", className) } />
      <Card.Header />
          <Card.Title className="flex items-center gap-2" />
            <Activity className="h-5 w-5" />
            Tempo Real
          </Card.Title>
        </Card.Header>
        <Card.Content />
          <div className=" ">$2</div><WifiOff className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={onRefresh} variant="outline" />
              Tentar Novamente
            </Button></div></Card.Content>
      </Card>);

  }

  return (
        <>
      <Card className={cn("", className) } />
      <Card.Header />
        <div className=" ">$2</div><Card.Title className="flex items-center gap-2" />
            <Activity className="h-5 w-5" />
            Tempo Real
            <Badge variant={ enabled ? "default" : "secondary" } />
              {enabled ? "Ativo" : "Inativo"}
            </Badge>
          </Card.Title>
          <div className=" ">$2</div><Button
              size="sm"
              variant="outline"
              onClick={ onToggle }
              className={enabled ? "bg-green-50 text-green-700 border-green-200" : "" } />
              {enabled ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />}
              {enabled ? "Conectado" : "Conectar"}
            </Button>
            <Button size="sm" variant="outline" onClick={ onRefresh } />
              <RefreshCw className="h-4 w-4" /></Button><Button size="sm" variant="outline" onClick={ onConfigure } />
              <Settings className="h-4 w-4" /></Button></div>
        
        { enabled && (
          <div className=" ">$2</div><div className=" ">$2</div><div className={cn(
                "w-2 h-2 rounded-full",
                connectionStatus === 'connected' ? "bg-green-500" : 
                connectionStatus === 'connecting' ? "bg-yellow-500" : "bg-red-500"
              )  }>
          {connectionStatus === 'connected' ? 'Conectado' : 
               connectionStatus === 'connecting' ? 'Conectando...' : 'Desconectado'}
            </div>
            {lastUpdateTime && (
              <div className=" ">$2</div><Clock className="h-3 w-3" />
                Atualizado há {Math.floor((Date.now() - lastUpdateTime.getTime()) / 1000)}s
              </div>
            )}
            <div className=" ">$2</div><Zap className="h-3 w-3" />
              Atualização a cada {refreshInterval / 1000}s
            </div>
        )}
      </Card.Header>

      <Card.Content className="space-y-6" />
        {/* Métricas Principais */}
        <div className="{(metrics || []).map((metric: unknown) => {">$2</div>
            const IconComponent = getIcon(metric.icon);

            return (
        <>
      <div key={metric.id} className="bg-gray-50 p-4 rounded-lg">
      </div><div className=" ">$2</div><div className=" ">$2</div><IconComponent className="h-4 w-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-600">{metric.name}</span></div><div className={cn("text-xs font-medium", getTrendColor(metric.trend))  }>
        </div>{getTrendIcon(metric.trend)} {metric.change > 0 ? '+' : ''}{metric.change}%
                  </div>
                <div className="{metric.value.toLocaleString()} {metric.unit}">$2</div>
                </div>
                {enabled && (
                  <div className=" ">$2</div><div className="w-1 h-1 bg-green-500 rounded-full animate-pulse">
          Ao vivo
        </div>
    </div>
  )}
              </div>);

          })}
        </div>

        {/* Páginas Mais Visitadas */}
        <div>
           
        </div><h3 className="text-lg font-semibold mb-3">Páginas Mais Visitadas</h3>
          <div className="{(realTimeData.topPages || []).map((page: unknown, index: unknown) => (">$2</div>
              <div key={page.path} className="flex items-center justify-between p-3 bg-gray-50 rounded">
           
        </div><div className=" ">$2</div><span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                  <span className="font-medium">{page.path}</span></div><div className=" ">$2</div><span>{page.views} views</span>
                  <span>{page.users} usuários</span>
      </div>
    </>
  ))}
          </div>

        {/* Fontes de Tráfego */}
        <div>
           
        </div><h3 className="text-lg font-semibold mb-3">Fontes de Tráfego</h3>
          <div className="{(realTimeData.trafficSources || []).map((source: unknown) => (">$2</div>
              <div key={source.source} className="flex items-center justify-between p-3 bg-gray-50 rounded">
           
        </div><span className="font-medium">{source.source}</span>
                <div className=" ">$2</div><span>{source.users} usuários</span>
                  <span>{formatPercentage(source.percentage)}</span>
      </div>
    </>
  ))}
          </div>

        {/* Dispositivos */}
        <div>
           
        </div><h3 className="text-lg font-semibold mb-3">Dispositivos</h3>
          <div className="{(realTimeData.devices || []).map((device: unknown) => (">$2</div>
              <div key={device.device} className="p-3 bg-gray-50 rounded text-center">
           
        </div><div className="font-medium">{device.device}</div>
                <div className="text-2xl font-bold text-blue-600">{device.users}</div>
                <div className="text-sm text-gray-600">{formatPercentage(device.percentage)}</div>
            ))}
          </div>

        {/* Localizações */}
        <div>
           
        </div><h3 className="text-lg font-semibold mb-3">Localizações</h3>
          <div className="{(realTimeData.locations || []).map((location: unknown) => (">$2</div>
              <div key={location.country} className="flex items-center justify-between p-3 bg-gray-50 rounded">
           
        </div><span className="font-medium">{location.country}</span>
                <div className=" ">$2</div><span>{location.users} usuários</span>
                  <span>{formatPercentage(location.percentage)}</span>
      </div>
    </>
  ))}
          </div>
      </Card.Content>
    </Card>);};

export default AnalyticsRealTime;