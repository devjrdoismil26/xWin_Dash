import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import PageLayout from '@/layouts/PageLayout';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { 
  Play, 
  RefreshCw, 
  Activity, 
  Users, 
  AlertTriangle, 
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Download,
  Filter
} from 'lucide-react';
import { useActivity } from '../hooks/useActivity';
import { cn } from '@/lib/utils';

interface ActivityIndexPageProps {
  className?: string;
  auth?: any;
}

export const ActivityIndexPage: React.FC<ActivityIndexPageProps> = ({ 
  className,
  auth 
}) => {
  const [showIntegrationTest, setShowIntegrationTest] = useState(false);
  const [realTimeEnabled, setRealTimeEnabled] = useState(false);
  
  const {
    logs,
    loading,
    error,
    stats,
    activityStats,
    hasActivity,
    totalLogs,
    errorCount,
    securityCount,
    recentCount,
    fetchStats,
    fetchLogs,
    exportData,
    getRecentLogs,
    getErrorLogs,
    getSecurityLogs,
    formatRelativeTime,
    getLogType,
    getLogIcon,
    getLogColor
  } = useActivity();

  // Carregar dados iniciais
  useEffect(() => {
    fetchLogs();
    fetchStats();
  }, []);

  // Auto-refresh para tempo real
  useEffect(() => {
    if (!realTimeEnabled) return;

    const interval = setInterval(() => {
      fetchLogs();
      fetchStats();
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [realTimeEnabled, fetchLogs, fetchStats]);

  const handleExport = async () => {
    try {
      await exportData('csv');
    } catch (error) {
      console.error('Erro ao exportar:', error);
    }
  };

  const handleRefresh = () => {
    fetchLogs();
    fetchStats();
  };

  const recentLogs = getRecentLogs(5);
  const errorLogs = getErrorLogs();
  const securityLogs = getSecurityLogs();

  const getStatusColor = (type: string) => {
    switch (type) {
      case 'error': return 'text-red-500';
      case 'security': return 'text-yellow-500';
      case 'success': return 'text-green-500';
      case 'info': return 'text-blue-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusBadgeColor = (type: string) => {
    switch (type) {
      case 'error': return 'bg-red-100 text-red-800';
      case 'security': return 'bg-yellow-100 text-yellow-800';
      case 'success': return 'bg-green-100 text-green-800';
      case 'info': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <AuthenticatedLayout user={auth?.user}>
      <Head title="Log de Atividades - xWin Dash" />
      <PageLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                📊 Log de Atividades
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                Monitore todas as atividades do sistema em tempo real
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={handleRefresh}
                disabled={loading}
                className="backdrop-blur-sm bg-blue-500/20 text-blue-400 border-blue-500/30 hover:bg-blue-500/30"
              >
                <RefreshCw className={cn("h-4 w-4 mr-2", loading && "animate-spin")} />
                Atualizar
              </Button>
              
              <Button
                variant="outline"
                onClick={handleExport}
                className="backdrop-blur-sm bg-green-500/20 text-green-400 border-green-500/30 hover:bg-green-500/30"
              >
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
              
              <Button
                variant="outline"
                onClick={() => setShowIntegrationTest(!showIntegrationTest)}
                className="backdrop-blur-sm bg-purple-500/20 text-purple-400 border-purple-500/30 hover:bg-purple-500/30"
              >
                <Play className="h-4 w-4 mr-2" />
                Teste de Integração
              </Button>
            </div>
          </div>

          {/* Integration Test Status */}
          {showIntegrationTest && (
            <Card className="p-4 border-purple-200 bg-purple-50 dark:bg-purple-900/20">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-purple-600 dark:text-purple-400 mb-2">
                    🔧 Teste de Integração Ativo
                  </h3>
                  <p className="text-purple-500 dark:text-purple-300">
                    Sistema de monitoramento de atividades em funcionamento.
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setRealTimeEnabled(!realTimeEnabled)}
                  className={cn(
                    "border-purple-300",
                    realTimeEnabled 
                      ? "bg-green-100 text-green-800 hover:bg-green-200" 
                      : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                  )}
                >
                  {realTimeEnabled ? (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Tempo Real Ativo
                    </>
                  ) : (
                    <>
                      <Clock className="h-4 w-4 mr-2" />
                      Ativar Tempo Real
                    </>
                  )}
                </Button>
              </div>
            </Card>
          )}

          {/* Error State */}
          {error && (
            <Card className="p-4 border-red-200 bg-red-50 dark:bg-red-900/20">
              <div className="flex items-center">
                <XCircle className="w-5 h-5 text-red-600 mr-2" />
                <span className="text-red-800 dark:text-red-200">{error}</span>
              </div>
            </Card>
          )}

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="w-6 h-6 animate-spin text-blue-600 mr-2" />
              <span className="text-gray-600">Carregando atividades...</span>
            </div>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-700">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-blue-900 dark:text-blue-100 mb-2">
                    Atividades Hoje
                  </h3>
                  <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                    {stats?.today_logs || activityStats.today}
                  </p>
                </div>
                <Activity className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
            </Card>
            
            <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-700">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-green-900 dark:text-green-100 mb-2">
                    Total de Logs
                  </h3>
                  <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                    {stats?.total_logs || activityStats.total}
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
            </Card>
            
            <Card className="p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 border-yellow-200 dark:border-yellow-700">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-yellow-900 dark:text-yellow-100 mb-2">
                    Usuários Ativos
                  </h3>
                  <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
                    {stats?.active_users || activityStats.activeUsers}
                  </p>
                </div>
                <Users className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
              </div>
            </Card>
            
            <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-700">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-purple-900 dark:text-purple-100 mb-2">
                    Chamadas API
                  </h3>
                  <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                    {stats?.api_calls || 0}
                  </p>
                </div>
                <Activity className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
            </Card>
          </div>

          {/* Additional Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Logs de Erro
                  </h3>
                  <p className="text-2xl font-bold text-red-600">{errorCount}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
            </Card>
            
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Logs de Segurança
                  </h3>
                  <p className="text-2xl font-bold text-yellow-600">{securityCount}</p>
                </div>
                <Eye className="w-8 h-8 text-yellow-600" />
              </div>
            </Card>
            
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Logs Recentes
                  </h3>
                  <p className="text-2xl font-bold text-blue-600">{recentCount}</p>
                </div>
                <Clock className="w-8 h-8 text-blue-600" />
              </div>
            </Card>
          </div>

          {/* Recent Logs */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                📋 Logs Recentes
              </h3>
              <Badge variant="outline" className="text-xs">
                {totalLogs} total
              </Badge>
            </div>
            
            {!hasActivity ? (
              <div className="text-center py-8">
                <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">
                  Nenhuma atividade registrada ainda.
                </p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                  As atividades aparecerão aqui conforme forem executadas no sistema.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentLogs.map((log) => {
                  const LogIcon = getLogIcon(log.log_name);
                  const logType = getLogType(log.log_name);
                  const logColor = getLogColor(log.log_name);
                  
                  return (
                    <div
                      key={log.id}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
                    >
                      <div className="flex items-center space-x-3">
                        <div className={cn("p-2 rounded-full", logColor.bg)}>
                          <LogIcon className={cn("w-4 h-4", logColor.text)} />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {log.description || log.log_name}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {log.causer_type} • {formatRelativeTime(log.created_at)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusBadgeColor(logType)}>
                          {logType}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            // Navigate to log detail
                            console.log('View log:', log.id);
                          }}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
                
                {recentLogs.length === 0 && (
                  <div className="text-center py-4">
                    <p className="text-gray-500 dark:text-gray-400">
                      Nenhum log recente encontrado.
                    </p>
                  </div>
                )}
              </div>
            )}
          </Card>

          {/* Real-time Status */}
          {realTimeEnabled && (
            <Card className="p-4 border-green-200 bg-green-50 dark:bg-green-900/20">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-3"></div>
                <span className="text-green-800 dark:text-green-200 font-medium">
                  Monitoramento em tempo real ativo
                </span>
                <span className="text-green-600 dark:text-green-300 ml-2 text-sm">
                  (atualizações a cada 30 segundos)
                </span>
              </div>
            </Card>
          )}
        </div>
      </PageLayout>
    </AuthenticatedLayout>
  );
};

export default ActivityIndexPage;