import React, { useState } from 'react';
import { useDashboard } from '../hooks/useDashboard';
import LayoutManager from './LayoutManager';
import AlertManager from './AlertManager';
import WidgetRefreshManager from './WidgetRefreshManager';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { 
  Settings,
  Bell,
  Share,
  BellOff,
  BarChart3,
  Cpu
} from 'lucide-react';

interface AdvancedDashboardFeaturesProps {
  className?: string;
}

export const AdvancedDashboardFeatures: React.FC<AdvancedDashboardFeaturesProps> = ({
  className = ''
}) => {
  const {
    // Advanced features
    layouts,
    currentLayout,
    layoutsLoading,
    alerts,
    alertsLoading,
    unreadAlertsCount,
    universeData,
    universeLoading,
    
    // Actions
    shareDashboard,
    subscribeToDashboard,
    unsubscribeFromDashboard,
    markAllAlertsAsRead,
    fetchUniverseData
  } = useDashboard();

  const [activeTab, setActiveTab] = useState<'layouts' | 'alerts' | 'sharing' | 'universe'>('layouts');
  const [isSharing, setIsSharing] = useState(false);
  const [isSubscribing, setIsSubscribing] = useState(false);

  const handleShareDashboard = async () => {
    setIsSharing(true);
    try {
      const success = await shareDashboard('main', {
        view: true,
        edit: false,
        export: true
      });
      
      if (success) {
        alert('Dashboard compartilhado com sucesso!');
      } else {
        alert('Erro ao compartilhar dashboard');
      }
    } catch (error) {
      alert('Erro ao compartilhar dashboard');
    } finally {
      setIsSharing(false);
    }
  };

  const handleSubscribeToDashboard = async () => {
    setIsSubscribing(true);
    try {
      const success = await subscribeToDashboard(
        ['metrics_update', 'alert_created', 'widget_error'],
        'realtime'
      );
      
      if (success) {
        alert('Inscrição realizada com sucesso!');
      } else {
        alert('Erro ao realizar inscrição');
      }
    } catch (error) {
      alert('Erro ao realizar inscrição');
    } finally {
      setIsSubscribing(false);
    }
  };

  const handleUnsubscribeFromDashboard = async () => {
    try {
      const success = await unsubscribeFromDashboard();
      
      if (success) {
        alert('Inscrição cancelada com sucesso!');
      } else {
        alert('Erro ao cancelar inscrição');
      }
    } catch (error) {
      alert('Erro ao cancelar inscrição');
    }
  };

  const tabs = [
    { id: 'layouts', label: 'Layouts', icon: Settings, count: layouts.length },
    { id: 'alerts', label: 'Alertas', icon: Bell, count: unreadAlertsCount },
    { id: 'sharing', label: 'Compartilhamento', icon: Share },
    { id: 'universe', label: 'Universe', icon: Cpu }
  ];

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Recursos Avançados do Dashboard
            </h2>
            <p className="text-gray-600 mt-1">
              Gerencie layouts, alertas, compartilhamento e integração com Universe
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            {unreadAlertsCount > 0 && (
              <Badge variant="error" size="lg" className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                {unreadAlertsCount} alertas não lidos
              </Badge>
            )}
            
            <Button
              onClick={markAllAlertsAsRead}
              variant="outline"
              size="sm"
              disabled={unreadAlertsCount === 0}
            >
              <BellOff className="h-4 w-4 mr-2" />
              Marcar todos como lidos
            </Button>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <Card className="p-6">
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
                {tab.count !== undefined && tab.count > 0 && (
                  <Badge variant="error" size="sm">
                    {tab.count}
                  </Badge>
                )}
              </button>
            );
          })}
        </div>
      </Card>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === 'layouts' && (
          <LayoutManager
            onLayoutSelect={(layout) => {
              console.log('Layout selecionado:', layout);
            }}
            onLayoutCreate={() => {
              console.log('Novo layout criado');
            }}
          />
        )}

        {activeTab === 'alerts' && (
          <AlertManager
            showUnreadOnly={false}
            maxItems={20}
          />
        )}

        {activeTab === 'sharing' && (
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              Compartilhamento e Notificações
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Sharing */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Compartilhar Dashboard</h4>
                <p className="text-sm text-gray-600">
                  Compartilhe este dashboard com outros usuários ou equipes
                </p>
                
                <div className="space-y-3">
                  <Button
                    onClick={handleShareDashboard}
                    variant="primary"
                    disabled={isSharing}
                    className="w-full flex items-center justify-center gap-2"
                  >
                    <Share className="h-4 w-4" />
                    {isSharing ? 'Compartilhando...' : 'Compartilhar Dashboard'}
                  </Button>
                  
                  <div className="text-xs text-gray-500">
                    <p>• Visualização: Permitida</p>
                    <p>• Edição: Não permitida</p>
                    <p>• Exportação: Permitida</p>
                  </div>
                </div>
              </div>

              {/* Subscriptions */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Notificações</h4>
                <p className="text-sm text-gray-600">
                  Configure notificações para atualizações do dashboard
                </p>
                
                <div className="space-y-3">
                  <Button
                    onClick={handleSubscribeToDashboard}
                    variant="outline"
                    disabled={isSubscribing}
                    className="w-full flex items-center justify-center gap-2"
                  >
                    <Bell className="h-4 w-4" />
                    {isSubscribing ? 'Inscrevendo...' : 'Ativar Notificações'}
                  </Button>
                  
                  <Button
                    onClick={handleUnsubscribeFromDashboard}
                    variant="outline"
                    className="w-full flex items-center justify-center gap-2 text-red-600 hover:text-red-700"
                  >
                    <BellOff className="h-4 w-4" />
                    Desativar Notificações
                  </Button>
                  
                  <div className="text-xs text-gray-500">
                    <p>• Atualizações de métricas</p>
                    <p>• Novos alertas</p>
                    <p>• Erros de widgets</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        )}

        {activeTab === 'universe' && (
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Integração com Universe
              </h3>
              <Button
                onClick={fetchUniverseData}
                variant="outline"
                size="sm"
                disabled={universeLoading}
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                {universeLoading ? 'Carregando...' : 'Atualizar'}
              </Button>
            </div>

            {universeLoading ? (
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            ) : universeData ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Instances */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Instâncias</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Total:</span>
                      <span className="font-medium">{universeData.instances.total}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Ativas:</span>
                      <span className="font-medium text-green-600">{universeData.instances.active}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Inativas:</span>
                      <span className="font-medium text-red-600">{universeData.instances.inactive}</span>
                    </div>
                  </div>
                </div>

                {/* Performance */}
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-medium text-green-900 mb-2">Performance</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Tempo de resposta:</span>
                      <span className="font-medium">{universeData.performance.avg_response_time}ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Taxa de sucesso:</span>
                      <span className="font-medium text-green-600">
                        {universeData.performance.success_rate}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Taxa de erro:</span>
                      <span className="font-medium text-red-600">
                        {universeData.performance.error_rate}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* System Health */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Saúde do Sistema</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Status:</span>
                      <Badge 
                        variant={
                          universeData.system_health.status === 'healthy' ? 'success' :
                          universeData.system_health.status === 'warning' ? 'warning' : 'error'
                        }
                        size="sm"
                      >
                        {universeData.system_health.status}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Uptime:</span>
                      <span className="font-medium">{universeData.system_health.uptime}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Última verificação:</span>
                      <span className="font-medium">
                        {new Date(universeData.system_health.last_check).toLocaleTimeString('pt-BR')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Cpu className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>Nenhum dado do Universe disponível</p>
                <p className="text-sm">Clique em &quot;Atualizar&quot; para carregar os dados</p>
              </div>
            )}
          </Card>
        )}
      </div>

      {/* Widget Refresh Demo */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Gerenciamento de Widgets
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <WidgetRefreshManager
            widgetId="metrics-widget"
            refreshInterval={30}
            autoRefresh={true}
          />
          <WidgetRefreshManager
            widgetId="charts-widget"
            refreshInterval={60}
            autoRefresh={false}
          />
          <WidgetRefreshManager
            widgetId="activity-widget"
            refreshInterval={15}
            autoRefresh={true}
          />
        </div>
      </Card>
    </div>
  );
};

export default AdvancedDashboardFeatures;
